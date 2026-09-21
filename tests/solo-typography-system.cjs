const { chromium } = require(process.env.WISTIA_NODE_MODULES + '/playwright')
const assert = require('node:assert/strict')
const path = require('node:path')

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const BASE = process.env.WISTIA_BASE || 'http://127.0.0.1:4173/'

function normalizedFamily(value) {
  return value.split(',')[0].replace(/["']/g, '').trim().toLowerCase()
}

;(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: EDGE })
  try {
    for (const width of [390, 500]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' })
      await page.goto(`${BASE}?typography-system=1#/detail/solo`, { waitUntil: 'domcontentloaded' })
      await page.locator('#wistiaBeforeAfter').waitFor()

      const hierarchy = await page.locator('.solo-detail-scope').evaluate(root => {
        const groups = [...root.querySelectorAll('[data-solo-section-intro]')]
        const read = node => {
          if (!node) return null
          const style = getComputedStyle(node)
          return {
            family: style.fontFamily,
            size: parseFloat(style.fontSize),
            weight: Number(style.fontWeight),
            lineHeight: parseFloat(style.lineHeight),
            spacing: style.letterSpacing
          }
        }
        return groups.map(group => ({
          name: group.className,
          kicker: read(group.querySelector('[data-solo-kicker]')),
          title: read(group.querySelector('[data-solo-title]')),
          sub: read(group.querySelector('[data-solo-sub]')),
          titleLines: group.querySelectorAll('[data-solo-title] > .solo-type-line').length,
          subLines: group.querySelectorAll('[data-solo-sub] > .solo-type-line').length,
          titleWraps: [...group.querySelectorAll('[data-solo-title] > .solo-type-line')].some(line => {
            const style = getComputedStyle(line)
            const contentHeight = line.getBoundingClientRect().height - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)
            return contentHeight > parseFloat(style.lineHeight) * 1.25
          }),
          subWraps: [...group.querySelectorAll('[data-solo-sub] > .solo-type-line')].some(line => {
            const style = getComputedStyle(line)
            const contentHeight = line.getBoundingClientRect().height - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)
            return contentHeight > parseFloat(style.lineHeight) * 1.25
          })
        }))
      })

      assert.ok(hierarchy.length >= 7, 'all major solo detail sections should use the shared type hierarchy')
      const reference = hierarchy[0]
      for (const [index, item] of hierarchy.entries()) {
        for (const role of ['kicker', 'title', 'sub']) {
          if (!item[role]) continue
          assert.equal(normalizedFamily(item[role].family), normalizedFamily(reference[role].family), `${role} font family should match`)
          if (!((role === 'title' || role === 'sub') && item.name.includes('ar-cd-copy'))) {
            assert.ok(Math.abs(item[role].size - reference[role].size) < 0.2, `${role} size should match in section ${index + 1}`)
          }
          assert.equal(item[role].weight, reference[role].weight, `${role} weight should match in section ${index + 1}`)
          const itemSpacingRatio = parseFloat(item[role].spacing) / item[role].size
          const referenceSpacingRatio = parseFloat(reference[role].spacing) / reference[role].size
          assert.ok(Math.abs(itemSpacingRatio - referenceSpacingRatio) < 0.002, `${role} letter spacing ratio should match in section ${index + 1}`)
        }
      }

      const colors = await page.locator('.solo-detail-scope').evaluate(root => ({
        lightTitle: getComputedStyle(root.querySelector('#wistiaBeforeAfterTitle')).color,
        darkTitle: getComputedStyle(root.querySelector('#soloReviewTitle')).color,
        overflow: document.documentElement.scrollWidth - innerWidth
      }))
      assert.notEqual(colors.lightTitle, colors.darkTitle, 'dark sections should retain their white type treatment')
      assert.ok(colors.overflow <= 1, `${width}px viewport must not overflow after type unification`)
      const beforeAfterLines = await page.locator('.wistia-ba-copy').evaluate(group => ({
        title: [...group.querySelectorAll('[data-solo-title] > .solo-type-line')].map(line => {
          const style = getComputedStyle(line)
          return (line.getBoundingClientRect().height - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)) / parseFloat(style.lineHeight)
        }),
        sub: [...group.querySelectorAll('[data-solo-sub] > .solo-type-line')].map(line => {
          const style = getComputedStyle(line)
          return (line.getBoundingClientRect().height - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)) / parseFloat(style.lineHeight)
        })
      }))
      assert.ok(beforeAfterLines.title.every(lines => lines < 1.25), `Before / After title must stay at exactly two visual lines at ${width}px`)
      assert.ok(beforeAfterLines.sub.every(lines => lines < 1.25), `Before / After supporting copy must stay at exactly two visual lines at ${width}px`)
      const ratioLines = hierarchy.find(item => item.name.includes('ar-cd-copy'))
      assert.equal(ratioLines.titleWraps, false, `AR ratio title lines must not wrap again at ${width}px`)
      assert.equal(ratioLines.subWraps, false, `AR ratio supporting lines must not wrap or clip at ${width}px`)
      if (process.env.WISTIA_TYPOGRAPHY_SCREENSHOTS) {
        await page.screenshot({ path: path.join(process.env.WISTIA_TYPOGRAPHY_SCREENSHOTS, `solo-typography-${width}.png`), fullPage: true })
        const intros = page.locator('[data-solo-section-intro]')
        for (let index = 0; index < await intros.count(); index += 1) {
          await intros.nth(index).screenshot({ path: path.join(process.env.WISTIA_TYPOGRAPHY_SCREENSHOTS, `solo-type-${width}-${index + 1}.png`) })
        }
      }
      await page.close()
    }
    console.log('solo typography system checks passed')
  } finally {
    await browser.close()
  }
})().catch(error => {
  console.error(error)
  process.exit(1)
})
