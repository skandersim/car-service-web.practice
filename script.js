/* утилиты */
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
const money = n => n.toLocaleString("ru-RU") + " ₽";
const pad = n => String(n).padStart(2, "0");

const pistonHead = $('#pistonGroup'),
    conrod = $('#conrod'),
    crankPin = $('#crankPin');

let rotation = 0,
    radius = 35,
    position = 40;

(function animation(){
    rotation += 0.02;
    const fingerX = Math.sin(rotation) * radius;
    const fingerY = Math.cos(rotation) * radius;
    crankPin.setAttribute("transform", `translate(${fingerX}, ${-fingerY})`);
    const pistonOffset = (1 - Math.cos(rotation)) * radius * 2;
    pistonHead.setAttribute("transform", "translate(0, " + (-20 + pistonOffset) + ")");
    requestAnimationFrame(animation)

})()

const storeGrid = $('#storeGrid');

function renderStore(items) {
    storeGrid.innerHTML = '';

    items.forEach(function(item) {
        const card = document.createElement('article');
        card.className = 'product-card reveal';
        card.innerHTML = `
            <div class="f-icon">${productIcons[item.icon]}</div>
            <h3>${item.name}</h3>
            <div class="product-subtitle">
                <span class="product-unit">${item.unit}</span>
                <div class="product-price">${money(item.price)}</div>
            </div>
            <button class="btn btn-primary">
                ${item.inStock ? 'В наличии' : 'Нет в наличии'}
            </button>
        `;
        storeGrid.append(card);
    })
}
renderStore(shopItems);

const reviewCard = $('#reviewCard'), revDots = $("#revDots");
let currentIndex = 0;
let revTimer = 0;

revDots.innerHTML = reviews.map((_, i) => 
    `<button class="r-dot" data-rev="${i}" aria-label="Отзыв ${i + 1}"></button>`
).join("");

function renderReview(i) {
    revIndex = (i + reviews.length) % reviews.length;
    const r = reviews[revIndex];
    reviewCard.classList.remove("swap");
    void reviewCard.offsetWidth;
    reviewCard.classList.add("swap");
    reviewCard.innerHTML = "";
    const review = 
    `<div class="review-stars">${"★".repeat(r.rating)}</div>
    <p class="review-text">«${r.text}»</p>
    <div class="review-author">
        <b>${r.name}</b>
        <span class="review-car">${r.car}</span>
    </div>`;
    $$(".r-dot", revDots).forEach((d, j) => d.classList.toggle("active", j === revIndex));
    reviewCard.innerHTML = review;
    currentIndex = revIndex;
}

function revInterval() {
    clearInterval(revTimer);
    revTimer = setInterval(() => renderReview(currentIndex + 1), 5500);
}

$('#revPrev').addEventListener('click', () => {
    renderReview(currentIndex - 1);
    revTimer = revInterval;
})
$('#revNext').addEventListener('click', () => {
    renderReview(currentIndex + 1);
    revTimer = revInterval;
})
revDots.addEventListener("click", e => {
    const d = e.target.closest("[data-rev]");
    if (!d) return;
    showReview(+d.dataset.rev);
    revAuto();
});

renderReview(0)
revInterval()

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    })
}, {threshold: 0.2});

$$('.reveal').forEach((el) => {
    observer.observe(el)
});

const navList = $('#navLinks');
const pill = document.createElement('span');
pill.className = 'nav-pill';
navList.append(pill);

function movePill(link) {
    if (!link) return;
    pill.style.left = link.parentElement.offsetLeft + 'px';
    pill.style.top = link.offsetTop + 'px';
    pill.style.width = link.offsetWidth + 'px';
    pill.style.height = link.offsetHeight + 'px';
}

const sections = $$('section[id]'),
    navLinks = $$('#navLinks a');
const observeSection = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((link) => {link.classList.toggle('active', link.getAttribute('href') === '#' + id)})
            const activeLink = navLinks.find(l => l.classList.contains('active'));
            movePill(activeLink);
        };
    });
}, {rootMargin: "-40% 0px -50% 0px"});

