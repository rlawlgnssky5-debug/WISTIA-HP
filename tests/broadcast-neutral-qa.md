# 방송 타이틀 NOIR 톤 정돈

2026-10-06, 네이비만 튀는 방송 그래픽의 톤 통일 요청

- 기존 승인된 방송 타이틀의 글자 형태·3D 질감·두 열 구성·중앙 선·여백을 시각적으로 보존하고 네이비를 차콜/실버, 차가운 바탕을 따뜻한 아이보리로 편집
- 내장 imagegen 사용, 목표는 색상/재질 정돈뿐이며 글자 재구성·소품 추가·인물 제작 없음
- 원본 assets/img/ar-detail/broadcast-typography-wistia-v2.png는 바이트 그대로 보관
- 참조 assets/img/story-polish/film-expert-v1.webp의 차콜·실버·아이보리 질감과 조화
- 신규 자산 assets/img/ar-detail/broadcast-typography-noir-v3.webp, 1600×533·51,258바이트
- 프롬프트·출처·참조·변환 기록 assets/img/ar-detail/broadcast-typography-noir-v3.json
- 이미지 생성 이후 Pillow는 비율 유지 축소/형식 변환에만 사용, 콘텐츠 수정 없음
- js/app.js는 전문가 방송 이미지 경로와 대체 문구만 변경, 기존 상품/가격/후기/가사 예시/문의/재생 로직 보존
- CSS 무변경, 3:1 contain과 filter:none 유지, 전문가 두 카드 기존 높이/간격 보존
- 앱 캐시 20261006-broadcast-neutral-1, 정적 HTML 30개 재생성
- 로컬 SOLO·DUET·스토리 × 320·390·1022px 9개 조합의 새 자산 정상 로딩·전체 표시·가로 넘침 0
- 같은 9개 조합에서 혜택가 rgb(198,40,40), 후기16개, 제작 단계7/7/8개 유지
- 검사 탭 오류/경고 0, 실제 휴대폰 실기와 외부 메시지 전송은 미실행
- 직접 회귀 55/55와 앱 JS 구문 검사를 통과, 임시 화면 크기는 복원하고 수정 미리보기 탭은 보존
- 로컬 증빙 tests/qa/broadcast-neutral-local-desktop-20261006.png
- 홈페이지 개선은 현재 홈 화면과 코드 구조에 근거한 가설만 제안, 실제 문의율/예약율 데이터는 확인하지 않았고 추천 사항은 구현하지 않음
- 배포 요청 없는 이번 작업은 로컬 미리보기까지만 반영, 커밋/원격 푸시/운영 배포 없음
