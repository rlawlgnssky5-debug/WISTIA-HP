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

## 검증 (2026-11-28 01:47~01:50 KST, 실측)

- 커밋 `ed14fee` → `git push origin main` 정상(`b15d8df..ed14fee`).
- `gh` 체크런 `Workers Builds: wistia` = **success** (`2026-11-27T16:48:41Z` = 01:48:41 KST). `wrangler deploy`는 필요 없음(main 푸시 → Cloudflare Workers Builds 자동 배포).
- 라이브 `/` HTML: `.home-first-lead` = `내 목소리로 미리 준비하는 축가`, `본식에서는 더 편안하게` **0건**.
- 라이브 `/js/app.js?v=20261128-hero-sub` sha256 = 커밋본과 **동일**(`df45f3b7…`), `heroCopy`의 `.ed-hero-lead` = `내 목소리로 미리 준비하는 축가`.
- HTML 8개(`/`, `/proposal`, `/event/solo`, `/event/duo`, `/contact`, `/events`, `/info/faq`, `/info/location`) 모두 **200 OK** + `js/app.js?v=20261128-hero-sub` 참조. `/api/health` 200(`status: ok`), apex `wistiastudio.com` → www **308** 정상.
- 실브라우저 로드 후 DOM 실측: `#app`의 `.ed-hero-lead` = `내 목소리로 미리 준비하는 축가`(구 문구 없음), 첫 페인트용 `[data-home-first-paint]`는 하이드레이션 후 사라짐 → 화면에 보이는 히어로가 app.js 문구임을 재확인.
- 캡처: `handoffs/✏️-wistia-hp-히어로-부제목-문구-수정-및-배포/evidence/hero-after-20261128-014917.png`(팝업 닫은 뒤).
- 히어로는 1인/2인 토글이 같은 `heroCopy`를 쓰므로 듀엣 보기에서도 같은 문구다. 반면 POINT 02 제목 등 상세 섹션의 `본식에서는 더 편안하게`, `본식에서는 더 안정적으로`는 그대로 남아 있다(의도).
