/**
 * Единый источник цен котокафе. Все суммы — в рублях, за 1 гостя.
 * hour    — стоимость первого часа
 * perMin  — стоимость каждой минуты после первого часа
 * stop    — стоп-чек (максимальная сумма), null — стоп-чека нет
 */
window.CAT_CAFE = {
  TARIFFS: {
    // Демо-цены для портфолио (вымышленные)
    base: {
      weekday: { hour: 390, perMin: 4, stop: 790 },
      weekend: { hour: 490, perMin: 6, stop: null },
    },
    discount: {
      weekday: { hour: 290, perMin: 4, stop: 690 },
      weekend: { hour: 390, perMin: 6, stop: null },
    },
    hall: {
      weekday: { hour: 2900 },
      weekend: { hour: 4500 },
      capacity: 10,
    },
  },

  formatRub(value) {
    return value.toLocaleString('ru-RU') + ' ₽';
  },
};
