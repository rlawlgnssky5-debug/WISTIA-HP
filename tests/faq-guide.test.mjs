import assert from 'node:assert/strict'
import {readFileSync,readdirSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
const source=readFileSync(new URL('../js/app.js',import.meta.url),'utf8')
const groups=runInNewContext(source.slice(source.indexOf('const INFO_FAQ_GROUPS='),source.indexOf('const SERVICE_ORDER'))+';INFO_FAQ_GROUPS')
assert.equal(groups.length,5)
assert.equal(groups.flatMap(group=>group.items).length,14)
const expectedQuestions=[
 ['스튜디오는 어디에 있나요?','곡을 아직 정하지 못했는데 상담받아도 될까요?','결혼식 며칠 전에 녹음하면 좋을까요?','곡의 키는 어떻게 정하면 될까요?'],
 ['녹음이 처음이고 노래에 자신이 없어도 괜찮을까요?','녹음은 현장에서 어떻게 진행되나요?','당일 녹음이 길어지면 추가금이 생기나요?'],
 ['AR 축가는 본식 현장에서 어떻게 하면 되나요?','AR에 들어가는 제 목소리 비율은 어떻게 정하나요?','AR을 사용하면 어색하거나 티가 나지 않을까요?'],
 ['완성된 음원은 언제 받을 수 있나요?','완성본을 듣고 수정하고 싶은 부분이 있으면 어떡하나요?','예식장에는 어떤 파일을 전달하면 되나요?'],
 ['차를 가져가도 괜찮을까요?']
]
assert.deepEqual(JSON.parse(JSON.stringify(groups.map(group=>group.items.map(([q])=>q)))),expectedQuestions)
assert.equal(groups[0].items[2][1],'결혼식 <strong>한 달 전까지</strong> 녹음하시는 걸 추천드려요.<br>음원은 <strong>최대 7일 이내</strong>에 받아 보시고, 남은 기간에 수정과 리허설까지 여유 있게 하실 수 있어요.')
assert.doesNotMatch(JSON.stringify(groups),/2주|녹음 전에 무엇을 준비하면 좋을까요/)
const home=runInNewContext(source.slice(source.indexOf('const INFO_FAQ_GROUPS='),source.indexOf('const SERVICE_ORDER'))+';'+source.match(/const GENERAL_FAQ = [^\n]+/)[0]+';GENERAL_FAQ')
assert.deepEqual(Array.from(home,([q])=>q),[expectedQuestions[1][0],expectedQuestions[2][0],expectedQuestions[0][1],expectedQuestions[0][2]])
const legacy=readFileSync(new URL('../js/app-1.js',import.meta.url),'utf8')
assert.doesNotMatch(legacy,/2주|녹음 전에 무엇을 준비하면 좋을까요/)
const root=new URL('../',import.meta.url)
const htmlFiles=readdirSync(root,{recursive:true}).filter(path=>path.endsWith('.html')&&!/^(?:node_modules|\.git|tmp)[\\/]/.test(path))
for(const path of htmlFiles){
 const html=readFileSync(new URL(path.replaceAll('\\','/'),root),'utf8')
 for(const match of html.matchAll(/<script\b[^>]*src=["']([^"']*\bjs\/app\.js(?:\?[^"']*)?)["']/g))assert.ok(match[1].endsWith('?v=20261017-faq3'),path)
 for(const match of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)){
  const data=JSON.parse(match[1]),nodes=Array.isArray(data)?data:(data['@graph']||[data])
  for(const node of nodes.filter(node=>node['@type']==='FAQPage')){
   assert.equal(node.mainEntity[0].name,expectedQuestions[0][0],path)
   assert.doesNotMatch(JSON.stringify(node),/2주|녹음 전에 무엇을 준비하면 좋을까요/)
  }
 }
}
for(const term of ['곡을 아직 정하지','결혼식 며칠 전에','예식장에는 어떤 파일','AR 축가는 본식 현장에서','녹음은 현장에서'])assert.ok(groups.some(group=>group.items.some(([q])=>q.includes(term))),term)
for(const group of groups){assert.ok(group.description);for(const [question,answer] of group.items){assert.ok(question.endsWith('?'));assert.ok(answer.length>30)}}
assert.doesNotMatch(JSON.stringify(groups),/촬영|다른 곡도 녹음|추가 1절/)
const menu=source.slice(source.indexOf('function navigationMenu()'),source.indexOf('function navigationMenu()')+1600)
assert.doesNotMatch(menu,/위스티아는 어떤 곳인가요|\/info\/about/)
assert.match(source,/faq-category-nav a/)
assert.match(source,/key: "reaction"[^\n]+discount: 20000/)
console.log('Five FAQ topics, 14 ordered answers, one-month guidance, preserved home questions, JSON-LD order and FAQ cache passed')
