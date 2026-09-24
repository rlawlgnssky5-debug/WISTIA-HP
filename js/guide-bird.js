/* A single decorative bird follows the cursor without blocking page controls. */
(() => {
  const SIZE = 64
  const OFFSET = 18
  let layer
  let bird
  let pointer = null
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

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)) }

  function position() {
    if (!layer || !pointer || document.hidden) {
      if (layer) layer.hidden = true
      return
    }
    const bounds = document.querySelector('#app')?.getBoundingClientRect()
    if (!bounds) { layer.hidden = true; return }
    const x = clamp(pointer.x + OFFSET, bounds.left + 8, Math.max(bounds.left + 8, bounds.right - SIZE - 8))
    const y = clamp(pointer.y + OFFSET, 8, Math.max(8, innerHeight - SIZE - 8))
    bird.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`
    layer.hidden = false
  }

  function onPointer(event) {
    if (event.pointerType && event.pointerType !== 'mouse') {
      pointer = null
      layer.hidden = true
      return
    }
    pointer = {x: event.clientX, y: event.clientY}
    position()
  }

  function mount() {
    ensureLayer()
    routeAbort?.abort()
    routeAbort = new AbortController()
    const {signal} = routeAbort
    document.addEventListener('pointermove', onPointer, {passive: true, signal})
    addEventListener('resize', position, {passive: true, signal})
    document.addEventListener('visibilitychange', position, {signal})
    position()
  }

  function destroy() {
    routeAbort?.abort()
    routeAbort = null
    if (layer) layer.hidden = true
  }

  window.WistiaGuide = {mount, destroy, notify: position}
})()
