# 2026-10-03 상품별 영상 및 POINT 검수

## 반영 사항

- SOLO 신랑 1인 소스: assets/video/groom-wedding-song-ar.mp4
- DUET 두 사람 소스: assets/video/duo-wedding-song-ar.mp4
- 인원 변경 시 기존 재생 정지, 영상 소스·대표 사진·설명과 기존 가격/시간/문의 경로 동기화, 새 영상 자동 재생 없음
- AR POINT 01~05, 스토리 POINT 01~04, 가사 영상 +40,000원 별도 보존
- 스토리의 중복 보컬 헤더 삭제 및 영상에 담길 목소리 중심 제목·문구
- 제작 폴더 원형 화살표, 세 번만 진행하는 화면 진입 효과, 감소 모션에서는 정적 표시

## 실제 브라우저 프레임

| 프레임 폭 | 실제 콘텐츠 폭 | 경로 | 가로 넘침 | 검사한 제목·POINT·시간·폴더 잘림 |
| --- | --- | --- | --- | --- |
| 306 | 276 | SOLO / DUET / 스토리 | 0 | 0 |
| 320 | 290 | SOLO / DUET / 스토리 | 0 | 0 |
| 390 | 360 | SOLO / DUET / 스토리 | 0 | 0 |
| 768 | 738 | SOLO / DUET / 스토리 | 0 | 0 |
| 1440 | 1410 | SOLO / DUET / 스토리 | 0 | 0 |

각 화면 H1 한 개, AR POINT 01→02→03→04→05, 스토리 POINT 01→02→03→04 확인
모바일·태블릿 번호 18px, PC 번호 22px
실제 휴대폰 Safari 검수가 아닌 브라우저 프레임 검수이며 30px 스크롤바 예약을 포함함

## 기능 검수

- 직접 탭에서 SOLO·DUET 각각 paused=false·currentSrc 일치·영상 폭 406px 확인
- DUET 선택 후 160,000원과 두 사람 대표 사진, SOLO 복귀 후 120,000원 및 1인 대표 사진, 변경 직후 paused=true 확인
- AR 보컬 재생·전후 선택·정지와 POINT 03 보존
- AR 비율 70→69% 및 실제 재생/정지 컨트롤 확인
- 스토리 보컬 실제 재생·정지, POINT 03과 스토리 전용 제목 확인
- 폴더 클릭/Enter 열기·접기, 닫힘 애니메이션 종료 후 open=false, 여덟 사진 정상 로딩
- 화면 진입 is-cue-visible, 화면 밖 effect pause 및 observer 정리는 직접 실행 회귀 시험
- OS 감소 설정에서 새 화살표 animationName=none, 일반 효과의 프레임 변화는 이번 환경에서 직접 확인하지 않음
- 직접 검수 탭 오류·경고 없음

## 증빙

- tests/qa/ar-solo-video-mobile-20261003.jpg
- tests/qa/ar-duet-video-mobile-20261003.jpg
- tests/qa/story-point-03-mobile-20261003.jpg
- tests/qa/story-point-04-folder-mobile-20261003.jpg

## 검사 및 범위

17개 직접 실행 회귀 시험, js/app.js·js/site-motion.js 구문 검사, git diff --check
독립 Edge 프로세스 기반 desktop-layout 검사는 기존 환경 제한으로 이번에는 사용하지 않고 실제 브라우저 프레임으로 확인함
기존 문의 통합·혜택·판매 종료 규칙과 추적 소스 보존, 가격 변경·원격 푸시·운영 배포 없음
로컬: http://127.0.0.1:4174/detail/duet-film
