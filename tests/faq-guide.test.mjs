import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
const source=readFileSync(new URL('../js/app.js',import.meta.url),'utf8')
const groups=runInNewContext(source.slice(source.indexOf('const INFO_FAQ_GROUPS='),source.indexOf('const SERVICE_ORDER'))+';INFO_FAQ_GROUPS')
assert.equal(groups.length,5)
assert.equal(groups.flatMap(group=>group.items).length,15)
for(const term of ['곡을 아직 정하지','결혼식 며칠 전에','예식장에는 어떤 파일','AR 축가는 본식 현장에서','녹음은 현장에서'])assert.ok(groups.some(group=>group.items.some(([q])=>q.includes(term))),term)
for(const group of groups){assert.ok(group.description);for(const [question,answer] of group.items){assert.ok(question.endsWith('?'));assert.ok(answer.length>30)}}
assert.doesNotMatch(JSON.stringify(groups),/촬영|다른 곡도 녹음|추가 1절/)
const menu=source.slice(source.indexOf('function navigationMenu()'),source.indexOf('function navigationMenu()')+1600)
assert.doesNotMatch(menu,/위스티아는 어떤 곳인가요|\/info\/about/)
assert.match(source,/faq-category-nav a/)
assert.match(source,/key: "reaction"[^\n]+discount: 20000/)
console.log('Five FAQ topics, 15 warm answers, five requested additions, removed menu entry and reaction 20k passed')
