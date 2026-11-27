const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
const money = n => n.toLocaleString("ru-RU") + " ₽";
const pad = n => String(n).padStart(2, "0");

let firstLoad = true;
async function loadRecord() {
    const res = await fetch("/api/records");
    const records = await res.json();
    const total = $('#total'), work = $('#work'), news = $('#new'), revenue = $('#revenue');
    let countNew = 0, countWork = 0, sumRevenue = 0;
    const STATUS_LABELS = {
        new: 'Новая',
        work: 'В работе',
        done: 'Выполнено',
        cancel: 'Отменена'
    };
    const tbody = $('#recordsBody');
    tbody.innerHTML = '';
    records.forEach(r => {
        if (r.status === 'done') {sumRevenue += r.price}
        if (r.is_deleted === 1) return;
        if (r.status === 'new') {countNew++}
        else if (r.status === 'work') {countWork++}
        tbody.innerHTML += `
            <tr>
                <td>${r.id}</td>
                <td>${r.name}</td>
                <td>${r.phone}</td>
                <td>${r.servis}</td>
                <td>${r.date} ${r.time}</td>
                <td><input type="number" class="admin-price" value="${r.price}" data-id="${r.id}"></td>
                <td>
                    <div class="custom-select admin-status" data-id="${r.id}" data-value="${r.status}">
                        <div class="custom-select-trigger">
                            <span>${STATUS_LABELS[r.status] || 'Новая'}</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                        <div class="custom-select-menu">
                            <div class="servis-option" data-value="new">Новая</div>
                            <div class="servis-option" data-value="work">В работе</div>
                            <div class="servis-option" data-value="done">Выполнено</div>
                            <div class="servis-option" data-value="cancel">Отменена</div>
                        </div>
                    </div>
                </td>
                <td>
                    <button class="btn-delete" data-id="${r.id}">✕</button>
                </td>
            </tr>
        `;
    });
    if (firstLoad) {
        animateNumber(total, records.length);
        animateNumber(news, countNew);
        animateNumber(work, countWork);
        animateNumber(revenue, sumRevenue, true);
        firstLoad = false;
    } else {
        total.textContent = records.length;
        news.textContent = countNew;
        work.textContent = countWork;
        revenue.textContent = money(sumRevenue);
    };
};

$('#recordsBody').addEventListener('click', async (event) => {
    const trigger = event.target.closest('.custom-select-trigger');
    if (trigger) {
        trigger.closest('.custom-select').classList.toggle('open');
        return;
    }

    const option = event.target.closest('.servis-option');
    if (option) {
        const select = option.closest('.custom-select');
        const id = select.dataset.id;
        const newStatus = option.dataset.value;
        const price = Number(select.closest('tr').querySelector('.admin-price').value);

        await fetch(`/api/records/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus, price })
        });
        loadRecord();
        return;
    }

    const delBtn = event.target.closest('.btn-delete');
    if (delBtn) {
        const id = delBtn.dataset.id;
        await fetch(`/api/records/${id}`, { method: 'DELETE' });
        loadRecord();
    }
});

loadRecord();

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

function animateNumber(el, target, isMoney = false) {
    const start = performance.now();
    const duration = 1000;

    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const current = Math.floor(target * progress);
        el.textContent = isMoney ? money(current) : current;
        if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
};