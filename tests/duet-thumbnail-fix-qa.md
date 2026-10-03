# 듀엣 썸네일 잘림 수정 — 2026-10-04

## 원인과 변경

- 첨부 화면의 신부 오른쪽 잘림은 기존 `duet-live-proof.jpg` 원본에서 확인됨
- 실제 로컬 영상 `assets/video/duo-wedding-song-ar.mp4`의 14초 장면을 추출
- 새 파일 `assets/img/ar-detail/duet-live-proof-v2.jpg`, 406×720px
- 두 사람의 얼굴·상체가 들어오는 구도로 교체, 허구의 인물/장면 생성 또는 사진 합성은 하지 않음
- 공유 helper의 poster와 fallback 경로를 동시에 변경, SOLO 썸네일과 재생 영상은 보존
- 기존 1:1 표시와 재생·일시정지·갤러리 전환은 유지

## 검수

- 실제 브라우저 SOLO/DUET × 320/390/1022px 여섯 조합의 새 poster/fallback 경로 확인
- 가로 넘침 0, 모바일 390px 새 썸네일에서 두 사람의 얼굴·상체 잘림 없음 확인
- 듀엣 실제 영상 재생 0.22→11.22초 진행, 클릭 일시정지 확인
- 검수 프레임의 출처 없는 MutationObserver 오류 1건은 앞서도 관찰한 로그이며 이번 썸네일 변경과의 관련은 확인되지 않음
- 기존 customer-review-fixes/unified-commerce/mobile-ar-solo 검사 3개·JS 구문·정적 HTML 27개 생성·Git 차이 검사 통과
- 증빙 `qa/duet-thumbnail-fixed-390-20261004.png`, 원본 장면 비교 `qa/duet-source-frames-20261004.jpg`
- 실제 휴대폰 기기 검수는 아님

## 배포 상태

- 앱 캐시 `20261004-duet-thumbnail-2`
- 커밋·원격 푸시·배포는 실행하지 않음, 배포는 폐하께서 직접 진행
- 수정된 JS/HTML과 함께 새 `assets/img/ar-detail/duet-live-proof-v2.jpg`를 포함
