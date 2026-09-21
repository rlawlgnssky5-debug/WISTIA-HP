const { chromium } = require(process.env.WISTIA_NODE_MODULES + '/playwright')
const assert = require('node:assert/strict')

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const BASE = process.env.WISTIA_BASE || 'http://127.0.0.1:4173/'

async function checkViewport(browser, viewport) {
  const page = await browser.newPage({ viewport, reducedMotion: 'reduce' })
  await page.goto(`${BASE}?section-continuity=1#/detail/solo`, { waitUntil: 'domcontentloaded' })
  await page.locator('.solo-detail-scope').waitFor()

  const metrics = await page.locator('.solo-detail-scope').evaluate(root => {
    const rootBox = root.getBoundingClientRect()
    const content = [...root.children].filter(node =>
      node.matches('section, .solo-editorial-sheet, footer') &&
      !node.matches('.fixed-price')
    )
    return content.map(node => {
      const box = node.getBoundingClientRect()
      const style = getComputedStyle(node)
      return {
        name: node.id || node.className,
        left: box.left,
        right: box.right,
        top: box.top,
        bottom: box.bottom,
        width: box.width,
        rootLeft: rootBox.left,
        rootRight: rootBox.right,
        rootWidth: rootBox.width,
        marginTop: parseFloat(style.marginTop),
        background: style.backgroundColor,
        backgroundImage: style.backgroundImage
      }
    })
  })

  for (const section of metrics) {
    assert.ok(Math.abs(section.left - section.rootLeft) < 1, `${section.name} must start at the page edge`)
    assert.ok(Math.abs(section.right - section.rootRight) < 1, `${section.name} must end at the page edge`)
    assert.ok(Math.abs(section.width - section.rootWidth) < 1, `${section.name} must fill the page width`)
    assert.equal(section.marginTop, 0, `${section.name} must not expose the parent background above it`)
    assert.ok(
      section.background !== 'rgba(0, 0, 0, 0)' || section.backgroundImage !== 'none',
      `${section.name} needs its own clear background`
    )
  }

  for (let index = 1; index < metrics.length; index += 1) {
    const gap = metrics[index].top - metrics[index - 1].bottom
    assert.ok(Math.abs(gap) < 1, `${metrics[index - 1].name} and ${metrics[index].name} must meet without a gutter`)
  }

  await page.close()
}

;(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: EDGE })
  try {
    await checkViewport(browser, { width: 1280, height: 900 })
    await checkViewport(browser, { width: 390, height: 844 })
    console.log('solo section continuity checks passed')
  } finally {
    await browser.close()
  }
})().catch(error => {
  console.error(error)
  process.exit(1)
})
