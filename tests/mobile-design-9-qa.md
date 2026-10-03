# 모바일 AR 디자인 재검수 — 2026-10-03

## 첨부 아홉 장 반영

- 1번: 반복 파형 세 장을 가위·점선 절단면과 두 색 녹음 구간, 연결 아이콘을 담은 한 설명 패널로 교체
- 2번: 키 조절의 반복 디렉팅 사진을 새 실버 타이포 이미지로 교체, POINT 01의 녹음·프로그램 사진 두 장도 모바일에서 제외
- 3번: 진행 순서를 작은 번호·단계별 아이콘·왼쪽 정렬 문장으로 구성한 네 단계 타임라인으로 변경
- 4번: 예약 안내는 항목명과 핵심 숫자·조건을 같은 열에 배치, 본식 전 확인은 별도 메모로 분리
- 5번: SOLO·DUET 본식 영상을 1:1 영역에 cover로 확대, 전체 탭 재생과 일시정지 유지
- 6번: 상품정보 여섯 항목을 동일한 항목명 위·값 아래 구조로 정렬, 포함 작업과 제작 기간 한 줄 유지
- 7번: 후기의 작은 제목과 반복 설명을 없애고 실제 고객 후기 제목 하나만 유지
- 8번: 기존 방문 페이지의 주소·부천시청역 1번 출구 도보 약 300m·공영주차장·별도 주차 요금 조건을 상세에 요약, 기존 방문 페이지 링크 유지
- 9번: 홈과 방문 페이지에서 도로명 주소·2층을 같은 행에 표시, 지역명만 위에 별도 표시

## 실제 브라우저 검수

- SOLO·DUET × 320·390px: 문서 가로 넘침 0, 두 긴 상품정보 값의 내부 넘침 0 및 nowrap 확인
- 스크롤바 제외 콘텐츠 폭은 320px에서 약 303px, 390px에서 약 373px
- 여섯 상품정보 행이 모두 동일한 단일 값 열과 왼쪽 시작점을 가짐
- 390px 영상 두 개의 실제 표시 영역은 각각 373×373px, object-fit cover 확인
- DUET 영상 실제 재생 후 진행 시간 증가, 다시 누르면 해당 시간에서 일시정지 확인
- 첫 FAQ 클릭 시 open 상태와 답변 노출 확인
- 390px 네이티브 화면 클릭 SOLO→DUET 전환: 선택 영역 top 79.81→79.25px, 위치 차이 약 0.56px, 2인·2시간·16만원 갱신
- 지도·방문 안내 버튼 클릭 시 /info/location 이동, 기존 지도·두 지도 링크와 방문 정보 보존
- 방문 페이지 320·390px와 홈 320px 주소 내부 넘침 0, 도로명과 층수 같은 grid 행 확인
- 생성 타이포 이미지 1254×1254px 실제 로딩 확인
- 기존 프레임 검수 도구의 출처 없는 MutationObserver observe 로그 1개는 여전히 관찰됨, 이번 소스 변경에서 새 오류라고 확정하지 않음
- 실제 휴대폰 Safari와 운영 화면은 이번 검수 범위가 아님

## 생성 이미지

- 실행 방식: 내장 image_gen, 새 이미지 생성, 불투명 배경
- 최종 자산: assets/img/ar-detail/key-typography-v1.png
- 원본은 생성 도구 보관 경로에 남기고 프로젝트에는 복사본을 사용
- 한글 표기 내 목소리에 / 맞는 키와 실버 타이포 디자인을 직접 확인
- 프롬프트:

```
+Use case: ads-marketing
Asset type: typography image replacing a repetitive studio photo on a mobile Korean wedding recording product page
Primary request: polished square editorial typographic poster about adjusting the song key to the singer, not a UI mockup
Text (verbatim): "내 목소리에" on first line, "맞는 키" on second line; small footer text "KEY ADJUSTMENT"
Style/medium: premium Korean Swiss editorial typography, bold clean Korean sans-serif, crisp black charcoal letters, second line large sculptural satin silver 3D type with dark readable edges, minimal white to pale silver background
Composition: tight intentional composition, main Korean text occupies middle upper two thirds, bottom has two slim silver musical pitch bars connected by a clearly visible curved downward arrow, restrained blue-grey accent, generous but not excessive margins
Constraints: only the exact text listed, Korean spelling must be exact, no people, no photos, no frames, no mockup devices, no logos, no watermark, strong mobile readability
```

## 회귀 검수 및 배포

- 직접 실행 회귀 시험 19개, JS 구문 검사, Git 차이 검사 통과
- 별도 Edge 프로세스 방식 desktop-layout 시험은 실행하지 않고 관련 화면은 현재 브라우저로 검수
- 정적 HTML 19개 재생성, 앱 캐시 20261003-design-review-9-1, 모바일 CSS 20261003-design-review-9-2, 주소 CSS 20261003-address-line-1
- PC AR 상세 사진·구성, 스토리 상품·가격·혜택·납기·상담 순서와 추적 소스는 변경하지 않음
- 원격 푸시·배포 없음

## 확인 화면

- tests/qa/design-9-cut-20261003.jpg
- tests/qa/design-9-key-20261003.jpg
- tests/qa/design-9-process-20261003.jpg
- tests/qa/design-9-notices-20261003.jpg
- tests/qa/design-9-info-20261003.jpg
- tests/qa/design-9-location-20261003.jpg
- tests/qa/design-9-address-20261003.jpg

미리보기: http://127.0.0.1:4174/tests/mobile-solo-preview.html?page=solo
