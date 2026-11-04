// Все тексты и ссылки сайта — здесь. Меняешь данные, вёрстка подстраивается сама.

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

export const CONTACTS = {
  telegram: { label: 'Telegram', handle: '@streetowww', url: 'https://t.me/streetowww' },
  vk: { label: 'ВКонтакте', handle: '@streewww', url: 'https://vk.com/streewww' },
}

export const NAV = [
  { label: 'Обо мне', href: '#about' },
  { label: 'Услуги', href: '#services' },
  { label: 'Проекты', href: '#projects' },
  { label: 'Контакты', href: '#contact' },
]

export const HERO_PORTRAIT =
  'https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png'

export const ABOUT_TEXT =
  'Я Егор, делаю сайты для бизнеса и вкладываю в каждый проект душу. Кондитерская, компьютерный клуб, котокафе – мне нравится погружаться в чужое дело и показывать его с лучшей стороны. Расскажите о своей идее, и давайте сделаем что-то по-настоящему крутое вместе!'

const FIGMA = 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7'
export const ABOUT_DECOR = {
  moon: `${FIGMA}/moon_icon.11395d36.png`,
  object: `${FIGMA}/p59_1.4659672e.png`,
  lego: `${FIGMA}/lego_icon-1.703bb594.png`,
  group: `${FIGMA}/Group_134-1.2e04f3ce.png`,
}

export const SERVICES = [
  {
    name: 'Лендинги',
    text: 'Одностраничные сайты, которые за пару экранов объясняют, что вы предлагаете, и мягко подводят посетителя к заявке или звонку.',
  },
  {
    name: 'Сайты для бизнеса',
    text: 'Сайты для кафе, клубов, студий и магазинов: меню, цены, запись, карта и контакты в одном месте, удобно и с телефона, и с компьютера.',
  },
  {
    name: 'Веб-дизайн',
    text: 'Продумываю структуру, шрифты и цвета под характер вашего бренда, чтобы сайт выглядел дорого, читался легко и запоминался.',
  },
  {
    name: 'Анимации',
    text: 'Плавные появления, бегущие строки, калькуляторы и переключатели тарифов – всё, что делает сайт живым и приятным в использовании.',
  },
  {
    name: 'Видео для соцсетей',
    text: 'Монтирую короткие ролики для Reels, Shorts и TikTok, чтобы о вашем бизнесе узнавали не только из поиска, но и из ленты.',
  },
]

export type Project = {
  name: string
  category: string
  description: string
  url: string
  images: [string, string, string] // левая верхняя, левая нижняя, правая высокая
}

export const PROJECTS: Project[] = [
  {
    name: '«Мечта»',
    category: 'Кондитерская',
    description: 'Семейная кондитерская в Челябинске: торты по ГОСТу, витрина с десертами и свадебные торты.',
    url: asset('works/mechta/index.html'),
    images: [asset('shots/mechta-d1.webp'), asset('shots/mechta-d3.webp'), asset('shots/mechta-phones.webp')],
  },
  {
    name: 'Space Capsula',
    category: 'Компьютерный клуб',
    description: 'Киберклуб в Челябинске: зоны, цены с переключателем, бар и атмосфера ночного сетапа.',
    url: asset('works/capsula/index.html'),
    images: [asset('shots/capsula-d1.webp'), asset('shots/capsula-d3.webp'), asset('shots/capsula-phones.webp')],
  },
  {
    name: 'Котокафе',
    category: 'Кафе',
    description: 'Уютное котокафе: тарифы «будни / выходные» и калькулятор стоимости визита.',
    url: asset('works/catcafe/index.html'),
    images: [asset('shots/catcafe-d1.webp'), asset('shots/catcafe-d3.webp'), asset('shots/catcafe-phones.webp')],
  },
]

// Плитки бегущей ленты — скриншоты моих работ
const shot = (slug: string, n: number) => asset(`shots/${slug}-d${n}.webp`)
export const MARQUEE_ROW_1 = [1, 2, 3].flatMap((n) => [shot('mechta', n), shot('capsula', n), shot('catcafe', n)])
export const MARQUEE_ROW_2 = [4, 5, 6].flatMap((n) => [shot('capsula', n), shot('catcafe', n), shot('mechta', n)])
