import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
const editorial = createRequire(import.meta.url)('../js/detail-editorial.js')

function rotation() {
  let nextId = 0
  const pending = new Map(), frames = []
  const controller = editorial.createReviewRotation(4, frame => frames.push(frame), {
    setTimeout: fn => { pending.set(++nextId, fn); return nextId },
    clearTimeout: id => pending.delete(id)
  })
  const tick = () => { const [id, fn] = pending.entries().next().value; pending.delete(id); fn() }
  return { controller, frames, pending, tick }
}

test('reviews loop smoothly in both directions and keep one timer', () => {
  const {controller:c,frames,pending,tick} = rotation()
  c.resume('offscreen'); assert.equal(pending.size, 1)
  tick(); assert.equal(frames.at(-1).index, 1)
  c.settle(); c.go(3); c.settle(); c.move(1)
  assert.deepEqual(frames.at(-1), {index:0,position:5,animate:true})
  c.settle(); assert.deepEqual(frames.at(-1), {index:0,position:1,animate:false})
  c.move(-1); assert.deepEqual(frames.at(-1), {index:3,position:0,animate:true})
  c.settle(); assert.equal(frames.at(-1).position, 4)
  assert.equal(pending.size, 1)
  c.destroy(); assert.equal(pending.size, 0)
})

test('focus, reduced motion and offscreen pauses cannot restart one another', () => {
  const {controller:c,pending,frames}=rotation()
  assert.equal(pending.size, 0)
  c.resume('offscreen'); c.pause('focus'); c.pause('reduced-motion')
  c.resume('focus'); assert.equal(pending.size, 0)
  c.move(1); assert.equal(frames.at(-1).index, 1)
  c.settle(); assert.equal(pending.size, 0)
  c.resume('reduced-motion'); assert.equal(pending.size, 1)
  c.destroy(); c.resume('offscreen'); assert.equal(pending.size, 0)
})

test('rapid navigation waits for the loop clone to settle before the next step', () => {
  const {controller:c,frames}=rotation()
  c.go(3); c.settle(); c.move(1); c.move(1)
  assert.deepEqual(frames.at(-1), {index:0,position:5,animate:true})
  c.settle()
  assert.deepEqual(frames.slice(-2), [
    {index:0,position:1,animate:false}, {index:1,position:2,animate:true}
  ])
  c.settle(); c.go(0); c.settle(); c.move(-1); c.move(-1)
  assert.equal(frames.at(-1).position, 0)
  c.settle()
  assert.deepEqual(frames.slice(-2), [
    {index:3,position:4,animate:false}, {index:2,position:3,animate:true}
  ])
  c.destroy()
})
