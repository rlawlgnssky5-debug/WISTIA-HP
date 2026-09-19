// Local design draft for the first screen of the wedding detail page
// This never changes the public page or submits data to a server
(() => {
  const STORAGE_KEY = "wistia:wedding-hero-draft:v1"
  const defaults = [
    {id:"title",kind:"title",text:"듀엣 식전 영상",x:3,y:18,w:43,h:16},
    {id:"intro",kind:"intro",text:"직접 부른 노래와 두 분의 이야기를 원하는 영상 구성에 맞춰 한 편의 웨딩 필름으로 완성합니다",x:3,y:39,w:43,h:27},
    {id:"timing",kind:"fact",text:"사용 시점\n예식 시작 전",x:3,y:75,w:17,h:12},
    {id:"people",kind:"fact",text:"참여 인원\n신랑신부 두 사람",x:23,y:75,w:19,h:12},
    {id:"video",kind:"video",text:"",src:"assets/img/wedding/03-lipsync-mv.webp",x:53,y:11,w:44,h:53},
    {id:"result",kind:"result",text:"이야기가 있는 영상 + 완성 음원",x:54,y:69,w:42,h:10},
    {id:"result-copy",kind:"copy",text:"직접 부른 노래와 촬영 장면을 하나의 영상으로 완성합니다",x:54,y:81,w:42,h:11}
  ]
  const copyDefaults = () => defaults.map(item => ({...item}))
  let blocks = copyDefaults()
  let selected = null
  let preview = false

  function loadDraft() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
      if (Array.isArray(saved) && saved.every(item => item && typeof item.id === "string")) return saved
    } catch {}
    return copyDefaults()
  }
  function saveDraft() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks))
    const status = document.querySelector("#heroEditorStatus")
    if (status) status.textContent = "이 브라우저에 자동 저장됨"
  }
  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)) }
  function applyGeometry(node, item) {
    node.style.left = item.x + "%"
    node.style.top = item.y + "%"
    node.style.width = item.w + "%"
    node.style.height = item.h + "%"
  }
  function clearEditor() {
    document.querySelector("#weddingHeroEditor")?.remove()
    document.querySelector("#heroEditorLaunch")?.remove()
    document.body.classList.remove("is-hero-editing")
  }
  function editorLink() {
    const url = new URL(location.href)
    url.searchParams.set("edit", "1")
    return url.href
  }
  function normalLink() {
    const url = new URL(location.href)
    url.searchParams.delete("edit")
    return url.href
  }
  function refreshHiddenList() {
    const list = document.querySelector("#heroEditorHidden")
    if (!list) return
    list.replaceChildren()
    blocks.filter(item => item.hidden).forEach(item => {
      const button = document.createElement("button")
      button.type = "button"
      button.textContent = (item.text.split("\n")[0] || "영상 사진") + " 복원"
      button.addEventListener("click", () => {
        item.hidden = false
        saveDraft()
        renderBlocks()
      })
      list.append(button)
    })
    if (!list.childElementCount) list.textContent = "숨긴 요소 없음"
  }
  function selectBlock(id) {
    selected = id
    document.querySelectorAll(".hero-edit-block").forEach(node => node.classList.toggle("is-selected", node.dataset.blockId === id))
  }
  function renderBlocks() {
    const canvas = document.querySelector("#heroEditorCanvas")
    if (!canvas) return
    canvas.replaceChildren()
    blocks.filter(item => !item.hidden).forEach(item => {
      const node = document.createElement("div")
      node.className = "hero-edit-block hero-edit-" + item.kind
      node.dataset.blockId = item.id
      applyGeometry(node, item)
      const content = document.createElement("div")
      content.className = "hero-edit-content"
      if (item.kind === "video") {
        const image = document.createElement("img")
        image.src = item.src
        image.alt = "듀엣 식전 영상 미리보기"
        image.draggable = false
        content.append(image)
        const play = document.createElement("span")
        play.className = "hero-edit-play"
        play.textContent = "▶"
        content.append(play)
      } else {
        content.textContent = item.text
        content.addEventListener("blur", () => {
          item.text = content.innerText.trim()
          content.contentEditable = "false"
          saveDraft()
        })
      }
      const controls = document.createElement("div")
      controls.className = "hero-edit-controls"
      controls.innerHTML = '<button type="button" class="hero-edit-move" data-editor-action="move" aria-label="요소 이동">⠿ 이동</button>' +
        (item.kind === "video" ? "" : '<button type="button" data-editor-action="text">글자 수정</button>') +
        '<button type="button" data-editor-action="delete">삭제</button>'
      const resize = document.createElement("button")
      resize.type = "button"
      resize.className = "hero-edit-resize"
      resize.dataset.editorAction = "resize"
      resize.setAttribute("aria-label", "요소 크기 조정")
      resize.textContent = "↘"
      node.append(content, controls, resize)
      node.addEventListener("click", event => {
        selectBlock(item.id)
        if (event.target.closest('[data-editor-action="delete"]')) {
          item.hidden = true
          selected = null
          saveDraft()
          renderBlocks()
        } else if (event.target.closest('[data-editor-action="text"]')) {
          content.contentEditable = "true"
          content.focus()
        }
      })
      canvas.append(node)
    })
    selectBlock(selected)
    refreshHiddenList()
  }
  function startPointerEditing(canvas) {
    canvas.addEventListener("pointerdown", event => {
      const handle = event.target.closest('[data-editor-action="move"],[data-editor-action="resize"]')
      if (!handle) return
      const node = handle.closest(".hero-edit-block")
      const item = blocks.find(block => block.id === node?.dataset.blockId)
      if (!item) return
      event.preventDefault()
      selectBlock(item.id)
      const start = {clientX:event.clientX,clientY:event.clientY,x:item.x,y:item.y,w:item.w,h:item.h}
      const bounds = canvas.getBoundingClientRect()
      const moving = handle.dataset.editorAction === "move"
      function onMove(move) {
        const dx = (move.clientX - start.clientX) / bounds.width * 100
        const dy = (move.clientY - start.clientY) / bounds.height * 100
        if (moving) {
          item.x = clamp(start.x + dx, 0, 100 - item.w)
          item.y = clamp(start.y + dy, 0, 100 - item.h)
        } else {
          item.w = clamp(start.w + dx, 5, 100 - item.x)
          item.h = clamp(start.h + dy, 5, 100 - item.y)
        }
        applyGeometry(node, item)
      }
      function onEnd() {
        window.removeEventListener("pointermove", onMove)
        window.removeEventListener("pointerup", onEnd)
        saveDraft()
      }
      window.addEventListener("pointermove", onMove)
      window.addEventListener("pointerup", onEnd, {once:true})
    })
  }
  function downloadDraft() {
    const file = new Blob([JSON.stringify({page:"detail/wedding",section:"hero",blocks}, null, 2)], {type:"application/json"})
    const url = URL.createObjectURL(file)
    const link = document.createElement("a")
    link.href = url
    link.download = "wistia-wedding-hero-draft.json"
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  function showEditor(hero) {
    blocks = loadDraft()
    selected = null
    preview = false
    document.body.classList.add("is-hero-editing")
    hero.hidden = true
    const editor = document.createElement("section")
    editor.id = "weddingHeroEditor"
    editor.className = "hero-editor"
    editor.innerHTML = '<div class="hero-editor-bar"><div><strong>듀엣 식전 영상 · 상단 편집</strong><span id="heroEditorStatus">이 브라우저에 자동 저장됨</span></div><div class="hero-editor-actions"><button type="button" data-editor-toolbar="add">텍스트 추가</button><button type="button" data-editor-toolbar="preview">미리보기</button><button type="button" data-editor-toolbar="export">초안 파일 저장</button><a href="'+normalLink()+'">편집 끝내기</a></div></div><p class="hero-editor-help">요소를 누른 뒤 ‘이동’을 끌어 위치를 바꾸고, 오른쪽 아래 ↘를 끌어 크기를 조정하세요 · 공개 홈페이지는 바뀌지 않습니다</p><div class="hero-editor-scroll"><div class="hero-editor-canvas" id="heroEditorCanvas"></div></div><div class="hero-editor-bottom"><span>숨긴 요소</span><div id="heroEditorHidden"></div></div>'
    hero.replaceWith(editor)
    const canvas = editor.querySelector("#heroEditorCanvas")
    startPointerEditing(canvas)
    renderBlocks()
    editor.addEventListener("click", event => {
      const action = event.target.closest("[data-editor-toolbar]")?.dataset.editorToolbar
      if (action === "add") {
        const item = {id:"text-"+Date.now(),kind:"copy",text:"새 텍스트",x:8,y:8,w:30,h:10}
        blocks.push(item)
        selected = item.id
        saveDraft()
        renderBlocks()
      }
      if (action === "preview") {
        preview = !preview
        editor.classList.toggle("is-preview", preview)
        event.target.textContent = preview ? "편집 계속" : "미리보기"
      }
      if (action === "export") downloadDraft()
    })
  }
  window.initHeroEditor = key => {
    clearEditor()
    if (key !== "wedding" || !["127.0.0.1", "localhost"].includes(location.hostname)) return
    const hero = document.querySelector(".detail-hero")
    if (!hero) return
    if (new URLSearchParams(location.search).get("edit") === "1") showEditor(hero)
    else {
      const link = document.createElement("a")
      link.id = "heroEditorLaunch"
      link.className = "hero-editor-launch"
      link.href = editorLink()
      link.textContent = "이 페이지 상단 직접 편집하기 ↗"
      hero.before(link)
    }
  }
})()
