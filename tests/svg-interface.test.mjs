import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {runInNewContext} from 'node:vm'
import {graphicsFixture,assertPreservedAppLogic} from './studio-graphics-fixture.mjs'
import {assertContactBusinessPreserved} from './svg-interface-fixture.mjs'

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')
const app=read('js/app.js'),beforeAfter=read('js/before-after.js'),ratio=read('js/ar-ratio-cd.js')
const index=read('index.html'),controlCss=read('css/svg-player-controls.css')
const digest=text=>createHash('sha256').update(text.replace(/\r\n/g,'\n')).digest('hex')

// Small controls can change, but simultaneous source mixing and playback timing cannot
for(const [source,start,end,hash] of [
 [beforeAfter,'    function start(offset){','    function activate(next,autoPlay=false){','f4dc19e3ada603f939e215ac15fc03de245aecdde3397843ae242ff830000d5f'],
 [beforeAfter,'    function makePeaks(buffer,count=120){',"    root.classList.add('is-loading')",'d0682b27127d7e7e8c7ec77ff3fbe063a39fc844e9a0f0e2eb87af94a74f5109'],
 [ratio,' function mixFor(value){',' function initArCdRatio(','ba6a832681f181115d1cecf6c024ef6ac944270f22dc997f7462fda8ff66b4fb'],
 [ratio,'  async function decode(data){','  function setPlaying(state){','0b178974135f5366381b804aef82853cab36dc7a2e7021d70420a44501bc49e3'],
 [ratio,'  function progress(){','  function render(){','7c38270146688152680ccce4f22777a8b7389caae5d7cdd3c72877f22e48e72d']
]){
 const a=source.indexOf(start),b=source.indexOf(end,a+start.length)
 assert.ok(a>=0&&b>a,'stable audio core boundaries remain available')
 assert.equal(digest(source.slice(a,b)),hash,'audio core changes require separate authorization')
}
assertPreservedAppLogic(app)
assertContactBusinessPreserved(read('js/contact-form.js'))

