# InquiryOpen button_location = "wpr-target" 수정 (2026-11-28)

## 원인

`js/press-ripple-20261116.js`가 `pointerdown` 때 누른 요소에 `wpr-target`(과 `wpr-down`) 클래스를 붙이고, `wpr-down`만 떼기 때문에 `wpr-target`은 클릭 뒤에도 그대로 남는다.
`js/inquiry-funnel.js`의 `locationOf()`는 id가 없는 버튼에서 `control.classList[0]`을 읽었으므로, 클래스가 없던 버튼(하단 고정 독 `.home-dock-row > a[data-package-inquiry]`, 할인 배너 `.home-offer a[data-home-offer-link]`)은 항상 `button_location: "wpr-target"`으로 기록됐다.

## 수정

`js/inquiry-funnel.js`만 변경. 위치 문자열을 만드는 부분을 `ownLocation()`으로 분리하고 우선순위를 다음과 같이 정했다.

1. 기존 특수 케이스(`#mainMenu`, `#floatingPrice`, `.solo-desktop-cta`, `.detail-sticky`류, `.hero`, `.consult-choice-form`, `.footer`) — 그대로
2. `data-inquiry-location` (앞으로 명시하고 싶을 때 쓰는 훅)
3. `control.id`
4. `wpr-`로 시작하지 않는 첫 클래스 (기존 `classList[0]`과 같은 결과, 물결 임시 클래스만 제외)
5. `data-home-offer-link` → `home_offer`, `data-package-inquiry` → `home_dock`
6. `.home-dock` 안이면 `home_dock`
7. 가장 가까운 `section[id]`
8. `inquiry_link`

`meta-pixel.js`의 40자 제한은 기존과 같이 `.replace(...).slice(0, 40)`로 지킨다(`home_offer`, `home_dock` 모두 통과).

물결 효과 스크립트는 손대지 않았다. `wpr-target`은 손을 뗀 뒤 `scale`이 부드럽게 돌아오는 transition을 계속 제공하는 클래스라 지우면 효과가 깨진다.

## 캐시

`/js/*`는 `immutable` 1년 캐시라서 `inquiry-funnel.js?v=20261111-three-steps` → `?v=20261128-button-location-1`로 8개 HTML을 모두 올렸다.
`contact.html`, `events.html`, `index.html`, `proposal.html`, `event/solo.html`, `event/duo.html`, `info/faq.html`, `info/location.html`.

## 검증

- `node`가 없는 환경이라 `node --check` 대신 tree-sitter 자바스크립트 파서로 `js/inquiry-funnel.js` 전체 구문 검사 → ERROR 노드 0.
- 배포 후 라이브 확인 항목: `js/inquiry-funnel.js` 응답이 커밋과 동일한지, 하단 독 클릭 시 `button_location`이 `home_dock`/`home_offer`로 오는지.
