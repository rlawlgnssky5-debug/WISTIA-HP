# 문의 날짜 달력 검수 — 2026-10-08 (KST)

- 희망 예약일: 폼 안에 펼친 달력, 운영 요일 안내, 월·화·수 휴무 표시/선택 차단, 과거 날짜 차단, 오늘/선택 범례.
- 예식일: 달력 팝업, 모든 요일 허용, 과거 날짜 차단, 월/연도 드롭다운과 이전/다음 달, 방향키/Enter/Esc/PageUp/PageDown(Shift는 연도 이동), 바깥 클릭 닫기.
- 표시 값은 한국어 날짜+실제 요일이며, 폼 값/초안은 YYYY-MM-DD. 2026-10-16의 실제 요일은 금요일. 문의 복사 형식은 변경하지 않음.
- 희망 예약일 선택 후 시간 버튼 표시. 기존 select와 값을 동기화하며, 조회 중에는 확인 중, 마감 시간에는 흐린 마감 표시. 미정 모드에서는 기존 시간 select 유지.
- 기존 Notion 요청/중복 요청 공유/상품별 소요 시간/8초 제한/실패 시 카카오톡 안내/복사 직전 강제 재조회는 유지. 예약 JS에는 달력 초기화와 시간 UI 동기화 호출만 추가.

## 검증

- `tests/*.test.mjs`: 62/62 통과.
- `node tests/contact-calendar-browser.mjs http://127.0.0.1:4175`: 320/390/1440px 통과. 실제 문의 화면에서 키보드 선택, Esc 포커스 복원, 외부 클릭 닫기, 요일 제한, 표시 요일, ISO FormData, 월/연도 선택, 상품 전환 후 날짜 유지, SOLO/DUET 마감 시간, 복사 직전 조회, 8초 fallback 및 미정 전환 확인.
- `/contact`, `/event/solo`, `/event/duo`, `/event/duet-film`에서 달력 초기화 확인. 기존 폐기 경로 `/event/proposal`, `/event/wedding`, `/event/solo-film`은 기존 리다이렉트 그대로 유지.
- 날짜/월 이동/연도 선택의 터치 영역 ≥40px, 캘린더 내부 잘림/페이지 가로 넘침 없음. 320px 40px, 390px 약41px, 1440px 약68px 날짜 칸. 선택 글자색 `rgb(255,252,245)` 대비 검사 포함.
- `node --check js/contact-form.js`, `node --check js/booking-availability.js`, `git diff --check` 통과.
- 브라우저 일정 응답은 모의 데이터로 검증. 실제 Notion 고객 일정 조회나 카카오톡 메시지 전송은 실행하지 않음.

## 기존 테스트 갱신

- 기본 date 입력 기대값을 커스텀 달력/숨긴 ISO 컨트롤로 변경하고, 관련 CSS/JS 캐시 기대값 갱신.
- SVG 보존 검사에서 추가한 달력/초기화만 제외하고 기존 필드/렌더/복사·초안 로직의 원래 해시는 유지.
- 오래된 song-card 픽스처를 현재 picker 카드 렌더 함수와 반응형 CSS로 갱신. 모바일 너비는 고정된 과거 350px 대신 실제 콘텐츠 폭에 맞는지 검사. 상품 페이지 코드는 변경하지 않음.
- analytics 원문은 그대로이며, LF 체크아웃 기준 보호 해시를 갱신.
- 관리 환경에서 file:// 브라우저 탐색이 제한되어 기존 desktop-layout 검사는 지원하는 LAYOUT_BROWSER 어댑터로 동일 픽스처를 로컬 HTTP에서 로딩해 측정. 나머지 61개 테스트는 직접 node 실행.

## 변경 범위

- `js/contact-form.js`, `js/booking-availability.js`, `css/booking-availability.css`, 관련 테스트.
- 공유 스크립트/CSS를 읽는 HTML은 해당 세 자산의 캐시 쿼리만 변경 (`20261008-contact-calendar-2`).
- `api/availability.js` CommonJS 원문, `js/app.js`, 승인 이미지·실제 후기·가사 예시·빨간 혜택가·POINT CSS는 변경 없음.
- 2026-10-08 후속: 희망 예약일 달력·안내의 월·화·수 표기를 `휴무`에서 `마감`으로 변경 (날짜 칸 표시·aria-label·안내 문구·범례·상태 메시지), 캐시 `20261008-contact-calendar-2`.
