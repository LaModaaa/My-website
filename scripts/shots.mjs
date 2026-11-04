// Снимает скриншоты моих работ для портфолио.
// Запуск: сначала `npm run dev -- --port 5180`, потом `npm run shots [папка-для-кандидатов]`
import puppeteer from 'puppeteer-core'
import fs from 'node:fs'
import path from 'node:path'

const BASE = 'http://localhost:5180/works'
const OUT = path.resolve(process.argv[2] ?? 'scripts/out')
const BROWSER = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
].find((p) => fs.existsSync(p))

const SITES = [
  { slug: 'mechta', url: `${BASE}/mechta/index.html` },
  { slug: 'capsula', url: `${BASE}/capsula/index.html` },
  { slug: 'catcafe', url: `${BASE}/catcafe/index.html` },
]

const DESKTOP_SHOTS = 9
const MOBILE_POSITIONS = [0, 0.3, 0.6]
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

async function open(browser, url, viewport) {
  const page = await browser.newPage()
  await page.setViewport(viewport)
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })
  await wait(1500)
  return page
}

// Прокручиваем постепенно, чтобы сработали все анимации появления
async function scrollTo(page, y) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y)
  await wait(1300)
}

async function shootSite(browser, site) {
  const files = { desktop: [], mobile: [] }

  const d = await open(browser, site.url, { width: 1440, height: 926, deviceScaleFactor: 1 })
  const dh = await d.evaluate(() => document.documentElement.scrollHeight - window.innerHeight)
  for (let i = 0; i < DESKTOP_SHOTS; i++) {
    await scrollTo(d, Math.round((dh * i) / (DESKTOP_SHOTS - 1)))
    const file = path.join(OUT, `${site.slug}-c${i + 1}.webp`)
    await d.screenshot({ path: file, type: 'webp', quality: 80 })
    files.desktop.push(file)
  }
  await d.close()

  const m = await open(browser, site.url, { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  const mh = await m.evaluate(() => document.documentElement.scrollHeight - window.innerHeight)
  for (const [i, k] of MOBILE_POSITIONS.entries()) {
    await scrollTo(m, Math.round(mh * k))
    const file = path.join(OUT, `${site.slug}-m${i + 1}.png`)
    await m.screenshot({ path: file, type: 'png' })
    files.mobile.push(file)
  }
  await m.close()
  return files
}

const toData = (file) => `data:image/${path.extname(file).slice(1)};base64,${fs.readFileSync(file).toString('base64')}`

// Три телефона рядом на тёмном фоне — показывает, что сайт адаптивный
async function phones(browser, slug, mobileFiles) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1320, height: 1100, deviceScaleFactor: 1 })
  const imgs = mobileFiles
    .map((f, i) => `<div class="ph" style="transform:translateY(${i === 1 ? -36 : 36}px)"><img src="${toData(f)}"></div>`)
    .join('')
  await page.setContent(`<!doctype html><html><body style="margin:0">
    <div style="width:1320px;height:1100px;display:flex;gap:36px;align-items:center;justify-content:center;
      background:radial-gradient(120% 90% at 50% 0%, #2a2c33 0%, #141519 55%, #0c0c0c 100%)">${imgs}</div>
    <style>.ph{width:379px;height:820px;border-radius:52px;padding:10px;background:#050506;
      box-shadow:0 0 0 2px #3a3d45, 0 40px 80px rgba(0,0,0,.55);overflow:hidden}
      .ph img{width:100%;height:100%;object-fit:cover;object-position:top;border-radius:42px;display:block}</style>
  </body></html>`)
  await wait(300)
  await page.screenshot({ path: path.join(OUT, `${slug}-phones.webp`), type: 'webp', quality: 82 })
  await page.close()
}

// Сводный лист кандидатов, чтобы выбрать лучшие кадры глазами
async function sheet(browser, slug, desktopFiles) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1500, height: 1000, deviceScaleFactor: 1 })
  const cells = desktopFiles
    .map((f, i) => `<figure><img src="${toData(f)}"><figcaption>c${i + 1}</figcaption></figure>`)
    .join('')
  await page.setContent(`<!doctype html><html><body style="margin:0;background:#222;font:20px sans-serif;color:#fff">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:8px">${cells}</div>
    <style>figure{margin:0;position:relative}img{width:100%;display:block}
    figcaption{position:absolute;left:6px;top:6px;background:#000c;padding:2px 8px;border-radius:6px}</style></body></html>`)
  await wait(300)
  await page.screenshot({ path: path.join(OUT, `_sheet-${slug}.png`), fullPage: true })
  await page.close()
}

fs.mkdirSync(OUT, { recursive: true })
const browser = await puppeteer.launch({ executablePath: BROWSER, headless: true })
try {
  for (const site of SITES) {
    console.log('→', site.slug)
    const files = await shootSite(browser, site)
    await phones(browser, site.slug, files.mobile)
    await sheet(browser, site.slug, files.desktop)
  }
} finally {
  await browser.close()
}
console.log('Готово:', OUT)