const scope={escapeHtml:value=>value,ratioSource:value=>'assets/audio/ar/'+value+'.mp3'}
runInNewContext(graphicsFixture(app),scope)
runInNewContext(app.slice(app.indexOf('function wistiaBeforeAfterSection('),app.indexOf('function setExpertPanel(')),scope)
runInNewContext(app.slice(app.indexOf('function arCdRatioSection('),app.indexOf('function formatRatioTime(')),scope)
const playPair=html=>{
 assert.match(html,/data-icon="play"/,'the actual SVG triangle remains in the button')
 assert.match(html,/data-icon="pause"/,'the actual SVG pause remains in the button')
 assert.doesNotMatch(html,/>[▶Ⅱ]<\/span>/,'text symbols must not substitute for the actual control SVG')
}
// Controls are normalized once per real page render, before either audio initializer
{
 const beforeGlyph=element(),ratioGlyph=element(),beforeButton=element(),arButton=element(),switcher=element(),ratioBox=element(),input=element()
 let label='',hint=null
 arButton.querySelector=()=>label?{}:null
 arButton.insertAdjacentHTML=(where,html)=>{label+=html}
 ratioBox.querySelector=selector=>selector==='.wistia-ar__ratio-input'?input:hint
 ratioBox.insertAdjacentHTML=(where,html)=>{hint={html}}
 scope.app={querySelector:selector=>selector==='.wistia-ar__play'?arButton:ratioBox,querySelectorAll:selector=>selector==='.bap-play-icon,.wistia-ar__play-icon'?[beforeGlyph,ratioGlyph]:selector==='.bap-play'?[beforeButton]:[switcher]}
 scope.prepareSvgPlayerControls()
 playPair(beforeGlyph.innerHTML);playPair(ratioGlyph.innerHTML)
 assert.equal(beforeButton.attrs['aria-pressed'],'false')
 assert.match(label,/class="wistia-ar__play-label">재생<\/span>/)
 assert.match(switcher.innerHTML,/<span>전환<\/span>/)
 assert.equal(switcher.attrs['aria-label'],'보정 후로 전환하여 듣기')
 assert.match(hint.html,/wistia-ar__ratio-hint/)
 assert.match(hint.html,/data-icon="drag"/)
 assert.equal(input.attrs['aria-describedby'],'arRatioDragHint')
 assert.equal(hint.id,'arRatioDragHint')
 scope.prepareSvgPlayerControls()
 assert.equal((label.match(/wistia-ar__play-label/g)||[]).length,1,'repeat preparation never duplicates the visible caption')
 assert.equal((beforeGlyph.innerHTML.match(/data-icon="play"/g)||[]).length,1,'repeat preparation never duplicates control icons')
}
for(const [html,cssClass] of [[scope.wistiaBeforeAfterSection(),'bap-play'],[scope.arCdRatioSection(),'wistia-ar__play']])assert.match(html,new RegExp('<button class="'+cssClass+'(?: [^"]*)?"[^>]*>'),'the shared player keeps its original actual button')
const route=app.slice(app.indexOf('function route('),app.indexOf('function normalizeInquiryLinks('))
assert.ok(route.indexOf('prepareSvgPlayerControls()')<route.indexOf('window.initWistiaBeforeAfter?.()'),'SVG controls exist before before/after audio initialization')
assert.ok(route.indexOf('prepareSvgPlayerControls()')<route.indexOf('window.initArCdRatio?.()'),'SVG controls exist before ratio audio initialization')
assert.match(controlCss,/\[aria-pressed="true"\] \[data-icon="pause"\]\{display:block!important\}/)
assert.match(controlCss,/\.bap-switch\{\s*position:static!important/,'the switch does not overlap the tabs')
assert.match(controlCss,/::-webkit-slider-thumb\{[^}]*border:2px solid #625D54!important/,'the native ratio handle has a visible boundary')
assert.match(controlCss,/touch-action:pan-y/,'native ranges retain vertical page scrolling')
assert.match(controlCss,/:focus-visible/,'keyboard users see the active control')
assert.match(index,/css\/svg-player-controls.css\?v=20261007-svg-interface-1/)

function element(){
 const classes=new Set()
 return {dataset:{},hidden:false,value:'70',attrs:{},events:{},style:{setProperty(){}},
  classList:{add:x=>classes.add(x),remove:x=>classes.delete(x),contains:x=>classes.has(x),toggle(x,state){state?classes.add(x):classes.delete(x)}},
  setAttribute(key,value){this.attrs[key]=value},removeAttribute(key){delete this.attrs[key]},
  addEventListener(type,fn){this.events[type]=fn},removeEventListener(){},getBoundingClientRect:()=>({width:360,height:80,left:0})}
}
const flush=()=>new Promise(resolve=>setImmediate(resolve))

// Retain the exact SVG nodes across play, pause and before/after selection
{
 const nodes=new Map()
 for(const selector of ['.bap-switch','.bap-badge','.bap-badge b','.bap-play','.bap-play-icon','.bap-play-label','.bap-time b','.bap-time span','.bap-wave','.bap-error','.bap-player'])nodes.set(selector,element())
 const glyph=nodes.get('.bap-play-icon');glyph.innerHTML='<svg data-icon="play"></svg><svg data-icon="pause"></svg>'
 Object.defineProperty(glyph,'textContent',{set(){assert.fail('playback must never overwrite persistent SVG nodes')}})
 nodes.get('.bap-badge').querySelector=()=>nodes.get('.bap-badge b')
 nodes.get('.bap-play').querySelector=selector=>nodes.get(selector)
 const before=element(),after=element();before.dataset.mode='before';after.dataset.mode='after'
 const root=element();root.querySelector=selector=>nodes.get(selector);root.querySelectorAll=()=>[before,after]
 nodes.get('.bap-wave').getContext=()=>({clearRect(){},fillRect(){}})
 let clock=0,lastBuffer=null,claims=0
 class AudioContext{constructor(){this.state='running';this.destination={}}get currentTime(){return clock}createBufferSource(){return {connect(){},disconnect(){},stop(){},start(){lastBuffer=this.buffer}}}close(){}}
 class OfflineAudioContext{async decodeAudioData(bytes){return {kind:new Uint8Array(bytes)[0],duration:85,getChannelData:()=>new Float32Array(240).fill(.5)}}}
 const window={AudioContext,OfflineAudioContext,addEventListener(){},devicePixelRatio:1,wistiaClaimPlayback(){claims++}}
 runInNewContext(beforeAfter,{window,document:{querySelector:()=>root,baseURI:'http://localhost/',body:element()},URL,AbortController,fetch:async src=>({ok:true,arrayBuffer:async()=>Uint8Array.of(src.includes('before.mp3')?1:2).buffer}),requestAnimationFrame:()=>1,cancelAnimationFrame(){},console})
 const player=window.initWistiaBeforeAfter();await flush()
 const play=nodes.get('.bap-play'),label=nodes.get('.bap-play-label'),switcher=nodes.get('.bap-switch')
 assert.equal(play.attrs['aria-pressed'],'false');assert.equal(label.textContent,'재생')
 assert.equal(switcher.attrs['aria-label'],'보정 후로 전환하여 듣기')
 await player.play();clock=10
 assert.equal(play.attrs['aria-pressed'],'true');assert.equal(label.textContent,'일시정지')
 switcher.events.click();await flush()
 assert.equal(lastBuffer.kind,2);assert.equal(root.dataset.position,'10')
 assert.equal(switcher.attrs['aria-label'],'보정 전으로 전환하여 듣기')
 player.pause();assert.equal(play.attrs['aria-pressed'],'false');assert.equal(label.textContent,'재생')
 before.events.click();await flush()
 assert.equal(lastBuffer.kind,1);assert.equal(root.dataset.position,'10')
 assert.equal(play.attrs['aria-pressed'],'true');assert.equal(label.textContent,'일시정지')
 playPair(glyph.innerHTML);assert.ok(claims>=2)
 player.destroy()
}

// The AR button's visible label follows the same state as its SVG pair
{
 const nodes=new Map()
 for(const selector of ['.wistia-ar__ratio-input','.wistia-ar__ratio-current','[data-ratio-mood]','.wistia-ar__disc-stage','.wistia-ar__ratio','.wistia-ar__play','.wistia-ar__play-label','.wistia-ar__seek','[data-current-time]','[data-duration]','.wistia-ar__volume','.wistia-ar__error'])nodes.set(selector,element())
 const root=element();root.querySelector=selector=>nodes.get(selector);root.querySelectorAll=()=>[];root.getAttribute=key=>key
 let clock=0
 class AudioContext{constructor(){this.state='running';this.destination={}}get currentTime(){return clock}createGain(){return {connect(){},gain:{value:0,cancelScheduledValues(){},setValueAtTime(){},setTargetAtTime(){}}}}createBufferSource(){return {connect(){},disconnect(){},start(){},stop(){}}}close(){return Promise.resolve()}}
 class OfflineAudioContext{async decodeAudioData(){return {duration:85}}}
 const window={AudioContext,OfflineAudioContext,wistiaClaimPlayback(){}}
 runInNewContext(ratio,{window,document:{querySelector:()=>root},navigator:{},AbortController,fetch:async()=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(1)}),requestAnimationFrame:()=>1,cancelAnimationFrame(){},console})
 const player=window.initArCdRatio();await flush()
 nodes.get('.wistia-ar__play').events.click();await flush()
 assert.equal(nodes.get('.wistia-ar__play').attrs['aria-pressed'],'true')
 assert.equal(nodes.get('.wistia-ar__play-label').textContent,'일시정지')
 clock=10;nodes.get('.wistia-ar__ratio-input').events.input({target:{value:'50'}});await flush()
 assert.equal(player.getSelected(),50)
 player.pause()
 assert.equal(nodes.get('[data-current-time]').textContent,'0:10','ratio adjustment preserves the same audio timeline')
 assert.equal(nodes.get('.wistia-ar__play').attrs['aria-pressed'],'false')
 assert.equal(nodes.get('.wistia-ar__play-label').textContent,'재생')
 player.destroy()
}

