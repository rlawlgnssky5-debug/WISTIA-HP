/* WISTIA songbird guide. The layer never captures page clicks. */
(() => {
  const IMAGE_ROOT = 'assets/guide/bird/'
  const MOTION_ROOT = 'assets/guide/motion/'
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)')
  const TWO_BIRD_KEYS = new Set(['duo', 'duet-film', 'wedding', 'proposal'])
  const SIZE = {small: 56, card: 76, panel: 78, normal: 96, large: 168}
  const MOBILE_SIZE = {small: 40, card: 54, panel: 58, normal: 56, large: 88}
  const SCENE_DEFINITIONS = {
    home: [
      {id: '01', selector: '.finder-home', pose: 'front', motion: 'pop', size: 'normal', side: 'right', highlight: 'h1,h2'},
      {id: '02', selector: '.finder-choice', pose: 'side', size: 'small', side: 'left'},
      {id: '18', selector: 'footer', pose: 'half-smile', size: 'small', side: 'left'}
    ],
    detail: [
      {id: '05', selector: '.ar-hook-hero', pose: 'front', size: 'large', side: 'right', highlight: '.ar-hook-media'},
      {id: '07', selector: '.package-overview', pose: 'front', size: 'small', side: 'right'},
      {id: '08', selector: '.ar-primary-benefit', pose: 'side', size: 'small', side: 'left'},
      {id: '09', selector: '#reviews', pose: 'half-smile', size: 'small', side: 'right'},
      {id: '10', selector: '.ar-expert-story', pose: 'front', size: 'panel', side: 'right', highlight: '.ar-expert-panel.is-active'},
      {id: '11', selector: '#wistiaBeforeAfter', pose: 'singing', motion: 'sing', size: 'large', side: 'left', highlight: '.bap-player'},
      {id: '12', selector: '.wistia-advantages', pose: 'front', size: 'small', side: 'right'},
      {id: '13', selector: '#process', pose: 'front', size: 'normal', side: 'left'},
      {id: '14', selector: '#arRatioExperience', pose: 'sing-record', motion: 'sing-record', size: 'normal', side: 'right', highlight: '.wistia-ar__disc-stage'},
      {id: '15', selector: '.booking-guide,.worry-section', pose: 'front', size: 'small', side: 'left'},
      {id: '18', selector: 'footer', pose: 'half-smile', size: 'small', side: 'left'}
    ],
    event: [
      {id: '16a', selector: '.calculator-intro,.booking-base', pose: 'front', size: 'normal', side: 'right'},
      {id: '16b', selector: '.booking-extra,.event-benefits', pose: 'front', size: 'small', side: 'left'},
      {id: '16c', selector: '.booking-follow-total', pose: 'celebrate', size: 'large', side: 'left'},
      {id: '18', selector: 'footer', pose: 'half-smile', size: 'small', side: 'left'}
    ],
    info: [
      {id: '17', selector: '.wistia-about-story,.wistia-specialist-grid article', pose: 'front', size: 'normal', side: 'right'},
      {id: '18', selector: 'footer', pose: 'half-smile', size: 'small', side: 'left'}
    ],
    faq: [
      {id: '15', selector: '.info-page-faq,.info-page-faq section', pose: 'front', size: 'small', side: 'left'},
      {id: '18', selector: 'footer', pose: 'half-smile', size: 'small', side: 'left'}
    ],
    beforeAfter: [
      {id: '11', selector: '#wistiaBeforeAfter,.before-after-page', pose: 'singing', motion: 'sing', size: 'large', side: 'left', highlight: '.bap-player'},
      {id: '18', selector: 'footer', pose: 'half-smile', size: 'small', side: 'left'}
    ]
  }

  let layer
  let lead
  let harmony
  let routeAbort
  let motionTimer
  let frame = 0
  let currentScene = null
  let activeCard = null
  let scenes = []
  let birdCount = 1
  let currentPose = ''
  let selectedElement = null
  let routeTimers = []
  let stateObservers = []
  let lastX = null
  let scrollDirection = 1
  let lastScroll = 0
  let priceConfirmed = false

  const mobile = () => innerWidth <= 767
  const asset = (color, pose) => `${IMAGE_ROOT}bird-${color}-${pose}.png`
  const clip = (color, name) => `${MOTION_ROOT}bird-${color}-${name}.webp`

  function createBird(color, modifier) {
    const bird = document.createElement('div')
    bird.className = `guide-bird guide-bird--${modifier}`
    bird.dataset.color = color
    bird.innerHTML = `<img class="guide-bird-art" src="${asset(color, 'front')}" alt="" width="512" height="512" decoding="async"><img class="guide-accessory" src="assets/guide/acc/acc-note.svg" alt="" aria-hidden="true">`
    return bird
  }

  function ensureLayer() {
    if (layer) return
    layer = document.createElement('div')
    layer.id = 'guideLayer'
    layer.className = 'guide-layer'
    layer.setAttribute('aria-hidden', 'true')
    lead = createBird('cream', 'lead')
    harmony = createBird('grey', 'harmony')
    harmony.hidden = true
    layer.append(lead, harmony)
    document.body.append(layer)
    ;['cream', 'grey'].forEach(color => ['front', 'side', 'side-right', 'wink', 'half-smile', 'singing'].forEach(pose => {
      const preload = new Image()
      preload.src = asset(color, pose)
    }))
  }

  function clearMotion() {
    clearTimeout(motionTimer)
    motionTimer = null
  }

  function later(callback, delay) {
    const timer = setTimeout(callback, delay)
    routeTimers.push(timer)
    return timer
  }

  function pose(name, force = false) {
    if (!force && currentPose === name) return
    clearMotion()
    currentPose = name
    lead.querySelector('.guide-bird-art').src = asset('cream', name)
    harmony.querySelector('.guide-bird-art').src = asset('grey', name)
  }

  function motion(name, duration = 700, returningPose = currentPose) {
    if (REDUCED.matches || !name || document.hidden || layer?.classList.contains('is-audio-active')) return
    clearMotion()
    lead.querySelector('.guide-bird-art').src = clip('cream', name)
    if (birdCount === 2) harmony.querySelector('.guide-bird-art').src = clip('grey', name)
    if (duration > 0) motionTimer = setTimeout(() => pose(returningPose, true), duration)
  }

  function resumeSceneMotion() {
    if (currentScene?.id === '11') motion('sing', 0, 'singing')
    if (currentScene?.id === '14') motion('sing-record', 0, 'sing-record')
  }

  function clearHighlight() {
    document.querySelectorAll('.guide-emphasis').forEach(el => el.classList.remove('guide-emphasis'))
    document.querySelectorAll('.guide-card-active,.guide-card-muted').forEach(el => el.classList.remove('guide-card-active', 'guide-card-muted'))
  }

  function highlight(scene) {
    clearHighlight()
    if (REDUCED.matches) return
    if (scene.id === '02' || scene.id === '03') {
      document.querySelectorAll('.finder-choice').forEach(card => card.classList.add(card === scene.element ? 'guide-card-active' : 'guide-card-muted'))
      return
    }
    const target = scene.highlight ? (scene.section || scene.element).querySelector(scene.highlight) : ['12','13','16a','16b','16c','17'].includes(scene.id) ? scene.element : null
    target?.classList.add('guide-emphasis')
  }

  function listScenes(kind) {
    return (SCENE_DEFINITIONS[kind] || SCENE_DEFINITIONS.info).flatMap(definition =>
      [...document.querySelectorAll(definition.selector)].map(element => ({...definition, element}))
    ).filter(scene => scene.element.getClientRects().length)
  }

  function nearestScene() {
    if (!scenes.length) return null
    if (document.body.dataset.page === 'home' && scrollY < 80) return scenes.find(scene => scene.id === '01') || scenes[0]
    const focusY = innerHeight * .48
    const eligible = scenes.filter(({element, id}) => {
      if (document.body.dataset.page === 'home' && id === '01') return false
      const rect = element.getBoundingClientRect()
      return rect.bottom > innerHeight * .1 && rect.top < innerHeight * .85
    })
    const candidates = eligible.length ? eligible : scenes
    const crossed = candidates.filter(scene => scene.element.getBoundingClientRect().top <= focusY)
    if (crossed.length) return crossed.reduce((best, scene) =>
      !best || scene.element.getBoundingClientRect().top >= best.element.getBoundingClientRect().top ? scene : best, null)
    return candidates.reduce((best, scene) => {
      const rect = scene.element.getBoundingClientRect()
      const distance = Math.abs(rect.top - focusY)
      return !best || distance < best.distance ? {scene, distance} : best
    }, null)?.scene || null
  }

  function clamp(value, low, high) { return Math.max(low, Math.min(high, value)) }

  function avoidFab(x, y, width, height) {
    const fab = document.querySelector('#floatingKakao')
    if (!fab || getComputedStyle(fab).display === 'none' || getComputedStyle(fab).visibility === 'hidden') return {x, y}
    const box = fab.getBoundingClientRect()
    const overlap = x < box.right + 24 && x + width > box.left - 24 && y < box.bottom + 24 && y + height > box.top - 24
    if (!overlap) return {x, y}
    const left = box.left - width - 24
    return left >= 12 ? {x: left, y} : {x, y: Math.max(12, box.top - height - 24)}
  }

  function avoidFixedControls(x, y, width, height) {
    for (const selector of ['.booking-follow-total', '.booking-mobile-bar', '#soloDesktopCta']) {
      const control = document.querySelector(selector)
      if (!control || getComputedStyle(control).display === 'none') continue
      const box = control.getBoundingClientRect()
      if (x < box.right + 8 && x + width > box.left - 8 && y < box.bottom + 8 && y + height > box.top - 8) {
        y = box.top - height - 12
      }
    }
    return {x, y: clamp(y, 64, Math.max(64, innerHeight - height - 28))}
  }

  function place(scene, point = null) {
    const size = (mobile() ? MOBILE_SIZE : SIZE)[scene.size] || 56
    const width = size * (birdCount === 2 ? 2.12 : 1)
    let x, y
    if (point) {
      x = point.x - size * .48
      y = point.y - size * .55
    } else if (mobile()) {
      const heading = scene.element.querySelector('h1,h2,h3') || scene.element
      const rect = heading.getBoundingClientRect()
      if (scene.id === '16c') {
        x = rect.right - width - 12
        y = rect.top - size - 12
      } else {
        x = scene.side === 'left' ? rect.left + 4 : rect.right - width - 4
        y = rect.top >= size + 76 ? rect.top - size - 8 : rect.bottom + 8
      }
    } else {
      const heading = scene.element.querySelector('h1,h2,h3') || scene.element
      const rect = heading.getBoundingClientRect()
      x = scene.side === 'left' ? rect.left - width - 12 : rect.right + 12
      if (x < 12 || x + width > innerWidth - 12) x = scene.side === 'left' ? rect.right + 12 : rect.left - width - 12
      y = rect.top + Math.min(24, Math.max(0, rect.height * .12))
      if (scene.id === '11') y = innerHeight * .3
    }
    x = clamp(x, 12, Math.max(12, innerWidth - width - 12))
    y = clamp(y, 64, Math.max(64, innerHeight - size - 28))
    const fixedSafe = avoidFixedControls(x, y, width, size)
    const safe = avoidFab(fixedSafe.x, fixedSafe.y, width, size)
    if (scene.pose === 'side' && lastX !== null && Math.abs(safe.x - lastX) > 4 && !mobile()) {
      pose(safe.x > lastX ? 'side' : 'side-right')
    }
    layer.style.setProperty('--guide-x', `${Math.round(safe.x)}px`)
    layer.style.setProperty('--guide-y', `${Math.round(safe.y)}px`)
    layer.style.setProperty('--guide-size', `${size}px`)
    lastX = safe.x
    if (scene.id === '05' && !mobile() && !REDUCED.matches) {
      const rect = scene.element.getBoundingClientRect()
      const progress = clamp((innerHeight * .7 - rect.top) / Math.max(1, innerHeight * .45), 0, 1)
      layer.style.setProperty('--guide-size', `${Math.round(96 + progress * 72)}px`)
    }
  }

  function activate(scene, point = null) {
    if (!scene) return
    const previous = currentScene
    const changed = previous?.id !== scene.id || previous?.element !== scene.element
    currentScene = scene
    layer.dataset.scene = scene.id
    const accessory = scene.id === '11' || scene.id === '14' ? 'note' : scene.id === '16c' ? 'sparkle' : ''
    layer.dataset.accessory = accessory
    if (accessory) layer.querySelectorAll('.guide-accessory').forEach(image => { image.src = `assets/guide/acc/acc-${accessory}.svg` })
    if (scene.id !== '18') layer.classList.remove('is-footer')
    if (changed) {
      let nextPose = scene.pose
      if (nextPose === 'side' && scrollDirection < 0) nextPose = 'side-right'
      pose(nextPose)
      highlight(scene)
      if (scene.id === '01') motion('pop', 650, nextPose)
      else if (scene.id === '03' && previous?.id === '03') motion('step-hop', 650, nextPose)
      else if (scene.id === '08' && scene.element.dataset.arIndex === '4') motion('wink', 650, nextPose)
      else if (scene.id === '11') motion('sing', 0, nextPose)
      else if (scene.id === '14') motion('sing-record', 0, nextPose)
      else if (scene.id === '18') { motion('wink', 650, 'half-smile'); later(() => { if (currentScene?.id === '18') layer?.classList.add('is-footer') }, 650) }
      else if (scene.id === '13') motion('step-hop', 650, nextPose)
    }
    place(scene, point)
  }

  function update() {
    frame = 0
    if (!layer || !routeAbort || document.hidden) return
    if (document.body.classList.contains('menu-open') || document.querySelector('dialog[open]')) {
      layer.classList.add('is-obscured')
      return
    }
    layer.classList.remove('is-obscured')
    if (activeCard?.isConnected) { activate({...currentScene, id: '03', element: activeCard, pose: 'half-smile', size: 'card'}, activeCard._guidePoint); return }
    if (priceConfirmed) {
      const total = document.querySelector('.booking-follow-total')
      if (total?.getClientRects().length) { activate({id: '16c', element: total, pose: 'celebrate', size: 'large', side: 'left'}); return }
    }
    const selectedScene = nearestScene()
    if (!selectedScene) return
    const scene = {...selectedScene, section: selectedScene.element}
    if (scene.id === '17' && scene.element.matches('.wistia-specialist-grid article')) scene.size = 'large'
    if (scene.id === '08') scene.element = scene.element.querySelector('.ar-index-item[aria-pressed="true"]') || scene.element
    if (scene.id === '10') scene.element = scene.element.querySelector('.ar-expert-panel.is-active') || scene.element
    if (scene.id === '12') {
      const items = [...scene.element.querySelectorAll('ol>li')]
      scene.element = items.reduce((best, item) => !best || Math.abs(item.getBoundingClientRect().top - innerHeight * .45) < Math.abs(best.getBoundingClientRect().top - innerHeight * .45) ? item : best, null) || scene.element
    }
    if (scene.id === '13') scene.element = scene.element.querySelector('.wps-accordion details[open]') || scene.element
    if (scene.id === '14') scene.element = scene.element.querySelector('.wistia-ar__ratio-input') || scene.element
    activate(scene)
  }

  function schedule() { if (!frame) frame = requestAnimationFrame(update) }

  function onPointer(event) {
    if (mobile() || REDUCED.matches) return
    const media = event.target.closest?.('.ar-hook-media')
    if (media && (currentScene?.id === '05' || currentScene?.id === '06')) {
      if (currentScene.id !== '06') activate({...currentScene, id: '06', element: media, pose: 'back34', size: 'normal', side: 'left'})
      return
    }
    const feature = event.target.closest?.('.package-feature')
    if (feature && currentScene?.id === '07') {
      place({...currentScene, element: feature, size: 'small'})
      return
    }
    const card = event.target.closest?.('.finder-choice')
    if (!card || !document.body.dataset.page?.includes('home')) {
      if (activeCard) { activeCard = null; schedule() }
      if (currentScene?.id === '06') schedule()
      return
    }
    selectCard(card, event)
  }

  function selectCard(card, event = null) {
    const rect = card.getBoundingClientRect()
    const radius = (mobile() ? MOBILE_SIZE : SIZE).card / 2
    activeCard = card
    activeCard._guidePoint = {
      x: clamp((event?.clientX || rect.left + rect.width / 2) + (mobile() ? 0 : 20), rect.left + radius + 8, Math.max(rect.left + radius + 8, rect.right - radius - 8)),
      y: clamp((event?.clientY || rect.top + rect.height / 2) - (mobile() ? 0 : 26), rect.top + radius + 8, Math.max(rect.top + radius + 8, rect.bottom - radius - 8))
    }
    schedule()
  }

  function onFocus(event) {
    const card = event.target.closest?.('.finder-choice')
    if (card && document.body.dataset.page?.includes('home')) selectCard(card)
  }

  function onBlur(event) {
    if (activeCard && !activeCard.contains(event.relatedTarget)) { activeCard = null; schedule() }
  }

  function onAction(event) {
    const element = event.target.closest?.('button,a,input,summary,label')
    if (!element) return
    if (element.closest('.finder-choice')) {
      const selected = element.closest('.finder-choice')
      selectedElement?.classList.remove('guide-choice-active')
      selected.classList.add('guide-choice-active')
      selectedElement = selected
      motion('point', 650)
    } else if (element.matches('.ar-hook-sound-control,[data-ar-sound-toggle]')) motion('wink', 680)
    else if (element.matches('[data-ar-index]')) schedule()
    else if (element.closest('.solo-person-picker')) { motion('point', 350); later(() => motion('wink', 650), 350) }
    else if (element.closest('#reviews')) { pose(element.matches('[aria-label*="이전"]') ? 'side-right' : 'side'); later(() => pose('half-smile'), 420) }
    else if (element.closest('.ar-expert-story')) { motion('pop', 650) }
    else if (element.closest('#process')) motion('step-hop', 700)
    else if (element.closest('#wistiaBeforeAfter')) { pose('listen'); later(() => { pose('singing'); resumeSceneMotion() }, 480) }
    else if (element.closest('.booking-calculator')) { motion('celebrate', 760) }
    else if (element.closest('.worry-section')) motion('point', 620)
    schedule()
  }

  function onChange(event) {
    if (event.target.closest?.('.booking-calculator')) {
      priceConfirmed = true
      const total = document.querySelector('.booking-follow-total')
      if (total) activate({id: '16c', element: total, pose: 'celebrate', size: 'large', side: 'left'})
      motion('celebrate', 760)
      later(schedule, 1300)
    }
    if (event.target.closest?.('#arRatioExperience')) {
      layer.classList.add('is-audio-active')
      pose(Number(event.target.value) < 50 ? 'side-right' : 'side')
      clearTimeout(motionTimer)
      motionTimer = setTimeout(() => { layer?.classList.remove('is-audio-active'); pose('sing-record'); resumeSceneMotion() }, 600)
    }
  }

  function onPointerDown(event) {
    if (event.target.closest?.('#arRatioExperience')) layer.classList.add('is-dragging')
    const card = event.target.closest?.('.finder-choice')
    if (mobile() && card && document.body.dataset.page?.includes('home')) selectCard(card, event)
  }

  function onPointerUp() { layer.classList.remove('is-dragging') }

  function mount(route = {}) {
    destroy()
    ensureLayer()
    const kind = route.home ? 'home' : route.type === 'before-after' ? 'beforeAfter' : route.event ? 'event' : route.detail || route.type === 'ar' ? 'detail' : route.info && route.key === 'faq' ? 'faq' : 'info'
    birdCount = TWO_BIRD_KEYS.has(route.key) || (route.key === 'solo-film' && route.purpose === 'duo') ? 2 : 1
    harmony.hidden = birdCount === 1
    layer.hidden = false
    layer.classList.toggle('is-reduced', REDUCED.matches)
    layer.classList.remove('is-footer', 'is-obscured')
    currentScene = null
    currentPose = ''
    lastX = null
    selectedElement = null
    activeCard = null
    priceConfirmed = false
    scenes = listScenes(kind)
    lastScroll = scrollY
    routeAbort = new AbortController()
    const {signal} = routeAbort
    addEventListener('scroll', () => { scrollDirection = scrollY >= lastScroll ? 1 : -1; lastScroll = scrollY; schedule() }, {passive: true, signal})
    addEventListener('resize', schedule, {passive: true, signal})
    document.addEventListener('pointermove', onPointer, {passive: true, signal})
    document.addEventListener('pointerdown', onPointerDown, {signal})
    document.addEventListener('pointerup', onPointerUp, {signal})
    document.addEventListener('pointercancel', onPointerUp, {signal})
    document.addEventListener('click', onAction, {signal})
    document.addEventListener('focusin', onFocus, {signal})
    document.addEventListener('focusout', onBlur, {signal})
    document.addEventListener('change', onChange, {signal})
    document.addEventListener('play', () => { layer.classList.add('is-audio-active'); pose(currentPose || 'front', true) }, {capture: true, signal})
    const onAudioStop = () => { layer.classList.remove('is-audio-active'); resumeSceneMotion() }
    document.addEventListener('pause', onAudioStop, {capture: true, signal})
    document.addEventListener('ended', onAudioStop, {capture: true, signal})
    document.addEventListener('visibilitychange', () => { if (document.hidden) pose(currentPose || 'front', true); else { resumeSceneMotion(); schedule() } }, {signal})
    REDUCED.addEventListener?.('change', () => { layer.classList.toggle('is-reduced', REDUCED.matches); pose(currentPose || 'front', true) }, {signal})
    for (const selector of ['[data-expert-split]', '.ar-index-wheel']) {
      const target = document.querySelector(selector)
      if (!target) continue
      const observer = new MutationObserver(schedule)
      observer.observe(target, {attributes: true, subtree: true, attributeFilter: ['class', 'aria-pressed', 'aria-expanded', 'data-active']})
      stateObservers.push(observer)
    }
    pose('front', true)
    schedule()
  }

  function destroy() {
    routeAbort?.abort()
    routeAbort = null
    stateObservers.forEach(observer => observer.disconnect())
    stateObservers = []
    cancelAnimationFrame(frame)
    frame = 0
    clearMotion()
    routeTimers.forEach(clearTimeout)
    routeTimers = []
    clearHighlight()
    selectedElement?.classList.remove('guide-choice-active')
    if (layer) layer.hidden = true
    scenes = []
    activeCard = null
    currentScene = null
  }

  function notify(action) {
    if (action === 'price-confirmed') motion('celebrate', 800)
    if (action === 'sound-on') motion('wink', 680)
    if (action === 'section-changed') update()
  }

  window.WistiaGuide = {mount, destroy, notify}
})()
