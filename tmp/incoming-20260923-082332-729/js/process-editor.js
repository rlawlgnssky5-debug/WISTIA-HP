// Local-only draft editor for the wedding film process section
(() => {
  const KEY = "wistia:wedding-process-draft:v1"
  let section, toolbar, selected, draft
  const editable = []
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n))
  const save = () => localStorage.setItem(KEY, JSON.stringify(draft))
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} } }
  function cleanup() {
    document.querySelector("#processEditorBar")?.remove()
    document.querySelector("#processEditorTools")?.remove()
    document.body.classList.remove("is-process-editing")
    section = toolbar = selected = null
    editable.length = 0
  }
  function register(id, node, label, opts = {}) {
    if (!node) return
    node.dataset.processEditId = id
    node.classList.add("process-edit-target")
    editable.push({id, node, label, ...opts})
    const state = draft[id]
    if (state?.text !== undefined && !opts.image) node.textContent = state.text
    if (state?.hidden) node.classList.add("process-edit-hidden")
    if (state?.x || state?.y) node.style.transform = `translate(${state.x || 0}px, ${state.y || 0}px)`
    if (state?.w) node.style.width = state.w + "px"
    if (state?.h) node.style.minHeight = state.h + "px"
  }
  function renderRestore() {
    const slot = document.querySelector("#processEditorRestore")
    if (!slot) return
    slot.replaceChildren()
    editable.filter(item => draft[item.id]?.hidden).forEach(item => {
      const button = document.createElement("button")
      button.type = "button"
      button.textContent = item.label + " 복원"
      button.onclick = () => {
        draft[item.id].hidden = false
        item.node.classList.remove("process-edit-hidden")
        save()
        renderRestore()
      }
      slot.append(button)
    })
    if (!slot.childElementCount) slot.textContent = "숨긴 요소 없음"
  }
  function select(item) {
    selected?.node.classList.remove("is-process-selected")
    selected = item
    if (!item) { toolbar.hidden = true; return }
    item.node.classList.add("is-process-selected")
    toolbar.hidden = false
    toolbar.querySelector("[data-process-action=text]").hidden = !!item.image
    toolbar.querySelector(".process-editor-selected").textContent = item.label
    positionToolbar()
  }
  function positionToolbar() {
    if (!selected || !toolbar) return
    const rect = selected.node.getBoundingClientRect()
    toolbar.style.left = clamp(rect.left + window.scrollX, 8, document.documentElement.scrollWidth - 290) + "px"
    toolbar.style.top = Math.max(0, rect.top + window.scrollY - 45) + "px"
  }
  function beginPointer(event, mode) {
    if (!selected) return
    event.preventDefault()
    const item = selected
    const node = item.node
    const state = draft[item.id] ||= {}
    const start = {x:event.clientX,y:event.clientY,dx:state.x || 0,dy:state.y || 0,w:node.getBoundingClientRect().width,h:node.getBoundingClientRect().height}
    function move(e) {
      if (mode === "move") {
        state.x = Math.round(start.dx + e.clientX - start.x)
        state.y = Math.round(start.dy + e.clientY - start.y)
        node.style.transform = `translate(${state.x}px, ${state.y}px)`
      } else {
        state.w = Math.round(clamp(start.w + e.clientX - start.x, 70, section.clientWidth))
        state.h = Math.round(clamp(start.h + e.clientY - start.y, 30, 1400))
        node.style.width = state.w + "px"
        node.style.minHeight = state.h + "px"
      }
      positionToolbar()
    }
    function end() { window.removeEventListener("pointermove", move); save() }
    window.addEventListener("pointermove", move)
    window.addEventListener("pointerup", end, {once:true})
  }
  function setup() {
    section = document.querySelector("#process")
    if (!section) return
    draft = load()
    document.body.classList.add("is-process-editing")
    register("section", section, "진행 과정 전체", {section:true})
    register("title", section.querySelector(".section-heading h2"), "진행 과정 제목")
    register("description", section.querySelector(".section-heading p"), "진행 과정 설명")
    register("live-button", section.querySelector('[data-process-format="live"] strong'), "뮤비 클립 버튼")
    register("making-button", section.querySelector('[data-process-format="making"] strong'), "녹음 메이킹 버튼")
    register("note", section.querySelector(".process-type-note"), "하단 안내 문구")
    for (const type of ["live", "making"]) {
      const panel = section.querySelector(`[data-process-panel="${type}"]`)
      panel?.querySelectorAll(".process-list li, .process-accordion details").forEach((step, i) => {
        register(`${type}-${i}-title`, step.querySelector("h3"), `${type === "live" ? "뮤비 클립" : "녹음 메이킹"} ${i + 1}단계 제목`)
        register(`${type}-${i}-copy`, step.querySelector("p"), `${type === "live" ? "뮤비 클립" : "녹음 메이킹"} ${i + 1}단계 설명`)
        register(`${type}-${i}-image`, step.querySelector(".process-image"), `${type === "live" ? "뮤비 클립" : "녹음 메이킹"} ${i + 1}단계 사진`, {image:true})
      })
    }
    const bar = document.createElement("div")
    bar.id = "processEditorBar"
    bar.innerHTML = '<strong>진행 과정 · 직접 편집</strong><span>글자를 선택해 수정하고, 필름 버튼을 눌러 단계를 펼치세요</span><button type="button" id="processEditorReset">진행 과정 초기화</button><div id="processEditorRestore"></div>'
    section.before(bar)
    bar.querySelector("#processEditorReset").onclick = () => {
      if (!confirm("진행 과정의 편집 내용을 모두 초기화하시겠습니까?")) return
      localStorage.removeItem(KEY)
      location.reload()
    }
    toolbar = document.createElement("div")
    toolbar.id = "processEditorTools"
    toolbar.hidden = true
    toolbar.innerHTML = '<span class="process-editor-selected"></span><button type="button" data-process-action="move">⠿ 이동</button><button type="button" data-process-action="text">글자 수정</button><button type="button" data-process-action="resize">↘ 크기</button><button type="button" data-process-action="delete">삭제</button>'
    document.body.append(toolbar)
    toolbar.addEventListener("pointerdown", e => {
      const action = e.target.dataset.processAction
      if (action === "move" || action === "resize") beginPointer(e, action)
    })
    toolbar.addEventListener("click", e => {
      const action = e.target.dataset.processAction
      if (!selected) return
      if (action === "text") {
        const item = selected
        item.node.contentEditable = "true"
        item.node.focus()
        const range = document.createRange()
        range.selectNodeContents(item.node)
        window.getSelection()?.removeAllRanges()
        window.getSelection()?.addRange(range)
      }
      if (action === "delete") {
        const item = selected
        draft[item.id] ||= {}
        draft[item.id].hidden = true
        item.node.classList.add("process-edit-hidden")
        save()
        select(null)
        renderRestore()
      }
    })
    section.addEventListener("click", e => {
      if (e.target.closest("#processEditorTools")) return
      const node = e.target.closest(".process-edit-target")
      if (!node || !section.contains(node)) return
      const item = editable.find(entry => entry.node === node)
      if (item) select(item)
    })
    section.addEventListener("focusout", e => {
      const node = e.target.closest(".process-edit-target[contenteditable=true]")
      if (!node) return
      node.contentEditable = "false"
      draft[node.dataset.processEditId] ||= {}
      draft[node.dataset.processEditId].text = node.innerText.trim()
      save()
    })
    section.addEventListener("keydown", e => {
      if (e.key === "Escape" && e.target.isContentEditable) e.target.blur()
    })
    window.addEventListener("scroll", positionToolbar, {passive:true})
    window.addEventListener("resize", positionToolbar)
    renderRestore()
  }
  window.initProcessEditor = key => {
    cleanup()
    if (key === "wedding" && ["localhost", "127.0.0.1"].includes(location.hostname) && new URLSearchParams(location.search).get("edit") === "1") setup()
  }
})()