// Exercise the real shared heading mount without a separate browser process
{
 class TextNode{
  constructor(value,document){this.nodeType=3;this.value=value;this.ownerDocument=document;this.parentElement=null}
  get textContent(){return this.value}
 }
 class Element{
  constructor(tag,document){this.nodeType=1;this.tagName=tag.toUpperCase();this.ownerDocument=document;this.parentElement=null;this.childNodes=[];this.dataset={};this.attrs={};this.classes=new Set();this._html='';this.id='';this.classList={add:cls=>this.classes.add(cls),contains:cls=>this.classes.has(cls)}}
  set className(value){this.classes=new Set(value.split(/\s+/).filter(Boolean))}
  get className(){return [...this.classes].join(' ')}
  get children(){return this.childNodes.filter(node=>node.nodeType===1)}
  get firstChild(){return this.childNodes[0]}
  get textContent(){return this.childNodes.map(node=>node.textContent).join('')}
  set innerHTML(value){this._html=value;this.childNodes=[]}
  get innerHTML(){return this._html}
  setAttribute(key,value){this.attrs[key]=value}
  getAttribute(key){return this.attrs[key]||null}
  hasAttribute(key){return key in this.attrs}
  append(...nodes){for(const node of nodes){if(node.parentElement)node.parentElement.childNodes.splice(node.parentElement.childNodes.indexOf(node),1);node.parentElement=this;this.childNodes.push(node)}}
  prepend(node){this.append(node);this.childNodes.unshift(this.childNodes.pop())}
  matches(selector){return selector.split(',').some(part=>{part=part.trim();if(part.includes('>'))return false;if(part.includes(' ')){const i=part.lastIndexOf(' ');return this.matches(part.slice(i+1))&&Boolean(this.parentElement?.closest(part.slice(0,i)))}const tag=part.match(/^[a-z][a-z\d]*/i)?.[0];if(tag&&tag.toUpperCase()!==this.tagName)return false;for(const cls of part.matchAll(/\.([\w-]+)/g))if(!this.classes.has(cls[1]))return false;for(const attr of part.matchAll(/\[([\w-]+)(?:="([^"]+)")?\]/g))if(!this.hasAttribute(attr[1])||(attr[2]&&this.getAttribute(attr[1])!==attr[2]))return false;return Boolean(tag||part.startsWith('.')||part.startsWith('['))})}
  closest(selector){for(let node=this;node;node=node.parentElement)if(node.matches(selector))return node;return null}
  querySelectorAll(selector){const nodes=[];for(const child of this.children){if(child.matches(selector))nodes.push(child);nodes.push(...child.querySelectorAll(selector))}return nodes}
  querySelector(selector){if(selector==='svg'&&this._html.includes('<svg'))return this;for(const child of this.children){if(child.matches(selector))return child;const nested=child.querySelector(selector);if(nested)return nested}return null}
 }
 const document={createElement(tag){return new Element(tag,this)},createTextNode(value){return new TextNode(value,this)}}
 const root=document.createElement('main'),records=[]
 for(const [titleText,name] of [['상품 소개','package'],['직접 남겨 주신 이야기','chat'],['왜 저렴한가요?','receipt'],['제작 과정','workflow'],['후기 페이백','refund'],['AR 비율을 골라보세요','mix'],['위스티아의 장점','shield'],['두 사람의 인터뷰','microphone'],['서로에게 전하는 편지','letter'],['부천에서 만나요','pin']]){
  const header=document.createElement('header'),kicker=document.createElement('p'),title=document.createElement('h2'),description=document.createElement('p')
  kicker.className='eyebrow';kicker.append(document.createTextNode('POINT 01'))
  const original=document.createTextNode(titleText);title.append(original)
  description.append(document.createTextNode('설명과 실제 내용을 그대로 보존합니다'))
  header.append(kicker,title,description);root.append(header);records.push({header,kicker,title,description,original,name})
 }
 const skipHeader=document.createElement('header'),alreadyIcon=document.createElement('h2'),nativeSvg=document.createElement('svg')
 alreadyIcon.append(nativeSvg,document.createTextNode('기존 SVG 제목'));skipHeader.append(alreadyIcon);root.append(skipHeader)
 const information=document.createElement('section'),definitionList=document.createElement('dl'),metadata=[]
 information.className='mas-information';information.append(definitionList);root.append(information)
 for(const [labelText,name,value] of [['인원','people','1인 또는 2인'],['가격','receipt','기본 12만원'],['주소','pin','부천시 석천로170번길 19'],['납기','clock','요청 시 3일 이내 · 추가 3만원']]){
  const row=document.createElement('div'),label=document.createElement('dt'),definition=document.createElement('dd')
  const originalLabel=document.createTextNode(labelText),originalValue=document.createTextNode(value)
  label.append(originalLabel);definition.append(originalValue);row.append(label,definition);definitionList.append(row)
  metadata.push({row,label,definition,originalLabel,originalValue,labelText,name,value})
 }
 const apiScope={window:{}}
 runInNewContext(read('js/svg-interface.js'),apiScope)
 const api=apiScope.window.WistiaSvgUI
 assert.equal(typeof api.mount,'function');assert.equal(typeof api.mountChrome,'function')
 api.mount(root,scope.studioIcon)
 api.mount(root,scope.studioIcon)
 for(const {header,kicker,title,description,original,name} of records){
  assert.equal(title.dataset.svgTitleIcon,name,'the title receives its own semantic SVG icon')
  assert.equal(title.childNodes.length,2,'repeat mount never duplicates an icon or title wrapper')
  assert.equal(title.children[1].childNodes[0],original,'the original title node is moved, not rewritten')
  assert.match(title.children[0].innerHTML,new RegExp('data-icon="'+name+'"'))
  assert.equal(title.children[0].attrs['aria-hidden'],'true')
  assert.ok(title.classList.contains('svg-section-title'))
  assert.ok(header.classList.contains('svg-section-heading'))
  assert.ok(kicker.classList.contains('svg-section-kicker'))
  assert.ok(description.classList.contains('svg-section-description'))
  assert.equal(description.textContent,'설명과 실제 내용을 그대로 보존합니다')
 }
 assert.equal(alreadyIcon.children.length,1,'a title with an existing actual SVG is never doubled')
 assert.equal(alreadyIcon.children[0],nativeSvg)
 assert.equal(information.children[0],definitionList,'native definition-list structure remains intact')
 assert.equal(definitionList.children.length,metadata.length,'metadata rows are neither duplicated nor removed')
 for(const {row,label,definition,originalLabel,originalValue,labelText,name,value} of metadata){
  assert.equal(row.children.length,2,'metadata remains one native label and one native definition')
  assert.equal(row.children[0],label);assert.equal(row.children[1],definition)
  assert.equal(label.tagName,'DT');assert.equal(definition.tagName,'DD')
  assert.equal(label.children.length,2,'repeat mount adds only one SVG icon and one text wrapper')
  assert.ok(label.classList.contains('svg-info-label'))
  assert.match(label.children[0].innerHTML,new RegExp('data-icon="'+name+'"'))
  assert.equal(label.children[0].attrs['aria-hidden'],'true')
  assert.equal(label.children[1].className,'svg-info-text')
  assert.equal(label.children[1].childNodes[0],originalLabel,'the original metadata label node is preserved')
  assert.equal(label.textContent,labelText)
  assert.equal(definition.childNodes.length,1);assert.equal(definition.childNodes[0],originalValue,'the original metadata definition node is preserved')
  assert.equal(definition.textContent,value,'metadata values, prices, conditions and descriptions never change')
 }
 const interfaceCss=read('css/svg-interface.css')
 assert.match(interfaceCss,/grid-template-columns:32px minmax\(0,1fr\)!important/)
 assert.match(interfaceCss,/\.svg-section-description\{[\s\S]*?margin-left:var\(--svg-title-indent,46px\)!important/)
 assert.match(interfaceCss,/\.svg-info-icon(?:>|,)[\s\S]*?width:18px!important;height:18px!important/,'metadata uses small SVGs without consuming the definition column')
 assert.match(interfaceCss,/\.mas-information dl>div dd :is\(small,span\)\{\s*min-width:0!important;max-width:100%!important;white-space:normal!important;\s*word-break:keep-all!important;overflow-wrap:anywhere!important/,'metadata definitions wrap instead of clipping on narrow screens')
 assert.match(index,/js\/svg-interface.js\?v=20261010-detail-polish-11/)
 assert.match(index,/css\/svg-interface.css\?v=20261007-svg-interface-1/)
 assert.ok(index.indexOf('js/svg-interface.js')<index.indexOf('js/app.js'))
}

console.log('Semantic/idempotent SVG headings, persistent SVG playback, accessible controls and preserved media/business/audio cores passed')
