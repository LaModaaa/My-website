/**
 * Интерфейс страницы: разбивка заголовков на слова, появление блоков при скролле,
 * «живой» чат в hero, плавный скролл Lenis, шапка, мобильное меню и подсветка пунктов меню.
 * Цены в чате берутся из data.js, как и везде на сайте.
 */
window.CAT_CAFE_UI = true;

(() => {
  const { TARIFFS, formatRub } = window.CAT_CAFE;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = ms => new Promise(r => setTimeout(r, ms));

  // 1) тексты ответов котокафе в чате hero
  const wd = TARIFFS.base.weekday;
  const twoHours = wd.hour + 60 * wd.perMin;
  const CHAT = {
    price: `Мур! Первый час — ${formatRub(wd.hour)}, дальше по ${formatRub(wd.perMin)} за минуту. Два часа выйдут в ${formatRub(twoHours)} на гостя. Место уже грею.`,
    stop: `В будни действует стоп-чек: больше ${formatRub(wd.stop)} не заплатите, сколько бы ни гостили. Настолки, книги, фильмы и PS — к вашим услугам.`,
  };
  document.querySelectorAll('#studio .ai-t').forEach(el => (el.dataset.text = CHAT[el.dataset.chat]));

  // 2) заголовки разбиваются на слова, вложенные span и <br> сохраняются
  document.querySelectorAll('[data-split]').forEach(el => {
    let i = 0;
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'w';
            const s = document.createElement('span'); s.textContent = part; s.style.setProperty('--i', i++);
            w.appendChild(s); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    };
    walk(el);
  });

  // 3) появление при скролле (низкий порог, чтобы высокие блоки тоже срабатывали)
  const reveal = el => {
    if (el.classList.contains('in')) return;
    el.classList.add('in');
    // после появления карточки переключаются на быстрые hover-переходы
    const done = () => el.classList.add('done');
    if (reduce) done();
    else el.addEventListener('transitionend', e => { if (e.target === el && e.propertyName === 'opacity') done(); });
  };
  const targets = document.querySelectorAll('.rv,[data-split]');
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); }
  }), { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
  targets.forEach(el => io.observe(el));
  // страховка: показать то, что уже на экране, даже если observer запоздал
  const sweep = () => targets.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight * 0.94 && r.bottom > 0) reveal(el);
  });
  requestAnimationFrame(() => requestAnimationFrame(sweep));
  addEventListener('load', sweep);

  // 4) чат в hero: высота ответов резервируется заранее, две колонки анимируются одновременно и независимо
  document.querySelectorAll('#studio .ai-t').forEach(el => {
    el.innerHTML = '<span class="ghost"></span><span class="live"></span>';
    el.firstChild.textContent = el.dataset.text;
  });
  const typeInto = (el, text, speed = 14) => new Promise(res => {
    const live = el.querySelector('.live');
    if (reduce) { live.textContent = text; return res(); }
    live.innerHTML = '<span class="typing"><i></i><i></i><i></i></span>';
    setTimeout(() => {
      live.textContent = ''; let k = 0;
      const step = () => { k += 2; live.textContent = text.slice(0, k); k < text.length ? setTimeout(step, speed) : res(); };
      step();
    }, 650);
  });
  const runColumn = async (items, done) => {
    await wait(reduce ? 0 : 1500);
    for (const m of items) {
      m.classList.add('show');
      if (m.id === 'hero-fig') m.classList.add('in');
      const t = m.querySelector('.ai-t');
      if (t) await typeInto(t, t.dataset.text);
      else await wait(reduce ? 0 : 380);
    }
    if (done) done();
  };
  runColumn([...document.querySelectorAll('#studio .chat .msg')], () => {
    document.getElementById('hero-track').style.width = Math.round((twoHours / wd.stop) * 100) + '%';
  });
  runColumn([...document.querySelectorAll('#studio .prod .msg')]);

  // 5) плавный скролл + один обработчик для шапки и параллакса кота в CTA
  const nav = document.getElementById('nav');
  const parallax = [...document.querySelectorAll('[data-parallax]')];
  const onScroll = () => {
    nav.classList.toggle('scrolled', scrollY > 20);
    if (reduce) return;
    parallax.forEach(el => {
      const r = el.parentElement.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
      el.style.setProperty('--py', (24 - p * 48).toFixed(1) + 'px');
    });
  };
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ duration: 1.25, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.on('scroll', onScroll);
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  } else {
    let ticking = false;
    addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(() => { onScroll(); ticking = false; }); ticking = true; }
    }, { passive: true });
  }
  onScroll();

  // 6) мобильное меню
  const burger = document.getElementById('burger');
  const mmenu = document.getElementById('mmenu');
  const setMenu = open => {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    mmenu.inert = !open;
    if (lenis) open ? lenis.stop() : lenis.start();
  };
  burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) { setMenu(false); burger.focus(); }
  });
  matchMedia('(min-width: 1241px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  // 7) якорные ссылки через Lenis
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (document.body.classList.contains('menu-open')) setMenu(false);
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: -80 });
    else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    history.replaceState(null, '', id);
  }));

  // 8) подсветка пункта меню текущей секции (калькулятор подсвечивает «Тарифы» через data-nav-section)
  const links = document.querySelectorAll('[data-nav-link]');
  const sectionIo = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = '#' + (entry.target.dataset.navSection || entry.target.id);
    links.forEach(a => {
      const active = a.getAttribute('href') === id;
      a.classList.toggle('nav-active', active);
      if (active) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }), { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(s => sectionIo.observe(s));

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
