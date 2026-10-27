# 선착순 쿠폰 운영

- 캠페인: limited-20261028, 총 20장, 브라우저당 한 장, 발급 취소나 화면 이동으로 재고를 반환하지 않음
- 기존 20,000원, DELUXE·PREMIUM·DUET, 2026년 11·12월 방문 조건과 2027-01-01 00:00 KST 종료 유지
- 상세·문의 양식에만 발급 카드 표시, 이벤트와 기본 할인 목록에서는 제외
- 기존 yearEndCoupon 필드는 저장 호환용으로 유지하지만 과거 로컬 선택은 발급 증명이 아니므로 이월하지 않음
- 정상 발급 후에는 서버 확인된 수령 상태를 사용, 브라우저 cookie를 삭제하지 않는 한 임시 초안 3시간 만료와 무관하게 복원
- HttpOnly·Secure·SameSite=Lax 쿠키로 브라우저를 식별하며 이름·전화번호·IP·분석 식별자는 저장하지 않음
- 브라우저 데이터 삭제, 별도 프로필, 시크릿 창, 다른 브라우저는 별도 브라우저로 취급하며 사람당 한 장을 보장하는 로그인 인증은 아님

## 저장소와 보안

- Supabase WISTIA-HP 프로젝트의 coupon_campaigns, coupon_browser_claims와 coupon_inventory 함수
- DB 함수는 security invoker, service_role만 실행 가능, 테이블 RLS 활성화와 anon/authenticated 접근 전면 회수
- Edge Function limited-coupon이 서버 내장 비밀키로 서명된 익명 브라우저 토큰을 검증한 후 service-only RPC 호출
- JWT gateway 대신 자체 HMAC 서명 검증을 사용하며 POST에 유효한 토큰이 없으면 401
- GET은 발급하지 않고 토큰과 상태만 반환, 같은 token의 POST는 캠페인 행 잠금 후 기존 발급을 먼저 확인
- Vercel /api/limited-coupon이 토큰을 HttpOnly 쿠키로 보관하고 JSON에서 제거하며 모든 응답은 no-store
- 조회나 발급 실패 시 성공 또는 임의의 잔여 수량을 표시하지 않음
- 첫 이용 쿠폰·GA4·메타 픽셀·문의 전송 경로는 변경하지 않음

## 검증

- tests/limited-coupon-server.test.mjs: 서명, 위조 차단, 장애 처리, 서버 쿠키와 교차 사이트 POST 차단
- tests/limited-coupon-live-inventory.mjs: 별도 limited-20261028-qa 캠페인에 60건 병렬 요청으로 20개 브라우저만 발급, 이 테스트는 QA 재고 초기화 후 한 번 실행하는 통합 검사
- tests/limited-coupon-browser.cjs: 응답 fixture로 320·360·375·390·414·780·1280px 레이아웃과 발급·재조회·문의·상품·방문일·소진·장애 검증
- 운영 검수에서는 실제 발급 POST를 하지 않아 운영 20장을 소진하지 않음
- RLS 정책 없음 INFO는 service_role 전용 테이블의 의도된 public 접근 차단 상태이며 권한 확인으로 anon 접근이 불가능함을 검증

## 배포

- DB 원본은 supabase/limited-coupon.sql, 원격 migration 이름은 limited_coupon_inventory
- Edge 코드 변경 시 supabase/functions/limited-coupon/index.ts와 handler.mjs를 함께 배포
- 기존 프로젝트의 서버 내장 키만 사용하므로 Vercel에 비밀키를 추가하거나 브라우저 코드에 키를 저장하지 않음
- 프런트 배포 후 /api/limited-coupon GET, 쿠키 속성과 재방문 동일성, 8개 페이지의 응답 및 새 캐시 버전을 검증
