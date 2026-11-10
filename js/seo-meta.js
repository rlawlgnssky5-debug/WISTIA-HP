// Shared by the browser router and the static HTML generator
const WISTIA_SEO = {
 home: {title:"부천·인천 축가 AR · 축가 녹음 · 셀프 축가 | 위스티아",description:"부천·인천 축가 AR 녹음 스튜디오 위스티아 · 셀프 축가를 위한 축가 AR(AR 축가) 사전 녹음, 한 구간씩 1:1 맞춤 디렉팅과 자연스러운 보컬 보정, 30·50·70·100% 모든 비율 제공 · 부천시청역 1번 출구 도보 약 300m (인천·시흥·김포 인근)"},
 detail: {
  solo:{title:"축가 AR 사전 녹음 · 50분·1시간 30분·2시간 30분 | 위스티아",description:"1곡 기준 녹음 50분·1시간 30분·2시간 30분 · 한 구간씩 1:1 맞춤 디렉팅, 티 나지 않는 자연스러운 보컬 보정 · 30·50·70·100% 모든 비율 제공"},
  duo:{title:"듀엣 축가 AR · 2인 1곡 | 위스티아",description:"인원에서 2인 (듀엣곡)을 선택하면 2인 1곡으로 준비해요 · 1인 기준 구성에 40,000원 추가 · 녹음 시간은 50분·1시간 30분·2시간 30분 중 선택"}
 },
 noindex:{
  "/contact":{title:"축가 AR 녹음 문의 양식 | 부천·인천 위스티아",description:"축가 AR 녹음 문의 · 인원·녹음 시간·음원 작업, 녹음 날짜와 시작 시간을 3단계로 고르면 예상 금액과 문의 내용을 카카오톡으로 바로 보낼 수 있어요"}
 },
 event:{title:"축가 AR 예약 문의 · 축가 녹음 가격 확인 | 부천 위스티아",description:"부천·인천 축가 AR 사전 녹음 예약 문의 · 인원·녹음 시간·음원 작업, 녹음 날짜와 시작 시간을 3단계로 고르면 예상 금액과 문의 내용을 카카오톡으로 바로 보낼 수 있어요 · 50분 50,000원부터"},
 location:{title:"오시는 길 · 부천시청역 1번 출구 축가 AR 녹음 스튜디오 | 위스티아",description:"위스티아는 경기도 부천시 석천로170번길 19, 부광프라자 2층에 있어요 · 부천시청역 1번 출구에서 도보 약 300m, 바로 옆 공영주차장(유료) 이용 가능 · 인천·시흥·김포 인근 축가 AR 녹음"}
};
if(typeof window!=="undefined")window.WISTIA_SEO=WISTIA_SEO;
if(typeof module!=="undefined")module.exports=WISTIA_SEO;
