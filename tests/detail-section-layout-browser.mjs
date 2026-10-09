import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
const {chromium}=createRequire(import.meta.url)('playwright')
const base=process.env.WISTIA_PREVIEW_URL||'http://127.0.0.1:4175'
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']})
try{
 for(const width of [1280,390])for(const path of ['/detail/solo','/detail/duo','/detail/duet-film']){
  const page=await browser.newPage({viewport:{width,height:900}})
  await page.route('https://**/*',route=>route.abort())
  await page.goto(base+path)
  await page.locator('.ar-commerce-detail h2').first().waitFor()
  await page.waitForTimeout(200)
  const result=await page.evaluate(()=>{
   const center=node=>{const r=node.getBoundingClientRect();return r.x+r.width/2}
   const visible=node=>!!node.getBoundingClientRect().width
   return {overflow:document.documentElement.scrollWidth>innerWidth,
    titles:[...document.querySelectorAll('.ar-commerce-detail h2')].filter(visible).map(node=>({text:node.textContent,center:center(node),align:getComputedStyle(node).textAlign,iconCenter:node.querySelector('.svg-title-icon')?center(node.querySelector('.svg-title-icon')):null})),
    badges:[...document.querySelectorAll('.ar-commerce-detail .detail-point-label,.ar-commerce-detail .price-reason-label')].filter(visible).map(node=>({center:center(node),size:node.querySelector('.detail-point-number')?parseFloat(getComputedStyle(node.querySelector('.detail-point-number')).fontSize):null,color:getComputedStyle(node).color,background:getComputedStyle(node).backgroundColor})),
    sections:[...document.querySelectorAll('.detail-section-layout')].filter(visible).map(node=>({padding:getComputedStyle(node).paddingTop,contentWidth:node.clientWidth-parseFloat(getComputedStyle(node).paddingLeft)-parseFloat(getComputedStyle(node).paddingRight)})),
    notices:[...document.querySelectorAll('.arc-notices ul')].filter(visible).map(node=>({center:center(node),gradient:getComputedStyle(node).backgroundImage}))}
  })
  assert.equal(result.overflow,false,path)
  for(const title of result.titles){assert.ok(Math.abs(title.center-width/2)<2,`${path} ${title.text}`);assert.equal(title.align,'center');if(title.iconCenter!==null)assert.ok(Math.abs(title.iconCenter-width/2)<2)}
  for(const badge of result.badges){assert.ok(Math.abs(badge.center-width/2)<2);if(badge.size!==null)assert.equal(badge.size,15);assert.notEqual(badge.color,badge.background)}
  for(const section of result.sections){assert.equal(section.padding,width===390?'40px':'56px');assert.ok(Math.abs(section.contentWidth-(width===390?350:900))<2)}
  for(const notice of result.notices){assert.ok(Math.abs(notice.center-width/2)<2);assert.equal(notice.gradient,'none')}
  console.log(`${width}px ${path}: centered titles/icons/badges, uniform section width/spacing, warm notice cards passed`)
  await page.close()
 }
}finally{await browser.close()}
