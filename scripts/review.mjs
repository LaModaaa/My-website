// Снимает мой сайт на разных экранах — для самопроверки вёрстки.
// Запуск: `node scripts/review.mjs <папка> [url]`
import puppeteer from 'puppeteer-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = path.resolve(process.argv[2] ?? 'scripts/review')
const URL = process.argv[3] ?? 'http://localhost:5180/'
const BROWSER = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
].find((p) => fs.existsSync(p))
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const VIEWPORTS = [
  { name: 'desk', width: 1440, height: 900, deviceScaleFactor: 1 },
  { name: 'mob', width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true },
]

fs.mkdirSync(OUT, { recursive: true })
const browser = await puppeteer.launch({ executablePath: BROWSER, headless: true })
try {
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
    await page.setViewport(vp)
    await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 })
    await wait(1800)
    const info = await page.evaluate(() => ({
      docW: document.documentElement.scrollWidth,
      winW: window.innerWidth,
      height: document.documentElement.scrollHeight,
      sections: [...document.querySelectorAll('section')].map((s) => [s.id || '-', Math.round(s.offsetTop)]),
    }))
    console.log(vp.name, JSON.stringify(info), errors.length ? 'ERRORS: ' + errors.join(' | ') : 'no errors')
    const step = vp.height * 0.9
    let k = 0
    for (let y = 0; y < info.height; y += step) {
      await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y)
      await wait(900)
      await page.screenshot({ path: path.join(OUT, `${vp.name}-${String(++k).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 70 })
    }
    await page.close()
  }
} finally {
  await browser.close()
}
