# 선착순 쿠폰 운영

- 캠페인: limited-20261028, 전체 발급 총 20장, 같은 브라우저는 마지막 수령부터 7일 뒤 잔여 재고가 있을 때 다시 받을 수 있음
- 재수령은 실제로 쿠폰 받기를 누를 때 한 장을 추가 차감하며, 7일 경과나 24시간 만료만으로 자동 발급하거나 재고를 늘리지 않음
- 기존 20,000원, DELUXE·PREMIUM·DUET, 2026년 11·12월 방문 조건과 2027-01-01 00:00 KST 종료 유지
- 상세·문의 양식에만 발급 카드 표시, 이벤트와 기본 할인 목록에서는 제외
- 기존 yearEndCoupon 필드는 저장 호환용으로 유지하지만 과거 로컬 선택은 발급 증명이 아니므로 이월하지 않음
- 문의양식은 마지막 저장부터 24시간 보존, 선착순 쿠폰은 서버의 최초 수령 시각부터 24시간만 사용 가능
- 수령 뒤 하단 안내띠형 타이머를 표시하며 새로고침·페이지 이동·문의양식 수정으로 사용 기한을 연장하지 않음
- 24시간 만료 시 할인 적용과 체크를 해제하며 안내띠에 만료 상태를 표시, 수령 후 7일 전까지는 받기 완료 버튼과 쿠폰을 받았어요 문구를 유지
- 7일 전에는 중복 발급을 차단하며, 7일 후 재수령하면 그 시각부터 새로 24시간을 사용할 수 있고 다음 재수령은 다시 7일 뒤 가능
- 최초 created_at은 보존하고 재수령 시 last_issued_at만 갱신하며, 현재 사용 기한과 다음 수령 시각은 coalesce(last_issued_at,created_at)을 기준으로 계산
- 타이머 표시·재조회·자동 만료 이벤트만으로는 문의양식의 마지막 저장 시각을 갱신하지 않음
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
- 첫 이용 금액·GA4·메타 픽셀·문의 전송 경로는 변경하지 않음, 브라우저 쿠폰 선택 저장 기간은 24시간으로 맞춤

## 검증

- tests/limited-coupon-server.test.mjs: 서명, 위조 차단, 장애 처리, 서버 쿠키와 교차 사이트 POST 차단
- tests/limited-coupon-live-inventory.mjs: 별도 limited-20261028-qa 캠페인에 60건 병렬 요청으로 20개 브라우저만 발급, 이 테스트는 QA 재고 초기화 후 한 번 실행하는 통합 검사
- tests/limited-coupon-browser.cjs: 응답 fixture로 320·360·375·390·414·780·1280px 레이아웃과 발급·재조회·문의·상품·방문일·소진·장애 검증
- 운영 검수에서는 실제 발급 POST를 하지 않아 운영 20장을 소진하지 않음
- tests/limited-coupon-expiry.test.mjs와 tests/coupon-24h-browser.cjs로 24시간 경계·새로고침·오프라인·만료 할인 해제·초안 기한 비연장·잔여 18장 보존 확인
- tests/limited-coupon-reclaim.test.mjs와 tests/coupon-reclaim-browser.cjs로 정확한 7일 전후, 재수령 버튼 해제, 새 24시간, 한 장만 추가 차감, 재조회·품절 차단 확인
- RLS 정책 없음 INFO는 service_role 전용 테이블의 의도된 public 접근 차단 상태이며 권한 확인으로 anon 접근이 불가능함을 검증

## 배포

- DB 원본은 supabase/limited-coupon.sql, 원격 migration 이름은 limited_coupon_inventory
- 24시간 만료 RPC 업그레이드는 supabase/limited-coupon-expiry.sql, 원격 migration 이름은 coupon_receipt_fixed_24h_expiry, 기존 발급 created_at과 issued 값은 수정하지 않음
- 최신 7일 재수령 업그레이드는 supabase/limited-coupon-reclaim.sql, 원격 migration 이름은 limited_coupon_reclaim_after_seven_days, 과거 24시간 전용 RPC 정의를 대체
- Edge 코드 변경 시 supabase/functions/limited-coupon/index.ts와 handler.mjs를 함께 배포
- 기존 프로젝트의 서버 내장 키만 사용하므로 Vercel에 비밀키를 추가하거나 브라우저 코드에 키를 저장하지 않음
- 프런트 배포 후 /api/limited-coupon GET, 쿠키 속성과 재방문 동일성, 8개 페이지의 응답 및 새 캐시 버전을 검증
