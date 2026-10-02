# 2026-10-02 입장 이미지·홈 채움·병합 검수

- 신부·신랑 버진로드 입장 예시를 내장 image_gen으로 각각 생성함
- 원본 PNG 보존, 화면용 WebP 640×360 이내 최적화(약 42KB·47KB)
- 홈 가격 CTA 문구는 `가격 보기`, `/event/solo` 이동을 유지함
- 홈 두 카드 사진의 4:5 비율과 동일 크기, cover 채움 및 커플 얼굴 구도를 실제 브라우저에서 확인함
- 320·390·768·1440px에서 홈·AR 가격·필름 가격·AR 상세·필름 상세·오시는 길 총 24개 화면 가로 넘침 0, H1 1개를 확인함
- 필름 입장곡 두 개 선택: 35→43만원, 메이킹 변경: 36만원, 블로그 혜택: 33만원
- 상담 CTA는 복사 안내 팝업만 열며 확인 전 외부 이동하지 않음
- 새 직접 가격 탭 오류 로그 0, 검수 헬퍼에는 이전에도 나타난 출처 없는 MutationObserver 오류 1개가 남아 있어 제품 오류 여부를 단정하지 않음
- 기존 회귀 시험 11개와 JavaScript 구문·Git 차이 검사 통과
- 옛 헤드리스 레이아웃 시험 대신 실제 브라우저의 반응형 검수를 사용함
- 병합은 최신 리뉴얼·가격 사이드 카드·현장 영상·지도·폴더 모션을 유지하고 원격 개인정보처리방침·고객지원·SEO·보조 페이지 및 오디오 정리 코드를 보존함
- 이전 4상품 홈·가이드 새·구형 가격 UI는 되살리지 않음
- 정적 HTML 18개를 현재 템플릿으로 갱신함

## 실제 화면

- `tests/qa/entrance-home-desktop-20261002.jpg`
- `tests/qa/entrance-price-desktop-20261002.jpg`
- `tests/qa/entrance-price-mobile-20261002.jpg`

## 운영 배포 확인

- 요청에 따라 병합 커밋 `bb5ce4b0a21829e7551b7dff2451942cfe9ce34b`를 GitHub `main`에 푸시함
- Vercel: `success`, `Deployment has completed`
- 배포 기록: https://vercel.com/wistia1/wistia/59Jhd1Cnk6EeqrTKh2mS229BnzkK
- https://www.wistiastudio.com/ HTTP 200, 앱 버전 `20261002-entrance-fill-1` 확인
- 운영 1440px 홈 사진 두 장은 각각 180×225px, cover 채움과 얼굴 구도를 확인함
- 운영 홈 `가격 보기` 클릭 → `/event/solo`, 기본가 12만원 확인
- 운영 320·390px 가격 화면 가로 넘침 0, CTA 잘림 없음
- 운영 신부 옵션 35→39만원, 상담 복사 팝업 확인, 해제 후 35만원 복귀
- 운영 홈·가격 새 탭 오류 로그 0, 확인 버튼의 외부 카카오톡 이동은 실행하지 않음
- 검수용 뷰포트 변경은 종료 전에 초기화하고 임시 검수 탭은 닫음
- 운영 미리보기 탭 두 개를 결과로 유지함
- 운영 캡처: `tests/qa/entrance-home-production-20261002.jpg`, `tests/qa/entrance-price-production-20261002.jpg`, `tests/qa/entrance-price-production-mobile-20261002.jpg`
