/**
 * Калькулятор стоимости посещения.
 * Первый час оплачивается целиком (минимальная оплата — 1 час),
 * далее поминутно; в будни сумма на гостя ограничена стоп-чеком.
 */
(function () {
  const { TARIFFS, formatRub } = window.CAT_CAFE;
  const form = document.getElementById('calc');
  if (!form) return;

  const range = form.querySelector('#calc-time');
  const timeOut = form.querySelector('#calc-time-out');
  const guestsInput = form.querySelector('#calc-guests');
  const perGuestOut = form.querySelector('#calc-per-guest');
  const totalOut = form.querySelector('#calc-total');
  const breakdownOut = form.querySelector('#calc-breakdown');
  const stopBadge = form.querySelector('#calc-stop');

  const MIN_GUESTS = 1;
  const MAX_GUESTS = 10;

  function formatDuration(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (!h) return m + ' мин';
    return m ? `${h} ч ${m} мин` : `${h} ч`;
  }

  function priceFor(category, day, minutes) {
    const t = TARIFFS[category][day];
    const extraMinutes = Math.max(0, minutes - 60);
    const raw = t.hour + extraMinutes * t.perMin;
    const capped = t.stop !== null && raw > t.stop;
    return { raw, extraMinutes, tariff: t, capped, value: capped ? t.stop : raw };
  }

  function update() {
    const category = form.elements.category.value;
    const day = form.elements.day.value;
    const minutes = Number(range.value);
    const guests = Number(guestsInput.value);

    const p = priceFor(category, day, minutes);

    timeOut.textContent = formatDuration(minutes);
    range.style.setProperty('--fill', ((minutes - range.min) / (range.max - range.min)) * 100 + '%');
    range.setAttribute('aria-valuetext', formatDuration(minutes));

    perGuestOut.textContent = formatRub(p.value);
    totalOut.textContent = formatRub(p.value * guests);

    let breakdown = `1 час — ${formatRub(p.tariff.hour)}`;
    if (p.extraMinutes) {
      breakdown += ` + ${p.extraMinutes} мин × ${formatRub(p.tariff.perMin)}`;
    }
    if (minutes < 60) breakdown += ' (минимальная оплата — 1 час)';
    breakdownOut.textContent = breakdown;

    stopBadge.hidden = !p.capped;
  }

  function setGuests(n) {
    guestsInput.value = Math.min(MAX_GUESTS, Math.max(MIN_GUESTS, n || MIN_GUESTS));
    update();
  }

  form.addEventListener('input', update);
  form.addEventListener('submit', (e) => e.preventDefault());
  form.querySelector('[data-guests="-"]').addEventListener('click', () => setGuests(Number(guestsInput.value) - 1));
  form.querySelector('[data-guests="+"]').addEventListener('click', () => setGuests(Number(guestsInput.value) + 1));
  guestsInput.addEventListener('change', () => setGuests(Number(guestsInput.value)));

  update();
})();
