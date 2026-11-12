const calendarDesigns = new Map([
  ['editorial', '1. 로즈 에디토리얼'],
  ['glass', '2. 펄 글래스'],
  ['grid', '3. 플랫 그리드'],
  ['pill', '4. 라운드 칩'],
  ['diary', '5. 웨딩 다이어리'],
])

const url = new URL(location.href)
const requestedDesign = url.searchParams.get('calendarDesign')
document.documentElement.dataset.calendarDesign = calendarDesigns.has(requestedDesign)
  ? requestedDesign
  : 'editorial'

document.addEventListener('submit', (event) => {
  if (event.target.id !== 'contactInquiryForm') return
  event.preventDefault()
  event.stopImmediatePropagation()
}, true)

const observer = new MutationObserver(attachCalendarDesignPicker)
observer.observe(document.body, {childList: true, subtree: true})
attachCalendarDesignPicker()

function attachCalendarDesignPicker() {
  const form = document.getElementById('contactInquiryForm')
  const schedule = form?.querySelector('[data-wf-date-view]')
  if (!schedule || form.querySelector('.calendar-design-picker')) return

  const picker = document.createElement('div')
  picker.className = 'calendar-design-picker'
  const label = document.createElement('label')
  label.htmlFor = 'calendar-design-select'
  label.textContent = '달력 디자인 시안'
  const select = document.createElement('select')
  select.id = label.htmlFor
  for (const [value, name] of calendarDesigns) {
    select.add(new Option(name, value, false, value === document.documentElement.dataset.calendarDesign))
  }
  select.addEventListener('change', () => {
    document.documentElement.dataset.calendarDesign = select.value
    const currentUrl = new URL(location.href)
    currentUrl.searchParams.set('calendarDesign', select.value)
    history.replaceState(history.state, '', currentUrl)
  })
  picker.append(label, select)
  schedule.before(picker)

  requestAnimationFrame(() => {
    if (form.dataset.wfCurrentStep === '0') form.querySelector('[data-wf-next]').click()
  })
}
