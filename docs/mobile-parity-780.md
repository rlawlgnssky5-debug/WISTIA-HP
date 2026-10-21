# 390px 구성과 PC 780px 통합

기준 커밋 bc0980a / 공통 캐시 20261021-mobile-parity-1

## 빌드

기존 시트의 순서와 실제 휴대폰 스타일은 유지한다
scripts/build-css-bundle.mjs는 각 소스를 scripts/mobile-canvas-css.mjs를 통해 두 범위로 묶는다

- 779px 이하에서는 원본 CSS를 그대로 사용한다
- 780px 이상에서는 390px 기준의 미디어 조건만 사용한다
- solo-detail 이름의 컨테이너는 휴대폰의 4vw 양쪽 여백을 반영하여 358.8px 조건으로 평가한다
- 레이아웃 vw는 780px, 글자 vw는 390px, 글자 cqw는 기존 휴대폰 컨테이너 폭을 기준으로 변환한다
- css/mobile-parity-780.css는 변환하지 않는 공통 보정 및 실제 PC 캔버스 규칙이다
- css/canvas-780.css는 번들 안에서 중복 로드하지 않으며 모든 진입 HTML의 마지막 독립 스타일시트로 유지한다
- output/ 검수용 HTML은 운영 진입점 검색에서 제외한다

CSS 수정 후 node scripts/build-css-bundle.mjs를 실행한다
새 소스와 번들 해시가 css/bundles.json 및 모든 정적 진입점에 반영되는지 확인한다
PC 전용 포스터와 다열 배치를 별도로 복원하지 않는다

## 지도와 개인정보

지도 원본은 변경하지 않고 .solo-map-art의 비율 860/1490으로 아래 그림 버튼 부분만 표시에서 제외한다
실제 지도 링크 주소와 기존 클릭 처리는 유지한다

개인정보 본문은 js/privacy-content.js의 원문을 공유하고 /privacy는 다른 경로와 동일한 앱 머리말과 푸터를 사용한다
본문의 법적 문구와 연락처는 이번 작업에서 변경하지 않는다

## 색상 승인 범위

구간 색상 6번은 운영 변경에서 제외한다
tests/mobile-parity-extras.cjs의 검수 브라우저 안에서만 승인용 색상을 주입한다
미리보기 이미지나 해당 색상 주입을 운영 페이지에 연결하지 않는다

## 검수

- tests/mobile-parity-browser.cjs: 32개 주소의 직접 / 소개 경유 전환, 1280px / 390px 전체 화면
- tests/mobile-parity-extras.cjs: 360px / 375px / 390px / 1280px 글자·메뉴·지도·승인용 구간 색상 시안
- scripts/mobile-parity-report.cjs: 화면 대조와 치수·글자 크기·이미지 검사 결과 및 잔여 영상 문구 보고서
- scripts/mobile-parity-suite.cjs: 기준 커밋과 기존 전체 테스트의 실패 비교

캡처는 합성 popstate 전환에서 재생 사용자 활성화가 생기지 않도록 정지 상태로 비교한다
실제 문의 제출과 카카오톡 전송은 차단한다
기존 영상 상품의 폐지 주소는 기존대로 홈으로 이동하며 새 상품을 되살리지 않는다
