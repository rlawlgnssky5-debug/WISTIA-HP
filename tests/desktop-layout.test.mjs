import assert from "node:assert/strict"
import {createRequire} from "node:module"
import {existsSync,readFileSync} from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const browser = [
  process.env.LAYOUT_BROWSER,
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
].find(candidate => candidate && existsSync(candidate))

assert.ok(browser, "Edge, Chrome 또는 LAYOUT_BROWSER 환경 변수가 필요합니다")

const {chromium}=createRequire(import.meta.url)('playwright')
async function measureFixture(filename,width,height){
 const instance=await chromium.launch({headless:true,executablePath:browser,args:['--no-sandbox','--allow-file-access-from-files']})
 try{
  const page=await instance.newPage({viewport:{width,height}})
  await page.route('https://**/*',r=>r.abort())
  await page.route('http://127.0.0.1/**',r=>{const path=resolve(here,'..','.'+new URL(r.request().url()).pathname);return r.fulfill({body:readFileSync(path),contentType:path.endsWith('.css')?'text/css':'text/html'})})
  await page.goto('http://127.0.0.1/tests/'+filename,{waitUntil:'load'})
  const result=await page.locator('#result').innerText()
  return JSON.parse(result)
 }finally{await instance.close()}
}

const measureLayout = (width, height) => measureFixture("desktop-layout.fixture.html", width, height)

{
  const layout = await measureLayout(1572, 900)
  assert.ok(
    Math.abs((layout.heroShell.left + layout.heroShell.right) / 2 - layout.viewport / 2) <= 1,
    "데스크톱 히어로 카드가 화면 중앙에 놓여야 합니다"
  )
  assert.ok(
    Math.abs((layout.hero.left + layout.hero.right) / 2 - layout.viewport / 2) <= 1,
    "데스크톱 히어로 문구가 화면 중앙축에 놓여야 합니다"
  )
  assert.ok(
    layout.gateway.left >= layout.heroShell.left && layout.gateway.right <= layout.heroShell.right,
    "아래 상품 콘텐츠가 히어로 이미지의 공통 데스크톱 가이드 안에 있어야 합니다"
  )
}

{
  const layout = await measureLayout(390, 844)
  assert.ok(
    Math.abs(layout.heroShell.left) <= 1 && Math.abs(layout.heroShell.right - layout.viewport) <= 1,
    `모바일 히어로 사진은 화면 너비를 온전히 사용해야 합니다 (현재 ${layout.heroShell.left}px / ${layout.viewport - layout.heroShell.right}px)`
  )
  assert.ok(
    Math.abs((layout.hero.left + layout.hero.right) / 2 - layout.viewport / 2) <= 1,
    "모바일 히어로 문구가 화면 중앙축에 놓여야 합니다"
  )
}

{
  const layout = await measureFixture("song-picker-layout.fixture.html", 1200, 900)
  assert.equal(layout.cards.length, 2, "축가 선택 카드는 두 개여야 합니다")
  assert.deepEqual(layout.cards.map(card => card.href), ["#/detail/solo", "#/detail/duo"], "각 축가 카드는 해당 상세 페이지로 연결되어야 합니다")
  assert.ok(
    Math.abs(layout.cards[0].top - layout.cards[1].top) <= 1,
    "데스크톱 축가 선택 카드는 같은 행에 배치되어야 합니다"
  )
  assert.ok(layout.cards.every(card => card.imageWidth >= card.width * .45), "각 카드의 이미지 영역은 카드 너비의 45% 이상이어야 합니다")
}

{
  const layout = await measureFixture("song-picker-layout.fixture.html", 390, 844)
  assert.ok(layout.cards[1].top > layout.cards[0].top + layout.cards[0].height, "모바일 축가 선택 카드는 한 열로 쌓여야 합니다")
  assert.ok(layout.cards.every(card => Math.abs(card.width - layout.contentWidth) <= 1), "모바일 축가 선택 카드는 콘텐츠 너비를 채워야 합니다")
}
