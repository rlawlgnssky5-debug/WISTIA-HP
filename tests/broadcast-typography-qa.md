# 방송 타이포와 인원 안내 검수

2026-10-04, 사용자 코멘트 네 항목과 운영 배포 요청

## 변경 범위

- 사운드 전문가의 사람 사진을 싱어게인2·불후의 명곡 타이틀을 담은 인물 없는 타이포 일러스트로 교체
- 공통 전문가 카드의 사운드 번호만 제거, 영상 연출 번호와 기존 방송 음악 작업 참여 문구 보존
- 지정된 SOLO/DUET 시간 비교 문단의 추가 설명만 제거, 곡수·시간·가격 보존
- 앞서 완료한 모바일 기준 PC 통일과 홈 입체 카드 변경을 함께 배포
- 가격, 할인/페이백, 옵션, 상담 흐름 변경 없음

## 이미지 제작

- 도구: 내장 imagegen
- 방식: 두 타이틀 참조 이미지 기반 합성/새 일러스트 생성, transparent_background=false
- 결과: `assets/img/ar-detail/broadcast-typography-v1.png`, 1536×1024px
- 인물·얼굴·손·실제 스튜디오 사진 없음, 미리보기에서 직접 시각 확인
- 프로그램 타이틀을 참고한 그래픽이며 공식 제휴나 승인 표시를 추가하지 않음
- 로컬 참조 파일은 제작 참고용이며 사이트 자산으로 사용하지 않음

참조 출처:

- 싱어게인2 타이틀 디자인 제작사: https://vbstudio.kr/main/?bmode=view&idx=8915549
- 위 제작사 공개 포스터: https://cdn.imweb.me/upload/S201810295bd6b89ce709f/ccd9723830714.jpg
- 불후의 명곡 방송 이미지 보도: https://sports.khan.co.kr/article/201606071206003
- 위 기사 타이틀 이미지: https://images.khan.co.kr/article/2016/06/07/l_2016060702000262200065161.jpg
- 프로그램명 확인: https://tv.jtbc.co.kr/singagain2?site_preference=normal 및 https://news.kbs.co.kr/news/pc/view/view.do?ncd=8202387

### 최종 제작 프롬프트

```text
Use case: compositing / ads-marketing. Create a finished premium typography illustration banner for a Korean wedding recording studio website, wide landscape 3:2 composition. Input 1 is supporting reference for the authentic 싱어게인2 title lettering and striped A mark only; Input 2 is supporting reference for the authentic 불후의 명곡 title lettering only. Extract/recreate and place these two program title graphics side by side as the main subjects on a clean very pale silver-blue studio background. Preserve their readable original Korean program titles. 싱어게인2 in charcoal silver with a restrained deep red A accent on the left, 불후의 명곡 in muted metallic gold and dark navy on the right. Keep the logos optically balanced and generously spaced, both fully inside the canvas. Add a subtle illustrated sound-wave line and brushed metal relief to connect the two title graphics, elegant typographic art with tasteful real depth and soft studio shadows. Exact small secondary text centered beneath the two titles: '방송 음악 작업 참여'. No other copy, no additional company logo, no partnership or official endorsement labels, no dates, no schedules, no cast names, no photos, no people, no faces, no silhouettes, no recording engineer, no human hands. Do not paste the entire reference posters or their backgrounds. This is a person-free drawn graphic, not a room photograph or webpage mockup. All Korean text must be correct and legible at mobile size.
```

## 검수 및 배포

- 실제 인앱 브라우저 SOLO·DUET·스토리 × 320·390·1022·1440px 12개 조합에서 이미지 로딩, contain 전체 표시, 사운드 번호 없음, 루트/검사한 텍스트 가로 넘침 0 확인
- SOLO/DUET 인원 선택에는 곡수·시간·가격만 표시, 요청한 추가 설명 없음
- 로컬 증빙: `qa/broadcast-typography-local-pc-20261004.png`, `qa/broadcast-typography-local-mobile-20261004.png`
- 직접 실행 회귀 시험 25개 통과, 앱 JS 구문·Git 차이 검사 및 정적 HTML 23개 재생성 통과
- 앱/공통 상세 CSS 캐시: `20261004-broadcast-type-1`
- 실제 휴대폰 실기 테스트 및 외부 카카오톡 전송 없음
- 앱 외 연락 양식·빠른 견적 JS 구문 검사도 통과

## 운영 배포 완료

- 커밋: `db177a02716b177243958bb08b92018710cbbb59`, 기존 main 정상 푸시, 강제 푸시/배포 설정 변경 없음
- GitHub Vercel 상태: `success`, `Deployment has completed`
- 배포 기록: https://vercel.com/wistia1/wistia/R5zBGoyt8caUT7AsFzqMmunDVwFL
- 운영 주소: https://www.wistiastudio.com/detail/solo
- 홈·SOLO·DUET·스토리·문의·오시는 길·새 이미지 HTTP 200, 새 앱/공통 상세 CSS 캐시 확인
- 공개 앱 소스의 새 이미지 포함, 이전 사운드 번호 없음, 지정된 DUET 추가 설명 없음, 공통 상세 렌더러 적용 확인
- 실제 공개 브라우저 세 상품 × 320·390·1022px 9개 조합: 공통 구성/새 이미지 로딩/전체 표시 정상, 사운드 번호 없음, 루트/검사한 텍스트 가로 넘침 0
- 공개 홈 320·1022px: 두 상품 카드의 1px 테두리·입체 단차 그림자·확정 슬로건 확인, 루트 가로 넘침 0
- 공개 SOLO 영상 재생 중 1022→390px 변경 후 일시정지 없이 2.99153→3.150393초 진행 확인, FAQ 첫 항목 펼침 정상
- 공개 직접 상세 탭 오류·경고 0, 외부 카카오톡 전송 없음
- 공개 증빙: `qa/broadcast-typography-production-pc-20261004.png`, `qa/broadcast-typography-production-mobile-20261004.png`
- 배포 후 기록/증빙은 로컬에 보관, 운영 소스는 위 커밋과 일치
