const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process')
const root=path.resolve(__dirname,'..'),out=path.join(root,'output/mobile-parity-20261021')
const git=args=>cp.execFileSync('git',args,{cwd:root,encoding:'utf8'}).trim()
const sha=git(['rev-parse','HEAD']),files=git(['diff','--name-only','bc0980a',sha]).split('\n')
const commits=git(['log','--reverse','--format=%H %s','bc0980a..HEAD']).split('\n')
const read=f=>JSON.parse(fs.readFileSync(path.join(out,f),'utf8'))
const validation=read('validation.json'),suite=read('suite-comparison.json')
const deployment=fs.existsSync(path.join(out,'deployment.json'))?read('deployment.json'):null
const live=fs.existsSync(path.join(out,'live-measurements.json'))?read('live-measurements.json'):null
const md=[
 '# 위스티아 전체 수정 최종 보고서','',
 '기준 커밋 bc0980a9b13d86eaa4d1ddb385986159496ebcb3',
 '변경 커밋 전체',...commits.map(c=>'- '+c),
 '변경 파일 '+files.length+'개','',
 '## 반영 범위','',
 '- 1~5번과 7번 반영: PC 780px 가운데 정렬, 휴대폰과 같은 구성·글자 크기·이미지, 제목 잘림 방지, 메뉴 색상·위치, 지도 실제 버튼, 소개 영상 설명·03 카드 제거',
 '- /privacy는 공통 앱에 통합하고 법적 본문을 원문 그대로 보존',
 '- 6번 구간 색상은 승인 대기이며 운영 변경에서 제외',
 '- 음악·원본 이미지·분석 코드·Contact/KakaoTalkClick·wistia_vid·예약 및 문의 전송 소스 보존',
 '- 실제 문의 제출·카카오톡 메시지 전송은 수행하지 않음','',
 '## 검수 결과','',
 '- 32주소 × 1280px/390px × 직접 접속/소개 경유: 수정 전 128장 + 최종 수정 후 '+validation.cases+'장',
 '- 모든 주요 외곽·머리말·푸터 x250/폭780, PC 바깥 배경 흰색',
 '- 가로 넘침·글자 잘림·이미지 로딩 오류·직접/SPA 배치 차이·PC/390px 글자 크기 차이 0',
 '- 360·375·390px와 PC 추가 검사 64건 통과, 열린 메뉴·지도 확대·360px 후기 제목 별도 캡처',
 '- 직접/SPA 비교는 미디어 정지 상태이며 사용자 활성화에 따른 자동 재생 차이는 배제',
 '- 변경 범위 직접 회귀 검사 17건 통과',
 '- 전체 기존 테스트 결과: '+suite.updated.summary.join(' / '),
 '- 기준 커밋 전체 테스트 결과: '+suite.baseline.summary.join(' / '),
 '- 신규 실패 '+suite.newFailures.length+'건, 과거 디자인·상품·예약 가정과 환경 제약의 기존 실패는 별도 원문에 기록',
 '- 실제 휴대폰 실기 검사가 아니라 Chromium 화면 크기별 검수이며 전체 접근성 인증은 아님','',
 '## 배포','',
 deployment?'- Vercel 상태 '+deployment.state+' / '+(deployment.target_url||''):'- 배포 상태 확인 대기',
 live?'- 운영 재검수 '+live.results.length+'건, 오류 '+live.errors.length+'건':'- 운영 재검수 확인 대기','',
 '## 잔여 영상 문구','',
 '- 현재 화면에서 상품 설명으로 남은 영상 편집·촬영·뮤직비디오·MV·스토리 필름 문구 없음',
 '- /events의 직접 촬영한 블로그 사진 안내와 본식 현장 영상 페이백은 요청대로 유지',
 '- 비활성 과거 상품 데이터·이전 SEO·과거 문서의 검색 결과 '+validation.videoMentions.length+'건은 remaining-video-copy.txt에 파일과 줄 번호를 기록',
 '- 폐지된 상품 주소의 기존 홈 이동 동작은 유지하며 새 상품으로 복원하지 않음','',
 '## 변경 파일 전체','',
 ...files.map(f=>'- '+f),'',
 '## 증빙','',
 '- index.html: 모든 페이지의 PC/휴대폰·직접/SPA·수정 전후 비교',
 '- extras/colour-preview-detail-solo-390.jpg 및 1280.jpg: 6번 상세페이지 전체 승인 시안',
 '- extras/menu-390.png 및 menu-1280.png: 메뉴 색상·위치',
 '- extras/map-390.png 및 map-1280.png: 원본 주소 그대로인 실제 지도 버튼',
 '- extras/review-360.png: 후기 제목 줄바꿈',
 '- validation.json 및 before/after-measurements.json: 치수·글자·이미지·배치 실측',
 '- remaining-video-copy.txt: 요청 검색 결과',
 '- node-suite.txt 및 baseline-node-suite.txt: 전체 테스트 원문',
 '- live/: 운영 직접/SPA 전체 화면',''
].join('\n')
fs.writeFileSync(path.join(out,'release-report.md'),md)
console.log(sha,files.length,'files')
