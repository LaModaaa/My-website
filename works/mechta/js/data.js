/**
 * Единый источник витрины «Мечты». Цены — как в каталоге группы ВКонтакте, в рублях.
 * cat   — вкладка витрины: cakes (торты) или desserts (десерты)
 * photo — снимок из каталога
 */
window.MECHTA = {
  PHONE: '+7 (912) 328-51-31',
  PHONE_HREF: 'tel:+79123285131',
  VK: 'https://vk.com/mechta_bashnya',

  PRODUCTS: [
    { id: 'frogs',        cat: 'cakes',    name: 'Торт «Лягушки»',          price: 1300,  note: 'Бирюзовый, с лягушками и надписью «С днём рождения!»', photo: 'photos/frogs.jpg' },
    { id: 'wedding-1',    cat: 'cakes',    name: 'Свадебный торт',          price: 1300,  note: 'Три яруса, голубые банты и пара лебедей', photo: 'photos/wedding-1.jpg' },
    { id: 'wedding-2',    cat: 'cakes',    name: 'Свадебный торт с розами', price: 1300,  note: 'Два яруса, кремовые розы и листья', photo: 'photos/wedding-2.jpg' },
    { id: 'svetlana',     cat: 'cakes',    name: 'Торт «Светлана»',         price: 597,   note: 'Белый крем, шоколадная стружка и безе', photo: 'photos/svetlana.jpg' },
    { id: 'leto',         cat: 'cakes',    name: 'Торт «Лето»',             price: 562,   note: 'В крошке, с розовыми кремовыми цветами', photo: 'photos/leto.jpg' },
    { id: 'slivyanochka', cat: 'cakes',    name: 'Торт «Сливяночка»',       price: 479.5, note: 'В крошке, с кремовым декором', photo: 'photos/slivyanochka.jpg' },
    { id: 'roll',         cat: 'desserts', name: 'Рулет с белковым кремом', price: 688,   note: 'Мягкий бисквит и воздушный крем', photo: 'photos/roll.jpg' },
    { id: 'meringue',     cat: 'desserts', name: 'Меренга на палочке',      price: 476.5, note: 'Разноцветные завитки безе', photo: 'photos/meringue.jpg' },
  ],

  formatRub(value) {
    const frac = value % 1 ? 2 : 0;
    return value.toLocaleString('ru-RU', { minimumFractionDigits: frac, maximumFractionDigits: 2 }) + ' ₽';
  },
};
