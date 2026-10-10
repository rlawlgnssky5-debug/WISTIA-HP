import assert from 'node:assert/strict'
import {readFileSync,readdirSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {assertPreservedAppLogic} from './studio-graphics-fixture.mjs'
const read=p=>readFileSync(new URL('../'+p,import.meta.url))
const source=read('js/app.js').toString(),css=read('css/luxury-finish.css').toString()
const manifest=JSON.parse(read('assets/img/studio-3d/manifest.json'))
const expected=['consultation','recording','directing','folder','balance','vocal-editing','mixing','delivery','film-editing','sound-review','bride-entrance','groom-entrance','vinyl','key-shift']
assert.equal(manifest.method,'built-in image_gen')
assert.deepEqual(manifest.assets.map(x=>x.name).sort(),expected.sort())
assert.deepEqual(readdirSync(new URL('../assets/img/studio-3d/',import.meta.url)).filter(x=>x.endsWith('.webp')).sort(),[...manifest.assets.map(art=>art.output.split('/').at(-1)),'gift-benefits-yellow-v1.webp'].sort(),'the fourteen approved studio objects are preserved, with only the separately approved yellow gift added')
let bytes=0
for(const art of manifest.assets){
 const data=read(art.output);bytes+=data.length
 assert.equal(data.subarray(0,4).toString(),'RIFF',art.name)
 assert.equal(data.subarray(8,12).toString(),'WEBP',art.name)
 assert.ok(data.length<100000,art.name+' is a compact web asset')
 assert.match(art.prompt,/No people, no faces, no hands/)
 assert.match(art.prompt,/ABSOLUTELY NO text, letters, numbers, logos/)
 assert.equal(art.transparent,['folder','vinyl'].includes(art.name))
}
assert.ok(bytes<750000)
assert.match(source,/class="mas-key-3d" src="assets\/img\/studio-3d\/key-shift.webp"/)
assert.match(source,/studio-folder-3d/)
assert.match(source,/assets\/img\/studio-3d\/vinyl.webp/)
assert.match(css,/\.studio-folder-3d img/)
assert.match(css,/@media\(prefers-reduced-motion:reduce\)/)
const hash=p=>createHash('sha256').update(read(p)).digest('hex')
assert.match(read('assets/img/studio-graphics/broadcast.svg').toString(),/싱어게인2/);assert.doesNotMatch(read('assets/img/studio-graphics/broadcast.svg').toString(),/불후의 명곡|IMMORTAL SONGS/)
assert.equal(hash('assets/img/song-options/lyric-video-v2.webp'),'ca947d5ef39db38f9e296be8d378f222fad426c55406750693de237616c9414b')
assertPreservedAppLogic(source)
console.log('14 compact object-only 3D assets, protected real media and business logic passed')
