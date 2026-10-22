// Shared by the browser router and the static HTML generator
const WISTIA_SEO = {
 home: {title:"위스티아 | 경기도 부천 웨딩 축가 전문 스튜디오",description:"부천 위스티아 AR 축가 사전녹음 · A 9만원, B 13만원, C 17만원 · 녹음 시간과 보컬 튜닝을 필요한 구성으로 선택하세요"},
 detail: {
  solo:{title:"AR 축가 1인 · A·B·C 패키지 | 위스티아",description:"1인·1곡 기준 A 90,000원, B 130,000원, C 170,000원 · 1:1 디렉팅과 기본 믹싱 · 보컬 튜닝과 녹음 시간을 필요한 구성으로 선택하세요"},
  duo:{title:"AR 축가 듀엣 · A·B·C 패키지 | 위스티아",description:"선택한 패키지에 30,000원을 추가해 2인·1곡 듀엣으로 변경하세요 · A·B는 1시간, C는 2시간 · 필요한 옵션을 함께 선택할 수 있어요"}
 },
 noindex:{
  "/contact":{title:"상담 신청 | 위스티아",description:"상품 선택부터 예식일과 방문 일정 작성까지 한 번에 준비하고 카카오톡으로 위스티아에 문의하세요"}
 },
 event:{title:"상담 신청 · 상품과 일정 선택 | 위스티아",description:"상품과 일정, 필요한 옵션과 이벤트 혜택을 한 양식에서 선택하세요. 예상 가격과 문의 내용을 복사해 카카오톡으로 상담할 수 있습니다"},
 location:{title:"오시는 길 | 경기도 부천 위스티아",description:"위스티아는 경기도 부천시 석천로170번길 19, 2층에 있습니다. 부천시청역 1번 출구에서 도보 약 300m입니다."}
};
if(typeof window!=="undefined")window.WISTIA_SEO=WISTIA_SEO;
if(typeof module!=="undefined")module.exports=WISTIA_SEO;
