/* One decorative bird follows a mouse within the WISTIA page canvas. */
(() => {
  const SIZE = 64
  const GAP = 18
  const CONTROL_SELECTOR = 'button,a,input,textarea,select,summary,img,video,iframe,canvas,[role="button"]'
  let layer
  let bird
  let pointer = null
  let frame = 0
  let settleTimer = 0
  let obstacleCache = null
  let routeAbort
  let lastTarget = null

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

  function overlaps(a, b, padding = b.text ? 12 : 3) {
    return a.left < b.right + padding && a.right > b.left - padding && a.top < b.bottom + padding && a.bottom > b.top - padding
  }

  function obstacles(canvas) {
    const now = performance.now()
    if (obstacleCache?.canvas === canvas && now - obstacleCache.time < 80 && obstacleCache.scroll === scrollY && obstacleCache.width === innerWidth) return obstacleCache.boxes
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
      for (const box of range.getClientRects()) if (inView(box)) boxes.push({left: box.left, right: box.right, top: box.top, bottom: box.bottom, text: true})
    }
    obstacleCache = {canvas, time: now, scroll: scrollY, width: innerWidth, boxes}
    return boxes
  }

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)) }

  function position() {
    if (frame) cancelAnimationFrame(frame)
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
    const blocked = obstacles(canvas)
    const previous = layer.hidden ? null : lastTarget
    let candidate = null
    for (const side of [SIZE, 52, 44, 36, 28, 22].filter(size => size <= bounds.width - 16)) {
      const minX = bounds.left + 8
      const maxX = bounds.right - side - 8
      const minY = 8
      const maxY = Math.max(8, innerHeight - side - 8)
      const offsets = [
        [GAP, GAP], [-side - GAP, GAP], [GAP, -side - GAP], [-side - GAP, -side - GAP],
        [side + GAP, GAP], [-side * 2 - GAP, GAP], [GAP, side + GAP], [GAP, -side * 2 - GAP]
      ]
      const points = offsets.map(([dx, dy]) => [pointer.x + dx, pointer.y + dy])
      for (const x of [minX, maxX]) {
        points.push([x, pointer.y - side / 2])
        for (let y = minY; y <= maxY; y += 32) points.push([x, y])
      }
      for (const [rawX, rawY] of points) {
        const x = clamp(rawX, minX, maxX)
        const y = clamp(rawY, minY, maxY)
        const box = {left: x, top: y, right: x + side, bottom: y + side}
        if (blocked.some(obstacle => overlaps(box, obstacle))) continue
        const distance = Math.abs(x - pointer.x) + Math.abs(y - pointer.y) * 1.6
        const continuity = previous ? Math.hypot(x - previous.x, y - previous.y) * .22 : 0
        const score = distance + continuity + (SIZE - side) * 1.2
        if (!candidate || score < candidate.score) candidate = {x, y, side, score}
      }
    }
    if (!candidate) { layer.hidden = true; return }
    bird.style.transform = `translate3d(${candidate.x.toFixed(1)}px,${candidate.y.toFixed(1)}px,0)`
    bird.style.width = `${candidate.side}px`
    bird.style.height = `${candidate.side}px`
    lastTarget = {x: candidate.x, y: candidate.y}
    layer.hidden = false
  }

  function schedule() { if (!frame) frame = requestAnimationFrame(position) }

  function settle() {
    clearTimeout(settleTimer)
    settleTimer = setTimeout(position, 900)
  }

  function onPointer(event) {
    if (event.pointerType && event.pointerType !== 'mouse') {
      pointer = null
      cancelAnimationFrame(frame)
      frame = 0
      clearTimeout(settleTimer)
      layer.hidden = true
      return
    }
    pointer = {x: event.clientX, y: event.clientY}
    position()
    settle()
  }

  function mount() {
    ensureLayer()
    obstacleCache = null
    routeAbort?.abort()
    routeAbort = new AbortController()
    const {signal} = routeAbort
    document.addEventListener('pointermove', onPointer, {passive: true, signal})
    addEventListener('scroll', () => { schedule(); settle() }, {passive: true, signal})
    addEventListener('resize', () => { schedule(); settle() }, {passive: true, signal})
    document.addEventListener('visibilitychange', schedule, {signal})
    if (pointer) schedule()
  }

  function destroy() {
    routeAbort?.abort()
    routeAbort = null
    cancelAnimationFrame(frame)
    frame = 0
    clearTimeout(settleTimer)
    obstacleCache = null
    if (layer) layer.hidden = true
  }

  window.WistiaGuide = {mount, destroy, notify: schedule}
})()
