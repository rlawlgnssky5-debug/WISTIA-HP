// Shared by the browser router and the static HTML generator
const WISTIA_SEO = {
 home: {title:"위스티아 | 웨딩 사전 녹음·식전·프로포즈 영상",description:"위스티아(WISTIA) 부천 웨딩 보컬 스튜디오. 사전 녹음·식전필름·축가 메이킹·프로포즈 영상까지, 내 목소리로 남기는 특별한 순간."},
 detail: {
  solo:{title:"사전 녹음 1시간 | 본식 축가 AR · 위스티아",description:"떨리는 본식 축가를 미리 녹음하고 보컬 보정·믹싱까지. 위스티아 1시간 사전 녹음으로 안정적인 본식용 AR과 완성 음원을 준비하세요."},
  duo:{title:"사전 녹음 2시간 | 듀엣 축가 AR · 위스티아",description:"신랑신부·친구 듀엣 축가를 2시간 넉넉히 녹음. 파트·화음 디렉팅과 본식용 AR·완성 음원까지 위스티아에서 준비하세요."},
  "solo-film":{title:"축가 메이킹필름 | 내 목소리 본식 상영 · 위스티아",description:"라이브 부담 없이 내 목소리로 전하는 축가. 녹음 메이킹필름과 완성 음원을 본식 축가 순서에 바로 상영하세요. 위스티아."},
  wedding:{title:"식전 스토리 필름 | 우리 목소리 웨딩영상 · 위스티아",description:"사진·가사만의 식전이 아쉽다면. 인터뷰·편지·우리 노래가 흐르는 듀엣 식전 스토리 필름을 위스티아에서 완성하세요."},
  "duet-film":{title:"듀엣 축가 영상 | 우리 목소리 본식 상영 · 위스티아",description:"축가 섭외 대신 신랑신부가 함께 부른 노래로 축가 순서를 채웁니다. 라이브 부담 없이 상영하는 듀엣 축가 영상을 위스티아에서 완성하세요."},
  proposal:{title:"프로포즈 영상 | 노래로 전하는 고백 · 위스티아",description:"직접 부른 노래와 추억·편지로 완성하는 프로포즈·답프로포즈 영상. 위스티아에서 세상에 하나뿐인 고백을 준비하세요."}
 },
 noindex:{
  "/song":{title:"노래 녹음 선택 | 위스티아",description:"위스티아 사전 녹음 상품을 고르는 보조 화면입니다."},
  "/film":{title:"영상 선택 | 위스티아",description:"위스티아 축가 영상 상품을 고르는 보조 화면입니다."},
  "/ar/self":{title:"AR 녹음 안내 | 위스티아",description:"위스티아 AR 축가 사전 녹음 안내 화면입니다."},
  "/ar/friend":{title:"AR 녹음 안내 | 위스티아",description:"위스티아 AR 축가 사전 녹음 안내 화면입니다."}
 },
 event:{title:"얼마일까 | 위스티아 사전녹음·영상 가격 계산",description:"상품별 예상 가격을 바로 확인하세요. 사전 녹음·메이킹필름·식전·프로포즈까지 위스티아 이벤트 가격 계산과 카카오 상담."},
 location:{title:"오시는 길 | 경기도 부천 위스티아",description:"위스티아는 경기도 부천시 석천로170번길 19, 2층에 있습니다. 부천시청역 1번 출구에서 도보 약 300m입니다."}
};
if(typeof window!=="undefined")window.WISTIA_SEO=WISTIA_SEO;
if(typeof module!=="undefined")module.exports=WISTIA_SEO;
