# 메인 히어로 부제목 문구 수정 (2026-11-28)

요청(지훈): 히어로 부제목 `내 목소리로 미리 준비하는 축가, 본식에서는 더 편안하게`에서
`, 본식에서는 더 편안하게`를 빼고 `내 목소리로 미리 준비하는 축가`만 남긴다.

## 문구가 있던 곳

`grep -rn "미리 준비하는 축가\|본식에서는"` 결과, 히어로 부제목과 같은 문장은 두 곳뿐이었다.

| 파일 | 위치 | 역할 |
|---|---|---|
| `index.html` 422줄 | `<p class="home-first-lead">` | JS 실행 전 첫 페인트(정적 마크업, 크롤러·no-JS 화면) |
| `js/app.js` 1439줄 | `mobileArSoloDetail()`의 `heroCopy` 안 `<p class="ed-hero-lead">` | JS 렌더 후 실제 홈 히어로 |

홈 라우트는 `renderDetail("solo")` → `arCommerceDetail()` → `mobileArSoloDetail()`로 그려지고,
로드 후 `[data-home-first-paint]`는 DOM에서 사라진다. 라이브 실측(`document.querySelector('.ed-hero-lead')`)
으로 최종 화면 문구가 app.js 쪽임을 확인했으므로 **두 곳 모두** 수정했다.

## 손대지 않은 같은 표현

- `js/app.js` POINT 02 제목 `본식에서는 더 편안하게<br><span>함께 부른 노래는 오래도록</span>` (듀엣 상세 섹션 제목)
- `js/app.js` `본식에서는 더 안정적으로` (솔로/듀엣 상세 한 줄 소개)
- FAQ `본식에서는 어떻게 사용하나요?` 등 질문 문구

모두 히어로 부제목이 아니라서 그대로 두었다. 메타 디스크립션·og/twitter 설명에는 이 표현이 없다.

## 캐시

`/js/*`는 `Cache-Control: public, max-age=31536000, immutable`이라 `js/app.js?v=20261126-nojank`
→ `?v=20261128-hero-sub`으로 8개 HTML(index, contact, events, proposal, event/solo, event/duo,
info/faq, info/location)에서 올렸다. `index.html`은 `max-age=0, must-revalidate`라 별도 버전 없음.

## 검증

- 변경 diff: 두 파일 각 1줄, 문구만 제거(다른 문자 변화 없음).
- 배포: main 푸시 → Cloudflare Workers Builds 자동 배포. `gh` 체크런과 라이브 HTML/JS 실측 결과는
  배포 후 아래에 덧붙인다.
- 라이브 `/`: HTTP 200, 히어로 부제목 `내 목소리로 미리 준비하는 축가`만 노출, `본식에서는 더 편안하게` 없음.
