// Keep the real phone cascade byte-for-byte; build a desktop cascade evaluated
// at the agreed 390px design width, with a 780px layout canvas
export function mobileCanvasCss(source, file = '') {
  if (/(?:mobile-parity-780|editorial-unified|site-fixes-20261024|wizard-layout-20261024|package-card-fixes-20261024)\.css$/.test(file)) return source
  function boundary(text, start) {
    let quote = '', comment = false, parens = 0
    for (let i = start; i < text.length; i++) {
      const c = text[i], n = text[i + 1]
      if (comment) { if (c === '*' && n === '/') { comment = false; i++ } continue }
      if (quote) { if (c === '\\') i++; else if (c === quote) quote = ''; continue }
      if (c === '/' && n === '*') { comment = true; i++; continue }
      if (c === '"' || c === "'") { quote = c; continue }
      if (c === '(' || c === '[') parens++
      if (c === ')' || c === ']') parens--
      if (!parens && (c === '{' || c === ';' || c === '}')) return i
    }
    return text.length
  }
  function desktopQuery(query, designWidth = 390) {
    return query.split(',').map(part => {
      let valid = true
      const replaced = part.replace(/\(\s*(min-|max-)?width\s*:\s*([\d.]+)(px|em|rem)\s*\)/gi, (_, edge, value, unit) => {
        const width = Number(value) * (unit.toLowerCase() === 'px' ? 1 : 16)
        valid &&= edge === 'min-' ? designWidth >= width : edge === 'max-' ? designWidth <= width : designWidth === width
        return '(min-width: 0px)'
      })
      return valid ? replaced : null
    }).filter(Boolean).join(',')
  }
  function declarations(text) {
    // Split at syntax-level semicolons, never inside quoted SVG/url values
    let result = '', start = 0
    while (start < text.length) {
      const end = boundary(text, start), part = text.slice(start, end)
      const match = part.match(/^(\s*(?:\/\*[\s\S]*?\*\/\s*)*)([-\w]+)\s*:/)
      if (!match) result += part
      else {
        const prop = match[2], type = /^(?:font(?:-.*)?|line-height|letter-spacing|word-spacing)$/.test(prop) || /^--.*(?:font|type|title).*(?:size)?$/.test(prop)
        result += part.replace(/(-?(?:\d*\.)?\d+)(vw|cqw)\b/g, (_, value, unit) => {
          if (unit === 'cqw' && !type) return value + unit
          if (unit === 'cqw' && type) return 'calc(' + value + ' * var(--wistia-font-cqw, 3.588px))'
          const scale = type ? 3.9 : 7.8
          return Number((Number(value) * scale).toFixed(5)) + 'px'
        })
      }
      result += text[end] || ''; start = end + 1
    }
    return result
  }
  function rules(text) {
    let result = '', cursor = 0
    while (cursor < text.length) {
      const end = boundary(text, cursor), header = text.slice(cursor, end)
      if (text[end] !== '{') { result += header + (text[end] || ''); cursor = end + 1; continue }
      let close = end + 1, depth = 1
      while (depth && close < text.length) { const next = boundary(text, close); if (text[next] === '{') depth++; if (text[next] === '}') depth--; close = next + 1 }
      if (depth) throw new Error('Unclosed rule in ' + file)
      const body = text.slice(end + 1, close - 1)
      const clean = header.replace(/\/\*[\s\S]*?\*\//g, '').trim()
      if (/^@media\b/i.test(clean)) {
        const q = desktopQuery(clean.replace(/^@media\s*/i, ''))
        if (q) result += '@media ' + q + '{' + rules(body) + '}'
      } else if (/^@container\b/i.test(clean)) {
        // The named detail container has the existing 4% phone gutter per side
        const q = desktopQuery(clean.replace(/^@container\s*/i, ''), /solo-detail/.test(clean) ? 358.8 : 390)
        if (q) result += '@container ' + q + '{' + rules(body) + '}'
      } else if (/^@(supports|layer|(?:-\w+-)?keyframes)\b/i.test(clean)) result += header + '{' + rules(body) + '}'
      else result += header + '{' + declarations(body) + '}'
      cursor = close
    }
    return result
  }
  return '@media (max-width:779px){\n' + source + '\n}\n@media (min-width:780px){\n' + rules(source) + '\n}\n'
}