sections.forEach((section) => {observeSection.observe(section)});

function updateClock() {
    const now = new Date();
    const hours = now.getHours(),
        minutes = now.getMinutes(),
        day = now.getDay();
    const open = HOURS[day].open,
      close = HOURS[day].close,
      openH = parseInt(open),
      closeH = parseInt(close);
    
    const currentTime = $('#currentTime');
    currentTime.innerHTML = "";
    currentTime.innerHTML = `${pad(hours)}:${pad(minutes)}`;

    if (hours >= openH && hours < closeH) {
        $('#statusText').innerHTML = "Сейчас открыто.";
        $('#heroStatus').innerHTML = `Открыто до ${close}.`;
        $('#heroDot').innerHTML = '🟢';
        $('#todayHoursText'). innerHTML = `Работаем до ${close}`;
    } else {
        $('#statusText').innerHTML = `Закрыто до ${open}.`;
        $('#heroStatus').innerHTML = `Закрыто до ${open}.`;
        $('#heroDot').innerHTML = '🔴';
        $('#todayHoursText').innerHTML = `Закрыто до ${open}`;
    }
}
updateClock();
setInterval(updateClock, 1000 * 30);

function openModal(modal) {
    $(modal).classList.add('show');
    document.body.style.overflow = "hidden";
};

function closeModal() {
    $$('.modal').forEach(m => m.classList.remove('show'));
    document.body.style.overflow = "";
};

$$('#record').forEach((btn) => {
    btn.addEventListener('click', () => {
        openModal('#recordModal')
    });
});
$$('.close-x').forEach((btn) => {
    btn.addEventListener('click', () => {
        closeModal()
    });
});
$$('[data-close]').forEach((btn) => {
    btn.addEventListener('click', closeModal);
});

const customSelect = $('.custom-select');
$('.custom-select-trigger').addEventListener('click', () => {
    customSelect.classList.toggle('open');
});
$$('.servis-option').forEach((btn) => {
    btn.addEventListener('click', () => {
        $('input[name="servis"]').value = btn.dataset.value;
        $('.custom-select-value').textContent = btn.textContent;
        customSelect.classList.remove('open');
    });
});

const ima = $('#name'),
    phone = $('#phone'),
    date = $('#date'),
    time = $('#time');
$('#recordForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    let ok = true;
    const today = new Date().toISOString().split('T')[0];
    $$('.form').forEach(f => f.classList.remove('field'));
    if (ima.value.trim().length < 2) {
        ima.closest('.form').classList.add('field');
        ok = false;
    } if (phone.value.replace(/\D/g, '').length < 10) {
        phone.closest('.form').classList.add('field');
        ok = false;
    } if (!date.value || date.value < today) {
        date.closest('.form').classList.add('field');
        ok = false;
    } if (!time.value) {
        time.closest('.form').classList.add('field');
        ok = false;
    } if (!ok) return;

    const record = {name: ima.value,
        phone: phone.value,
        date: date.value,
        time: time.value,
        servis: $('input[name="servis"]').value || 'Не выбрано'
    };

    const res = await fetch("/api/records", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(record)});

    if (res.ok) {
        closeModal();
        openModal('#successModal');
        event.target.reset();
    }

    closeModal();
    openModal('#successModal');
    event.target.reset();
});

$('#year').textContent = new Date().getFullYear();

$('#copyAddress').addEventListener('click', () => {
    navigator.clipboard.writeText($('#addressText').textContent);
    $('#copyAddress').textContent = 'Скопировано!';
    setTimeout(() => {
        $('#copyAddress').textContent = 'Копировать';
    }, 2000);
});

// переключене темы
const themeToggle = $('#themeToggle');
function applyTheme(t) {
    document.documentElement.dataset.theme = t;
    themeToggle.innerHTML = t === 'dark' ? `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2"/><path d="M12 20v2"/>
        <path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/>
        <path d="M2 12h2"/><path d="M20 12h2"/>
        <path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
    </svg>`
    : `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
        </svg>`
}
themeToggle.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
});