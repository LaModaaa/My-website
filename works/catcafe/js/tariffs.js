/**
 * Табы «Будни / Выходные и праздники» в блоке тарифов.
 * Цены в карточках подставляются из data.js по атрибутам
 * data-tariff="base|discount|hall" и data-field="hour|perMin|stop".
 */
(function () {
  const { TARIFFS, formatRub } = window.CAT_CAFE;
  const tabs = Array.from(document.querySelectorAll('[data-day-tab]'));
  const fields = document.querySelectorAll('[data-tariff][data-field]');
  const dayLabels = document.querySelectorAll('[data-day-label]');

  const LABELS = { weekday: 'в будни', weekend: 'в выходные и праздники' };

  function render(day) {
    fields.forEach((el) => {
      const price = TARIFFS[el.dataset.tariff][day];
      const value = price[el.dataset.field];

      if (el.dataset.field === 'stop') {
        el.textContent = value ? 'Стоп-чек: ' + formatRub(value) : 'Стоп-чека нет';
        el.classList.toggle('opacity-70', !value);
      } else if (el.dataset.field === 'perMin') {
        el.textContent = 'далее ' + formatRub(value) + ' / минута';
      } else {
        el.textContent = formatRub(value);
      }
    });

    dayLabels.forEach((el) => (el.textContent = LABELS[day]));
  }

  function select(tab, focus) {
    tabs.forEach((t) => {
      const active = t === tab;
      t.setAttribute('aria-selected', String(active));
      t.tabIndex = active ? 0 : -1;
      t.classList.toggle('tab-active', active);
    });
    if (focus) tab.focus();
    render(tab.dataset.dayTab);
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab, false));
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const step = e.key === 'ArrowRight' ? 1 : -1;
      select(tabs[(i + step + tabs.length) % tabs.length], true);
    });
  });

  // По умолчанию открываем вкладку, соответствующую сегодняшнему дню
  const today = new Date().getDay();
  const isWeekend = today === 0 || today === 6;
  select(tabs[isWeekend ? 1 : 0], false);
})();
