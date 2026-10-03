# 위스티아 브랜드·하단 버튼·방송 그래픽 재정리

2026-10-04, 첨부 네 이미지와 방송 그래픽 브라우저 코멘트 반영

## 적용

- 헤더의 외곽 48px/내부 72px 충돌이 실제 공개 화면에서 재현됨, 공통 헤더는 모바일 64px·PC 72px과 내부 100% 높이로 정합
- 로고 원본 유지, contain 전체 표시와 여백/색상 대비 보정, 브랜드 글자는 기존 serif 워드마크 방향으로 정리
- 상품 브랜드 링크의 인위적인 원형 테두리·굵은 sans 타이틀·문자 꺾쇠 제거, 원본 씰과 serif 타이틀/작은 설명/얇은 SVG 꺾쇠 사용
- 하단 빠른 견적·카카오톡 문의는 화이트/슬레이트 네이비 그라데이션과 4px 받침의 얕은 입체 버튼으로 변경, 눌림/초점/움직임 감소/팝업 가림 유지
- 방송 그래픽의 붉은색·금색·광택·빛 효과 제거, 실버/네이비의 조용한 3:1 그래픽으로 재제작, PC 최대 420×140px 및 AR 단일 패널 최대 560px
- 첨부 전문가 소개의 평평한 띠를 개별 카드로 구분, PC 구간 하단 여백 64→40px 및 다음 인용 구간 여백 정리, 기존 인물 사진과 경력/설명 보존
- PC/모바일 공통 구성·가격·혜택·옵션·음원/영상 재생·상담 기능은 보존

## 이미지 제작

- 내장 imagegen, 기존 방송 이미지의 스타일 편집, transparent_background=false
- 최종 자산: `assets/img/ar-detail/broadcast-typography-wistia-v2.png`, 2172×724px
- 이전 자산은 삭제하지 않고 보존
- 프로그램명과 인물 없음 보존, 새 공식 제휴/승인 주장 없음
- 기존 참조 출처는 `broadcast-typography-qa.md`에 기록

### 최종 프롬프트

```text
Use case: style-transfer. Edit target: the supplied broadcast typography illustration. Redesign it as a compact, restrained graphic for WISTIA, a Korean wedding vocal and film studio with a quiet silver-white and slate-navy identity. Wide 3:1 banner composition, intended display width only 420px on desktop. Retain only the two legible Korean program titles, exact text '싱어게인2' and '불후의 명곡', balanced side by side, all lettering inside safe margins. Preserve recognizability of their title letter shapes but unify them in matte slate navy #354f62 with a very fine satin-silver edge and shallow embossed relief, not thick extrusion. Put a thin pale vertical separator between them. Clean nearly white #f7f9fb background, even diffuse light, subtle tiny grounded shadows, restrained editorial identity card. Remove the red accent, gold, black chrome, glossy mirror floor, gold wave, sparkles, rays, mist, glowing particles, cinematic effects and all decorative flourishes. Remove the bottom caption entirely; there must be no other text except the two program names. No people, faces, hands, silhouettes or photographs. This is a simple person-free brand typography graphic, not a poster or website mockup. Keep negative space modest so the titles remain readable when displayed small. Do not add WISTIA text, new slogans, endorsement or official partnership claims.
```

## 검수

- 로컬 인앱 브라우저 SOLO·DUET·스토리 × 320·390·663·768·769·1022·1440px 21개 조합: 헤더 로고/문구 잘림 0, 루트 가로 넘침 0, 브랜드 문구 내부 넘침 0, H1 한 개, 새 그래픽 로딩/전체 표시, 양쪽 버튼 그림자 확인
- 이미지 실 표시 AR 320px 222×74px, 390px 292×97px, PC 420×140px
- 전문가 소개 320·390·663·1022·1440px: 카드 세 개 보존, 루트 및 검사한 제목/본문 넘침 0
- 홈·문의 × 320·1022px: 공통 헤더 잘림 0, 루트 가로 넘침 0
- 빠른 견적 열기 및 메뉴 열기에서 하단 버튼 숨김, 닫기 정상
- DUET 문의 연결: 단일 form, 2인·2시간·16만원 선택 유지, 외부 카카오톡 전송 없음
- 실제 휴대폰 실기 테스트는 아님
- 직접 실행 회귀 시험 26개, 앱 JS 구문 검사와 정적 HTML 23개 재생성 통과
- 캐시: 앱과 새 브랜드 CSS의 `20261004-brand-polish-1`
- 로컬 증빙: `qa/brand-polish-intro-mobile-20261004.png`, `qa/brand-polish-intro-pc-20261004.png`, `qa/brand-polish-expert-pc-20261004.png`, `qa/brand-polish-specialists-pc-20261004.png`

## 운영 배포

- 디자인 변경 커밋 `bd83ac1fb06d1dd508c2ba71cd6c00b17347a05b`를 main에 정상 푸시, Vercel success 및 Deployment has completed 확인
- 배포 주소: https://vercel.com/wistia1/wistia/DvE7xKF1xaagtfe4cAzhhjde7H7s
- 홈·세 상품·DUET 문의·새 CSS·새 이미지 HTTP 200, HTML 새 캐시 반영 확인
- 운영 `/info/about`의 직접 방문 404를 발견, 상품 브랜드 링크로 이동하는 화면을 직접 새로고침해도 열도록 정적 HTML 생성 경로 추가, 재생성 24개 및 회귀 검사 통과
- 경로 보완 배포와 공개 브라우저 검수 결과는 완료 후 추가
