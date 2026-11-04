/**
 * Витрина, калькулятор заказа и карта адресов.
 * Все товары и цены берутся из data.js — правьте только его.
 */
(() => {
  const { PRODUCTS, formatRub } = window.MECHTA;
  const byId = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
  const qty = Object.fromEntries(PRODUCTS.map(p => [p.id, 0]));

  // цены в статичной разметке (hero и т. п.)
  document.querySelectorAll('[data-price]').forEach(el => (el.textContent = formatRub(byId[el.dataset.price].price)));

  // 1) карточки витрины
  const grid = document.getElementById('goods');
  grid.innerHTML = PRODUCTS.map((p, i) => `
    <article class="good-card rv" style="--d:${i % 4}" data-cat="${p.cat}">
      <div class="good-ph"><img src="${p.photo}" alt="${p.name}" width="268" height="324" loading="lazy"></div>
      <div class="good-body">
        <span class="good-tag">${p.cat === 'cakes' ? 'Торт' : 'Десерт'}</span>
        <h3>${p.name}</h3>
        <p class="good-note">${p.note}</p>
        <div class="good-foot">
          <p class="good-price">${formatRub(p.price)}</p>
          <button type="button" class="good-add" data-add="${p.id}" aria-label="Добавить «${p.name}» в расчёт заказа">
            <svg class="ic" aria-hidden="true"><use href="#i-plus"/></svg><span>В расчёт</span>
          </button>
        </div>
      </div>
    </article>`).join('');

  // 2) вкладки витрины
  const tabs = [...document.querySelectorAll('[data-goods-tab]')];
  const setTab = key => {
    tabs.forEach(t => {
      const on = t.dataset.goodsTab === key;
      t.classList.toggle('tab-active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    grid.querySelectorAll('.good-card').forEach(c => { c.hidden = key !== 'all' && c.dataset.cat !== key; });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => setTab(t.dataset.goodsTab));
    t.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      next.focus(); setTab(next.dataset.goodsTab);
    });
  });
  setTab('all');

  // 3) калькулятор заказа
  const list = document.getElementById('calc-list');
  list.innerHTML = PRODUCTS.map(p => `
    <li class="calc-item">
      <img src="${p.photo}" alt="" width="268" height="324" loading="lazy">
      <span class="calc-name"><b>${p.name}</b><small>${formatRub(p.price)}</small></span>
      <span class="stepper">
        <button type="button" data-step="-" data-id="${p.id}" aria-label="Убрать: ${p.name}">−</button>
        <output data-qty="${p.id}" aria-label="Количество: ${p.name}">0</output>
        <button type="button" data-step="+" data-id="${p.id}" aria-label="Добавить: ${p.name}">+</button>
      </span>
    </li>`).join('');

  const countEl = document.getElementById('calc-count');
  const breakEl = document.getElementById('calc-break');
  const totalEl = document.getElementById('calc-total');
  const plural = n => {
    const a = n % 10, b = n % 100;
    if (a === 1 && b !== 11) return 'позиция';
    if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return 'позиции';
    return 'позиций';
  };
  const render = () => {
    let total = 0, count = 0;
    const lines = [];
    PRODUCTS.forEach(p => {
      const q = qty[p.id];
      list.querySelector(`[data-qty="${p.id}"]`).textContent = q;
      list.querySelector(`[data-step="-"][data-id="${p.id}"]`).disabled = q === 0;
      if (!q) return;
      total += q * p.price; count += q;
      lines.push(`<li><span>${p.name} × ${q}</span><span>${formatRub(q * p.price)}</span></li>`);
    });
    countEl.textContent = count ? `${count} ${plural(count)}` : 'Пока пусто';
    breakEl.innerHTML = lines.length ? lines.join('') : '<li class="empty">Нажмите «+» рядом с тортом или десертом</li>';
    totalEl.textContent = formatRub(Math.round(total * 100) / 100);
  };
  const change = (id, d) => { qty[id] = Math.max(0, Math.min(20, qty[id] + d)); render(); };
  list.addEventListener('click', e => {
    const b = e.target.closest('[data-step]');
    if (b) change(b.dataset.id, b.dataset.step === '+' ? 1 : -1);
  });
  document.getElementById('calc-reset').addEventListener('click', () => { Object.keys(qty).forEach(k => (qty[k] = 0)); render(); });

  // кнопка «В расчёт» на витрине
  grid.addEventListener('click', e => {
    const b = e.target.closest('[data-add]');
    if (!b) return;
    change(b.dataset.add, 1);
    b.classList.add('added');
    b.querySelector('span').textContent = `В расчёте: ${qty[b.dataset.add]}`;
    clearTimeout(b._t);
    b._t = setTimeout(() => { b.classList.remove('added'); b.querySelector('span').textContent = 'В расчёт'; }, 1800);
  });
  render();

  // 4) адреса: переключают карту и маршрут
  const PLACES = [
    'Челябинск, улица Горького, 22',
    'Челябинск, улица Бейвеля, 37А',
  ];
  const map = document.getElementById('map');
  const route = document.getElementById('route');
  const placeBtns = [...document.querySelectorAll('[data-place]')];
  const setPlace = i => {
    const q = encodeURIComponent(PLACES[i]);
    map.src = `https://yandex.ru/map-widget/v1/?text=${q}&z=16`;
    route.href = `https://yandex.ru/maps/?text=${q}`;
    placeBtns.forEach((b, k) => { b.classList.toggle('is-active', k === i); b.setAttribute('aria-selected', String(k === i)); });
  };
  placeBtns.forEach(b => b.addEventListener('click', () => setPlace(+b.dataset.place)));
  setPlace(0);
})();
