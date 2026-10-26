// Shared by the browser router and the static HTML generator
const WISTIA_SEO = {
 home: {title:"부천 축가 녹음 · AR 축가 사전녹음 · 셀프 축가 | 위스티아",description:"부천 AR 축가 사전녹음 위스티아 · 한 구간씩 1:1 맞춤 디렉팅, 티 나지 않는 자연스러운 보컬 보정, 30·50·70·100% 모든 비율 제공 · 부천시청역 1번 출구"},
 detail: {
  solo:{title:"AR 축가 사전녹음 · STANDARD·DELUXE·PREMIUM·DUET | 위스티아",description:"1곡 기준 STANDARD·DELUXE·PREMIUM·DUET · 한 구간씩 1:1 맞춤 디렉팅, 티 나지 않는 자연스러운 보컬 보정 · 30·50·70·100% 모든 비율 제공"},
  duo:{title:"AR 축가 듀엣 · STANDARD·DELUXE·PREMIUM | 위스티아",description:"선택한 타입에 30,000원을 추가해 2인·1곡 듀엣으로 변경하세요 · STANDARD는 50분, DELUXE는 1시간 30분, PREMIUM은 2시간 30분 · 필요한 옵션을 함께 선택할 수 있어요"}
 },
 noindex:{
  "/contact":{title:"문의 양식 | 위스티아 AR 축가 사전녹음",description:"타입, 녹음 날짜와 시작 시간, 추가 옵션을 4단계로 고르면 예상 금액과 문의 내용을 카카오톡으로 바로 보낼 수 있어요"}
 },
 event:{title:"문의 양식 | 위스티아 AR 축가 사전녹음",description:"타입, 녹음 날짜와 시작 시간, 추가 옵션을 4단계로 고르면 예상 금액과 문의 내용을 카카오톡으로 바로 보낼 수 있어요"},
 location:{title:"오시는 길 | 경기도 부천 위스티아",description:"위스티아는 경기도 부천시 석천로170번길 19, 부광프라자 2층에 있어요 · 부천시청역 1번 출구에서 도보 약 300m"}
};
if(typeof window!=="undefined")window.WISTIA_SEO=WISTIA_SEO;
if(typeof module!=="undefined")module.exports=WISTIA_SEO;
