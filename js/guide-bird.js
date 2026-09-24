/* One decorative bird follows a mouse within the WISTIA page canvas. */
(() => {
  const SIZE = 64
  const GAP = 18
  const CONTROL_SELECTOR = 'button,a,input,textarea,select,summary,video,iframe,canvas,[role="button"]'
  let layer
  let bird
  let pointer = null
  let frame = 0
  let routeAbort

  function ensureLayer() {
    if (layer) return
    layer = document.createElement('div')
    layer.id = 'guideLayer'
    layer.className = 'guide-layer'
    layer.setAttribute('aria-hidden', 'true')
    layer.hidden = true
    bird = document.createElement('div')
    bird.className = 'guide-bird'
    bird.innerHTML = '<img class="guide-bird-art" src="assets/guide/bird/bird-cream-front.png" alt="" width="512" height="512" decoding="async">'
    layer.append(bird)
    document.body.append(layer)
  }

  function overlaps(a, b, padding = 3) {
    return a.left < b.right + padding && a.right > b.left - padding && a.top < b.bottom + padding && a.bottom > b.top - padding
  }

  function obstacles(canvas) {
    const boxes = []
    const inView = box => box.width > 0 && box.height > 0 && box.bottom > 0 && box.top < innerHeight
    canvas.querySelectorAll(CONTROL_SELECTOR).forEach(element => {
      if (element.closest('#guideLayer') || getComputedStyle(element).visibility === 'hidden') return
      const box = element.getBoundingClientRect()
      if (inView(box)) boxes.push(box)
    })
    const walker = document.createTreeWalker(canvas, NodeFilter.SHOW_TEXT)
    while (walker.nextNode()) {
      const node = walker.currentNode
      if (!node.textContent.trim() || node.parentElement.closest('script,style,[hidden]')) continue
      const range = document.createRange()
      range.selectNodeContents(node)
      for (const box of range.getClientRects()) if (inView(box)) boxes.push(box)
    }
    return boxes
  }

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)) }

  function position() {
    frame = 0
    if (!layer || !pointer || document.hidden || document.body.classList.contains('menu-open') || document.querySelector('dialog[open]')) {
      if (layer) layer.hidden = true
      return
    }
    const canvas = document.querySelector('#app')
    const bounds = canvas?.getBoundingClientRect()
    if (!bounds || pointer.x < bounds.left || pointer.x > bounds.right || pointer.y < 0 || pointer.y > innerHeight) {
      layer.hidden = true
      return
    }
    const side = Math.min(SIZE, bounds.width - 16)
    const minX = bounds.left + 8
    const maxX = bounds.right - side - 8
    const minY = 8
    const maxY = Math.max(8, innerHeight - side - 8)
    const offsets = [
      [GAP, GAP], [-side - GAP, GAP], [GAP, -side - GAP], [-side - GAP, -side - GAP],
      [GAP, -side / 2], [-side - GAP, -side / 2], [-side / 2, GAP], [-side / 2, -side - GAP],
      [side + GAP, GAP], [-side * 2 - GAP, GAP], [GAP, side + GAP], [GAP, -side * 2 - GAP]
    ]
    const blocked = obstacles(canvas)
    const candidate = offsets.map(([dx, dy]) => {
      const x = clamp(pointer.x + dx, minX, maxX)
      const y = clamp(pointer.y + dy, minY, maxY)
      const box = {left: x, top: y, right: x + side, bottom: y + side}
      const covered = blocked.reduce((count, obstacle) => count + Number(overlaps(box, obstacle)), 0)
      return {x, y, covered, distance: Math.hypot(x - pointer.x, y - pointer.y)}
    }).sort((a, b) => a.covered - b.covered || a.distance - b.distance)[0]
    if (!candidate || candidate.covered) { layer.hidden = true; return }
    bird.style.left = `${Math.round(candidate.x)}px`
    bird.style.top = `${Math.round(candidate.y)}px`
    bird.style.width = `${side}px`
    bird.style.height = `${side}px`
    layer.hidden = false
  }

  function schedule() { if (!frame) frame = requestAnimationFrame(position) }

  function onPointer(event) {
    if (event.pointerType && event.pointerType !== 'mouse') {
      pointer = null
      cancelAnimationFrame(frame)
      frame = 0
      layer.hidden = true
      return
    }
    pointer = {x: event.clientX, y: event.clientY}
    if (layer.hidden) position()
    else schedule()
  }

  function mount() {
    ensureLayer()
    routeAbort?.abort()
    routeAbort = new AbortController()
    const {signal} = routeAbort
    document.addEventListener('pointermove', onPointer, {passive: true, signal})
    addEventListener('scroll', schedule, {passive: true, signal})
    addEventListener('resize', schedule, {passive: true, signal})
    document.addEventListener('visibilitychange', schedule, {signal})
    if (pointer) schedule()
  }

  function destroy() {
    routeAbort?.abort()
    routeAbort = null
    cancelAnimationFrame(frame)
    frame = 0
    if (layer) layer.hidden = true
  }

  window.WistiaGuide = {mount, destroy, notify: schedule}
})()
