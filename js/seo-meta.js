// Shared by the browser router and the static HTML generator
const WISTIA_SEO = {
 home: {title:"위스티아 | 경기도 부천 웨딩 축가 전문 스튜디오",description:"경기도 부천의 웨딩 축가 전문 스튜디오 위스티아(WISTIA), AR 축가 사전녹음으로 본식에서 전할 노래를 함께 준비합니다"},
 detail: {
  solo:{title:"AR 축가 SOLO(1인) | 위스티아",description:"셀프 축가, 목소리는 미리 준비하세요. 1:1 보컬 디렉팅·수작업 음정·박자 보정·믹싱·마스터링으로 본식용 AR과 완성 음원을 준비합니다"},
  duo:{title:"AR 축가 DUET(2인) | 위스티아",description:"둘이 함께 부르는 셀프 축가, 목소리는 미리 준비하세요. 두 분의 파트와 목소리를 디렉팅하고 수작업 보정·믹싱·마스터링으로 본식용 AR과 완성 음원을 준비합니다"}
 },
 noindex:{
  "/contact":{title:"상담 신청 | 위스티아",description:"상품 선택부터 예식일과 방문 일정 작성까지 한 번에 준비하고 카카오톡으로 위스티아에 문의하세요"}
 },
 event:{title:"상담 신청 · 상품과 일정 선택 | 위스티아",description:"상품과 일정, 필요한 옵션과 이벤트 혜택을 한 양식에서 선택하세요. 예상 가격과 문의 내용을 복사해 카카오톡으로 상담할 수 있습니다"},
 location:{title:"오시는 길 | 경기도 부천 위스티아",description:"위스티아는 경기도 부천시 석천로170번길 19, 2층에 있습니다. 부천시청역 1번 출구에서 도보 약 300m입니다."}
};
if(typeof window!=="undefined")window.WISTIA_SEO=WISTIA_SEO;
if(typeof module!=="undefined")module.exports=WISTIA_SEO;
