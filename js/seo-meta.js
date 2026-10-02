// Shared by the browser router and the static HTML generator
const WISTIA_SEO = {
 home: {title:"위스티아 | 경기도 부천 웨딩 축가 전문 스튜디오",description:"경기도 부천의 웨딩 축가 전문 스튜디오 위스티아(WISTIA), AR 축가 사전녹음과 축가 스토리 필름으로 본식에서 전할 노래를 함께 준비합니다"},
 detail: {
  solo:{title:"AR 축가 SOLO(1인) · 1시간 12만원 | 위스티아",description:"1곡 기준 SOLO 1인·1시간 12만원, 보컬 디렉팅·수작업 음정·박자 보정·믹싱·마스터링으로 본식용 AR과 완성 음원을 준비합니다"},
  duo:{title:"AR 축가 DUET(2인) · 2시간 16만원 | 위스티아",description:"1곡 기준 DUET 2인·2시간 16만원, 두 분의 파트와 목소리를 디렉팅하고 수작업 보정·믹싱·마스터링으로 본식용 AR과 완성 음원을 준비합니다"},
  "solo-film":{title:"축가 메이킹필름 | 내 목소리 본식 상영 · 위스티아",description:"라이브 부담 없이 내 목소리로 전하는 축가. 녹음 메이킹필름과 완성 음원을 본식 축가 순서에 바로 상영하세요. 위스티아."},
  wedding:{title:"식전 스토리 필름 | 우리 목소리 웨딩영상 · 위스티아",description:"사진·가사만의 식전이 아쉽다면. 인터뷰·편지·우리 노래가 흐르는 듀엣 식전 스토리 필름을 위스티아에서 완성하세요."},
  "duet-film":{title:"축가 스토리 필름 | 우리 목소리 본식 상영 · 위스티아",description:"우리의 목소리와 이야기를 담아 하객들도 함께 즐기는 축가 영상으로 완성합니다, 경기도 부천 위스티아의 축가 스토리 필름"},
  proposal:{title:"프로포즈 영상 | 노래로 전하는 고백 · 위스티아",description:"직접 부른 노래와 추억·편지로 완성하는 프로포즈·답프로포즈 영상. 위스티아에서 세상에 하나뿐인 고백을 준비하세요."}
 },
 noindex:{
  "/contact":{title:"문의 양식 | 위스티아",description:"희망 서비스와 예식일, 예약일, 방문 가능한 시간을 작성하고 카카오톡으로 위스티아에 문의하세요"},
  "/before-after":{title:"보컬 보정 전후 비교 | 위스티아",description:"위스티아의 같은 녹음본으로 보정 전과 후의 목소리를 비교해 들을 수 있습니다."},
  "/song":{title:"노래 녹음 선택 | 위스티아",description:"위스티아 사전 녹음 상품을 고르는 보조 화면입니다."},
  "/film":{title:"영상 선택 | 위스티아",description:"위스티아 축가 영상 상품을 고르는 보조 화면입니다."},
  "/ar/self":{title:"AR 녹음 안내 | 위스티아",description:"위스티아 AR 축가 사전 녹음 안내 화면입니다."},
  "/ar/friend":{title:"AR 녹음 안내 | 위스티아",description:"위스티아 AR 축가 사전 녹음 안내 화면입니다."}
 },
 event:{title:"얼마일까 | 위스티아 사전녹음·영상 가격 계산",description:"상품별 예상 가격을 바로 확인하세요. AR 축가 사전녹음과 녹음 메이킹 필름의 위스티아 이벤트 가격 계산과 카카오 상담."},
 location:{title:"오시는 길 | 경기도 부천 위스티아",description:"위스티아는 경기도 부천시 석천로170번길 19, 2층에 있습니다. 부천시청역 1번 출구에서 도보 약 300m입니다."}
};
if(typeof window!=="undefined")window.WISTIA_SEO=WISTIA_SEO;
if(typeof module!=="undefined")module.exports=WISTIA_SEO;
