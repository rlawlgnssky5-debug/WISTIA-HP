# 모바일 AR 코멘트 14개 검수 — 2026-10-03

- 대상: `/detail/solo`, `/detail/duo`
- 로컬 미리보기: http://127.0.0.1:4174/tests/mobile-solo-preview.html?page=solo
- 실제 브라우저 프레임: 320·390px, 콘텐츠 폭 303·373px
- 네 조합 모두 문서 가로 넘침 0, 포함 작업·보정 설명·가사 영상 제목·장점 소개·푸터 슬로건 내부 넘침 0
- 상품정보의 녹음시간·녹음 포함·녹음 후 최대 7일 이내 문구 확인
- 모바일 키 조절 이미지 0, 추가 옵션 중복 안내 항목 0
- 네이버 지도와 카카오맵은 기존 주소를 포함한 동일 서비스 링크이며 새 탭·noopener 유지
- 보정 전 최초 클릭 시 재생 시간 진행, 일시정지 후 보정 후 클릭 시 재생 및 시간 보존, 동일 선택 항목 재클릭으로 재생 복귀
- AR 비율 키보드 70→69% 조작 시 재생 시작, 69→70% 변경 중 재생 지속, 실제 포인터 드래그 70→79% 즉시 재생
- AR 재생 시 보정 플레이어 정지 확인, 기존 미디어 독점 재생 유지
- 직접 실행 Node 회귀 시험 20개 통과, desktop-layout 실행형 검사는 기존 환경 제약으로 제외하고 실제 브라우저 검수로 대체
- app.js·ar-ratio-cd.js·before-after.js 구문 검사와 Git 차이 검사 통과, 초기 HTML 19개 재생성
- 사용자 확정 슬로건: 완성도는 높이고, 부담은 줄인 가격을 약속드립니다
- 증빙: `qa/mobile-comments-14-key-20261003.jpg`, `qa/mobile-comments-14-location-20261003.jpg`
- 실제 휴대폰 Safari 및 광고 이벤트 관리자 수신 검수는 아님

## 운영 배포 검수

- 커밋: `14b69bbaf8eb4b53d45056110d9c95ba87c56136`, main 정상 푸시
- Vercel: success / Deployment has completed
- 배포: https://vercel.com/wistia1/wistia/Apo7BfamnuWGNYSWb8qbLsgnPfUs
- 공개 홈·SOLO·DUET·문의·오시는 길 HTTP 200 및 새 캐시 반영
- 공개 SOLO·DUET 320·390px 가로 넘침 0, 콘텐츠 폭 305·375px
- 공개 SOLO 두 폭 및 DUET 320px 요청한 긴 문구 내부 넘침 0
- 공개 보정 전·후 탭 즉시 재생, AR 70→69% 즉시 재생 및 0:23까지 시간 진행, 다른 플레이어 정지 확인
- 공개 지도 두 서비스 링크와 확정 슬로건 확인, 검수 탭 오류·경고 0
- 공개 증빙: `qa/mobile-comments-14-production-20261003.jpg`
