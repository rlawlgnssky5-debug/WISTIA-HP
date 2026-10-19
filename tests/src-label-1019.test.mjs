import assert from 'node:assert/strict'
import {readFileSync, readdirSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import path from 'node:path'

const root = fileURLToPath(new URL('../', import.meta.url))
function htmlFiles(dir) {
 return readdirSync(dir, {withFileTypes:true}).flatMap(entry => {
  if (entry.name === '.git') return []
  const file = path.join(dir, entry.name)
  return entry.isDirectory() ? htmlFiles(file) : file.toLowerCase().endsWith('.html') ? [file] : []
 })
}
const expected = 'js/booking-wizard.js?v=20261019-svc'
const files = htmlFiles(root)
let scripts = 0
assert.ok(files.length > 0, 'No HTML files found')
for (const file of files) {
 const html = readFileSync(file, 'utf8')
 const label = path.relative(root, file)
 assert.ok(!html.includes('$' + '{1}'), label + ': literal replacement backreference found')
 for (const [tag] of html.matchAll(/<script\b[^>]*>/gi)) {
  const src = tag.match(/\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i)
  const value = src && (src[1] ?? src[2] ?? src[3])
  if (!value || !value.includes('booking-wizard.js')) continue
  assert.equal(value, expected, label + ': unexpected booking wizard script source')
  scripts++
 }
}
assert.ok(scripts > 0, 'No booking wizard script tags found')
console.log('PASS: ' + files.length + ' HTML files scanned, ' + scripts + ' booking wizard scripts use ' + expected + ', no literal backreferences')
