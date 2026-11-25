const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
const money = n => n.toLocaleString("ru-RU") + " ₽";
const pad = n => String(n).padStart(2, "0");

async function loadRecord() {
    const res = await fetch("/api/records");
    const records = await res.json();
    const total = $('#total'), work = $('#work'), news = $('#new'), revenue = $('#revenue');
    let countNew = 0, countWork = 0, sumRevenue = 0;
    total.textContent = records.length;
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
    work.textContent = countWork;
    news.textContent = countNew;
    revenue.textContent = money(sumRevenue);
}

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