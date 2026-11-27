# 예약 1단계 하단 바(.wf-nav) 화면 아래 고정 — 2026-11-28

## 원인

`css/page-materials-20261113-rose-editorial.css`가 `@layer wistia-page-materials` 안에서

```css
#app .wistia-wizard form[data-wf-current-step="1"] .wf-nav { position: relative !important; inset: auto !important; transform: none !important; width: 100% !important; margin: 16px 0 0 !important; }
#app .wistia-wizard form[data-wf-current-step="1"] .wf-nav:has([data-wf-next-hint]:not([hidden])) { margin-top: 44px !important; }
```

로 1단계에서만 `.wf-nav`를 본문 흐름에 두고 있었다. 레이어의 `!important`는 레이어 없는 `!important`보다 우선하므로, `css/wizard-layout-20261024.css`(layer `wistia-wizard-layout`)와 `css/booking-wizard.css`(unlayered)의 `position: fixed`를 덮었다.

## 수정

위 두 규칙을 삭제하고 짧은 주석만 남겼다. 1단계가 2·3단계와 **같은 규칙**을 쓰게 되어, 390px에서 `position: fixed; bottom: 0; width: 334px`(2단계와 동일), 데스크톱에서는 2·3단계와 동일한 값이 된다.

- `data-wf-next-hint` 말풍선은 `#app .wf-nav [data-wf-next-hint]{position:absolute; bottom:calc(100% + 8px)}`(approved-mobile-layout)로 바 위에 떠 있어, 바가 흐름에 있을 때 쓰던 `margin-top:44px`가 필요 없다. 두 번째 규칙도 함께 삭제.
- 하단 가림 여백: `.wf-nav` 높이는 390px에서 89px, `.calendar-time-grid` 등 1단계 내용 뒤에는 form `padding-bottom` 96px + `.wistia-wizard` `padding-bottom` 110px가 있어 2·3단계와 같은 여유가 유지된다.
- 캐시: `/css/*`가 immutable이라 `page-materials-20261113-rose-editorial.css?v=20261119-dir` → `?v=20261128-wfnav-fixed-1`로 8개 HTML 9곳 교체.

## 배포 전 실측(라이브, 수정 전)

| 화면 폭 | 1단계 | 2단계 |
|---|---|---|
| 390px | `position: relative`, margin 16px, width 319px (버그) | `position: fixed`, bottom 0, left 187.5px, width 334px |
| 1920px | `position: relative`, margin 16px, width 636px (버그) | `position: fixed`, bottom 0, width 636px |

데스크톱에서도 2·3단계는 이미 `fixed`였다(레이어 우선순위 때문에 `booking-wizard.css`의 `@media(min-width:780px){position:static}`이 이기지 못함). 이번 수정으로 1단계도 같은 값이 된다.
