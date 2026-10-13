const { chromium } = require(process.env.WISTIA_NODE_MODULES + '/playwright')
const path = require('node:path')

;(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'})
 const page=await browser.newPage({viewport:{width:441,height:808},deviceScaleFactor:1,reducedMotion:'reduce'})
 await page.goto('http://127.0.0.1:4173/?v=20261014-detail-polish-16j',{waitUntil:'networkidle'})
 await page.screenshot({path:path.join(__dirname,'qa','home-v85-441.png')})
 await page.goto('http://127.0.0.1:4173/?v=20261014-detail-polish-16j',{waitUntil:'networkidle'})
 await page.locator('.process-image img').first().scrollIntoViewIfNeeded()
 await page.locator('.process-image img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())))
 await page.locator('#process').screenshot({path:path.join(__dirname,'qa','ar-process-v85-441.png')})
 await browser.close()
})().catch(error=>{console.error(error);process.exitCode=1})
