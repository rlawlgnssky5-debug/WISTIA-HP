# 전체 화면 디자인 검수 — 2026-10-06

## 변경 범위

- 최신 전체 디자인/글꼴 변경 및 배포 요청에 따라 한글 제목·본문·조작 요소를 Pretendard로 통일
- 영문 WISTIA 서명은 기존 브랜드의 성격을 유지하는 Georgia, 로고 이미지 원본은 유지
- 블랙 #111111 / 화이트 #FFFFFF / 그레이 #E8E8E8 유지, 사진·영상·카카오 공식 이미지에 색상 필터 없음
- 홈의 큰 회색 텍스트 박스를 기존 스튜디오 이미지와 상품 연결 버튼으로 재구성, 첫 이미지 eager/high priority 로딩
- 상품 카드의 이미지 확대, 흰 면과 얇은 구분선, 제목·가격·본문 위계와 섹션 간격 정돈
- 상품 상세·스토리 장면·진행 폴더·FAQ·정보·이벤트·지도·선택·신청서·개인정보 화면의 공통 스타일 적용
- 문의 카드와 입력란은 중첩 회색 면을 제거하고 선택/초점 상태와 버튼 대비 보존
- AR 7단계/스토리 8단계의 전체 사진·본문·기본 펼침·접기/재개방 보존
- 가격·혜택·옵션·사업 문구·음원·영상·문의 복사/확인 로직은 변경하지 않음

## 로컬 반응형

다음 26개 경로 요청에서 320·390·768·769·1022·1440px, 높이 735px의 156개 조합을 확인

`/`, `/detail/solo`, `/detail/duo`, `/detail/duet-film`, `/event/solo`, `/event/duo`, `/event/duet-film`, `/contact`, `/info/about`, `/info/faq`, `/info/process`, `/info/location`, `/events`, `/before-after`, `/song`, `/film`, `/ar/self`, `/ar/friend`, `/find/role`, `/find/service`, `/find/people`, `/section/homeServices`, `/section/homeCases`, `/section/homeLocation`, `/section/homeProcess`, `/privacy`

- 가로 넘침 0
- 검사한 제목·한 줄 설명·가격/상품 정보·버튼·진행 라벨·슬로건의 내부 가로 잘림 0
- 표시되는 이미지의 로딩 오류 0, 본문 계산된 font-family에 Pretendard 포함
- 휴대폰 실기 검수가 아닌 브라우저 viewport 검사
- `/section/homeProcess`는 기존 `/info/process` 이동, `/find/service`와 `/find/people`은 선행 선택 없는 경우 기존 선택 화면으로 이동
- DOM에 명시적으로 검사한 영역 기준이며 모든 브라우저/OS의 픽셀 단위 결과를 보장하는 검사는 아님

## 시각 검수

- 홈 모바일/PC의 제목·사진·두 버튼·상품 카드
- SOLO/DUET/스토리 상세의 소개·가격·파형·키 조절·스토리 장면·전체 진행 단계
- 상담 모바일/PC의 질문 카드·선택한 구성·하단 복사 버튼
- FAQ 모바일/PC, 소개, 이벤트, 지도, 진행 안내, 비교, 노래/영상/AR 선택, 개인정보 화면
- 이전 CSS의 고특이성 충돌로 남던 버튼 글자 대비·카드 모서리·문의 배경·좌측 카카오 아이콘 위치를 새 범위에서 보정

## 동작 검수

- SOLO 실제 영상 재생과 일시정지, 390→1022px 변경 시 재생 시간 진행 및 DOM 재생 상태 유지
- 보정 후 선택 시 재생 상태, AR 비율 ArrowRight 70→71 변경 시 AR 0:04 진행과 보정 플레이어 정지 상태
- DUET 선택 시 16만원/2인/7단계 갱신
- AR 폴더 클릭 닫기와 Enter 재개방, 스토리 폴더 클릭 닫기와 Space 재개방 시 전체 8단계 유지
- FAQ 첫 답변 펼침, 메뉴 열기/닫기와 전체 연결 항목 유지
- 문의 필수 항목 누락 팝업의 직접 성함 수정 및 Enter 제출
- 실제 브라우저 클립보드의 DUET 2인/2시간/16만원과 검수용 성함 확인
- 상품 드롭다운 스토리 선택 시 성함 보존과 35만원 표시
- 카카오톡 최종 외부 이동/상담 메시지 전송은 실행하지 않음
- 직접 검수 탭의 오류/경고 기록 0

## 자동 검사와 증빙

- 직접 실행 회귀 검사 42개, 실패 0
- 앱/보정/문의 JavaScript 구문 및 Git 차이 검사 통과
- 최초 정적 HTML 27개 재생성, 운영 검수 후 선택 화면 3개를 추가하여 최종 30개
- `desktop-layout.test.mjs`의 직접 터미널 브라우저 구동은 실행하지 않고 지원 브라우저 반응형 실측으로 대체
- 새 `studio-editorial.test.mjs`로 서체·미디어 홈·버튼 대비·입력·초점·움직임 감소·전체 폴더 유지 검증
- 로컬: `tests/qa/editorial-home-local-1022-20261006.png`
- 로컬: `tests/qa/editorial-contact-local-390-20261006.png`
- 로컬: `tests/qa/editorial-story-local-390-20261006.png`

## 배포

최신 요청으로 기존 main → GitHub → Vercel 배포 승인

- 첫 디자인 배포 커밋 `d589e899e82c48652231d282ad44b2e1e0e3d699`, Vercel success / Deployment has completed
- 공개 홈·상품·신청서·정보·이벤트·비교·기존 보조 화면·홈 섹션·개인정보 등 23경로 HTTP 200과 새 디자인 캐시 확인
- 새 디자인 CSS·서체 CSS·앱 JS의 공개 내용과 커밋 일치 확인
- 공개 `/find/role`, `/find/service`, `/find/people` 직접 방문은 기존 404로 확인되어 정적 생성 목록에 추가, 초기 검사 오류 후의 오래된 응답 변수 값은 유효 결과로 취급하지 않음
- 해당 3개 정적 HTML은 기존 화면/선택 로직을 그대로 실행하며 noindex 처리, 최종 운영 결과는 보완 배포 후 추가
