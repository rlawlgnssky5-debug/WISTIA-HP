# 문의 복사 버튼 모바일 pointer 차단 수정 — 2026-10-04

## 원인과 수정

- 앞선 안내 팝업 배포만으로 실제 모바일 클릭은 해결되지 않았음
- 운영 /event/solo의 모바일 390px에서 버튼과 부모 계산 스타일 pointer-events none, 실제 클릭 후 팝업 비노출 재현
- consultation-flow.css의 max-width 900px 규칙이 이전 가격 전용 바의 pointer-events none을 남겼고, 현재는 그 안에 복사 버튼과 개인정보 링크가 있음
- 해당 규칙을 auto로 변경하여 클릭 입력을 복원, 검증·복사·직접 상담 코드와 현재 디자인은 보존
- 해당 CSS 캐시만 20261004-inquiry-pointer-fix-1로 갱신하고 HTML 27개 재생성

## 실제 포인터 클릭 검수

- SOLO 320·390·663·900·901·1022 CSS px에서 실제 click → 누락 팝업 표시, pointer auto, 페이지 가로 넘침 0
- SOLO·DUET·스토리·직접 문의 × 320·390 CSS px 여덟 조합
- 각 조합에서 빈 성함 클릭 → 성함 입력 안내
- 수정 버튼 클릭 → 성함 수정, 정상 입력 뒤 버튼 클릭 → 복사 완료
- 실제 클립보드에 검수 성함 포함 확인
- Enter, programmatic submit, force click으로 대체하지 않음
- 직접 상담 링크 click → 새로운 https://pf.kakao.com/_GbExjX/chat 채널 탭 연결, 클립보드 검수 문자열 보존
- 실제 메시지 전송과 휴대폰 실기 검수는 하지 않음

## 자동 검수

- 기존 contact-validation 시험에 모바일 카드 pointer-events auto 및 캐시 기대값 추가
- 직접 실행 기존 회귀 27개 통과, git diff --check 통과

로컬 증빙: tests/qa/contact-pointer-local-390-20261004.png

## 운영 배포 및 실제 클릭 확인

- 커밋 ef020235fdfd0b9130dd13a19db738609bb57e20을 기존 main에 정상 푸시했고 Vercel success / Deployment has completed 확인
- 배포 주소: https://vercel.com/wistia1/wistia/6dVSBonWHBRcm8oMcD96ZQzM1MZd
- 운영 SOLO·DUET·스토리·직접 문의 네 경로 HTTP 200 및 새 CSS 캐시 확인
- 운영 CSS 화면 폭 390px에서 각 화면의 실제 복사 버튼 클릭 → 성함 누락 안내, 수정 후 실제 버튼 클릭 → 복사 완료 및 클립보드 검수 성함 확인
- 운영 SOLO·스토리·직접 문의에서 pointer auto 및 페이지 가로 넘침 0 확인, 검수 탭 오류·경고 0
- 운영 SOLO의 양식 없이 바로 상담 링크 실제 클릭 → 카카오톡 채널 새 탭 연결 및 클립보드 불변 확인
- 320px 요청 이후에도 실제 innerWidth는 390px였으므로 운영 320px 완료로 기록하지 않음, 로컬의 실제 320px 검수와 구분
- 운영 증빙: tests/qa/contact-pointer-production-390-20261004.png
- 실제 휴대폰 실기 검수와 실제 상담 메시지 전송은 하지 않음, 배포 후 기록·증빙은 로컬 보관
