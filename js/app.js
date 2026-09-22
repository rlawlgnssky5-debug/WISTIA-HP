const KAKAO_FALLBACK = "http://pf.kakao.com/_GbExjX/chat"

const PRODUCTS = {
  solo: {
    key: "solo", category: "song", kicker: "SOLO WEDDING SONG", title: "1인 축가 녹음",
    sub: "미리 완성한 목소리를 AR로 함께 틀어 본식에서는 더 안정적으로, 녹음한 노래는 오래도록 남깁니다",
    normal: 120000,
    resultVideo: "assets/video/groom-wedding-song-ar.mp4",
    oneLine: "떨리는 축가를 미리 준비하고 본식에서는 더 안정적으로",
    useCases: ["결혼하는 당사자가 직접 부르는 축가", "친구의 결혼식에서 불러주는 축가"],
    highlights: [
      ["본식에 맞춘 AR", "미리 녹음한 목소리의 비율을 조절해 현장에서 함께 부를 수 있도록 준비합니다"],
      ["긴장되는 순간도 안정적으로", "메이크업과 예식 진행으로 긴장되는 순간에도 완성된 음원이 목소리를 자연스럽게 받쳐줍니다"],
      ["한 번 녹음하고 오래도록", "완성된 음원은 본식 이후에도 간직하고 다른 축가 자리에서도 다시 사용할 수 있습니다"]
    ],
    audiences: ["본식에서 직접 축가를 부르고 싶은 신랑·신부", "친구의 결혼식에서 실수 없이 마음을 전하고 싶은 분", "한 번 녹음한 축가를 오래 간직하고 싶은 분"],
    expertise: [["1대1 보컬 디렉팅", "처음 녹음하는 분도 한 구간씩 편하게 부를 수 있도록 안내합니다"], ["자연스러운 보컬 보정", "원래 목소리는 살리고 음정과 박자만 필요한 만큼 다듬습니다"], ["본식 현장에 맞춘 제작", "예식장 재생 환경과 실제 축가 상황을 고려해 완성합니다"]],
    concerns: [
      ["노래를 잘 못해도 괜찮을까요", "1대1 디렉팅과 수작업 보정으로 원래 목소리를 살려 자연스럽게 완성합니다"],
      ["본식에서 긴장할 것 같아요", "미리 완성된 음원을 준비해 당일에는 더 안정적으로 마음을 전할 수 있습니다"],
      ["어떤 키가 맞는지 모르겠어요", "음역을 확인하고 가장 편하게 부를 수 있는 키를 함께 정합니다"]
    ],
    steps: [
      ["맞춤 제작 상담 · 곡과 키 확인", "예식 분위기와 음역을 확인해 곡·키·본식에서 사용할 AR 방향을 함께 정합니다", "assets/img/process/consultation.webp"],
      ["스튜디오 방문 · 녹음 준비", "예약한 날짜에 위스티아 스튜디오를 방문해 마이크와 헤드폰을 맞추고 편안하게 녹음을 준비합니다", "assets/img/ar-process/self/01-recording.webp"],
      ["1:1 보컬 디렉팅 & 구간별 녹음", "엔지니어가 호흡·발음·감정 표현을 안내하며 한 소절씩 나누어 녹음합니다", "assets/img/process/vocal-directing.webp"],
      ["AR 속 내 목소리 비율 선택", "스튜디오에서 리허설과 AR 연습 방법을 안내해 드리며, 실제 노래 방식에 맞춰 1:1 맞춤 비율을 결정합니다", "assets/img/ar-process/self/03-ratio-casual.webp"],
      ["멜로다인 수작업 보컬 보정", "원래 목소리의 느낌은 살리면서 음정·박자·호흡을 한 음씩 세밀하게 다듬습니다", "assets/img/process/melodyne-tuning.webp"],
      ["전문 엔지니어 믹싱 & AR 제작", "보컬과 반주의 밸런스를 맞춰 예식장에서 바로 재생할 수 있는 AR 음원으로 완성합니다", "assets/img/ar-process/02-mixing.webp"],
      ["최종 검수 & 완성본 전달", "본식에서 바로 사용할 수 있도록 전체 음원을 검수한 뒤 전달합니다", {duration:"약 7일",note:"녹음 완료 후 일정 확정"}]
    ],
    included: ["녹음 및 1대1 디렉팅", "음정 · 박자 보정", "믹싱 · 마스터링", "최종 음원 전달"],
    faq: [
      ["AR 음원은 어떻게 사용하나요", "미리 녹음한 목소리가 포함된 AR을 예식장에서 재생하고 현장에서는 그 음원에 맞춰 함께 부릅니다"],
      ["내 목소리 비율은 어떻게 정하나요", "스튜디오에서 리허설과 AR 연습 방법을 안내해 드리며, 실제 노래 방식에 맞춰 1:1 맞춤 비율을 결정합니다"],
      ["어떤 파일을 받나요", "예식장에서 사용할 본식용 AR과 보컬 보정·믹싱·마스터링을 마친 완성 음원을 전달합니다"]
    ]
  },
  duo: {
    key: "duo", category: "song", kicker: "DUET WEDDING SONG", title: "2인 축가",
    sub: "두 사람의 음역과 파트, 화음을 맞춰 자연스럽고 안정적인 듀엣 축가 음원으로 완성합니다",
    normal: 160000,
    resultVideo: "assets/video/duo-wedding-song-ar.mp4",
    oneLine: "두 사람의 목소리를 미리 맞추고 본식에서는 더 편안하게",
    useCases: ["신랑신부가 함께 부르는 축가", "두 친구가 함께 준비하는 축가"],
    highlights: [
      ["두 목소리에 맞춘 AR", "파트와 화음을 정리한 완성 음원을 현장에 맞는 비율로 틀어 더욱 안정적으로 부를 수 있습니다"],
      ["본식 현장에 맞춘 사운드", "예식장 재생 환경을 고려한 믹싱과 자연스러운 마스터링으로 준비합니다"],
      ["다시 꺼내 듣는 듀엣", "예식이 끝난 뒤에도 두 사람이 함께 부른 노래는 온전한 음원으로 남습니다"]
    ],
    audiences: ["신랑신부가 함께 축가를 부르고 싶은 두 분", "파트와 화음을 안정적으로 맞추고 싶은 두 분", "함께 부른 노래를 완성 음원으로 남기고 싶은 두 분"],
    expertise: [["두 사람을 위한 디렉팅", "서로 다른 음역에 맞춰 파트와 화음을 편하게 정리합니다"], ["두 목소리의 자연스러운 조화", "각자의 목소리는 살리면서 한 곡 안에서 자연스럽게 어우러지도록 보정합니다"], ["본식 현장에 맞춘 제작", "예식장에서 안정적으로 들릴 수 있도록 믹싱과 마스터링을 진행합니다"]],
    concerns: [
      ["둘의 음역이 달라요", "파트와 키를 나눠 두 분 모두 편하게 부를 수 있도록 구성합니다"],
      ["화음을 넣고 싶은데 어려워요", "필요한 구간의 화음과 파트 구성을 함께 정리합니다"],
      ["둘 다 녹음이 처음이에요", "파트별로 나눠 천천히 녹음한 뒤 두 목소리를 자연스럽게 합칩니다"]
    ],
    steps: [
      ["맞춤 제작 상담 · 곡과 파트 확인", "두 분의 음역과 예식 분위기를 확인해 곡·키·파트·화음 구성을 함께 정합니다", "assets/img/process/consultation.webp"],
      ["스튜디오 방문 · 듀엣 녹음 준비", "두 분의 마이크와 헤드폰을 맞추고 각자 부를 파트와 함께 부를 구간을 확인합니다", "assets/img/duet-film/duet-recording.webp"],
      ["1:1 보컬 디렉팅 & 구간별 녹음", "각자의 파트를 한 소절씩 녹음하고 두 목소리의 호흡과 타이밍을 맞춥니다", "assets/img/process/vocal-directing.webp"],
      ["AR 속 목소리 비율 선택", "30% · 50% · 70% · 100%를 실제 음원으로 비교해 두 분이 함께 부르기 편한 비율을 선택합니다", "assets/img/ar-process/self/03-ratio-casual.webp"],
      ["멜로다인 수작업 보컬 보정", "각자의 음색은 살리면서 음정·박자·화음과 함께 부르는 구간의 타이밍을 세밀하게 다듬습니다", "assets/img/process/melodyne-tuning.webp"],
      ["전문 엔지니어 믹싱 & 듀엣 AR 제작", "두 보컬과 반주의 밸런스를 맞춰 예식장에서 바로 재생할 수 있는 AR로 완성합니다", "assets/img/ar-process/02-mixing.webp"],
      ["최종 검수 & 완성본 전달", "본식에서 바로 사용할 수 있도록 두 보컬과 전체 음원을 검수한 뒤 전달합니다", {duration:"약 7일",note:"녹음 완료 후 일정 확정"}]
    ],
    included: ["두 사람 녹음 및 디렉팅", "파트 · 화음 구성", "음정 · 박자 보정", "믹싱 · 마스터링", "최종 음원 전달"],
    faq: [
      ["파트와 화음도 구성해 주나요", "곡과 두 분의 음역에 맞춰 함께 부를 부분과 나눠 부를 부분, 필요한 화음을 구성합니다"],
      ["두 사람의 목소리 비율은 어떻게 정하나요", "30% · 50% · 70% · 100% 음원을 비교해 두 분이 본식에서 함께 부르기 편한 비율을 선택합니다"],
      ["어떤 파일을 받나요", "예식장에서 사용할 듀엣 AR과 두 보컬의 믹싱·마스터링을 마친 완성 음원을 전달합니다"]
    ]
  },
  wedding: {
    key: "wedding", category: "wedding", kicker: "DUET WEDDING FILM", title: "듀엣 식전 영상",
    sub: "직접 부른 노래와 두 분의 이야기를 원하는 영상 구성에 맞춰 한 편의 웨딩 필름으로 완성합니다",
    normal: 350000,
    videoUrl: "https://www.youtube.com/embed/5ZuTmQWCRJk?rel=0",
    inlineVideo: true,
    oneLine: "우리의 이야기와 목소리로 하객에게 건네는 첫인사",
    useCases: ["식전 영상", "식중 영상", "신랑신부가 준비한 듀엣 축가 영상"],
    highlights: [
      ["노래가 아닌 이야기가 흐르는 영상", "사진과 가사만 이어지는 영상이 아니라 하객 메시지부터 인터뷰, 뮤직비디오 클립과 편지까지 두 분만의 서사를 담습니다"],
      ["축가 섭외 없이도 특별하게", "축가 순서에 영상을 상영해 신랑신부가 직접 준비한 특별한 축가로 소개할 수 있습니다"],
      ["영상이 끝난 뒤에도 남는 목소리", "두 분이 직접 부른 노래는 별도의 완성 음원으로 남아 언제든 다시 들을 수 있습니다"]
    ],
    audiences: ["사진과 가사만 나오는 평범한 식전영상이 아쉬운 두 분", "두 사람의 이야기와 목소리를 함께 남기고 싶은 두 분", "축가 섭외 없이 축가 시간을 특별하게 채우고 싶은 두 분", "예식이 끝난 뒤에도 꺼내 볼 영상을 원하는 두 분"],
    expertise: [["1대1 보컬 디렉팅", "처음 녹음하는 두 분도 편하게 부를 수 있도록 파트별로 안내합니다"], ["자연스러운 보컬 보정", "두 분의 원래 목소리는 살리고 음정과 박자를 섬세하게 다듬습니다"], ["웨딩에 맞춘 스토리 구성", "식전·식중 또는 축가 순서에 맞춰 이야기의 흐름을 설계합니다"], ["녹음부터 영상까지 한 번에", "음원 제작과 인터뷰·촬영·영상 편집을 하나의 과정으로 진행합니다"]],
    concerns: [
      ["둘 다 노래에 자신이 없어요", "파트 구성과 1대1 디렉팅, 보컬 보정으로 안정감 있게 완성합니다"],
      ["둘만의 특별한 추억을 남기고 싶어요", "두 사람의 목소리와 이야기를 한 편의 영상으로 담습니다"],
      ["직접 부르기에는 부담스러워요", "미리 녹음하고 제작한 영상으로 예식에서 편안하게 상영할 수 있습니다"],
      ["너무 오글거릴까 걱정돼요", "담백한 무드부터 감성적인 연출까지 두 분에게 맞게 조절합니다"]
    ],
    steps: [
      ["맞춤 제작 상담", "두 분에게 맞는 곡·키·파트 구성과 식전 상영 시점까지 함께 설계합니다"],
      ["1:1 보컬 디렉팅 & 구간별 녹음", "한 번에 잘 부를 필요 없이 각자의 파트를 한 소절씩 세분화해 녹음하고, 두 분의 목소리가 자연스럽게 어우러지도록 디렉팅합니다"],
      ["스토리 영상 촬영", "인터뷰, 전하는 편지, 뮤비 클립, 인서트, 녹음 메이킹 등 두 분의 이야기가 자연스럽게 담기도록 촬영합니다"],
      ["디테일 수작업 보컬 보정", "AI 자동 보정 없이 각자의 목소리와 감정은 살리면서 음정·박자·호흡·화음과 타이밍까지 세밀하게 작업합니다"],
      ["전문 엔지니어 믹싱 & 마스터링", "실제 앨범 발매 음원을 작업하는 전문 엔지니어가 두 보컬의 밸런스와 반주를 조율해 최종 사운드를 완성합니다"],
      ["영상 편집 & 색감 보정", "가사와 두 분의 감정선에 맞춰 장면의 흐름을 구성하고, 컷 편집부터 색감·싱크·자막까지 세밀하게 완성합니다"],
      ["최종 검수 & 완성본 전달", "음원과 영상의 흐름, 싱크, 색감까지 전체를 최종 검수한 뒤 전달합니다 · 기본 제작 기간 약 14일"]
    ],
    composition: [
      ["하객 메시지", "두 분의 새로운 시작을 함께해 주신 하객에게 감사의 인사를 전합니다", "assets/img/wedding/01-guest-message.png"],
      ["두 사람의 인터뷰", "처음 만난 순간과 함께하며 달라진 점처럼 두 분만이 들려줄 수 있는 이야기를 담습니다", "assets/img/wedding/02-interview.png"],
      ["립싱크 뮤직비디오", "직접 완성한 노래에 맞춰 두 분이 함께 부르는 모습을 한 편의 뮤직비디오처럼 구성합니다", "assets/img/wedding/03-lipsync-mv.png"],
      ["녹음 메이킹 영상", "서로의 목소리를 맞추고 노래를 완성해 가는 자연스러운 녹음 과정을 보여드립니다", "assets/img/wedding/04-recording-making.png"],
      ["우리 둘의 사진", "처음 만난 날부터 결혼을 준비하는 지금까지 두 분의 추억을 완성된 노래와 함께 보여드립니다", "assets/img/wedding/05-couple-memories.png"],
      ["서로에게 전하는 편지", "영상의 마지막에는 노래만으로 다 전하지 못한 진심을 서로의 목소리로 남깁니다", ["assets/img/wedding/06-letter.webp", "assets/img/wedding/06-letter-groom.webp"]]
    ],
    included: ["녹음 및 1대1 디렉팅", "커플 인터뷰", "외부 스튜디오 촬영", "음정 · 박자 보정", "믹싱 · 마스터링", "영상 편집", "예식장 상영용 최종본 전달"],
    faq: [
      ["뮤직 비디오 필름과 녹음 메이킹 필름은 무엇이 다른가요", "뮤직 비디오 필름은 하객 메시지·인터뷰·뮤비 클립·편지를 담고, 녹음 메이킹 필름은 인서트 컷과 실제 녹음 과정, 인트로·아웃트로 문구를 중심으로 구성합니다"],
      ["녹음과 촬영은 같은 날 진행되나요", "선택한 영상 구성과 예약 상황을 확인한 뒤 두 분에게 맞는 녹음·촬영 일정을 상담에서 안내합니다"],
      ["준비해야 할 사진이나 문구가 있나요", "선택한 구성에 필요한 사진과 인트로·아웃트로 문구, 영상에 담을 메시지는 상담 후 목록으로 안내합니다"],
      ["완성까지 얼마나 걸리나요", "기본 제작 기간은 촬영과 자료 전달이 완료된 뒤 약 14일입니다"],
      ["예식장에서 바로 상영할 수 있는 파일로 받을 수 있나요", "가능합니다 예식장에서 바로 재생할 수 있는 상영용 영상과 완성 음원을 전달합니다"]
    ]
  },
  "duet-film": {
    key: "duet-film", category: "wedding", kicker: "DUET WEDDING SONG FILM", title: "듀엣 축가 영상",
    sub: "축가 섭외 대신 신랑신부가 함께 부른 노래와 영상을 축가 순서에 상영할 수 있도록 완성합니다",
    normal: 350000,
    videoUrl: "https://www.youtube.com/embed/aSKrlQwmnHI?rel=0",
    inlineVideo: false,
    resultCopy: "두 분이 함께 부른 완성 음원과 축가 순서에 바로 상영할 수 있는 영상 파일로 전달합니다",
    oneLine: "무대에 서지 않아도 우리의 목소리로 완성하는 특별한 축가",
    useCases: ["본식 축가 순서", "신랑신부가 함께 준비하는 영상 축가"],
    highlights: [
      ["축가 섭외 없이 두 사람이 직접", "다른 사람의 축가가 아니라 신랑신부가 함께 부른 노래로 축가 시간을 채웁니다"],
      ["라이브 부담 없이 영상으로", "본식 현장에서 직접 부르지 않아도 완성된 노래와 영상으로 자연스럽게 상영할 수 있습니다"],
      ["예식이 끝난 뒤에도 남는 듀엣", "두 사람이 함께 부른 완성 음원과 영상은 본식 이후에도 오래 간직할 수 있습니다"]
    ],
    audiences: ["축가 섭외 대신 직접 준비한 축가를 들려주고 싶은 신랑신부", "본식에서 라이브로 부르는 것이 부담스러운 두 분", "함께 부른 노래와 영상을 오래 남기고 싶은 두 분"],
    expertise: [["두 사람을 위한 보컬 디렉팅", "서로 다른 음역에 맞춰 파트와 화음을 편하게 정리합니다"], ["자연스러운 듀엣 보정", "각자의 목소리는 살리면서 한 곡 안에서 자연스럽게 어우러지도록 다듬습니다"], ["축가 순서에 맞춘 영상 편집", "사회자 소개 직후 바로 상영할 수 있도록 본식 흐름에 맞춰 완성합니다"], ["음원과 영상을 한 번에", "듀엣 녹음부터 믹싱·마스터링과 영상 편집까지 하나의 과정으로 진행합니다"]],
    concerns: [
      ["축가를 따로 섭외하기 어려워요", "신랑신부가 직접 부른 노래와 영상으로 축가 시간을 완성할 수 있습니다"],
      ["본식에서 직접 부르기에는 부담스러워요", "미리 완성한 영상을 상영하므로 당일 라이브 부담을 덜 수 있습니다"],
      ["둘의 음역과 실력이 달라요", "파트와 키를 조정하고 필요한 부분을 보정해 두 목소리를 자연스럽게 맞춥니다"],
      ["축가 영상이 어색할까 걱정돼요", "녹음 장면과 립싱크 컷, 두 분의 추억을 노래 흐름에 맞춰 담백하게 구성합니다"]
    ],
    steps: [
      ["맞춤 제작 상담", "두 분의 음역과 목소리에 맞춰 곡·키·파트 구성과 예식에서 사용할 시점까지 함께 설계합니다"],
      ["1:1 보컬 디렉팅 & 구간별 녹음", "각자의 파트를 한 소절씩 세분화해 녹음하고, 함께 부르는 구간과 화음까지 자연스럽게 어우러지도록 디렉팅합니다"],
      ["축가 영상 촬영", "뮤비 클립, 인서트, 녹음 메이킹, 전하는 메시지 등 축가의 분위기와 두 분의 이야기에 맞춰 촬영합니다"],
      ["디테일 수작업 보컬 보정", "AI 자동 보정 없이 각자의 음색은 그대로 살리면서 음정·박자·호흡·화음과 두 보컬의 타이밍까지 세밀하게 작업합니다"],
      ["전문 엔지니어 믹싱 & 마스터링", "실제 앨범 발매 음원을 작업하는 전문 엔지니어가 두 사람의 목소리와 반주의 밸런스를 조율해 예식장에서도 선명하게 들리는 최종 사운드를 완성합니다"],
      ["영상 편집 & 색감 보정", "노래의 흐름과 가사에 맞춰 장면을 구성하고, 컷 편집부터 색감·싱크·자막까지 세밀하게 완성합니다"],
      ["최종 검수 & 완성본 전달", "음원과 영상의 밸런스, 싱크와 전체 흐름을 최종 검수한 뒤 전달합니다 · 기본 제작 기간 약 14일"]
    ],
    compositionTitle: "듀엣 축가 영상은 이렇게 구성됩니다",
    compositionDescription: "두 분의 이야기부터 함께 완성한 노래까지, 한 편의 축가 영상으로 자연스럽게 이어집니다",
    composition: [
      ["하객 메시지", "두 분의 새로운 시작을 함께해 주신 하객에게 감사의 인사를 전합니다", "assets/img/duet-film/duet-guest-message.webp"],
      ["두 사람의 인터뷰", "처음 만난 순간과 서로에게 어떤 사람이 되고 싶은지 두 분만의 이야기를 담습니다", "assets/img/duet-film/duet-interview.webp"],
      ["우리 둘의 사진과 영상", "처음 만난 날부터 지금까지 함께한 사진과 영상을 노래의 흐름에 맞춰 보여드립니다", "assets/img/duet-film/duet-memories.webp"],
      ["녹음 메이킹 필름", "서로의 목소리를 맞추고 노래를 완성해 가는 실제 녹음 과정을 담습니다", "assets/img/duet-film/duet-recording.webp"],
      ["노래 뮤비 클립", "직접 완성한 노래에 맞춰 두 분이 함께 부르는 모습을 뮤직비디오처럼 구성합니다", "assets/img/duet-film/duet-music-video.webp"],
      ["서로에게 전하는 편지", "영상의 마지막에는 노래만으로 다 전하지 못한 진심을 두 분의 목소리로 남깁니다", ["assets/img/duet-film/duet-letter-bride.webp", "assets/img/duet-film/duet-letter-groom.webp"]]
    ],
    included: ["두 사람 녹음 및 1대1 디렉팅", "파트 · 화음 구성", "음정 · 박자 보정", "믹싱 · 마스터링", "녹음 메이킹 및 립싱크 촬영", "영상 편집", "축가 상영용 최종본과 완성 음원 전달"],
    faq: [
      ["식전영상과 무엇이 다른가요", "식전영상은 하객 메시지와 인터뷰, 편지로 두 분의 이야기를 전하고 듀엣 축가 영상은 노래와 뮤직비디오를 중심으로 축가 순서에 상영합니다"],
      ["뮤직 비디오 필름과 녹음 메이킹 필름은 무엇이 다른가요", "뮤직 비디오 필름은 노래에 맞춘 촬영 장면을 중심으로, 녹음 메이킹 필름은 실제 녹음 과정과 인서트 컷을 중심으로 완성합니다"],
      ["어떤 파일을 받나요", "본식 축가 순서에 상영할 영상과 두 분이 함께 부른 완성 음원을 전달합니다"],
      ["완성까지 얼마나 걸리나요", "기본 제작 기간은 촬영과 자료 전달이 완료된 뒤 약 14일입니다"]
    ]
  },
  "solo-film": {
    key: "solo-film", category: "wedding", kicker: "SOLO WEDDING SONG FILM", title: "1인 축가 녹음 메이킹 필름",
    sub: "신랑 또는 신부 한 사람이 직접 부른 노래를 영상으로 완성해 본식 축가 순서에 상영합니다",
    normal: 220000,
    resultCopy: "한 사람이 직접 부른 완성 음원과 본식 축가 순서에 바로 상영할 수 있는 영상 파일로 전달합니다",
    oneLine: "직접 부르는 부담은 덜고 내 목소리로 전하는 축가",
    useCases: ["본식 축가 순서", "신랑이 신부에게 전하는 영상 축가", "신부가 신랑에게 전하는 영상 축가"],
    highlights: [
      ["상대에게 직접 전하는 한 곡", "축가 가수 대신 신랑 또는 신부가 직접 부른 목소리로 마음을 전합니다"],
      ["긴장되는 본식에는 영상으로", "메이크업과 예식 진행으로 여유가 없는 당일에는 완성된 영상만 편안하게 상영합니다"],
      ["한 번 부른 노래를 오래도록", "완성된 음원과 영상은 본식 이후에도 두고두고 다시 볼 수 있습니다"]
    ],
    audiences: ["본식에서 상대에게 직접 부른 축가를 전하고 싶은 분", "하객 앞에서 라이브로 부르는 것이 부담스러운 분", "노래와 영상으로 특별한 모습을 남기고 싶은 분"],
    expertise: [["1대1 보컬 디렉팅", "처음 녹음하는 분도 한 구간씩 편하게 부를 수 있도록 안내합니다"], ["자연스러운 보컬 보정", "본래 목소리와 감정은 살리고 음정과 박자만 필요한 만큼 다듬습니다"], ["축가 순서에 맞춘 영상 구성", "노래가 중심이 되도록 촬영 장면과 사진을 간결하게 편집합니다"], ["녹음부터 영상까지 한 번에", "완성 음원과 영상 상영본을 함께 준비합니다"]],
    concerns: [
      ["하객 앞에서 직접 부르기에는 떨려요", "본식 전에 녹음과 촬영을 마치고 당일에는 완성 영상을 상영할 수 있습니다"],
      ["노래를 잘 못해도 괜찮을까요", "1대1 디렉팅과 자연스러운 보정으로 본래 목소리를 살려 완성합니다"],
      ["영상이 프로포즈처럼 보일까 걱정돼요", "고백 중심의 프로포즈 영상과 달리 축가 곡과 본식 상영 흐름을 중심으로 구성합니다"],
      ["본식 일정이 바빠 준비가 걱정돼요", "녹음과 촬영, 편집을 한 번에 진행해 준비할 일을 줄여드립니다"]
    ],
    steps: [
      ["맞춤 제작 상담", "부르시는 분의 음역과 예식 분위기에 맞춰 곡·키·부르는 구간·상영 시점까지 함께 설계합니다"],
      ["1:1 보컬 디렉팅 & 구간별 녹음", "한 번에 잘 부를 필요 없이 한 소절씩 세분화해 호흡·발음·감정 표현까지 1:1 디렉팅합니다"],
      ["스토리 영상 촬영", "인터뷰, 전하는 편지, 뮤비 클립, 인서트, 녹음 메이킹 등 전하고 싶은 이야기에 맞춰 촬영합니다"],
      ["디테일 수작업 보컬 보정", "AI 자동 보정 없이 직접 듣고 원래의 목소리와 감정은 살리면서 음정·박자·호흡을 세밀하게 작업합니다"],
      ["전문 엔지니어 믹싱 & 마스터링", "실제 앨범 발매 음원을 작업하는 전문 엔지니어가 보컬과 반주의 밸런스부터 최종 사운드까지 완성합니다"],
      ["영상 편집 & 색감 보정", "가사와 감정선에 맞춘 컷 편집부터 색감·싱크·자막까지 세밀하게 완성합니다"],
      ["최종 검수 & 완성본 전달", "음원과 영상 전체를 최종 검수한 뒤 완성본을 전달합니다 · 기본 제작 기간 약 14일"]
    ],
    compositionTitle: "한 사람의 축가는 이렇게 완성됩니다",
    compositionDescription: "한 사람의 목소리와 상대에게 전하고 싶은 마음이 중심이 됩니다",
    composition: [
      ["녹음 메이킹 필름", "한 사람이 축가를 녹음하고 노래를 완성해 가는 실제 과정을 담습니다", "assets/img/solo-film/solo-film-cover-v2.webp"]
    ],
    included: ["솔로 녹음 및 1대1 디렉팅", "음정 · 박자 보정", "믹싱 · 마스터링", "녹음 메이킹 및 립싱크 촬영", "사진 자료 구성", "영상 편집", "축가 상영용 최종본과 완성 음원 전달"],
    faq: [
      ["프로포즈 영상과 무엇이 다른가요", "프로포즈 영상은 고백과 편지를 중심으로 구성하고 1인 축가 영상은 노래와 본식 상영을 중심으로 구성합니다"],
      ["뮤직 비디오 필름과 녹음 메이킹 필름은 무엇이 다른가요", "뮤직 비디오 필름은 노래에 맞춰 부르는 모습을 중심으로, 녹음 메이킹 필름은 실제 녹음 과정과 인서트 컷을 중심으로 완성합니다"],
      ["어떤 파일을 받나요", "본식 축가 순서에 상영할 영상과 보컬 보정·믹싱·마스터링을 마친 완성 음원을 전달합니다"],
      ["완성까지 얼마나 걸리나요", "기본 제작 기간은 촬영과 자료 전달이 완료된 뒤 약 14일입니다"]
    ]
  },
  proposal: {
    key: "proposal", category: "proposal", kicker: "PROPOSAL FILM", title: "프로포즈 / 답프로포즈",
    sub: "직접 부른 노래와 전하고 싶은 이야기를 뮤직 비디오 필름으로 완성합니다",
    normal: 200000,
    videoUrl: "https://www.youtube.com/embed/pTBfPEWlyZU?rel=0",
    inlineVideo: true,
    oneLine: "직접 부른 노래와 우리의 추억으로 마음을 전하는 프로포즈 영상",
    useCases: ["프로포즈", "답프로포즈", "결혼식 축가 영상"],
    highlights: [
      ["그날의 고백이 노래로 남도록", "그때 전하고 싶었던 이야기를 직접 부른 음원과 영상으로 오래 간직할 수 있습니다"],
      ["한 번의 녹음, 여러 번의 순간", "완성 음원은 프로포즈 이후에도 축가 영상이나 본식 라이브 축가에 다시 사용할 수 있습니다"],
      ["나중의 축가까지 미리 준비", "보컬이 포함된 AR 버전을 함께 준비하면 본식이나 친구의 결혼식에서도 더 안정적으로 부를 수 있습니다"]
    ],
    audiences: ["평범한 선물보다 직접 만든 고백을 전하고 싶은 분", "둘만의 사진과 이야기를 한 편의 영상으로 남기고 싶은 분", "프로포즈 때 부른 노래를 결혼식에서도 다시 사용하고 싶은 분"],
    expertise: [["1대1 보컬 디렉팅", "노래가 익숙하지 않아도 한 구간씩 편하게 녹음할 수 있도록 안내합니다"], ["자연스러운 보컬 보정", "전하고 싶은 감정은 살리면서 음정과 박자를 섬세하게 다듬습니다"], ["고백에 맞춘 스토리 구성", "두 분의 추억과 편지가 자연스럽게 이어지도록 구성합니다"], ["녹음부터 영상까지 한 번에", "완성 음원과 녹음 메이킹·사진·편지 영상을 함께 제작합니다"]],
    concerns: [
      ["노래를 잘 못해도 괜찮을까요", "1대1 디렉팅과 음정·박자 보정, 믹싱으로 자연스럽게 다듬습니다"],
      ["혼자 준비하는 것이 막막해요", "곡 선택부터 녹음과 촬영까지 필요한 모든 과정을 함께 안내합니다"],
      ["편지만으로는 부족한 것 같아요", "직접 부른 목소리와 영상으로 마음을 더 선명하게 전합니다"],
      ["프로포즈가 너무 평범할까 걱정돼요", "두 분만의 이야기로 세상에 하나뿐인 영상 선물을 완성합니다"]
    ],
    steps: [
      ["맞춤 제작 상담", "전하고 싶은 분위기와 사용할 곡, 촬영 방향과 프로포즈 상영 시점까지 함께 설계합니다"],
      ["1:1 보컬 디렉팅 & 구간별 녹음", "엔지니어가 곁에서 호흡과 발음, 감정 표현을 안내하며 한 소절씩 편하게 녹음합니다"],
      ["뮤비 클립 촬영", "인터뷰와 편지, 뮤비 클립 등 선택한 구성에 맞춰 이야기를 촬영합니다"],
      ["디테일 수작업 보컬 보정", "원래 목소리와 감정은 살리면서 음정·박자·호흡을 세밀하게 다듬습니다"],
      ["전문 엔지니어 믹싱 & 마스터링", "보컬과 반주의 밸런스를 조율해 고백의 감정이 선명하게 들리는 최종 사운드를 완성합니다"],
      ["영상 편집 & 색감 보정", "노래와 이야기의 흐름에 맞춰 컷 편집부터 색감·싱크·자막까지 세밀하게 완성합니다"],
      ["최종 검수 & 완성본 전달", "음원과 영상 전체를 최종 검수한 뒤 현장에서 바로 상영할 수 있는 완성본으로 전달합니다"]
    ],
    compositionTitle: "고백은 이렇게 완성됩니다",
    compositionDescription: "노래를 녹음하는 순간부터 마음을 전하는 장면까지 한 편의 영상으로 담습니다",
    composition: [
      ["녹음 준비", "한 사람만을 위한 노래를 준비하고 디렉팅을 받는 순간부터 담습니다", "assets/img/proposal/process-01.webp"],
      ["녹음 메이킹", "직접 노래를 부르고 완성해 가는 실제 녹음 과정을 촬영합니다", "assets/img/proposal/process-03.webp"],
      ["다양한 인서트 컷", "마이크와 손짓, 표정처럼 현장의 자연스러운 장면을 함께 담습니다", "assets/img/proposal/process-02.webp"],
      ["우리의 이야기", "보내주신 사진과 문구를 활용해 두 분의 이야기를 구성합니다", "assets/img/proposal/process-04.webp"],
      ["전하는 편지", "노래만으로 다 전하지 못한 마음을 영상의 마지막에 전합니다", "assets/img/proposal/process-05.webp"]
    ],
    included: ["녹음 1시간", "내부 스튜디오 촬영 1시간", "인터뷰 및 편지 촬영", "음정 · 박자 보정", "믹싱 · 마스터링", "영상 편집", "최종 필름 전달"],
    faq: [
      ["녹음 장면은 어떻게 촬영하나요", "직접 노래를 녹음하는 과정과 표정, 손짓, 마이크 등 자연스러운 인서트 장면을 함께 촬영합니다"],
      ["준비해야 할 사진이나 문구가 있나요", "두 분의 사진과 영상에 넣을 문구, 직접 전할 편지나 메시지는 선택한 구성에 맞춰 상담 후 안내합니다"],
      ["프로포즈 현장에서 바로 틀 수 있나요", "현장에서 바로 상영할 수 있는 영상 파일로 전달하며 사용 날짜가 정해져 있다면 상담에서 일정을 먼저 확인합니다"],
      ["완성까지 얼마나 걸리나요", "기본 제작 기간은 촬영과 자료 전달이 완료된 뒤 약 14일입니다"]
    ]
  }
}

const EVENTS = [
  { key: "blog", label: "블로그 리뷰", discount: 30000, detail: "일 방문자 100명 이상 · 안내 가이드에 따라 작성" },
  { key: "reaction", label: "현장 리액션 영상", discount: 10000, detail: "본식 현장 촬영 파일 제공" },
  { key: "cafe", label: "웨딩 카페 후기", discount: 10000, detail: "300자 이상 · 관련 사진 4장 이상" },
  { key: "instagram", label: "인스타그램 후기", discount: 10000, detail: "후기 50자 이상 · 사진 4장 이상 · BGM 추가 · 공식 계정 태그 · 공개 계정" }
]

const ACTUAL_REVIEW_IMAGES = Array.from({ length: 11 }, (_, index) => index===5?"assets/img/reviews/review-06-clean.webp":`assets/img/reviews/review-${String(index + 1).padStart(2, "0")}.png`)
const SOLO_REVIEW_IMAGES=[...Array.from({length:8},(_,index)=>`assets/img/reviews/showcase/review-${String(index+1).padStart(2,"0")}-black.webp`),...Array.from({length:3},(_,index)=>`assets/img/reviews/showcase/review-${String(index+9).padStart(2,"0")}-light.webp`)]

const DETAIL_STORIES = {
  wedding: [
    ["01 · WHY THIS FILM", "흔한 식전영상은 많지만<br><span>우리 목소리로 만든 이야기는 하나뿐</span>", "사진과 가사만 이어지는 영상이 아니라 하객의 축하와 두 사람의 인터뷰, 추억과 편지가 한 편의 이야기로 흐릅니다"],
    ["02 · AFTER THE DAY", "예식이 끝난 뒤에도<br><span>우리가 부른 노래는 남습니다</span>", "본식에서는 하객과 함께 보고 예식이 끝난 뒤에는 두 사람이 직접 부른 완성 음원과 영상으로 다시 꺼내볼 수 있습니다"]
  ],
  "duet-film": [
    ["01 · WHY THIS FILM", "축가 섭외 대신<br><span>두 사람이 직접 준비한 한 곡</span>", "신랑신부가 함께 부른 노래와 녹음 메이킹, 립싱크 장면을 하나의 뮤직비디오로 완성해 축가 순서에 상영합니다"],
    ["02 · ON THE DAY", "무대에 서지 않아도<br><span>우리 목소리로 채우는 축가 시간</span>", "사회자의 소개 뒤 완성 영상을 재생하면 두 분이 직접 부르지 않아도 하객에게 특별한 축가를 전할 수 있습니다"]
  ],
  "solo-film": [
    ["01 · WHY THIS FILM", "축가 가수 대신<br><span>내 목소리로 직접 전하는 한 곡</span>", "신랑 또는 신부가 직접 부른 노래와 촬영 장면을 영상으로 완성해 상대와 하객에게 전합니다"],
    ["02 · ON THE DAY", "긴장되는 본식에는 영상으로<br><span>마음은 내 목소리 그대로</span>", "당일에는 무대에 설 부담 없이 완성 영상을 상영하고 직접 부른 음원과 영상은 본식 이후에도 오래 간직할 수 있습니다"]
  ],
  proposal: [
    ["01 · WHY THIS FILM", "준비된 고백은 많지만<br><span>내 목소리로 전하는 마음은 하나뿐</span>", "직접 부른 노래와 두 사람의 추억, 마지막 편지를 하나의 흐름으로 엮어 오직 한 사람을 위한 고백을 만듭니다"],
    ["02 · AFTER THE DAY", "프로포즈가 끝난 뒤에도<br><span>그날의 마음은 노래로 남습니다</span>", "완성된 음원과 영상은 프로포즈 이후에도 간직하고 결혼식 축가 영상이나 라이브 축가에 다시 사용할 수 있습니다"]
  ],
  solo: [
    ["01 · WHY RECORD", "축가는 한 번뿐이기에<br><span>실수보다 마음에 집중할 수 있도록</span>", "본식 전에 내 목소리를 미리 녹음하고 필요한 만큼 보정해 현장에서 안정적으로 함께 부를 수 있는 AR을 만듭니다"],
    ["02 · AFTER THE DAY", "긴장은 줄이고<br><span>내 목소리는 오래 남깁니다</span>", "완성된 음원은 본식 이후에도 계속 간직하고 다른 소중한 축가 자리에서도 다시 사용할 수 있습니다"]
  ],
  duo: [
    ["01 · WHY RECORD", "서로 다른 두 목소리를<br><span>한 곡 안에서 자연스럽게</span>", "각자의 음역에 맞춰 파트와 화음을 정리하고 두 사람 모두 편하게 부를 수 있도록 녹음합니다"],
    ["02 · AFTER THE DAY", "본식에서는 더 편안하게<br><span>함께 부른 노래는 오래도록</span>", "미리 완성한 듀엣 음원이 현장의 목소리를 받쳐주고 예식이 끝난 뒤에도 두 사람의 노래로 남습니다"]
  ]
}

const AR_PURPOSES = {
  self: {
    kicker: "WEDDING SONG AR",
    title: "직접 축가를 부르고 싶은데 실수가 걱정돼요",
    productTitle: "미리 준비하는 축가 AR",
    lead: "떨리는 축가를 미리 준비하고 본식에서는 더 안정적으로",
    useCase: "신랑 또는 신부가 자신의 결혼식에서 직접 부르는 축가",
    items: [
      ["맞춤 제작 상담 · 곡과 키 확인", "예식 분위기와 음역을 확인해 곡·키·본식에서 사용할 AR 방향을 함께 정합니다", "assets/img/process/consultation.webp"],
      ["스튜디오 방문 · 녹음 준비", "예약한 날짜에 위스티아 스튜디오를 방문해 마이크와 헤드폰을 맞추고 편안하게 녹음을 준비합니다", "assets/img/ar-process/self/01-recording.webp"],
      ["1:1 보컬 디렉팅 & 구간별 녹음", "엔지니어가 호흡·발음·감정 표현을 안내하며 한 소절씩 나누어 녹음합니다", "assets/img/process/vocal-directing.webp"],
      ["AR 속 내 목소리 비율 선택", "30% · 50% · 70% · 100% 중 본식에서 가장 편안한 비율을 실제 음원으로 비교해 선택합니다", "assets/img/ar-process/self/03-ratio-casual.webp"],
      ["멜로다인 수작업 보컬 보정", "원래 목소리의 느낌은 살리면서 음정·박자·호흡을 한 음씩 세밀하게 다듬습니다", "assets/img/process/melodyne-tuning.webp"],
      ["전문 엔지니어 믹싱 & AR 제작", "보컬과 반주의 밸런스를 맞춰 예식장에서 바로 재생할 수 있는 AR 음원으로 완성합니다", "assets/img/ar-process/02-mixing.webp"],
      ["최종 검수 & 완성본 전달", "본식에서 바로 사용할 수 있도록 전체 음원을 검수한 뒤 전달합니다", {duration:"약 7일",note:"녹음 완료 후 일정 확정"}]
    ]
  },
  friend: {
    kicker: "WEDDING SONG AR",
    title: "지인의 결혼식에서 축가를 부르는데 떨려요",
    productTitle: "미리 준비하는 축가 AR",
    lead: "소중한 사람의 결혼식에서 실수 부담은 줄이고 마음은 그대로",
    useCase: "친구나 지인의 결혼식에서 직접 불러주는 축가",
    items: [
      ["맞춤 제작 상담 · 곡과 키 확인", "축가 분위기와 음역을 확인해 곡·키·현장에서 사용할 AR 방향을 함께 정합니다", "assets/img/process/consultation.webp"],
      ["스튜디오 방문 · 녹음 준비", "예약한 날짜에 스튜디오를 방문해 마이크와 헤드폰을 맞추고 편안하게 녹음을 준비합니다", "assets/img/ar-process/friend/01-female.webp"],
      ["1:1 보컬 디렉팅 & 구간별 녹음", "엔지니어가 호흡·발음·감정 표현을 안내하며 한 소절씩 나누어 녹음합니다", "assets/img/process/vocal-directing.webp"],
      ["AR 속 내 목소리 비율 선택", "30% · 50% · 70% · 100% 중 현장에서 가장 편안한 비율을 실제 음원으로 비교해 선택합니다", "assets/img/ar-process/friend/03-female.webp"],
      ["멜로다인 수작업 보컬 보정", "원래 목소리의 느낌은 살리면서 음정·박자·호흡을 한 음씩 세밀하게 다듬습니다", "assets/img/process/melodyne-tuning.webp"],
      ["전문 엔지니어 믹싱 & AR 제작", "보컬과 반주의 밸런스를 맞춰 예식장에서 바로 재생할 수 있는 AR 음원으로 완성합니다", "assets/img/ar-process/friend/02-female.webp"],
      ["최종 검수 & 완성본 전달", "예식장에서 바로 사용할 수 있도록 전체 음원을 검수한 뒤 전달합니다", {duration:"약 7일",note:"녹음 완료 후 일정 확정"}]
    ],
  }
}

const app = document.querySelector("#app")
const won = value => value.toLocaleString("ko-KR") + "원"
const shortWon = value => value === 0 ? "0원" : Number.isInteger(value / 10000) ? (value / 10000).toLocaleString("ko-KR") + "만원" : won(value)
const escapeHtml = value => String(value).replace(/[&<>'"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" })[c])
let config = {accounts:{kakao:KAKAO_FALLBACK}}
let selectedEvents = new Set()
let selectedOptions = new Set()
let optionQuantities = {}
let currentEventProduct = "wedding"
let currentEventPurpose = ""
let chosenOption = ""
let selectedFilmFormat = "live"
let voiceRatio = "70"
let ratioSwitchToken = 0
let consultationDraft = {source:"",name:"",eventDate:"",purpose:"",message:""}
let lastDialogFocus = null
let routeObserver
let reviewFrame
let reviewTarget=0
let reviewDisplay=0
let reviewLast=0
const dialog = document.querySelector("#mediaDialog")
const MENU = []
const NAVIGATION_GROUPS = [
 {label:"직접 부른다면",items:[
  {title:"AR 축가",note:"사전녹음",href:"#/detail/solo"},
  {title:"가사 영상 옵션",href:"#/event/solo/lyrics",kind:"option"}
 ]},
 {label:"영상으로 상영한다면",items:[
  {title:"녹음 메이킹 영상",href:"#/detail/solo-film"},
  {title:"스토리형 축가 영상",href:"#/detail/duet-film"}
 ]},
 {label:"뻔한 식전영상이 싫다면",items:[
  {title:"스토리형 식전 영상",href:"#/detail/wedding"}
 ]},
 {label:"프로포즈",items:[
  {title:"프로포즈 / 답프로포즈",href:"#/detail/proposal"}
 ]},
 {label:"위스티아",kind:"utility",items:[
  {title:"위스티아는 이런 곳입니다",href:"#/info/about"},
  {title:"위스티아가 드리는 약속",href:"#/info/promise"},
  {title:"이벤트",href:"#/event/solo"},
  {title:"QnA",href:"#/info/faq"}
 ]}
]
const INFO_PAGES = {
 about:{eyebrow:"ABOUT WISTIA",title:"노래와 장면으로\n마음을 오래 남기는 곳",description:"직접 부른 목소리와 그날의 이야기가 가장 자연스럽게 이어지도록, 녹음부터 영상 완성까지 함께합니다",points:["목소리를 먼저 듣는 1:1 제작","예식의 순간에 맞춘 음원과 영상","본식 뒤에도 꺼내 볼 수 있는 완성본"]},
 promise:{eyebrow:"WISTIA PROMISE",title:"위스티아가\n드리는 약속",description:"누구에게나 같은 방식보다, 부르는 사람과 전하고 싶은 마음에 맞는 과정을 함께 찾겠습니다",points:["필요한 과정과 결과물을 분명하게 안내합니다","목소리의 원래 느낌을 살려 세심하게 완성합니다","예식에서 바로 사용할 수 있는 완성본으로 전달합니다"]},
 faq:{eyebrow:"QnA",title:"자주 묻는\n질문",description:"상품을 고르기 전 가장 많이 궁금해하시는 내용을 모았습니다",faq:[
  ["AR 축가는 어떤 서비스인가요","본식 축가 시간에 직접 노래를 부르되, 미리 녹음하고 보정한 내 목소리를 함께 재생해 보다 편안하게 노래할 수 있도록 돕는 사전녹음 서비스입니다"],
  ["녹음 메이킹 영상과 스토리형 축가 영상은 무엇이 다른가요","녹음 메이킹 영상은 녹음 과정과 노래를 중심으로 완성하며, 스토리형 축가 영상은 하객 메시지와 인터뷰, 뮤비 클립 등을 더해 이야기의 흐름까지 담습니다"],
  ["스토리형 식전 영상은 무엇이 다른가요","사진과 익숙한 배경음악 대신, 두 분이 직접 부른 노래와 이야기를 담아 예식의 첫 장면을 시작하는 영상입니다"],
  ["프로포즈 필름도 직접 노래해야 하나요","직접 부른 노래를 중심으로 준비할 수 있으며, 전하고 싶은 이야기와 장면에 맞춰 상담에서 함께 방향을 정합니다"]
 ]}
}
const SERVICE_ORDER = ["wedding","duet-film","solo-film","solo","duo","proposal"]
const SERVICE_META = {
  wedding:{type:"OUR STORY",label:"식전 영상",use:"예식 시작 전",who:"신랑신부 두 사람",result:"이야기가 있는 영상 + 완성 음원",short:"우리의 이야기를 들려주는 식전 영상",image:"assets/img/wedding/02-interview.webp"},
  "duet-film":{type:"OUR DUET",label:"듀엣 축가 영상",use:"본식 축가 순서",who:"신랑신부 두 사람",result:"본식에서 바로 상영하는 듀엣 축가 영상 + 보컬 보정·믹싱을 마친 완성 음원",short:"우리 둘의 노래로 채우는 축가 시간",image:"assets/img/song-film/duet-video-cover.jpg"},
  "solo-film":{type:"A SONG FOR YOU",label:"1인 축가 녹음 메이킹 필름",use:"본식 축가 순서",who:"신랑 또는 신부 한 사람",result:"본식에서 바로 상영하는 1인 축가 영상 + 보컬 보정·믹싱을 마친 완성 음원",short:"한 사람이 직접 부른 노래를 영상으로",image:"assets/img/solo-film/solo-film-cover-v2.webp"},
  solo:{type:"YOUR VOICE, LIVE",label:"1인 축가 녹음",use:"현장에서 직접 노래",who:"한 사람",result:"보컬 비율별 AR + 완성 음원",short:"떨리는 순간, 내 목소리를 받쳐주는 AR",image:"assets/img/song/solo.webp"},
  duo:{type:"TWO VOICES, LIVE",label:"2인 축가",use:"현장에서 직접 노래",who:"두 사람",result:"듀엣 AR + 완성 음원",short:"두 목소리와 화음을 미리 맞추는 축가",image:"assets/img/song/duo.webp"},
  proposal:{type:"ONLY FOR YOU",label:"프로포즈 / 답프로포즈",use:"둘만의 고백 순간",who:"마음을 전하는 한 사람",result:"프로포즈 상영용 영상 + 보컬 보정·믹싱을 마친 완성 음원",short:"말로 다 전하지 못한 마음을 한 편의 영상으로",image:"assets/img/proposal-video-cover.jpg"}
}
const FILM_FORMAT_PRODUCTS = new Set(["wedding","duet-film","solo-film","proposal"])
const FILM_FORMATS = {
  live:{
    title:"뮤직 비디오 필름",
    summary:"뮤비 클립 · 다양한 인서트 컷 · 하객 메시지 · 인터뷰 · 전하는 편지",
    notes:[]
  },
  making:{
    title:"녹음 메이킹 필름",
    summary:"실제 녹음 장면을 중심으로 메이킹 클립과 다양한 인서트 컷 구성",
    notes:[
      "인터뷰와 전하는 편지 촬영은 기본 구성에서 제외됩니다",
      "인트로·아웃트로에 들어갈 문구를 작성해서 보내주시면 타이포 형태로 넣어드립니다",
      "하객 메시지나 서로에게 전하는 편지를 직접 집이나 방에서 촬영해 보내주시면 영상에 함께 넣어드릴 수 있습니다",
      "인터뷰 촬영은 진행되지 않습니다"
    ]
  }
}
const FILM_FORMAT_IMAGES = {
  wedding:{live:"assets/img/film-types/music-video-film-original.png",making:"assets/img/film-types/recording-making-film-original.png"},
  "duet-film":{live:"assets/img/film-types/music-video-film-original.png",making:"assets/img/film-types/recording-making-film-original.png"},
  "solo-film":{live:"assets/img/film-types/music-video-film-original.png",making:"assets/img/film-types/recording-making-film-original.png"},
  proposal:{live:"assets/img/film-types/music-video-film-original.png",making:"assets/img/film-types/recording-making-film-original.png"}
}
const FILM_PROCESS_IMAGES = {
  wedding:["assets/img/process/consultation.webp",["assets/img/film-types/recording-making-female.webp","assets/img/film-types/recording-making-male.webp"],"assets/img/film-types/music-video-film.webp","assets/img/process/melodyne-tuning.webp","assets/img/ar-process/02-mixing.webp","assets/img/process/video-color-grading.webp"],
  "duet-film":["assets/img/process/consultation.webp",["assets/img/film-types/recording-making-female.webp","assets/img/film-types/recording-making-male.webp"],"assets/img/film-types/music-video-film.webp","assets/img/process/melodyne-tuning.webp","assets/img/ar-process/02-mixing.webp","assets/img/process/video-color-grading.webp"],
  "solo-film":["assets/img/process/consultation.webp","assets/img/process/vocal-directing.webp","assets/img/solo-film/solo-film-cover-v2.webp","assets/img/process/melodyne-tuning.webp","assets/img/ar-process/02-mixing.webp","assets/img/process/video-color-grading.webp"],
  proposal:["assets/img/process/consultation.webp","assets/img/process/vocal-directing.webp","assets/img/proposal/process-02.webp","assets/img/process/melodyne-tuning.webp","assets/img/ar-process/02-mixing.webp","assets/img/process/video-color-grading.webp"]
}
const FILM_PRICE_IMAGES = {
  wedding:{making:["assets/img/film-types/recording-making-female.webp","assets/img/film-types/recording-making-male.webp"]},
  "duet-film":{making:["assets/img/film-types/recording-making-female.webp","assets/img/film-types/recording-making-male.webp"]}
}
const FILM_FORMAT_PRICES = {
  wedding:{live:350000,making:280000},
  "duet-film":{live:350000,making:280000},
  "solo-film":{live:290000,making:220000},
  proposal:{live:200000}
}
const BASE_FILM_FORMAT = {
  wedding:"making",
  "duet-film":"making",
  "solo-film":"making",
  proposal:"live"
}
const FILM_REVISION_NOTICE = {key:"extra-revision",label:"추가 수정 안내",detail:"기본 수정 3회까지 무료이며 4회차부터는 1회당 10,000원입니다",notice:true}
const PRODUCT_OPTIONS = {
  wedding:[
    {key:"entrance-ar",label:"신부/신랑 AR 입장곡",detail:"입장곡을 미리 녹음해 예식장에서 바로 재생할 수 있는 AR 음원으로 완성합니다",price:40000,quantity:true,unit:"명",priceUnit:"인당",max:2},
    {key:"rush",label:"3일 이내 빠른 작업",detail:"빠른 작업을 원하실 경우 선택해 주세요",price:30000},
    FILM_REVISION_NOTICE
  ],
  "duet-film":[
    {key:"entrance-ar",label:"신부/신랑 AR 입장곡",detail:"입장곡을 미리 녹음해 예식장에서 바로 재생할 수 있는 AR 음원으로 완성합니다",price:40000,quantity:true,unit:"명",priceUnit:"인당",max:2},
    {key:"extra-shoot",label:"추가 촬영",detail:"기본 구성 외 촬영이 필요한 경우 상담으로 확인합니다"},
    {key:"extra-material",label:"사진·영상 자료 추가 구성",detail:"보유 자료를 더 활용하고 싶을 때 선택합니다"},
    FILM_REVISION_NOTICE
  ],
  "solo-film":[
    {key:"entrance-ar",label:"신부/신랑 AR 입장곡",detail:"입장곡을 미리 녹음해 예식장에서 바로 재생할 수 있는 AR 음원으로 완성합니다",price:40000,quantity:true,unit:"명",priceUnit:"인당",max:2},
    FILM_REVISION_NOTICE
  ],
  proposal:[
    {key:"extra-scene",label:"고백 장면 추가 구성",detail:"원하는 고백 장면이나 별도의 스토리를 추가할 때 선택합니다"},
    {key:"extra-shoot",label:"추가 촬영 또는 장소 변경",detail:"기본 촬영 외 시간이나 장소가 필요한 경우 상담으로 확인합니다"},
    FILM_REVISION_NOTICE
  ]
}
const FRIEND_PRODUCT_OPTIONS = [
]
const SONG_OPTIONS = [
 {key:"lyrics",label:"가사 영상",detail:"완성한 축가와 두 분의 사진을 활용해 예식장에서 바로 재생할 가사 영상을 제작합니다",price:40000,image:"assets/img/song-options/lyric-video-v2.webp"},
 {key:"lyrics-making",label:"가사 영상 + 녹음 메이킹 필름",detail:"가사 영상에 실제 녹음 장면을 담은 메이킹 필름까지 함께 제작합니다",price:null,image:"assets/img/song-options/recording-making-v2.webp"}
]
const WORKS = [
 {id:"wedding-film",category:"식전 영상",product:"wedding",title:"두 사람의 목소리로 시작하는 결혼식",description:"하객에게 전하는 인사부터 서로에게 쓴 편지까지",image:"assets/img/wedding/03-lipsync-mv.webp",video:PRODUCTS.wedding.videoUrl},
 {id:"duet-film",category:"축가 영상",product:"duet-film",title:"위스티아 듀엣 웨딩 필름",description:"두 사람이 함께 부른 노래로 완성한 본식 축가 영상",image:"assets/img/song-film/duet-video-cover.jpg",video:PRODUCTS["duet-film"].videoUrl},
 {id:"proposal-film",category:"프로포즈",product:"proposal",title:"위스티아 프로포즈 필름",description:"직접 부른 노래와 고백을 담은 프로포즈 영상",image:"assets/img/proposal-video-cover.jpg",video:PRODUCTS.proposal.videoUrl}
]
const GENERAL_FAQ = [
 ["노래를 잘 못해도 가능한가요","가능합니다 처음 녹음하는 분도 한 구간씩 편하게 부를 수 있도록 안내합니다 원래 목소리와 감정을 살리고 음정과 박자는 자연스럽게 다듬습니다"],
 ["식전 영상과 축가 영상은 어떻게 다른가요","식전 영상은 하객 메시지, 인터뷰와 편지로 두 사람의 이야기를 전합니다 축가 영상은 직접 부른 노래와 뮤직비디오를 중심으로 본식 축가 순서에 상영합니다"],
 ["AR은 무엇이고, 본식에서는 어떻게 사용하나요","AR은 미리 녹음한 목소리가 포함된 반주 음원입니다 예식장에서 AR을 틀고 그 위에 직접 노래합니다 목소리 비율과 재생 방법을 상담하고, 본식 전에 예식장 담당자와 음향 리허설을 확인해 주세요"],
 ["곡이나 키를 아직 정하지 못했어요","괜찮습니다 원하는 분위기와 음역을 확인해 곡과 편하게 부를 수 있는 키를 함께 정합니다"],
 ["녹음 시간과 영상 제작 기간은 얼마나 걸리나요","상품과 촬영 구성, 일정에 따라 달라집니다 예식일 또는 영상 사용 예정일을 알려주시면 가능한 일정과 소요 시간을 안내합니다"],
 ["수정은 몇 번 가능한가요","수정 범위와 횟수는 선택한 상품과 제작 구성에 따라 상담 시 안내합니다 꼭 넣고 싶은 장면이나 문구는 제작 전에 함께 정리해 주세요"],
 ["사진이 많이 없어도 가능한가요","보유한 사진과 영상의 양을 확인한 뒤 녹음 메이킹, 촬영 장면 등 활용 가능한 구성으로 상담합니다"],
 ["예식장에는 어떤 파일을 전달하나요","상영용 최종 영상 또는 AR 음원을 전달합니다 예식장의 지원 형식과 재생 환경을 먼저 확인해 알려주시면 준비에 도움이 됩니다"]
]
const PROCESS = [
 ["상담과 예약","사용 날짜와 어떤 순간을 준비하는지 알려주세요"],
 ["곡과 구성 결정","편한 키와 파트, 담고 싶은 이야기를 함께 정합니다"],
 ["스튜디오 녹음","한 구간씩 안내받으며 내 목소리를 남깁니다"],
 ["음원·영상 제작","보정과 믹싱, 상품에 맞는 촬영과 편집을 진행합니다"],
 ["완성본 확인","함께 정한 구성에 맞는지 확인하고 수정 사항을 협의합니다"],
 ["최종본 전달","예식장이나 고백 현장에서 사용할 파일을 전달합니다"]
]
const REVIEW_QUOTES = [
 {index:6,quote:"저희 둘 다 녹음 처음이라 너무 떨렸는데",body:"친절하게 디렉도 봐주시고 분위기도 풀어주셔서 너무너무 즐거웠어요",tag:"처음 녹음하는 두 분의 이야기"},
 {index:3,quote:"실수를 많이 한것 같아서 걱정했는데",body:"너무너무 만족스럽습니다! 그리고 영상이랑 노래가 너무 이뻐서 무한재생하게 되네요",tag:"완성된 노래와 영상을 받고"},
 {index:1,quote:"여자친구가 너무 좋아하네요",body:"예쁘게 잘 만들어주셔서 감사합니다",tag:"마음을 전한 뒤 보내주신 말"}
]
function kakao(){return config.accounts?.kakao || KAKAO_FALLBACK}
function img(src,alt,eager=false){return '<img src="'+escapeHtml(src)+'" alt="'+escapeHtml(alt)+'" loading="'+(eager?"eager":"lazy")+'" decoding="async"'+(eager?' fetchpriority="high"':"")+'>'}
function arrow(){return '<span aria-hidden="true">↗</span>'}
function label(text){return '<p class="eyebrow">'+text+'</p>'}
function heading(kicker,title,description=""){return '<div class="section-heading'+(kicker?"":" no-kicker")+'">'+(kicker?label(kicker):"")+'<div><h2>'+title+'</h2>'+(description?'<p>'+description+'</p>':"")+'</div></div>'}
function cta(text,href,style="dark"){return '<a class="button '+style+'" href="'+href+'">'+text+arrow()+'</a>'}
function external(text,url,cls="text-link"){return '<a class="'+cls+'" href="'+escapeHtml(url)+'" target="_blank" rel="noopener noreferrer">'+text+arrow()+'</a>'}
function priceBar(key,purpose=""){return '<div class="fixed-price"><div><a class="price-bar-action" href="#/event/'+key+(purpose?'/'+purpose:'')+'"><span><small>선택한 구성의 혜택까지</small><strong>이벤트 적용 가격 확인하기</strong></span><b aria-hidden="true">↗</b></a></div></div>'}
function faq(items){return '<div class="faq-list">'+items.map(([q,a])=>'<details><summary>'+q+'<span aria-hidden="true">+</span></summary><p>'+a+'</p></details>').join("")+'</div>'}
function packageItem(item){return ({
 "녹음 및 1대1 디렉팅":"1:1 레코딩 · 보컬 디렉팅",
 "두 사람 녹음 및 1대1 디렉팅":"2인 레코딩 · 보컬 디렉팅",
 "솔로 녹음 및 1대1 디렉팅":"솔로 레코딩 · 보컬 디렉팅",
 "두 사람 녹음 및 디렉팅":"2인 레코딩 · 보컬 디렉팅",
 "커플 인터뷰":"두 사람의 스토리 인터뷰",
 "외부 스튜디오 촬영":"협업 촬영 스튜디오 대여",
 "음정 · 박자 보정":"디테일 음정·박자 보정",
 "믹싱 · 마스터링":"보컬 믹싱 · 최종 마스터링",
 "영상 편집":"웨딩 필름 편집",
 "예식장 상영용 최종본 전달":"예식장 상영용 최종본",
 "축가 상영용 최종본과 완성 음원 전달":"축가 상영본 · 완성 음원",
 "최종 음원 전달":"본식용 AR · 완성 음원",
 "최종 필름 전달":"상영용 최종 필름"
 })[item]||item}
function footerIcon(type){const icons={instagram:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.6" cy="6.6" r="1" fill="currentColor" stroke="none"></circle></svg>',youtube:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.3 7.1a2.8 2.8 0 0 0-2-2C16.6 4.6 12 4.6 12 4.6s-4.6 0-6.3.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 3.2 12a29 29 0 0 0 .5 4.9 2.8 2.8 0 0 0 2 2c1.7.5 6.3.5 6.3.5s4.6 0 6.3-.5a2.8 2.8 0 0 0 2-2 29 29 0 0 0 .5-4.9 29 29 0 0 0-.5-4.9Z"></path><path d="m10 15.3 5.2-3.3L10 8.7v6.6Z" fill="currentColor" stroke="none"></path></svg>',kakao:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4C6.9 4 2.8 7.2 2.8 11.2c0 2.6 1.7 4.8 4.4 6.1L6.3 21l4.2-2.6 1.5.1c5.1 0 9.2-3.2 9.2-7.3S17.1 4 12 4Z"></path></svg>'};return icons[type]||''}
function footer(){const channels=[['instagram','Instagram',config.accounts?.instagram||'https://www.instagram.com/wistia.film/'],['youtube','YouTube',config.accounts?.youtube||'https://www.youtube.com/@wistia_film'],['kakao','Kakao 상담',kakao()]];return '<footer class="footer shell"><div class="footer-main"><a class="footer-brand" href="#/">'+img('assets/img/wistia-logo-transparent.webp','')+'<span><b>WISTIA</b><small>VOICE & FILM STUDIO</small></span></a><div class="footer-message"><strong>목소리와 장면을<br>오래 남을 작품으로.</strong><p>한 번뿐인 순간을 세심하게 듣고 기록합니다.</p></div><a class="footer-consult" href="'+escapeHtml(kakao())+'" target="_blank" rel="noopener noreferrer"><span>1:1 상담 시작하기</span><b aria-hidden="true">↗</b></a></div><div class="footer-divider" aria-hidden="true"></div><nav class="footer-social" aria-label="WISTIA 채널">'+channels.map(channel=>'<a href="'+escapeHtml(channel[2])+'" target="_blank" rel="noopener noreferrer" aria-label="'+channel[1]+' 열기"><i>'+footerIcon(channel[0])+'</i><span>'+channel[1]+'</span></a>').join('')+'</nav><div class="footer-bottom"><small>© '+new Date().getFullYear()+' WISTIA. All rights reserved.</small><span>VOICE · FILM · AUDIO</span></div></footer>'}
function serviceRows(keys){return keys.map((key,i)=>{let p=PRODUCTS[key],m=SERVICE_META[key];return '<a class="service-row" href="#/detail/'+key+'"><span class="index">'+String(i+1).padStart(2,"0")+'</span><div><h3>'+p.title+'</h3><p>'+m.short+'</p></div><span class="row-use">'+m.use+'</span>'+arrow()+'</a>'}).join("")}
function reviewCard(src,i,clone=false){return '<figure class="review-capture review-crop-'+String(i+1).padStart(2,"0")+'"'+(clone?' aria-hidden="true"':'')+'><span class="review-capture-image">'+img(src,"실제 고객 카카오톡 후기 "+(i+1))+'</span></figure>'}
function reviews(productKey=""){const cards=ACTUAL_REVIEW_IMAGES.map((src,i)=>reviewCard(src,i)).join("");const clones=ACTUAL_REVIEW_IMAGES.map((src,i)=>reviewCard(src,i,true)).join("");return '<section class="section reviews-section'+(productKey==="proposal"?' proposal-reviews':'')+'" id="reviews"><div class="shell"><div class="review-carousel-head">'+heading("","실제 고객 후기","직접 보내주신 카카오톡 후기 원문입니다")+'<div class="review-carousel-controls"><button type="button" data-review-prev aria-label="이전 후기">←</button><button type="button" data-review-next aria-label="다음 후기">→</button></div></div><div class="review-captures" id="reviewTrack" aria-label="실제 고객 후기가 자동으로 순환합니다"><div class="review-loop"><div class="review-set">'+cards+'</div><div class="review-set" aria-hidden="true">'+clones+'</div></div></div></div></section>'}
function soloReviewShowcase(){const total=SOLO_REVIEW_IMAGES.length;return '<section class="solo-review-showcase" id="reviews" data-review-showcase aria-labelledby="soloReviewTitle"><div class="solo-review-copy" data-solo-section-intro><span class="solo-review-kicker" data-solo-kicker>REVIEW</span><h2 id="soloReviewTitle" data-solo-title><span class="solo-type-line">실제 고객</span><span class="solo-type-line">후기</span></h2><span class="solo-review-rule" aria-hidden="true"></span><p data-solo-sub><span class="solo-type-line">위스티아와 함께한 고객님들이</span><span class="solo-type-line">직접 보내주신 카카오톡 후기입니다.</span></p><div class="solo-review-index" aria-label="후기 위치"><span class="solo-review-status" data-review-status>01</span><span class="solo-review-index-line" aria-hidden="true"></span><span>'+String(total).padStart(2,"0")+'</span></div></div><div class="solo-review-visual" aria-label="고객 후기 화면"><span class="solo-review-phone-shadow" aria-hidden="true"></span><div class="solo-review-phone"><div class="solo-review-phone-bezel"><div class="solo-review-phone-screen" aria-live="polite"><div class="solo-review-statusbar" aria-hidden="true"><span>9:41</span><span class="solo-review-status-icons"><span class="solo-review-signal"><i></i><i></i><i></i><i></i></span><span>⌁</span><span class="solo-review-battery"></span></span></div>'+SOLO_REVIEW_IMAGES.map((src,i)=>'<figure class="solo-review-slide'+(i===0?' is-active':'')+'" data-review-slide="'+i+'" data-screen-fill="'+(i<8?'#050505':'#f1f1f1')+'" aria-hidden="'+(i!==0)+'">'+img(src,'실제 고객 카카오톡 후기 '+(i+1))+'</figure>').join('')+'<span class="solo-review-screen-shade" aria-hidden="true"></span></div></div></div></div><nav class="solo-review-navigation" aria-label="후기 넘기기"><span class="solo-review-rail-label">NEXT REVIEW</span><span class="solo-review-rail-dot" aria-hidden="true"></span><span class="solo-review-rail-line" aria-hidden="true"></span><button type="button" data-solo-review-next aria-label="다음 후기">›</button></nav></section>'}
function soloReviewCarousel(){
 const cards=ACTUAL_REVIEW_IMAGES.map((src,i)=>reviewCard(src,i)).join("")
 const clones=ACTUAL_REVIEW_IMAGES.map((src,i)=>reviewCard(src,i,true)).join("")
 return '<section class="solo-review-carousel section reviews-section" id="reviews" aria-labelledby="soloReviewTitle"><div class="shell"><div class="review-carousel-head"><header data-solo-section-intro><span data-solo-kicker>REVIEW</span><h2 id="soloReviewTitle" data-solo-title>실제 고객 후기</h2><p data-solo-sub>직접 보내주신 카카오톡 후기 원문입니다</p></header><div class="review-carousel-controls"><button type="button" data-review-prev aria-label="이전 후기">←</button><button type="button" data-review-next aria-label="다음 후기">→</button></div></div><div class="review-captures" id="reviewTrack" aria-label="실제 고객 후기가 자동으로 순환합니다"><div class="review-loop"><div class="review-set">'+cards+'</div><div class="review-set" aria-hidden="true">'+clones+'</div></div></div></div></section>'
}
const AR_DETAIL_CONTENT={
 solo:{
  kicker:"1인 AR 축가",poster:"assets/img/ar-detail/solo-live-proof.jpg",videoLabel:"실제 고객의 본식 AR 축가 현장 영상",
  heroLine1:"떨리는 본식 무대,",heroLine2:"미리 준비한 내 목소리가 함께합니다",
  heroDescription:"미리 녹음하고 자연스럽게 보정한 내 목소리를 AR로 함께 재생해,<br>현장에서는 노래와 마음에만 집중할 수 있습니다.",
  benefitLine1:"라이브의 감동은 그대로,",benefitEmphasis:"AR로 안정감까지 더합니다",
  benefitDescription:["정교하게 보정한 AR이 목소리를 받쳐주고,","본식에서도 자연스럽게 노래를 이어갑니다."],
  keywords:[["01","프로 녹음 퀄리티"],["02","1:1 디렉팅"],["03","노래 못해도 OK"],["04","AR 밸런스"],["05","라이브 안정"]]
 },
 duo:{
  kicker:"2인 AR 축가",poster:"assets/img/song/duo.webp",videoLabel:"실제 고객의 본식 2인 AR 축가 현장 영상",
  heroLine1:"함께 부르는 본식 무대,",heroLine2:"두 사람의 목소리가 자연스럽게 어우러집니다",
  heroDescription:"미리 각자의 파트와 화음을 녹음하고 자연스럽게 보정한 두 사람의 목소리를 AR로 함께 재생해,<br>현장에서는 서로의 호흡과 마음에만 집중할 수 있습니다.",
  benefitLine1:"두 사람의 호흡은 그대로,",benefitEmphasis:"AR로 균형감까지 더합니다",
  benefitDescription:["각자의 음역과 화음에 맞춘 AR이 두 사람의 목소리를 받쳐주고,","본식에서도 자연스럽게 호흡을 이어갑니다."],
  keywords:[["01","파트 설계"],["02","화음 균형"],["03","구간별 디렉팅"],["04","듀엣 밸런스"],["05","라이브 안정"]]
 },
 wedding:{
  kicker:"듀엣 식전 영상",poster:"assets/img/wedding/03-lipsync-mv.webp",videoLabel:"위스티아 듀엣 식전 영상 예시",
  heroLine1:"우리의 이야기로,",heroLine2:"예식의 첫 장면을 엽니다",
  heroDescription:"두 사람이 직접 부른 노래와 이야기를 한 편의 웨딩 필름으로 완성해,<br>하객에게 가장 우리다운 첫인사를 전합니다.",
  benefitLine1:"사진만 지나가는 식전 영상 대신,",benefitEmphasis:"두 사람의 목소리로 시작합니다",
  benefitDescription:["인터뷰와 노래, 두 사람만의 장면을 하나의 흐름으로 엮어,","예식이 시작되기 전부터 마음을 전합니다."],
  keywords:[["01","듀엣 녹음"],["02","스토리 인터뷰"],["03","영상 촬영"],["04","수작업 편집"],["05","상영본 전달"]]
 },
 "duet-film":{
  kicker:"듀엣 축가 영상",poster:"assets/img/song-film/duet-video-cover.jpg",videoLabel:"위스티아 듀엣 축가 영상 예시",
  heroLine1:"무대에 서지 않아도,",heroLine2:"우리의 목소리로 축가를 전합니다",
  heroDescription:"두 사람이 직접 부른 노래와 영상을 축가 순서에 맞춰 완성해,<br>라이브 부담 없이 가장 특별한 축가 시간을 만듭니다.",
  benefitLine1:"축가를 따로 섭외하는 대신,",benefitEmphasis:"우리 둘의 노래로 채웁니다",
  benefitDescription:["두 사람의 음역과 화음을 세심하게 다듬고 장면까지 더해,","본식 축가 순서에 바로 상영할 수 있는 영상으로 완성합니다."],
  keywords:[["01","듀엣 녹음"],["02","파트 · 화음"],["03","뮤비 클립"],["04","영상 편집"],["05","상영본 전달"]]
 },
 "solo-film":{
  kicker:"1인 축가 녹음 메이킹 필름",poster:"assets/img/solo-film/solo-film-cover-v2.webp",videoLabel:"위스티아 1인 축가 녹음 메이킹 필름 예시",
  heroLine1:"한 사람의 목소리로,",heroLine2:"가장 진한 마음을 전합니다",
  heroDescription:"직접 부른 노래와 녹음 장면을 축가 영상으로 완성해,<br>본식에서는 편안하게 상영하고 마음은 오래 남깁니다.",
  benefitLine1:"축가 가수 대신,",benefitEmphasis:"내 목소리로 직접 전합니다",
  benefitDescription:["한 소절씩 편안하게 녹음하고 자연스럽게 보정해,","본식 축가 순서에 바로 상영할 한 편의 영상으로 만듭니다."],
  keywords:[["01","1:1 디렉팅"],["02","구간별 녹음"],["03","보컬 보정"],["04","메이킹 촬영"],["05","상영본 전달"]]
 },
 proposal:{
  kicker:"프로포즈 필름",poster:"assets/img/proposal-video-cover.jpg",videoLabel:"위스티아 프로포즈 필름 예시",
  heroLine1:"말로 다 전하지 못한 마음을,",heroLine2:"노래와 장면으로 남깁니다",
  heroDescription:"직접 부른 노래와 두 사람의 이야기를 한 편의 필름으로 완성해,<br>오직 한 사람을 위한 고백의 순간을 만듭니다.",
  benefitLine1:"평범한 선물 대신,",benefitEmphasis:"내 목소리로 마음을 전합니다",
  benefitDescription:["녹음부터 편지와 장면의 흐름까지 함께 완성해,","프로포즈가 끝난 뒤에도 오래 꺼내 볼 고백을 만듭니다."],
  keywords:[["01","곡 방향 상담"],["02","1:1 녹음"],["03","고백 촬영"],["04","스토리 편집"],["05","완성 필름"]]
 }
}
function detailHookHero(p,key="solo"){const content=AR_DETAIL_CONTENT[key]||AR_DETAIL_CONTENT.solo,localVideo=Boolean(p.resultVideo),video=localVideo?'<video autoplay muted loop playsinline preload="auto" poster="'+escapeHtml(content.poster)+'" aria-label="'+escapeHtml(content.videoLabel)+'"><source src="'+escapeHtml(p.resultVideo)+'" type="video/mp4">영상을 재생할 수 없는 브라우저입니다</video>':"",control=localVideo?'<button type="button" class="ar-hook-video-control" data-ar-video-toggle aria-label="영상 재생"><span class="ar-icon-play" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M4 2.5v11l9-5.5-9-5.5Z" fill="currentColor"/></svg></span><span class="ar-icon-pause" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 16 16"><rect x="3" y="2" width="3" height="12" rx="1" fill="currentColor"/><rect x="10" y="2" width="3" height="12" rx="1" fill="currentColor"/></svg></span></button>':p.videoUrl?'<button type="button" class="ar-hook-video-control ar-hook-video-play" data-inline-youtube="'+escapeHtml(p.videoUrl)+'" aria-label="'+escapeHtml(p.title)+' 실제 영상 재생"><span class="ar-icon-play" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M4 2.5v11l9-5.5-9-5.5Z" fill="currentColor"/></svg></span></button>':"",note=localVideo?"실제 고객님이 보내주신 현장 영상입니다":p.videoUrl?"※ 실제 제작 영상입니다":"※ 위스티아 제작 장면입니다";return '<section class="ar-hook-hero" aria-labelledby="arHookTitle"><div class="ar-hook-media">'+img(content.poster,content.videoLabel,true).replace('<img ','<img class="ar-hook-fallback" ')+video+'<span class="ar-hook-video-source">'+note+'</span>'+control+'</div><div class="ar-hook-copy shell">'+label(content.kicker)+'<h1 id="arHookTitle"><span class="hero-line hero-line1">'+content.heroLine1+'</span><br><strong class="hero-line hero-line2">'+content.heroLine2+'</strong></h1><p>'+content.heroDescription+'</p></div></section>'}
const AR_MIC_ICON='<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3"></rect><path d="M5 10v1a7 7 0 0 0 14 0v-1"></path><line x1="12" y1="18" x2="12" y2="22"></line><line x1="8" y1="22" x2="16" y2="22"></line></svg>'
function arPrimaryBenefit(key="solo"){const content=AR_DETAIL_CONTENT[key]||AR_DETAIL_CONTENT.solo,ar=["solo","duo"].includes(key),benefitLabel=ar?"AR BENEFIT":"FILM BENEFIT",serviceName=ar?"WISTIA AR 축가":"WISTIA 영상 제작";return '<section class="shell section ar-primary-benefit" aria-labelledby="arPrimaryBenefitTitle"><div class="ar-benefit-copy" data-solo-section-intro><p class="ar-tags" data-solo-kicker>'+benefitLabel+'</p><h2 id="arPrimaryBenefitTitle" data-solo-title><span class="solo-type-line ar-copy-line1">'+content.benefitLine1+'</span><span class="solo-type-line ar-copy-emphasis"><span class="ar-copy-emphasis-bg" aria-hidden="true"></span><span class="ar-copy-emphasis-text">'+content.benefitEmphasis+'</span></span></h2><p class="ar-benefit-desc" data-solo-sub><span class="solo-type-line">'+content.benefitDescription[0]+'</span><span class="solo-type-line">'+content.benefitDescription[1]+'</span></p></div><div class="ar-index-wheel" role="group" aria-label="'+serviceName+'의 다섯 가지 강점"><div class="ar-index-ring ar-index-ring-1" aria-hidden="true"></div><div class="ar-index-ring ar-index-ring-2" aria-hidden="true"></div><div class="ar-index-center" aria-hidden="true">'+AR_MIC_ICON+'</div><ul class="ar-index-items">'+content.keywords.map((k,i)=>'<li><button type="button" class="ar-index-item" data-ar-index="'+i+'" aria-pressed="'+(i===0)+'"><span class="ar-index-dot" aria-hidden="true"></span><span class="ar-index-num">'+k[0]+'</span><span class="ar-index-label">'+k[1]+'</span></button></li>').join("")+'</ul></div></section>'}
let arIndexTimer=null
function stopArIndexAuto(){clearInterval(arIndexTimer);arIndexTimer=null}
function startArIndexAuto(wheel){stopArIndexAuto();if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;arIndexTimer=setInterval(()=>{const items=[...wheel.querySelectorAll(".ar-index-item")];const current=items.findIndex(b=>b.classList.contains("is-active"));setArIndexActive(wheel,(current+1)%items.length)},2500)}
function setArIndexActive(wheel,index){const items=[...wheel.querySelectorAll(".ar-index-item")];items.forEach((b,i)=>{const active=i===index;b.classList.toggle("is-active",active);b.setAttribute("aria-pressed",String(active))})}
function initArIndexWheel(){const wheel=document.querySelector(".ar-index-wheel");stopArIndexAuto();if(!wheel)return;const items=[...wheel.querySelectorAll(".ar-index-item")];if(!items.length)return;setArIndexActive(wheel,0);let resumeTimer=null;const pauseAuto=()=>{stopArIndexAuto();clearTimeout(resumeTimer)};const resumeAuto=()=>{clearTimeout(resumeTimer);resumeTimer=setTimeout(()=>startArIndexAuto(wheel),3200)};items.forEach((b,i)=>{b.addEventListener("mouseenter",()=>{pauseAuto();setArIndexActive(wheel,i)});b.addEventListener("focus",()=>{pauseAuto();setArIndexActive(wheel,i)});b.addEventListener("click",()=>{pauseAuto();setArIndexActive(wheel,i);resumeAuto()});b.addEventListener("blur",()=>{if(!wheel.matches(":hover"))resumeAuto()})});wheel.addEventListener("mouseleave",()=>{if(!wheel.matches(":focus-within"))resumeAuto()});startArIndexAuto(wheel)}
const EXPERT_CARDS=[
 {index:"01 · VISUAL DIRECTION",keyword:"영상 연출",sub:"7년 경력 영상 편집 디자이너",detail:"한 곡의 감정이 본식 장면까지<br>자연스럽게 이어지도록 설계합니다.",image:"assets/img/song/solo.webp",alt:"실제 녹음 세션에서 사용된 마이크"},
 {index:"02 · AUDIO ENGINEERING",keyword:"사운드 완성",sub:"방송 음악 작업 엔지니어",detail:"목소리의 음정과 밸런스를 다듬어,<br>자연스럽게 들리는 AR을 완성합니다.",image:"assets/img/ar-process/02-mixing.webp",alt:"모니터 앞에서 음원을 조율하는 엔지니어"}
]
const EXPERT_CARD_ICONS=[
 '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="2"></rect><path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none"></path></svg>',
 '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 14v-4m4 8V6m4 10V8m4 10V5m4 9v-4"></path></svg>'
]
function arExpertStory(){
 const total=EXPERT_CARDS.length
 return '<section class="ar-expert-story section" data-story-carousel aria-labelledby="arExpertStoryTitle"><div class="shell"><header class="ar-story-intro" data-solo-section-intro><p data-solo-kicker>WISTIA · BRAND STORY</p><h2 id="arExpertStoryTitle" data-solo-title><span class="solo-type-line">같은 소스여도,</span><span class="solo-type-line">전문가들과 함께라면 다릅니다.</span></h2></header><div class="ar-story-viewport ar-expert-viewport" tabindex="0"><div class="ar-story-track ar-expert-track" data-expert-track data-index="0">'+EXPERT_CARDS.map((c,i)=>'<article class="ar-story-slide ar-expert-card'+(i===0?' is-active':'')+'" data-story-slide="'+i+'" data-expert-card><div class="ar-story-copy"><div class="ar-story-role-wrap"><span class="ar-story-icon" aria-hidden="true">'+EXPERT_CARD_ICONS[i]+'</span><h3 class="ar-story-role">'+c.keyword+'</h3></div><p><strong>'+c.sub+'</strong><span>'+c.detail+'</span></p></div><figure class="ar-story-image">'+img(c.image,c.alt)+'</figure></article>').join('')+'</div></div><div class="ar-story-controls"><span class="ar-story-status" data-story-status data-expert-status>01 / '+String(total).padStart(2,'0')+'</span><span class="ar-story-progress" aria-hidden="true"><i></i></span><button type="button" data-expert-prev aria-label="이전 제작 이야기">←</button><button type="button" data-story-next data-expert-next aria-label="다음 제작 이야기">→</button></div></div></section>'
}
function wistiaBeforeAfterSection(){return '<section class="wistia-ba-section" id="wistiaBeforeAfter" data-before-src="assets/audio/before-after/before.mp3" data-after-src="assets/audio/before-after/after.mp3" aria-labelledby="wistiaBeforeAfterTitle"><div class="wistia-ba-layout"><header class="wistia-ba-copy" data-solo-section-intro><p class="wistia-ba-eyebrow" data-solo-kicker>BEFORE / AFTER</p><h2 id="wistiaBeforeAfterTitle" data-solo-title><span class="solo-type-line">노래를 잘 못해도</span><span class="solo-type-line">괜찮습니다.</span></h2><p data-solo-sub><span class="solo-type-line">녹음 원본이 완벽하지 않아도 괜찮아요.</span><span class="solo-type-line">튠·믹싱으로 목소리와 마음을 선명하게 완성합니다.</span></p></header><div class="bap-player"><div class="bap-body"><div class="bap-controls"><button class="bap-play mode-before" type="button" aria-label="재생"><span class="bap-play-icon">▶</span><b class="bap-play-label">재생</b></button><div class="bap-time"><b>0:00</b> / <span>0:00</span></div></div><div class="bap-badge mode-before"><span></span><b>VOCAL 원본</b></div><canvas class="bap-wave" aria-label="오디오 파형. 클릭하여 재생 위치 이동"></canvas><div class="bap-tabs" role="group" aria-label="보정 전후 음원 선택"><button class="bap-tab active" type="button" data-mode="before" aria-pressed="true">보정 전</button><button class="bap-switch" type="button" aria-label="보정 전후 전환">⇄</button><button class="bap-tab" type="button" data-mode="after" aria-pressed="false">보정 후</button></div><p class="bap-hint">탭을 바꿔도 <b>같은 재생 위치</b>에서 차이를 들을 수 있습니다.</p><p class="bap-note">ⓘ 보정 전과 후의 보컬 소스는 같은 녹음본입니다.</p><p class="bap-error" role="status" hidden>음원을 불러오지 못했습니다. 파일 경로를 확인해 주세요.</p></div></div></div></section>'}
function setExpertPanel(split,index){split.dataset.active=index;const panels=[...split.querySelectorAll("[data-expert-panel]")];panels.forEach((panel,i)=>{const active=i===index;panel.classList.toggle("is-active",active);panel.setAttribute("aria-expanded",String(active));const toggle=panel.querySelector(".ar-expert-panel-toggle");if(toggle)toggle.textContent=active?"−":"+";const keyword=panel.querySelector(".ar-expert-panel-keyword")?.textContent||"";panel.setAttribute("aria-label",keyword+" 이야기 "+(active?"접기":"펼치기"))})}
function initExpertSplitPanel(){const split=document.querySelector("[data-expert-split]");if(!split)return;const panels=[...split.querySelectorAll("[data-expert-panel]")];panels.forEach((panel,i)=>{panel.addEventListener("click",()=>{if(Number(split.dataset.active)===i)return;setExpertPanel(split,i)})})}
let expertAutoTimer=null,expertResumeTimer=null
function stopExpertAuto(){clearInterval(expertAutoTimer);expertAutoTimer=null}
function startExpertAuto(root,count){stopExpertAuto();if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;expertAutoTimer=setInterval(()=>{const track=root.querySelector("[data-expert-track]");if(!track)return;const current=Number(track.dataset.index||0);setExpertIndex(root,(current+1)%count)},5000)}
function setExpertIndex(root,index){const track=root.querySelector("[data-expert-track]");if(!track)return;const cards=[...root.querySelectorAll("[data-expert-card]")],dots=[...root.querySelectorAll("[data-expert-goto]")],status=root.querySelector("[data-expert-status]"),progress=root.querySelector(".ar-story-progress i");track.dataset.index=index;track.style.transform="translateX(-"+(index*100)+"%)";cards.forEach((c,i)=>{const active=i===index;c.classList.toggle("is-active",active);c.setAttribute("aria-hidden",String(!active))});dots.forEach((d,i)=>d.setAttribute("aria-selected",String(i===index)));if(status)status.textContent=String(index+1).padStart(2,"0")+" / "+String(cards.length).padStart(2,"0");if(progress)progress.style.width=((index+1)/cards.length*100)+"%"}
function initExpertSlider(){const root=document.querySelector(".ar-expert-story");stopExpertAuto();clearTimeout(expertResumeTimer);if(!root)return;const track=root.querySelector("[data-expert-track]"),cards=[...root.querySelectorAll("[data-expert-card]")];if(!track||!cards.length)return;const count=cards.length;setExpertIndex(root,0);const pause=()=>{stopExpertAuto();clearTimeout(expertResumeTimer)},resume=()=>{clearTimeout(expertResumeTimer);expertResumeTimer=setTimeout(()=>{if(!root.matches(":hover")&&!root.matches(":focus-within"))startExpertAuto(root,count)},4200)},go=delta=>{const i=Number(track.dataset.index||0);setExpertIndex(root,(i+delta+count)%count);pause();resume()};root.addEventListener("mouseenter",pause);root.addEventListener("mouseleave",()=>{if(!root.matches(":focus-within"))resume()});root.addEventListener("focusin",pause);root.addEventListener("focusout",()=>{if(!root.matches(":hover"))resume()});root.querySelector("[data-expert-prev]")?.addEventListener("click",()=>go(-1));root.querySelector("[data-expert-next]")?.addEventListener("click",()=>go(1));root.querySelectorAll("[data-expert-goto]").forEach(btn=>btn.addEventListener("click",()=>{setExpertIndex(root,Number(btn.dataset.expertGoto));pause();resume()}));const viewport=root.querySelector(".ar-expert-viewport");viewport.addEventListener("keydown",e=>{if(e.key==="ArrowRight"){e.preventDefault();go(1)}else if(e.key==="ArrowLeft"){e.preventDefault();go(-1)}});let dragging=false,startX=0,deltaX=0;viewport.addEventListener("pointerdown",e=>{dragging=true;startX=e.clientX;deltaX=0;track.style.transition="none";pause();viewport.setPointerCapture(e.pointerId)});viewport.addEventListener("pointermove",e=>{if(!dragging)return;deltaX=e.clientX-startX;if(Math.abs(deltaX)>6)e.preventDefault();const i=Number(track.dataset.index||0);track.style.transform="translateX(calc(-"+(i*100)+"% + "+deltaX+"px))"});const endDrag=()=>{if(!dragging)return;dragging=false;track.style.transition="";const i=Number(track.dataset.index||0);if(Math.abs(deltaX)>60)setExpertIndex(root,Math.min(count-1,Math.max(0,i+(deltaX<0?1:-1))));else setExpertIndex(root,i);resume()};viewport.addEventListener("pointerup",endDrag);viewport.addEventListener("pointercancel",endDrag);startExpertAuto(root,count)}
const AR_COMPARE_ROWS=[["준비 범위","단계별로 직접 확인","상담부터 AR 제작까지 한 번에"],["녹음 방식","완곡 위주의 일괄 녹음","구간별 1:1 디렉팅"],["보컬 보정","음역·비용 위주 확인","음색을 살린 수작업 보정"],["최종 전달","제공 파일만 확인","완성 음원 + 본식용 AR 제공"]]
const FILM_COMPARE_ROWS=[["준비 범위","항목별로 따로 준비","녹음부터 상영본까지 한 번에"],["노래 제작","완곡 위주로 일괄 진행","구간별 1:1 디렉팅"],["영상 구성","기본 편집만 확인","노래와 이야기의 흐름까지 설계"],["최종 전달","제공 파일만 확인","완성 음원과 상영본 함께 전달"]]
function arComparisonSection(key="solo"){const ar=["solo","duo"].includes(key),rows=ar?AR_COMPARE_ROWS:FILM_COMPARE_ROWS,title=ar?["위스티아는","다릅니다."]:["일반 제작 방식과","비교해 보세요."],description=ar?["준비 범위부터 보정과 최종 전달까지,","위스티아의 제작 방식을 비교해 보세요."]:["준비 범위부터 완성본 전달까지,","위스티아의 제작 방식을 비교해 보세요."];return '<section class="ar-compare section" aria-labelledby="arCompareTitle" data-ar-compare><div class="shell"><header class="ar-compare-intro" data-solo-section-intro><p data-solo-kicker>WHY WISTIA</p><h2 id="arCompareTitle" class="ar-compare-title" data-solo-title><span class="solo-type-line">'+title[0]+'</span><span class="solo-type-line">'+title[1]+'</span></h2><p class="ar-compare-sub" data-solo-sub><span class="solo-type-line">'+description[0]+'</span><span class="solo-type-line">'+description[1]+'</span></p></header><div class="ar-compare-table" role="table" aria-label="일반 제작과 WISTIA 비교"><div class="ar-compare-head" role="row"><span role="columnheader">일반 제작</span><strong role="columnheader">WISTIA</strong></div>'+rows.map((row,i)=>'<div class="ar-compare-row" data-ar-compare-row role="row" style="--row-i:'+i+'"><span class="ar-compare-general" role="cell">'+row[1]+'</span><strong class="ar-compare-criteria" role="rowheader">'+row[0]+'</strong><span class="ar-compare-wistia" role="cell">'+row[2]+'</span></div>').join("")+'</div><p class="ar-compare-note">제공 범위는 업체와 상품에 따라 달라질 수 있습니다.</p></div></section>'}
let arCompareObserver=null
function initArCompare(){arCompareObserver?.disconnect();const section=document.querySelector("[data-ar-compare]");if(!section)return;if(matchMedia("(prefers-reduced-motion: reduce)").matches){section.classList.add("is-visible");return}arCompareObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){section.classList.add("is-visible");arCompareObserver.disconnect()}}),{threshold:.2,rootMargin:"0px 0px -8% 0px"});arCompareObserver.observe(section)}
function prepareArHookVideo(){const video=document.querySelector(".ar-hook-media video"),button=document.querySelector("[data-ar-video-toggle]");if(!video||!button)return;const update=()=>{const playing=!video.paused&&!video.ended&&video.readyState>=2;video.classList.toggle("is-playing",playing);button.classList.toggle("is-playing",playing);button.setAttribute("aria-label",playing?"영상 일시정지":"영상 재생")};video.addEventListener("playing",update);video.addEventListener("pause",update);video.addEventListener("ended",update);video.addEventListener("waiting",()=>video.classList.remove("is-playing"));video.play().catch(update);update()}
function detailBenefit(p){const highlights=p.highlights||[],main=highlights[0]||[p.oneLine,p.sub],support=highlights.slice(1,3);return '<section class="shell section detail-benefit" aria-labelledby="detailBenefitTitle"><div class="detail-benefit-intro">'+label("핵심 장점")+'<h2 id="detailBenefitTitle">'+main[0]+'</h2><p>'+main[1]+'</p></div><div class="detail-benefit-points">'+support.map((item,i)=>'<article><span>'+String(i+2).padStart(2,"0")+'</span><h3>'+item[0]+'</h3><p>'+item[1]+'</p></article>').join("")+'</div></section>'}
function detailComparison(p){const film=p.category!=="song",rows=film?[["준비 방식","녹음·촬영·편집을 각각 확인","한 곳에서 녹음부터 상영본까지"],["녹음 진행","연습 후 전체 곡 녹음","구간별 1:1 보컬 디렉팅"],["보컬 보정","보정 범위와 비용을 별도 확인","음정·박자·호흡까지 수작업 보정"],["최종 전달","제공 파일을 항목별로 확인","완성 음원과 상영용 영상 함께 전달"]]:[["준비 방식","반주·녹음·보정을 각각 확인","녹음부터 본식용 AR까지 한 번에"],["녹음 진행","연습 후 전체 곡 녹음","구간별 1:1 보컬 디렉팅"],["보컬 보정","보정 범위와 비용을 별도 확인","원래 목소리를 살린 수작업 보정"],["최종 전달","최종 음원 종류를 별도 확인","완성 음원과 본식용 AR 함께 전달"]];return '<section class="comparison-band section" aria-labelledby="comparisonTitle"><div class="shell">'+heading("","타사 비교","예약 전에 반드시 확인해야 할 제작 범위를 기준으로 정리했습니다")+'<div class="comparison-table" role="table" aria-label="일반 제작 방식과 위스티아 비교"><div class="comparison-head" role="row"><span></span><strong>일반 제작 방식</strong><strong>WISTIA</strong></div>'+rows.map(row=>'<div class="comparison-row" role="row"><strong>'+row[0]+'</strong><span><small>일반 제작 방식</small>'+row[1]+'</span><span><small>WISTIA</small>'+row[2]+'</span></div>').join("")+'</div><p class="comparison-note">업체별 상품 구성은 다를 수 있으므로 실제 포함 범위와 추가 비용은 예약 전에 확인해 주세요</p></div></section>'}
function detailIncluded(p){const items=p.included||[];if(!items.length)return "";return '<section class="shell section detail-included" aria-labelledby="detailIncludedTitle">'+heading("","최종 완성본에 포함됩니다","상담부터 제작과 전달까지 기본 구성에 포함되는 항목입니다")+'<ul>'+items.map((item,i)=>'<li><span>'+String(i+1).padStart(2,"0")+'</span><strong>'+item+'</strong></li>').join("")+'</ul></section>'}
function reviewMetrics(){const loop=document.querySelector(".review-loop"),set=loop?.querySelector(".review-set"),card=set?.querySelector(".review-capture");if(!loop||!set||!card)return null;const gap=parseFloat(getComputedStyle(set).gap)||0;return{loop,setWidth:set.scrollWidth,step:card.getBoundingClientRect().width+gap}}
function paintReviews(){const metrics=reviewMetrics();if(metrics)metrics.loop.style.transform='translate3d('+(-reviewDisplay)+'px,0,0)'}
function moveReviews(direction=1){const metrics=reviewMetrics();if(!metrics)return;reviewTarget+=direction*metrics.step}
function startReviewCarousel(reset=true){cancelAnimationFrame(reviewFrame);const initial=reviewMetrics();if(!initial)return;if(reset){reviewTarget=0;reviewDisplay=0;reviewLast=0}if(matchMedia("(prefers-reduced-motion: reduce)").matches){reviewDisplay=reviewTarget;paintReviews();return}paintReviews();const tick=now=>{const track=document.querySelector("#reviewTrack");if(!track)return;const region=track.closest(".reviews-section")||track,metrics=reviewMetrics();if(!metrics)return;const elapsed=reviewLast?Math.min(now-reviewLast,50):0;reviewLast=now;const paused=region.matches(":hover")||region.contains(document.activeElement);if(!paused)reviewTarget+=elapsed*.04;const ease=1-Math.exp(-elapsed/180);reviewDisplay+=(reviewTarget-reviewDisplay)*(ease||1);if(reviewTarget>=metrics.setWidth){reviewTarget-=metrics.setWidth;reviewDisplay-=metrics.setWidth}if(reviewTarget<0){reviewTarget+=metrics.setWidth;reviewDisplay+=metrics.setWidth}paintReviews();reviewFrame=requestAnimationFrame(tick)};reviewFrame=requestAnimationFrame(tick)}
function processMedia(step){const media=step[2];if(!media)return "";if(Array.isArray(media))return '<div class="process-image is-pair">'+media.map((source,index)=>img(source,step[0]+' 예시 사진 '+(index+1))).join("")+'</div>';if(typeof media==="object"&&media.duration)return '<div class="process-duration-card"><span>PRODUCTION PERIOD</span><strong>'+escapeHtml(media.duration)+'</strong><small>'+escapeHtml(media.note||"")+'</small></div>';return '<div class="process-image">'+img(media,step[0]+' 과정 이미지')+'</div>'}
function processSection(steps=PROCESS){const hasImages=steps.some(step=>step[2]);return '<section class="shell section" id="process">'+heading("","진행 과정","상담부터 최종본 전달까지 순서대로 진행합니다")+'<ol class="process-list'+(hasImages?' has-images':'')+'">'+steps.map((s,i)=>'<li>'+processMedia(s)+'<span>'+String(i+1).padStart(2,"0")+'</span><div><h3>'+s[0]+'</h3><p>'+s[1]+'</p></div></li>').join("")+'</ol></section>'}
function processList(steps){const hasImages=steps.some(step=>step[2]);return '<ol class="process-list'+(hasImages?' has-images':'')+'">'+steps.map((s,i)=>'<li>'+processMedia(s)+'<span>'+String(i+1).padStart(2,"0")+'</span><div><h3>'+s[0]+'</h3><p>'+s[1]+'</p></div></li>').join("")+'</ol>'}
function processAccordionMedia(step){const media=step[2];if(typeof media==="object"&&media?.duration)return '<div class="process-duration-line"><span>제작 기간</span><strong>'+escapeHtml(media.duration)+'</strong><small>촬영과 자료 전달 완료 후 정확한 일정을 안내합니다</small></div>';return processMedia(step)}
function processAccordionList(steps){return '<div class="process-accordion">'+steps.map((s,i)=>'<details><summary data-process-step><span>'+String(i+1).padStart(2,"0")+'</span><h3>'+s[0]+'</h3><b aria-hidden="true">+</b></summary><div class="process-accordion-body">'+processAccordionMedia(s)+'<p>'+s[1]+'</p></div></details>').join("")+'</div>'}
function songProcessSection(steps){return '<section class="shell section song-process-section" id="process">'+heading("","진행 과정","항목을 누르면 사진과 자세한 설명을 볼 수 있습니다")+processAccordionList(steps)+'</section>'}
const SOLO_STUDIO_PROCESS=[
 {id:1,eyebrow:"CONSULTATION",title:"맞춤 제작 상담<br>곡과 키 확인",short:"맞춤 제작 상담",description:"예식 분위기와 음역을 확인해 곡과 키를 정하고, 본식에서 사용할 AR의 방향을 함께 설계합니다.",meta:[["방식","1:1 상담"],["준비","원하는 곡"]],image:"assets/img/process-studio/01-consultation.png"},
 {id:2,eyebrow:"RECORDING",title:"스튜디오 방문<br>녹음 준비",short:"녹음 준비",description:"마이크와 헤드폰을 편안하게 맞춘 뒤, 컨디션과 호흡을 확인하며 녹음을 준비합니다.",meta:[["장소","위스티아 스튜디오"],["안내","장비 세팅"]],image:"assets/img/process-studio/02-recording.png"},
 {id:3,eyebrow:"VOCAL DIRECTING",title:"1:1 보컬 디렉팅<br>구간별 녹음",short:"1:1 보컬 디렉팅",description:"엔지니어가 호흡·발음·감정 표현을 안내하고, 부담 없는 길이로 나누어 한 구간씩 녹음합니다.",meta:[["방식","구간별 녹음"],["진행","1:1 디렉팅"]],image:"assets/img/process-studio/03-vocal-directing.png"},
 {id:4,eyebrow:"AR BALANCE",title:"AR 속 내 목소리<br>비율 선택",short:"AR 비율 선택",description:"같은 노래를 여러 비율로 직접 들어보고, 실제 본식에서 가장 편안한 목소리 비율을 결정합니다.",meta:[["비교","30–100%"],["결정","맞춤 비율"]],image:"assets/img/process-studio/04-ratio.png"},
 {id:5,eyebrow:"VOCAL EDITING",title:"멜로다인 수작업<br>보컬 보정",short:"수작업 보정",description:"원래 목소리의 느낌은 살리면서 음정·박자·호흡을 한 음씩 세밀하게 다듬습니다.",meta:[["보정","수작업"],["기준","음색 유지"]],image:"assets/img/process-studio/05-melodyne.png"},
 {id:6,eyebrow:"MIXING & MASTERING",title:"전문 엔지니어 믹싱<br>AR 제작",short:"믹싱 · AR 제작",description:"보컬과 반주의 밸런스를 맞춰 예식장에서 바로 재생할 수 있는 AR 음원으로 완성합니다.",meta:[["작업","믹싱"],["출력","본식용 AR"]],image:"assets/img/process-studio/06-mixing.png"},
 {id:7,eyebrow:"FINAL DELIVERY",title:"최종 검수<br>완성본 전달",short:"최종 검수 · 전달",description:"본식에서 바로 사용할 수 있도록 전체 음원을 최종 검수한 뒤 완성 파일을 전달합니다.",meta:[["제작","약 7일"],["전달","완성 음원"]],image:"assets/img/process-studio/07-delivery.svg"}
]
const DUO_STUDIO_PROCESS=[
 {id:1,eyebrow:"CONSULTATION",title:"함께하는 맞춤 상담<br>곡·키·파트 확인",short:"맞춤 제작 상담",description:"예식 분위기와 두 사람의 음역을 확인해 곡과 키, 파트를 정하고 본식용 듀엣 AR의 방향을 함께 설계합니다.",meta:[["방식","1:1 상담"],["준비","원하는 곡"]],image:"assets/img/process-studio/01-consultation.png"},
 {id:2,eyebrow:"RECORDING",title:"스튜디오 방문<br>듀엣 녹음 준비",short:"듀엣 녹음 준비",description:"두 사람의 마이크와 헤드폰을 편안하게 맞춘 뒤, 각자의 컨디션과 호흡을 확인하며 녹음을 준비합니다.",meta:[["장소","위스티아 스튜디오"],["안내","장비 세팅"]],image:"assets/img/process-studio/02-recording.png"},
 {id:3,eyebrow:"DUET DIRECTING",title:"듀엣 보컬 디렉팅<br>파트별 구간 녹음",short:"듀엣 보컬 디렉팅",description:"각자의 파트와 화음이 자연스럽게 맞물리도록 안내하고, 부담 없는 길이로 나누어 구간별로 녹음합니다.",meta:[["방식","파트별 녹음"],["진행","듀엣 디렉팅"]],image:"assets/img/process-studio/03-vocal-directing.png"},
 {id:4,eyebrow:"DUET BALANCE",title:"두 목소리의 AR<br>밸런스 확인",short:"듀엣 밸런스",description:"각자의 목소리와 화음이 가장 자연스럽게 들리는 지점을 확인해 본식용 AR 밸런스를 결정합니다.",meta:[["비교","보컬 · 화음"],["결정","맞춤 밸런스"]],image:"assets/img/process-studio/04-ratio.png"},
 {id:5,eyebrow:"VOCAL EDITING",title:"멜로다인 수작업<br>보컬 보정",short:"수작업 보정",description:"두 사람의 원래 음색은 살리면서 음정·박자·호흡을 한 음씩 세밀하게 다듬습니다.",meta:[["보정","수작업"],["기준","음색 유지"]],image:"assets/img/process-studio/05-melodyne.png"},
 {id:6,eyebrow:"MIXING & MASTERING",title:"듀엣 믹싱과<br>본식용 AR 제작",short:"듀엣 AR 제작",description:"두 보컬과 반주의 밸런스를 맞춰 예식장에서 바로 재생할 수 있는 듀엣 AR 음원으로 완성합니다.",meta:[["작업","듀엣 믹싱"],["출력","본식용 AR"]],image:"assets/img/process-studio/06-mixing.png"},
 {id:7,eyebrow:"FINAL DELIVERY",title:"최종 검수<br>완성본 전달",short:"최종 검수 · 전달",description:"본식에서 바로 사용할 수 있도록 듀엣 AR과 완성 음원을 최종 검수한 뒤 전달합니다.",meta:[["제작","약 7일"],["전달","듀엣 AR · 완성 음원"]],image:"assets/img/process-studio/07-delivery.svg"}
]
const DETAIL_PROCESS_IMAGES={
 wedding:["assets/img/wedding/01-guest-message.webp","assets/img/wedding/02-interview.webp","assets/img/wedding/03-lipsync-mv.webp","assets/img/wedding/04-recording-making.webp","assets/img/wedding/05-couple-memories.webp","assets/img/wedding/06-letter.webp","assets/img/wedding/03-lipsync-mv.webp"],
 "duet-film":["assets/img/song-film/duet-scene-01.jpg","assets/img/song-film/duet-scene-02.jpg","assets/img/song-film/duet-scene-03.jpg","assets/img/song-film/duet-scene-04.jpg","assets/img/song-film/duet-video-cover.jpg","assets/img/song-film/duet-video-cover.jpg","assets/img/song-film/duet-video-cover.jpg"],
 "solo-film":["assets/img/solo-film/solo-film-cover-v2.webp","assets/img/solo-film/solo-film-cover-v2.webp","assets/img/solo-film/solo-film-cover-v2.webp","assets/img/solo-film/solo-film-cover-v2.webp","assets/img/solo-film/solo-film-cover-v2.webp"],
 proposal:["assets/img/proposal/process-01.webp","assets/img/proposal/process-02.webp","assets/img/proposal/process-03.webp","assets/img/proposal/process-04.webp","assets/img/proposal/process-05.webp","assets/img/proposal-video-cover.jpg","assets/img/proposal-video-cover.jpg"]
}
function detailStudioSteps(key="solo"){
 if(key==="solo")return SOLO_STUDIO_PROCESS
 if(key==="duo")return DUO_STUDIO_PROCESS
 const product=PRODUCTS[key],images=DETAIL_PROCESS_IMAGES[key]||[],steps=product?.steps||[]
 return steps.map(([title,description],index)=>{
  const number=index+1,last=index===steps.length-1,short=String(title).replace(/\s*·.*$/,"").replace(/\s*&.*$/,"").replace(/\s*\(.*/,"")
  return {id:number,eyebrow:last?"FINAL DELIVERY":"STEP "+String(number).padStart(2,"0"),title,short,description,meta:last?[["전달",key==="proposal"?"완성 필름":"상영본 · 완성 음원"],["안내","일정 상담"]]:index===0?[["방식","1:1 상담"],["준비","원하는 곡"]]:[["진행","맞춤 제작"],["확인","중간 피드백"]],image:images[index%images.length]||AR_DETAIL_CONTENT[key]?.poster||AR_DETAIL_CONTENT.solo.poster}
 })
}
function processStudioMeta(step){return step.meta.map(([label,value])=>'<span><strong>'+escapeHtml(label)+'</strong>'+escapeHtml(value)+'</span>').join("")}
function soloProcessSlider(key="solo"){const steps=detailStudioSteps(key),ar=["solo","duo"].includes(key),first=steps[0],total=String(steps.length).padStart(2,"0"),description=key==="duo"?["두 사람의 파트와 화음을 맞춘 뒤, 본식용 AR 전달까지","일곱 단계를 순서대로 확인해 보세요."]:ar?["상담부터 녹음과 보정, 본식용 AR 전달까지","일곱 단계를 순서대로 확인해 보세요."]:["상담부터 녹음과 촬영, 상영본 전달까지","상품별 제작 과정을 순서대로 확인해 보세요."];return '<section class="wistia-process-studio solo-process-section" id="process" data-process-studio data-process-product="'+key+'" aria-labelledby="processStudioTitle">'
 +'<header class="wps-head" data-solo-section-intro><div><p class="wps-kicker" data-solo-kicker>WISTIA · PRODUCTION PROCESS</p><h2 id="processStudioTitle" data-solo-title><span class="solo-type-line">처음부터 끝까지,</span><span class="solo-type-line">맞춤형으로 케어해드립니다.</span></h2><p class="wps-sub" data-solo-sub><span class="solo-type-line">'+description[0]+'</span><span class="solo-type-line">'+description[1]+'</span></p></div><div class="wps-counter" aria-label="현재 프로세스 01 / '+total+'"><span data-process-current>01</span><i></i><span>'+total+'</span></div></header>'
 +'<div class="wps-feature" data-process-feature tabindex="0" role="group" aria-label="작업과정 단계 슬라이더. 좌우 방향키로 단계를 이동할 수 있습니다."><div class="wps-photo"><span class="wps-badge">CURRENT STEP</span>'+img(first.image,first.short,true).replace('<img ','<img data-process-image ')+'</div><article class="wps-content" aria-live="polite" aria-atomic="true"><span class="wps-ghost" data-process-ghost>01</span><p class="wps-step" data-process-eyebrow>'+first.eyebrow+'</p><h3 data-process-title>'+first.title+'</h3><p class="wps-description" data-process-description>'+first.description+'</p><div class="wps-detail" data-process-meta>'+processStudioMeta(first)+'</div><div class="wps-controls"><button type="button" data-process-prev aria-label="이전 단계" disabled>←</button><button type="button" class="is-toggle" data-process-toggle aria-label="자동 재생 일시정지" aria-pressed="false">Ⅱ</button><button type="button" class="is-next" data-process-next aria-label="다음 단계">→</button></div></article></div>'
 +'<nav class="wps-chapters" aria-label="제작 단계 선택" hidden>'+steps.map((step,index)=>'<button type="button" class="wps-chapter'+(index===0?' is-active':'')+'" data-process-chapter="'+index+'" data-image="'+step.image+'" aria-current="'+(index===0?'step':'false')+'" aria-label="'+String(step.id).padStart(2,"0")+' '+escapeHtml(step.short)+' 단계 보기"><b>'+String(step.id).padStart(2,"0")+'</b><span>'+escapeHtml(step.short)+'</span></button>').join("")+'</nav></section>'}
function processTypeButton(productKey,formatKey,icon){const format=FILM_FORMATS[formatKey],expanded=selectedFilmFormat===formatKey;return '<button type="button" aria-expanded="'+expanded+'" aria-controls="processType'+(formatKey==="live"?'Live':'Making')+'" data-process-format="'+formatKey+'"><span class="process-type-preview">'+img(FILM_FORMAT_IMAGES[productKey][formatKey],format.title+' 예시 사진')+'</span><span class="process-type-label"><span class="process-type-marker" aria-hidden="true"></span><strong><span aria-hidden="true">'+icon+'</span> '+format.title+'</strong></span></button>'}
function filmProcessSection(productKey,steps){const live=filmProcessSteps(productKey,steps,"live"),making=filmProcessSteps(productKey,steps,"making");if(productKey==="proposal")return '<section class="shell section film-process-section proposal-process-section" id="process">'+heading("","진행 과정","녹음부터 영상 완성까지의 과정을 확인해 주세요")+'<div id="processTypeLive" class="process-type-panel proposal-single-process" role="region" aria-label="뮤직 비디오 필름 진행 과정" data-process-panel="live">'+processAccordionList(live)+'</div></section>';return '<section class="shell section film-process-section" id="process">'+heading("","녹음 메이킹 필름 진행 과정","항목을 누르면 사진과 자세한 설명을 볼 수 있습니다")+'<div id="processTypeMaking" class="process-type-panel" role="region" aria-label="녹음 메이킹 필름 진행 과정" data-process-panel="making">'+processAccordionList(making)+'</div></section>'}
function filmUpgradeDetail(productKey){if(productKey==="proposal")return "";const difference=filmFormatPrice(productKey,"live")-filmFormatPrice(productKey,"making"),price="+"+shortWon(difference);return '<section class="shell section film-upgrade-detail"><div class="film-upgrade-detail-media">'+img(FILM_FORMAT_IMAGES[productKey].live,"뮤직 비디오 필름 실제 예시 사진",true)+'</div><div class="film-upgrade-detail-copy">'+label("선택 업그레이드")+'<h2>뮤직 비디오 필름으로 업그레이드</h2><p>기본 녹음 메이킹 필름에 아래 구성이 추가됩니다</p><ul>'+filmUpgradeFeatures(productKey).map(item=>'<li>'+item+'</li>').join("")+'</ul><div><strong>'+price+'</strong></div></div></section>'}
function productionGuide(p){const film=p.category!=="song";return '<section class="shell production-guide" aria-labelledby="productionGuideTitle"><h2 id="productionGuideTitle">제작 안내</h2><div><article><span>작업 기간</span><strong>'+(film?"촬영·자료 전달 후 일정 확정":"녹음 완료 후 일정 확정")+'</strong><p>사용 예정일과 제작 구성을 확인한 뒤 정확한 전달 일정을 안내합니다</p></article><article><span>수정 안내</span><strong>상품별 기본 범위 적용</strong><p>수정 가능 범위와 횟수는 예약 전 상담에서 명확히 안내합니다</p></article><article><span>최종 전달</span><strong>'+(film?"상영용 영상 + 완성 음원":"본식용 AR + 완성 음원")+'</strong><p>사용 환경을 확인해 현장에서 바로 쓸 수 있는 파일로 전달합니다</p></article></div></section>'}
function resultSection(p,m,w,song){return '<section class="result-band"><div class="shell"><div>'+label("THE RESULT")+'<h2>이렇게 완성됩니다</h2></div><div><p>'+m.result+'</p><span>'+escapeHtml(p.resultCopy|| (song?"보정과 믹싱·마스터링을 거친 최종 음원으로 전달합니다":"직접 부른 노래와 촬영 장면을 하나의 영상으로 완성합니다"))+'</span></div></div>'+(w?'<div class="shell result-film"><button class="film-poster" data-video="'+w.id+'" aria-label="'+w.title+' 실제 결과물 재생">'+img(w.image,w.title,true)+'<span class="play" aria-hidden="true">▶</span><span class="poster-note">실제 결과물 재생하기</span></button></div>':'')+'</section>'}
function detailNext(key,purpose=""){const song=PRODUCTS[key]?.category==="song",eventHref="#/event/"+key+(purpose?"/"+purpose:"");if(song)return '<section class="detail-next section song-video-option"><div class="shell"><h2>영상도 필요하신가요?</h2><p>완성한 축가와 사진을 활용해 예식장에서 바로 재생할 가사 영상을 함께 제작할 수 있습니다</p><a class="detail-bottom-option" href="#/event/'+key+'/lyrics">'+img(SONG_OPTIONS[0].image,"가사 영상 제작 예시")+'<span><small>선택 옵션</small><strong>가사 영상 제작</strong></span><b>+40,000원</b></a></div></section>';return '<section class="detail-next section"><div class="shell"><h2>상품 구성과 가격을<br>확인해 보세요</h2><p>포함 작업과 선택 옵션, 이벤트 혜택을 확인한 뒤 예약 상담으로 이어집니다</p>'+cta("상품 구성·가격 확인하기",eventHref)+'</div></section>'}
function renderHome(requested="role"){
 const serviceIcon=kind=>kind==="음원"?'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="7"></rect><path d="M9 8v6M12 6v10M15 9v4"></path></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"></rect><path d="m10 9 5 3-5 3Z"></path></svg>'
 const choices=(name,items)=>items.map(([value,title,example,kind])=>'<label class="finder-choice"><input type="radio" name="'+name+'" value="'+value+'">'+(kind?'<span class="finder-service-badge">'+serviceIcon(kind)+'<em>'+kind+'</em></span>':'<span class="finder-choice-mark" aria-hidden="true"></span>')+'<span><strong>'+title+'</strong>'+(example?'<small>'+example+'</small>':'')+'</span></label>').join("")
 const stage=requested==="lyrics"&&finderChoice.role==="singer"?"lyrics":requested==="people"&&finderChoice.moment?"people":requested==="service"&&finderChoice.role==="couple"?"service":"role"
 const configs={
  role:{number:"01",title:"어떤 서비스를 원하시나요?",description:"준비하시는 서비스를 선택해 주세요",name:"finderRole",items:[["singer","사전 AR 축가","","음원"],["couple","식전 영상 / 축가 영상","","영상"],["proposal","프로포즈",""]]},
  lyrics:{number:"02",title:"가사 영상도 필요하신가요?",description:"축가와 함께 사용할 가사 영상 여부를 선택해 주세요",name:"finderLyrics",items:[["yes","네, 가사 영상도 필요해요","예식장에서 가사를 보여줄 영상도 함께 준비해요"],["no","아니요, 사전 녹음 음원만 필요해요","예식에서 사용할 사전 녹음 음원만 준비해요"]]},
  service:{number:"02",title:"무엇을 준비하시나요?",description:"예식에서 상영할 영상을 선택해 주세요",name:"finderMoment",items:[["pre","예식 전 식전 영상","하객이 입장하는 시간, 우리의 목소리로 예식의 시작을 열어요"],["ceremony","축가 순서에 상영할 영상","축가를 따로 섭외하지 않고, 우리가 직접 부른 영상을 축가 시간에 상영해요"]]},
  people:{number:"03",title:"혼자 준비하시나요, 두 분이 함께 준비하시나요?",description:"노래를 녹음하고 영상에 참여하는 인원을 선택해 주세요",name:"finderPeople",items:[["one","1인 · 혼자 준비해요","신랑 또는 신부 한 분이 노래하고 준비하는 경우"],["two","2인 · 두 분이 함께 준비해요","신랑신부 두 분이 함께 노래하고 준비하는 경우"]]}
 }
 const config=configs[stage],back=stage==="service"||stage==="lyrics"?"#/":"#/find/service"
 let showIntro=false;try{showIntro=stage==="role"&&!sessionStorage.getItem("wistia:intro-seen");if(showIntro)sessionStorage.setItem("wistia:intro-seen","1")}catch{}
 const splash=showIntro?'<div class="finder-intro-splash" aria-hidden="true"><div><img src="assets/img/wistia-logo-transparent.webp" alt=""></div></div>':''
 app.innerHTML='<section class="finder-home shell finder-stage-'+stage+(showIntro?' has-intro-animation':'')+'" aria-labelledby="finderTitle">'+splash+'<div class="finder-content">'+(stage==="role"?"":'<a class="finder-back" href="'+back+'">← 이전 질문</a>')+'<header class="finder-intro"><span class="eyebrow">'+config.number+'</span><h1 id="finderTitle">'+config.title+'</h1><p>'+config.description+'</p></header><div class="finder-steps"><fieldset class="finder-step"><legend class="sr-only">'+config.title+'</legend><div class="finder-options">'+choices(config.name,config.items)+'</div></fieldset></div></div></section>'
 updateHomeFinder()
 app.querySelectorAll(".finder-choice").forEach(choice=>choice.addEventListener("click",event=>{event.preventDefault();const input=choice.querySelector("input");if(input)handleFinderChoice(input)}))
}
function renderInfoPage(key){
 const page=INFO_PAGES[key]||INFO_PAGES.about
 const content=page.faq?'<div class="info-faq">'+faq(page.faq)+'</div>':'<ol class="info-points">'+page.points.map((point,index)=>'<li><span>'+String(index+1).padStart(2,"0")+'</span><strong>'+point+'</strong></li>').join("")+'</ol>'
 app.innerHTML='<section class="shell section info-page" aria-labelledby="infoPageTitle"><header class="info-page-intro">'+label(page.eyebrow)+'<h1 id="infoPageTitle">'+page.title.replace("\n","<br>")+'</h1><p>'+page.description+'</p></header>'+content+'</section>'+footer()
}
const FINDER_LABELS={role:{couple:"식전, 축가 영상",singer:"사전 녹음 AR 축가",proposal:"프로포즈 / 답프로포즈"},people:{one:"1인",two:"2인"},moment:{pre:"예식 전 식전 영상",ceremony:"축가 순서에 상영할 영상",live:"예식에서 직접 부를 축가"},lyrics:{yes:"가사 영상 필요",no:"사전 녹음 음원만 필요"}}
const FINDER_PRODUCTS={"pre/one":"solo-film","pre/two":"wedding","ceremony/one":"solo-film","ceremony/two":"duet-film","live/one":"solo","live/two":"duo"}
let finderChoice=(()=>{try{const value=JSON.parse(sessionStorage.getItem("wistia:finder-selection"));return {role:value.role||"",people:value.people||"",moment:value.moment||"",lyrics:value.lyrics||""}}catch{return {role:"",people:"",moment:"",lyrics:""}}})()
function finderProduct(){return FINDER_PRODUCTS[[finderChoice.moment,finderChoice.people].join("/")]}
function finderPriceContext(key){return finderProduct()===key?finderChoice:null}
function handleFinderChoice(el){
 if(el.name==="finderRole"){
  finderChoice={role:el.value,moment:"",people:"",lyrics:""}
  sessionStorage.setItem("wistia:finder-selection",JSON.stringify(finderChoice))
  const next=el.value==="singer"?"#/detail/solo":el.value==="proposal"?"#/detail/proposal":"#/detail/solo-film/making"
  history.pushState({wistiaDepth:(history.state?.wistiaDepth||0)+1},"",next);route();return
 }
 if(el.name==="finderLyrics"){
  finderChoice.lyrics=el.value
  sessionStorage.setItem("wistia:finder-selection",JSON.stringify(finderChoice))
  history.pushState({wistiaDepth:(history.state?.wistiaDepth||0)+1},"","#/ar/friend");route();return
 }
 if(el.name==="finderMoment"){
  finderChoice.moment=el.value;finderChoice.people=""
  sessionStorage.setItem("wistia:finder-selection",JSON.stringify(finderChoice))
  history.pushState({wistiaDepth:(history.state?.wistiaDepth||0)+1},"","#/find/people");route();return
 }
 if(el.name==="finderPeople"){
  finderChoice.people=el.value
  sessionStorage.setItem("wistia:finder-selection",JSON.stringify(finderChoice))
  const product=finderProduct()
  history.pushState({wistiaDepth:(history.state?.wistiaDepth||0)+1},"",product?"#/detail/"+product:"#/");route()
 }
}
function updateHomeFinder(){
 const home=document.querySelector(".finder-home");if(!home)return
 home.querySelectorAll('input[name="finderRole"]').forEach(input=>input.checked=input.value===finderChoice.role)
 home.querySelectorAll('input[name="finderLyrics"]').forEach(input=>input.checked=input.value===finderChoice.lyrics)
 home.querySelectorAll('input[name="finderPeople"]').forEach(input=>input.checked=input.value===finderChoice.people)
 home.querySelectorAll('input[name="finderMoment"]').forEach(input=>input.checked=input.value===finderChoice.moment)
 const result=home.querySelector("#finderResult")
 if(!result)return
 result.hidden=!(finderChoice.people&&finderChoice.moment)
 if(result.hidden)return
 const key=finderProduct()
 const picked='<p class="finder-picked">'+[finderChoice.role,finderChoice.moment,finderChoice.people].map((value,i)=>FINDER_LABELS[["role","moment","people"][i]][value]).join(" · ")+'</p>'
 result.innerHTML='<span class="eyebrow">YOUR SELECTION</span><h2>선택하신 조건</h2>'+picked+(key?'<h3>'+PRODUCTS[key].title+'</h3><p>상품 구성과 가격을 확인해 보세요</p><a class="finder-next" href="#/event/'+key+'">가격 확인하기 <span aria-hidden="true">↗</span></a>':'<p>선택하신 조건에 맞는 상품은 상담을 통해 안내해 드립니다</p><a class="finder-next" href="'+kakao()+'" target="_blank" rel="noopener noreferrer">카카오톡으로 문의하기 <span aria-hidden="true">↗</span></a>')
}
function renderPicker(kind){
 const song=kind==="song";const keys=song?["solo","duo"]:["duet-film","solo-film"];
 app.innerHTML='<section class="shell section picker">'+label(song?"VOICE RECORDING":"WEDDING SONG FILM")+'<h1>'+(song?"현장에서는 편안하게<br>목소리는 미리 준비하세요":"축가 시간에 상영하는<br>우리의 뮤직비디오")+'</h1><p class="lead">'+(song?"미리 녹음한 목소리가 함께 흐르는 AR로 본식의 긴장을 덜어보세요":"하객 앞에서 직접 부르지 않아도, 직접 부른 노래로 마음을 전합니다")+'</p><div class="picker-grid">'+keys.map((k,i)=>{const p=PRODUCTS[k],m=SERVICE_META[k],href="#/detail/"+k;return '<article>'+label(m.type)+(m.image?'<a class="picker-photo" href="'+href+'" aria-label="'+p.title+' 상품 알아보기">'+img(m.image,p.title+' 안내 이미지')+'</a>':'<div class="type-art" aria-hidden="true">'+(k==="duet-film"?"DUET":"SOLO")+'</div>')+'<h2>'+p.title+'</h2><p>'+m.short+'</p><dl><div><dt>노래하는 사람</dt><dd>'+m.who+'</dd></div><div><dt>받는 결과물</dt><dd>'+m.result+'</dd></div></dl>'+cta("상품 알아보기",href)+'</article>'}).join("")+'</div></section>'+footer()
}
function compositionMedia(scene,index){const media=scene[2];if(!media)return "";if(Array.isArray(media))return '<div class="scene-image scene-pair">'+media.map((src,i)=>img(src,scene[0]+" 실제 영상 장면 "+(i+1))).join("")+'</div>';if(media.includes("-scenes.png"))return '<div class="scene-image scene-sprite" role="img" aria-label="'+escapeHtml(scene[0]+' 연출 이미지')+'" style="--scene-image:url(\'/'+media+'\');--scene-position:'+index*25+'%"></div>';return '<div class="scene-image">'+img(media.replace(".png",".webp"),scene[0]+" 실제 영상 장면")+'</div>'}
function composition(p){if(!p.composition)return "";const hasImages=p.composition.some(s=>s[2]);return '<section class="shell section composition-section">'+heading("",p.compositionTitle||"구성은 이렇습니다",p.compositionDescription||"원하는 장면은 더하고, 필요 없는 구성은 덜어낼 수 있습니다")+'<ol class="scene-grid '+(hasImages?"with-images":"text-scenes")+'">'+p.composition.map((s,i)=>'<li>'+compositionMedia(s,i)+'<div class="scene-copy"><span class="index">'+String(i+1).padStart(2,"0")+'</span><div><h3>'+s[0]+'</h3><p>'+s[1]+'</p></div></div></li>').join("")+'</ol><aside class="custom-note">'+label("1:1 맞춤 제작")+'<h3>정해진 틀보다, 두 분의 이야기</h3><p>구성을 빼거나 순서를 바꾸는 것도 가능합니다<br>원하는 컷이나 스토리가 있다면 1대1 상담으로 맞춤 반영합니다</p></aside></section>'}
function filmFormatNotes(format){return format.notes.length?'<ul>'+format.notes.map(note=>'<li>'+note+'</li>').join("")+'</ul>':""}
function bookingFilmFormatMedia(productKey,formatKey){const sources=FILM_PRICE_IMAGES[productKey]?.[formatKey]||[FILM_FORMAT_IMAGES[productKey][formatKey]];return '<span class="booking-format-media'+(sources.length>1?' is-pair':'')+'">'+sources.map((src,index)=>img(src,FILM_FORMATS[formatKey].title+' 예시 '+(index+1))).join("")+'</span>'}
function filmFormatPrice(productKey,formatKey=selectedFilmFormat){return FILM_FORMAT_PRICES[productKey]?.[formatKey]||PRODUCTS[productKey].normal}
function proposalFormatPreview(formatKey=selectedFilmFormat){const format=FILM_FORMATS[formatKey];return bookingFilmFormatMedia("proposal",formatKey)+'<div><strong>'+format.title+'</strong><p>'+format.summary+'</p></div>'}
function filmFormatSummary(productKey,formatKey){if(formatKey==="making"){if(productKey==="wedding"||productKey==="duet-film")return "녹음 메이킹 클립 6컷(인당 3컷) · 다양한 인서트 컷";if(productKey==="solo-film")return "녹음 메이킹 클립 2컷 · 다양한 인서트 컷"}if(formatKey==="live"&&(productKey==="wedding"||productKey==="duet-film"))return "뮤비 클립 4컷 · 다양한 인서트 컷 · 하객 메시지 · 인터뷰 · 전하는 편지";return FILM_FORMATS[formatKey].summary}
function bookingFilmFormatSection(productKey,step="02"){if(productKey!=="proposal")return "";return '<section class="booking-film-format proposal-format-selector calculator-step proposal-single-format"><span class="booking-step">'+step+'</span><h2>뮤직 비디오 필름</h2><p>직접 부른 노래와 전하고 싶은 이야기를 한 편의 뮤직 비디오로 완성합니다</p><div class="proposal-format-preview" data-proposal-format-preview>'+proposalFormatPreview("live")+'</div></section>'}
function filmUpgradeFeatures(){return ["뮤비 클립 4컷","다양한 인서트 컷","하객 메시지","인터뷰","전하는 편지"]}
function filmUpgradeOption(productKey){if(!FILM_FORMAT_PRODUCTS.has(productKey)||productKey==="proposal")return "";const base=filmFormatPrice(productKey,"making"),live=filmFormatPrice(productKey,"live"),difference=live-base,price=difference>0?"+"+shortWon(difference):shortWon(live),label=difference>0?"뮤직 비디오 필름으로 업그레이드":"뮤직 비디오 필름으로 구성 변경";return '<label class="option-choice film-upgrade-option"><span class="film-upgrade-media">'+img(FILM_FORMAT_IMAGES[productKey].live,"뮤직 비디오 필름 실제 예시 사진",true)+'</span><input type="checkbox" data-film-upgrade="live" '+(selectedFilmFormat==="live"?'checked':'')+'><span class="film-upgrade-copy"><strong>'+label+'</strong><small>기본 녹음 메이킹 필름에 아래 구성이 추가됩니다</small><ul>'+filmUpgradeFeatures(productKey).map(item=>'<li>'+item+'</li>').join("")+'</ul></span><b>'+price+'</b></label>'}
function filmFormatIncluded(productKey){const onePerson=productKey==="proposal"||productKey==="solo-film";const audio=onePerson?["1인 레코딩 · 보컬 디렉팅","디테일 음정·박자 보정","보컬 믹싱 · 최종 마스터링","완성 음원"]:["2인 레코딩 · 보컬 디렉팅","파트 · 화음 구성","디테일 음정·박자 보정","보컬 믹싱 · 최종 마스터링","완성 음원"];const video=selectedFilmFormat==="live"?["하객 메시지 촬영","인터뷰 촬영","뮤비 클립 촬영","전하는 편지 촬영","영상 편집 · 색감 보정","상영용 최종본"]:["인서트 컷 촬영","녹음실 메이킹 촬영","인트로·아웃트로 타이포","영상 편집 · 색감 보정","상영용 최종본"];return {audio,video}}
function packageList(items){return '<ul class="package-list">'+items.map(x=>'<li><span aria-hidden="true">✓</span><span>'+x+'</span></li>').join("")+'</ul>'}
function bookingPackageList(productKey,p){if(FILM_FORMAT_PRODUCTS.has(productKey)){const groups=filmFormatIncluded(productKey);return '<section class="package-group"><h3>오디오 작업</h3>'+packageList(groups.audio)+'</section><section class="package-group"><h3>비디오 작업</h3>'+packageList(groups.video)+'</section>'}return p.included.map(packageItem).map(x=>'<li><span aria-hidden="true">✓</span><span>'+x+'</span></li>').join("")}
function bookingPackageSection(productKey,p){if(!FILM_FORMAT_PRODUCTS.has(productKey))return '<section class="package-section"><h2>기본 제작에 포함되는 작업</h2><ul class="package-list" data-package-list>'+bookingPackageList(productKey,p)+'</ul></section>';return '<details class="package-section"><summary><span><small>선택한 구성 자세히 보기</small><strong data-package-title>'+FILM_FORMATS[selectedFilmFormat].title+' 기본 구성</strong></span><b aria-hidden="true">+</b></summary><div class="package-section-body"><p>선택한 영상 구성에 따라 아래 작업이 기본으로 포함됩니다</p><div class="package-groups" data-package-list>'+bookingPackageList(productKey,p)+'</div>'+filmFormatNotes(FILM_FORMATS[selectedFilmFormat])+'</div></details>'}
function filmProcessSteps(productKey,steps,formatKey){
 if(!FILM_FORMAT_PRODUCTS.has(productKey))return steps;
 let copy=steps.map(step=>[...step]);
 if(formatKey==="making"){
   const filming=["녹음 메이킹 영상 촬영","인서트 컷과 녹음실 메이킹 컷을 촬영하고, 보내주신 인트로·아웃트로 문구를 타이포로 구성합니다"];
   copy[2]=filming
  }
 const images=[...(FILM_PROCESS_IMAGES[productKey]||[])];
 if(formatKey==="making")images[2]=FILM_FORMAT_IMAGES[productKey].making;
 return copy.map((step,index)=>[step[0],step[1],index===copy.length-1?{duration:"약 14일",note:"촬영·자료 전달 후 일정 확정"}:images[index]||step[2]])
}
function inlineVideoResult(p){return '<button class="detail-result-media detail-inline-video inline-video-poster" type="button" data-inline-youtube="'+escapeHtml(p.videoUrl)+'" aria-label="'+escapeHtml(p.title)+' 유튜브 영상 재생">'+img(FILM_FORMAT_IMAGES[p.key]?.live||SERVICE_META[p.key].image,p.title+' 유튜브 영상 미리보기',true)+'<span class="detail-result-badge">유튜브 영상 재생</span><span class="play" aria-hidden="true">▶</span></button>'}
function detailResult(p,m,w,song){
 const copy=escapeHtml(p.resultCopy||(song?"보정과 믹싱·마스터링을 거친 최종 음원으로 전달합니다":"직접 부른 노래와 촬영 장면을 하나의 영상으로 완성합니다"));
 if(p.inlineVideo)return '<div class="detail-result-card">'+inlineVideoResult(p)+'</div>'
 if(w)return '<div class="detail-result-card"><button class="detail-result-media" data-video="'+w.id+'" aria-label="'+w.title+' 실제 결과물 재생">'+img(w.image,w.title,true)+'<span class="detail-result-badge">이렇게 완성됩니다</span><span class="play" aria-hidden="true">▶</span></button><div class="detail-result-copy"><strong>'+m.result+'</strong><p>'+copy+'</p><span>눌러서 실제 결과물 보기</span></div></div>';
 if(p.resultVideo)return '<div class="detail-result-card has-local-video"><div class="detail-result-media detail-local-video"><video controls playsinline preload="auto" muted autoplay loop aria-label="'+escapeHtml(p.title)+' 실제 고객 현장 라이브 영상"><source src="'+escapeHtml(p.resultVideo)+'" type="video/mp4">영상을 재생할 수 없는 브라우저입니다</video><span class="detail-result-badge">실제 고객님이 보내주신 현장 라이브 영상입니다</span></div></div>';
 if(song)return '<div class="detail-result-card"><div class="detail-result-media">'+img(m.image,p.title+" 안내 이미지",true)+'<span class="detail-result-badge">이렇게 완성됩니다</span></div><div class="detail-result-copy"><strong>'+m.result+'</strong><p>'+copy+'</p></div></div>';
 if(m.image)return '<div class="detail-result-card"><div class="detail-result-media song-film-cover">'+img(m.image,p.title+" 연출 이미지",true)+'<span class="detail-result-badge">이렇게 완성됩니다</span></div><div class="detail-result-copy"><strong>'+m.result+'</strong><p>'+copy+'</p></div></div>';
 return '<div class="detail-result-card type-result"><div class="detail-typography" aria-hidden="true">'+(p.key==="duet-film"?"Our duet":p.key==="solo-film"?"Just for you":"Only you")+'</div><div class="detail-result-copy"><span>이렇게 완성됩니다</span><strong>'+m.result+'</strong><p>'+copy+'</p></div></div>'
}
const DETAIL_PERSON_GROUPS={
 solo:[{key:"solo",label:"1인"},{key:"duo",label:"2인"}],
 duo:[{key:"solo",label:"1인"},{key:"duo",label:"2인"}],
 "solo-film":[{key:"solo-film",label:"1인",format:"making"},{key:"duet-film",label:"2인",format:"making"}],
 "duet-film":[{key:"solo-film",label:"1인",format:"making"},{key:"duet-film",label:"2인",format:"making"}],
 wedding:[{key:"solo-film",label:"1인",format:"making"},{key:"wedding",label:"2인",format:"making"}],
 proposal:[{key:"proposal",label:"1인",format:"live"}]
}
function detailPersonPrice(item){return item.format?filmFormatPrice(item.key,item.format):PRODUCTS[item.key].normal}
function detailPersonTabs(key){
 const items=DETAIL_PERSON_GROUPS[key]||[]
 if(!items.length)return ""
 const showPrice=!['solo','duo'].includes(key)
 return '<section class="shell detail-person-picker" aria-label="'+(showPrice?'참여 인원과 가격':'참여 인원')+'"><span>인원 선택</span><div class="detail-person-tabs'+(showPrice?'':' is-label-only')+'">'+items.map(item=>{const active=item.key===key,href="#/detail/"+item.key+(item.format?"/"+item.format:"");return '<a class="'+(active?'is-active':'')+'" href="'+href+'"'+(active?' aria-current="page"':'')+'><small>'+item.label+'</small>'+(showPrice?'<strong>'+shortWon(detailPersonPrice(item))+'</strong>':'')+'</a>'}).join("")+'</div></section>'
}
function soloTopCta(key="solo"){const song=["solo","duo"].includes(key),copy=song?"1인·2인 축가, 이벤트 가격 확인하기":"식전·축가 영상, 이벤트 가격 확인하기";return '<div class="solo-top-cta"><a href="#/event/'+key+'" aria-label="'+copy+'로 이동">'+copy+' <b aria-hidden="true">→</b></a></div>'}
function initSoloTopCta(){const bar=document.querySelector(".solo-top-cta");if(!bar)return;bar.classList.remove("is-stuck");bar.previousElementSibling?.classList.contains("solo-top-cta-sentinel")&&bar.previousElementSibling.remove()}
const SOLO_PERSON_ITEMS=[{key:"solo",title:"1인 축가",desc:"혼자 부르는 무대"},{key:"duo",title:"2인 축가",desc:"함께 부르는 무대"}]
function soloPersonTabs(key){const activeIndex=SOLO_PERSON_ITEMS.findIndex(item=>item.key===key);return '<section class="shell solo-person-picker" aria-label="인원 선택"><div class="solo-person-tabs" role="tablist" aria-label="1인·2인 축가 선택" data-active="'+Math.max(activeIndex,0)+'">'+SOLO_PERSON_ITEMS.map((item,i)=>{const active=item.key===key;return '<a class="solo-person-tab'+(active?' is-active':'')+'" role="tab" aria-selected="'+active+'" tabindex="'+(active?"0":"-1")+'" href="#/detail/'+item.key+'" data-solo-person-tab="'+i+'"><strong>'+item.title+'</strong><span>'+item.desc+'</span></a>'}).join("")+'<span class="solo-person-indicator" aria-hidden="true"></span></div></section>'}
function initSoloPersonTabs(){const tabs=document.querySelector(".solo-person-tabs");if(!tabs)return;const links=[...tabs.querySelectorAll("[data-solo-person-tab]")];links.forEach((link,i)=>{link.addEventListener("keydown",e=>{if(e.key!=="ArrowRight"&&e.key!=="ArrowLeft")return;e.preventDefault();const next=links[(i+(e.key==="ArrowRight"?1:-1)+links.length)%links.length];links.forEach(l=>l.tabIndex=-1);next.tabIndex=0;next.focus()})})}
const DETAIL_PRODUCT_FAMILIES={
 wedding:[{key:"wedding",title:"식전 영상",desc:"예식의 첫 장면"},{key:"duet-film",title:"듀엣 축가 영상",desc:"축가 순서 상영"}],
 "duet-film":[{key:"wedding",title:"식전 영상",desc:"예식의 첫 장면"},{key:"duet-film",title:"듀엣 축가 영상",desc:"축가 순서 상영"}],
 "solo-film":[{key:"solo-film",title:"1인 축가 영상",desc:"한 곡으로 전하는 마음"},{key:"proposal",title:"프로포즈 필름",desc:"고백의 한 장면"}],
 proposal:[{key:"solo-film",title:"1인 축가 영상",desc:"한 곡으로 전하는 마음"},{key:"proposal",title:"프로포즈 필름",desc:"고백의 한 장면"}]
}
function detailProductTabs(key){const items=DETAIL_PRODUCT_FAMILIES[key]||[];if(!items.length)return "";const activeIndex=items.findIndex(item=>item.key===key);return '<section class="shell solo-person-picker detail-product-picker" aria-label="영상 상품 선택"><div class="solo-person-tabs" role="tablist" aria-label="영상 상품 선택" data-active="'+Math.max(activeIndex,0)+'">'+items.map((item,i)=>{const active=item.key===key;return '<a class="solo-person-tab'+(active?' is-active':'')+'" role="tab" aria-selected="'+active+'" tabindex="'+(active?"0":"-1")+'" href="#/detail/'+item.key+'" data-solo-person-tab="'+i+'"><strong>'+item.title+'</strong><span>'+item.desc+'</span></a>'}).join("")+'<span class="solo-person-indicator" aria-hidden="true"></span></div></section>'}
function compactFilmHeroMedia(productKey){return '<div class="detail-result-card compact-film-hero-media"><div class="detail-result-media">'+img(FILM_FORMAT_IMAGES[productKey].making,PRODUCTS[productKey].title+' 실제 촬영 사진',true)+'</div></div>'}
function renderDetail(key,purpose=""){
  if(FILM_FORMAT_PRODUCTS.has(key))selectedFilmFormat=BASE_FILM_FORMAT[key]
 const p=PRODUCTS[key],m=SERVICE_META[key],w=WORKS.find(w=>w.product===key),song=p.category==="song",filmProduct=FILM_FORMAT_PRODUCTS.has(key);
 const compactFilm=["wedding","duet-film","solo-film"].includes(key),result=compactFilm?compactFilmHeroMedia(key):detailResult(p,m,w,song),process=filmProduct?filmProcessSection(key,p.steps):song?songProcessSection(p.steps):processSection(p.steps);
 if(AR_DETAIL_CONTENT[key]){
  const productTabs=["solo","duo"].includes(key)?soloPersonTabs(key):detailProductTabs(key)
  app.innerHTML=soloTopCta(key)+productTabs+'<div class="solo-detail-scope ar-detail-scope" data-ar-product="'+key+'">'+detailHookHero(p,key)+arPrimaryBenefit(key)+soloReviewCarousel()+'<div class="solo-editorial-sheet">'+arExpertStory()+'</div>'+wistiaBeforeAfterSection()+arComparisonSection(key)+soloProcessSlider(key)+(key==="solo"?arCdRatioSection():"")+'<section class="shell section worry-section"><header class="solo-faq-intro" data-solo-section-intro><p data-solo-kicker>FAQ</p><h2 data-solo-title><span class="solo-type-line">자주 묻는 질문을</span><span class="solo-type-line">확인해 보세요.</span></h2><p data-solo-sub><span class="solo-type-line">예약 전 궁금한 내용을 모았습니다.</span><span class="solo-type-line">더 필요한 내용은 편하게 문의해 주세요.</span></p></header>'+faq(p.faq)+'<a class="solo-inline-contact" href="'+escapeHtml(kakao())+'" target="_blank" rel="noopener noreferrer"><strong>더 궁금한 점이 있나요?</strong><span>상담하기 <b aria-hidden="true">›</b></span></a></section>'+footer()+priceBar(key)+'</div>'
  return
 }
 app.innerHTML=detailPersonTabs(key)+'<section class="shell detail-hero'+(compactFilm?' film-summary-hero':'')+'"><div><h1>'+p.title+'</h1><p class="lead">'+p.sub+'</p><div class="detail-facts"><span><b>사용 시점</b>'+m.use+'</span><span><b>참여 인원</b>'+m.who+'</span></div></div>'+result+'</section>'+detailBenefit(p)+reviews(key)+
 (song?detailNext(key)+process+arRatio():(filmProduct?process+filmUpgradeDetail(key):composition(p)+process))+
 detailComparison(p)+detailIncluded(p)+'<section class="shell section worry-section">'+heading("","자주 묻는 질문")+faq(p.faq)+'</section>'+footer()+priceBar(key)
}
const RATIO_SOURCES={"30":"assets/audio/ar-samples/voice-30-web.wav","50":"assets/audio/ar-samples/voice-50-web.wav","70":"assets/audio/ar-samples/voice-70-web.wav","100":"assets/audio/ar-samples/voice-100-web.wav"}
const ratioAudioUrls=new Map()
const ratioAudioPromises=new Map()
let ratioAudioGeneration=0
function arRatio(){const ratios=["30","50","70","100"];if(!ratios.includes(voiceRatio))voiceRatio="70";return '<section class="shell section ratio-section is-loading" aria-busy="true">'+heading("","실제 AR을 들어보고<br>내 목소리 비율을 골라보세요","같은 노래를 30%부터 100%까지 비교할 수 있습니다")+'<div class="ratio-explainer"><div class="ratio-display"><span>현재 선택한 목소리 비율</span><strong id="ratioValue">'+voiceRatio+'<small>%</small></strong></div><div><div class="ratio-buttons" role="group" aria-label="AR 목소리 비율 듣기">'+ratios.map(n=>'<button class="'+(n==="70"?'is-popular':n==="100"?'is-safe':'')+'" data-ratio="'+n+'" aria-pressed="'+(n===voiceRatio)+'" disabled>'+(n==="70"?'<small>가장 인기</small>':n==="100"?'<small>완전 안전</small>':'<small aria-hidden="true">&nbsp;</small>')+'<span>'+n+'%</span></button>').join("")+'</div><div class="ratio-audio-stack"><audio id="ratioAudio" class="ratio-audio is-active" data-ratio-audio="'+voiceRatio+'" controls preload="auto">오디오를 재생할 수 없는 브라우저입니다</audio></div><p id="ratioHelp">폐하께서 제공하신 비율별 원본 음원을 준비하고 있습니다</p><p class="ratio-guide"><strong>본식에 맞는 비율을 함께 결정합니다</strong><span>스튜디오에서 리허설과 AR 연습 방법을 안내해 드리며, 실제 노래 방식에 맞춰 1:1 맞춤 비율을 결정합니다</span></p><p class="fine">샘플곡 · 그중에 그대를 만나</p></div></div></section>'}
function ratioSource(ratio){return RATIO_SOURCES[ratio]+"?v=167"}
async function ratioBlobSource(ratio){
 if(ratioAudioUrls.has(ratio))return ratioAudioUrls.get(ratio)
 if(ratioAudioPromises.has(ratio))return ratioAudioPromises.get(ratio)
 const generation=ratioAudioGeneration
 const pending=fetch(ratioSource(ratio)).then(response=>{if(!response.ok)throw new Error("audio load failed: "+response.status);return response.blob()}).then(blob=>{const url=URL.createObjectURL(blob);if(generation!==ratioAudioGeneration){URL.revokeObjectURL(url);throw new Error("ratio audio route changed")};ratioAudioUrls.set(ratio,url);ratioAudioPromises.delete(ratio);return url}).catch(error=>{ratioAudioPromises.delete(ratio);throw error})
 ratioAudioPromises.set(ratio,pending)
 return pending
}
function releaseRatioAudioSources(){
 ratioAudioGeneration++;ratioSwitchToken++;stopSoloAutoCompare()
 const audio=document.querySelector("#ratioAudio");if(audio){audio.pause();audio.removeAttribute("src");audio.load()}
 ratioAudioUrls.forEach(url=>URL.revokeObjectURL(url));ratioAudioUrls.clear();ratioAudioPromises.clear()
}
function waitForRatioAudio(audio){return new Promise((resolve,reject)=>{if(audio.readyState>=3)return resolve();let timer;const done=callback=>event=>{clearTimeout(timer);audio.removeEventListener("canplay",onReady);audio.removeEventListener("error",onError);callback(event)},onReady=done(resolve),onError=done(()=>reject(audio.error||new Error("audio load failed")));audio.addEventListener("canplay",onReady,{once:true});audio.addEventListener("error",onError,{once:true});timer=setTimeout(onError,12000)})}
function setRatioStatus(message,isError=false){const help=document.querySelector("#ratioHelp");if(!help)return;help.textContent=message;help.classList.toggle("is-error",isError)}
async function prepareRatioAudioSources(){const section=document.querySelector(".ratio-section"),audio=document.querySelector("#ratioAudio");if(!section||!audio)return;try{audio.src=await ratioBlobSource(voiceRatio);if(!section.isConnected)return;audio.dataset.ratioAudio=voiceRatio;audio.load();await waitForRatioAudio(audio);section.classList.remove("is-loading");section.removeAttribute("aria-busy");section.querySelectorAll("[data-ratio]").forEach(button=>button.disabled=false);setRatioStatus("각 비율은 서로 다른 원본 음원이며 재생 위치를 유지해 전환됩니다")}catch{if(section.isConnected)setRatioStatus("음원을 불러오지 못했습니다. 잠시 후 새로고침해 주세요.",true)}}
function fadeRatioAudio(audio,from,to,duration,token){return new Promise(resolve=>{if(!audio)return resolve(false);const started=performance.now();audio.dataset.ratioFading="true";const tick=now=>{if(token!==ratioSwitchToken){delete audio.dataset.ratioFading;resolve(false);return}const progress=Math.min(1,(now-started)/duration);audio.volume=Math.max(0,Math.min(1,from+(to-from)*progress));if(progress<1)requestAnimationFrame(tick);else{delete audio.dataset.ratioFading;resolve(true)}};requestAnimationFrame(tick)})}
async function switchRatioAudio(ratio,options={}){
 const audio=document.querySelector("#ratioAudio");if(!audio||audio.dataset.ratioAudio===ratio)return
 const token=++ratioSwitchToken,position=audio.currentTime||0,oldDuration=audio.duration,wasPlaying=!audio.paused,shouldPlay=options.play??wasPlaying,volume=audio.volume,muted=audio.muted,rate=audio.playbackRate,previousSrc=audio.src,previousRatio=audio.dataset.ratioAudio
 const nearEnd=audio.ended||(Number.isFinite(oldDuration)&&oldDuration-position<.75),nextPosition=nearEnd?0:position
 setRatioStatus(ratio+"% 음원을 불러오는 중입니다")
 if(wasPlaying){const faded=await fadeRatioAudio(audio,volume,0,70,token);if(!faded)return}
 audio.pause()
 try{
  const source=await ratioBlobSource(ratio);if(token!==ratioSwitchToken)return
  audio.src=source;audio.dataset.ratioAudio=ratio;audio.muted=muted;audio.playbackRate=rate;audio.load();let queuedPlay=null;if(shouldPlay){audio.volume=0;queuedPlay=audio.play()}await waitForRatioAudio(audio);if(queuedPlay)await queuedPlay;if(token!==ratioSwitchToken)return
  const limit=Number.isFinite(audio.duration)?Math.max(0,audio.duration-.75):nextPosition
  try{audio.currentTime=Math.min(nextPosition,limit)}catch{}
  audio.volume=volume
  if(shouldPlay){if(token!==ratioSwitchToken){audio.pause();return}await fadeRatioAudio(audio,0,volume,100,token)}
  setRatioStatus(ratio+"% · 재생 준비 완료")
 }catch{
  if(token!==ratioSwitchToken)return
  audio.src=previousSrc;audio.dataset.ratioAudio=previousRatio;audio.muted=muted;audio.playbackRate=rate;audio.volume=volume;audio.load()
  try{await waitForRatioAudio(audio);audio.currentTime=Math.min(position,Math.max(0,audio.duration-.75));if(wasPlaying)await audio.play()}catch{}
  setRatioStatus(ratio+"% 음원을 불러오지 못했습니다. 다시 선택해 주세요.",true)
 }
}
const SOLO_RATIO_STEPS=["30","50","70","100"]
const SOLO_RATIO_META={"30":{label:"안정감 중심",desc:"AR의 도움을 충분히 받는 편안한 비율"},"50":{label:"균형 있게",desc:"내 목소리와 AR이 고르게 들리는 비율"},"70":{label:"자연스럽게",desc:"라이브의 생동감과 안정감이 잘 맞는 추천 비율"},"100":{label:"목소리 중심",desc:"녹음한 내 목소리를 가장 선명하게 듣는 비율"}}
function soloRatioIndex(ratio){return Math.max(0,SOLO_RATIO_STEPS.indexOf(ratio))}
function soloArRatioSection(){
 if(!SOLO_RATIO_STEPS.includes(voiceRatio))voiceRatio="70"
 const meta=SOLO_RATIO_META[voiceRatio]
 return '<section class="shell section ratio-section solo-ratio is-loading" aria-busy="true" data-ratio="'+voiceRatio+'">'
  +'<div class="solo-ratio-experience">'
  +'<div class="solo-ratio-control"><header><h2>실제 AR을 들어보고<br>내 목소리 비율을 골라보세요</h2><p>같은 노래를 30%부터 100%까지 비교할 수 있습니다.</p></header>'
  +'<div class="solo-ratio-choices" role="group" aria-label="AR 목소리 비율 선택">'+SOLO_RATIO_STEPS.map(ratio=>'<button type="button" class="solo-ratio-mark solo-ratio-choice'+(ratio===voiceRatio?' is-active':'')+'" data-ratio="'+ratio+'" data-ratio-choice="'+ratio+'" aria-pressed="'+(ratio===voiceRatio)+'" disabled>'+(ratio==="70"?'<small>가장 인기</small>':ratio==="100"?'<small>완전 안전</small>':'<small aria-hidden="true">&nbsp;</small>')+'<b>'+ratio+'%</b></button>').join('')+'</div>'
  +'<div class="solo-ratio-player"><audio id="ratioAudio" class="ratio-audio is-active" data-ratio-audio="'+voiceRatio+'" preload="auto">오디오를 재생할 수 없는 브라우저입니다</audio><button type="button" class="solo-ratio-play" id="soloRatioPlay" aria-label="재생" disabled><svg class="icon-play" width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5-9-5.5Z" fill="currentColor"/></svg><svg class="icon-pause" width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" hidden><rect x="3" y="2" width="3" height="12" rx="1" fill="currentColor"/><rect x="10" y="2" width="3" height="12" rx="1" fill="currentColor"/></svg></button><div class="solo-ratio-progress"><span class="solo-ratio-time" id="soloRatioCurrent">0:00</span><div class="solo-ratio-bar" id="soloRatioBar"><span class="solo-ratio-bar-fill" id="soloRatioBarFill"></span></div><span class="solo-ratio-time" id="soloRatioDuration">0:00</span></div><button type="button" class="solo-ratio-mute" id="soloRatioMute" aria-label="음소거"><svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6v4h2.5l3.5 3V3l-3.5 3H2Z" fill="currentColor"/><path class="mute-wave" d="M10.5 5.5a3 3 0 0 1 0 5" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg></button></div>'
  +'<div class="solo-ratio-guide"><strong>비율, 몰라도 괜찮아요</strong><span>WISTIA 엔지니어가 보컬 톤과 본식 환경을 고려해<br>가장 자연스러운 AR 비율로 세팅합니다.</span></div><p id="ratioHelp" class="solo-ratio-status" role="status" aria-live="polite">비율별 원본 음원을 준비하고 있습니다</p></div>'
  +'<div class="solo-ratio-visual"><div class="solo-ratio-orbit" style="--dial-index:'+soloRatioIndex(voiceRatio)+'"><span class="solo-ratio-orbit-glow" aria-hidden="true"></span><div class="solo-ratio-dial" data-ratio-dial role="meter" aria-label="현재 AR 목소리 비율" aria-valuemin="30" aria-valuemax="100" aria-valuenow="'+voiceRatio+'" aria-valuetext="'+voiceRatio+'%, '+meta.label+'" style="--dial-index:'+soloRatioIndex(voiceRatio)+'"><span class="solo-ratio-dial-face" aria-hidden="true"></span><span class="solo-ratio-center"><span id="soloRatioLabel" class="solo-ratio-label">'+meta.label+'</span><strong class="solo-ratio-value"><span class="solo-ratio-num">'+voiceRatio+'</span><small>%</small></strong><span id="soloRatioDesc" class="solo-ratio-desc">'+meta.desc+'</span></span></div></div></div>'
  +'</div><p class="fine">샘플곡 · 그중에 그대를 만나</p></section>'
}
function arCdRatioSection(){return '<section class="wistia-ar solo-section-reveal" id="arRatioExperience" data-wistia-ar-ratio data-audio-30="'+ratioSource('30')+'" data-audio-50="'+ratioSource('50')+'" data-audio-70="'+ratioSource('70')+'" data-audio-100="'+ratioSource('100')+'" aria-labelledby="wistiaArTitle"><div class="wistia-ar__artboard"><header class="wistia-ar__copy"><p class="wistia-ar__eyebrow">AR RATIO EXPERIENCE</p><h2 class="wistia-ar__title" id="wistiaArTitle">내 목소리 비율을<br>골라보세요</h2></header><div class="wistia-ar__disc-stage" tabindex="0" role="group" aria-label="현재 AR 비율 70%, 손가락으로 밀거나 마우스 휠로 변경"><div class="wistia-ar__orb" aria-hidden="true"><span></span><span></span><span></span><span></span><i></i></div><p class="wistia-ar__mood" data-ratio-mood>균형 있게</p><output class="wistia-ar__ratio-current">70%</output><p class="wistia-ar__gesture">손가락으로 밀거나 마우스 휠을 굴려보세요</p></div><div class="wistia-ar__ratio" aria-label="AR 비율 선택"><input class="wistia-ar__ratio-input" type="range" min="0" max="3" step="1" value="2" aria-label="AR 비율" aria-valuetext="70%"><div class="wistia-ar__ratio-marks" aria-hidden="true"><span data-index="0">30%</span><span data-index="1">50%</span><span data-index="2">70%</span><span data-index="3">100%</span></div></div><div class="wistia-ar__player" aria-label="AR 미리듣기 플레이어"><button class="wistia-ar__play" type="button" aria-label="재생" aria-pressed="false"><span class="wistia-ar__play-icon" aria-hidden="true"></span></button><span class="wistia-ar__time"><span data-current-time>0:00</span> / <span data-duration>0:00</span></span><input class="wistia-ar__seek" aria-label="재생 위치" type="range" min="0" max="32" step="0.1" value="0"><button class="wistia-ar__volume" type="button" aria-label="음소거">◖</button><p class="wistia-ar__error" role="status" hidden>음원을 불러오지 못했습니다</p></div><audio class="wistia-ar__audio" preload="metadata"></audio></div></section>'}
function formatRatioTime(sec){if(!Number.isFinite(sec))return "0:00";const m=Math.floor(sec/60),s=Math.floor(sec%60);return m+":"+String(s).padStart(2,"0")}
function animateSoloRatioValue(section,ratio){
 const center=section.querySelector(".solo-ratio-center")
 if(matchMedia("(prefers-reduced-motion: reduce)").matches){applySoloRatioText(section,ratio);return}
 center.classList.add("is-fading")
 setTimeout(()=>{applySoloRatioText(section,ratio);center.classList.remove("is-fading")},160)
}
function applySoloRatioText(section,ratio){
 const meta=SOLO_RATIO_META[ratio]
 section.dataset.ratio=ratio
 section.querySelector(".solo-ratio-num").textContent=ratio
 section.querySelector("#soloRatioLabel").textContent=meta.label
 section.querySelector("#soloRatioDesc").textContent=meta.desc
 const dial=section.querySelector("[data-ratio-dial]")
 dial.style.setProperty("--dial-index",soloRatioIndex(ratio))
 const orbit=section.querySelector(".solo-ratio-orbit");if(orbit)orbit.style.setProperty("--dial-index",soloRatioIndex(ratio))
 dial.setAttribute("aria-valuenow",ratio)
 dial.setAttribute("aria-valuetext",ratio+"%, "+meta.label)
 section.querySelectorAll(".solo-ratio-mark").forEach(button=>{const active=button.dataset.ratio===ratio;button.classList.toggle("is-active",active);button.setAttribute("aria-pressed",String(active))})
}
function togglseSoloPlayIcon(btn,playing){btn.querySelector(".icon-play").hidden=playing;btn.querySelector(".icon-pause").hidden=!playing;btn.setAttribute("aria-label",playing?"일시정지":"재생")}
let soloAutoCompareToken=0
function soloSleep(ms,token){return new Promise(resolve=>{setTimeout(()=>resolve(token===soloAutoCompareToken),ms)})}
function stopSoloAutoCompare(){soloAutoCompareToken++;const compareBtn=document.querySelector("#soloRatioCompare");if(compareBtn&&compareBtn.classList.contains("is-running")){compareBtn.classList.remove("is-running");compareBtn.textContent="4가지 비율 자동 비교"}}
async function startSoloAutoCompare(section,compareBtn,audio){
 const token=++soloAutoCompareToken
 compareBtn.classList.add("is-running");compareBtn.textContent="자동 비교 중지"
 try{await Promise.all(SOLO_RATIO_STEPS.filter(ratio=>ratio!==audio.dataset.ratioAudio).map(ratio=>ratioBlobSource(ratio)))}catch{if(token===soloAutoCompareToken){compareBtn.classList.remove("is-running");compareBtn.textContent="4가지 비율 자동 비교";setRatioStatus("비교할 음원을 모두 불러오지 못했습니다. 다시 시도해 주세요.",true)}return}
 if(token!==soloAutoCompareToken)return
 if(audio.paused){try{await audio.play()}catch{}}
 for(const ratio of SOLO_RATIO_STEPS){
  if(token!==soloAutoCompareToken)return
  if(ratio!==voiceRatio){voiceRatio=ratio;animateSoloRatioValue(section,ratio);await switchRatioAudio(ratio,{play:true})}
  if(token!==soloAutoCompareToken)return
  const ok=await soloSleep(4500,token)
  if(!ok)return
 }
 if(token!==soloAutoCompareToken)return
 voiceRatio="70";animateSoloRatioValue(section,"70");await switchRatioAudio("70",{play:true})
 if(token!==soloAutoCompareToken)return
 audio.pause()
 compareBtn.classList.remove("is-running");compareBtn.textContent="4가지 비율 자동 비교"
}
function initSoloArRatio(){
 const section=document.querySelector(".solo-ratio");if(!section)return
 const dial=section.querySelector("[data-ratio-dial]"),marks=[...section.querySelectorAll(".solo-ratio-mark")],playBtn=section.querySelector("#soloRatioPlay"),muteBtn=section.querySelector("#soloRatioMute"),bar=section.querySelector("#soloRatioBar"),barFill=section.querySelector("#soloRatioBarFill"),curEl=section.querySelector("#soloRatioCurrent"),durEl=section.querySelector("#soloRatioDuration"),audio=section.querySelector("#ratioAudio")
 if(!dial||!audio)return
 const choose=ratio=>{stopSoloAutoCompare();audio.play().catch(()=>{});if(ratio===voiceRatio)return;voiceRatio=ratio;animateSoloRatioValue(section,ratio);switchRatioAudio(ratio,{play:true})}
 marks.forEach(button=>button.addEventListener("click",()=>choose(button.dataset.ratio)))
 playBtn.addEventListener("click",()=>{if(audio.paused)audio.play().catch(()=>{});else audio.pause()})
 audio.addEventListener("play",()=>togglseSoloPlayIcon(playBtn,true))
 audio.addEventListener("pause",()=>togglseSoloPlayIcon(playBtn,false))
 audio.addEventListener("timeupdate",()=>{if(!Number.isFinite(audio.duration))return;curEl.textContent=formatRatioTime(audio.currentTime);barFill.style.width=Math.min(100,audio.currentTime/audio.duration*100)+"%"})
 audio.addEventListener("loadedmetadata",()=>{durEl.textContent=formatRatioTime(audio.duration)})
 bar.addEventListener("click",e=>{if(!Number.isFinite(audio.duration))return;const rect=bar.getBoundingClientRect(),pos=Math.min(1,Math.max(0,(e.clientX-rect.left)/rect.width));audio.currentTime=pos*audio.duration})
 muteBtn.addEventListener("click",()=>{audio.muted=!audio.muted;muteBtn.classList.toggle("is-muted",audio.muted);muteBtn.setAttribute("aria-label",audio.muted?"음소거 해제":"음소거")})
 const enableWhenReady=()=>{if(!section.classList.contains("is-loading")){marks.forEach(button=>button.disabled=false);playBtn.disabled=false;return}requestAnimationFrame(enableWhenReady)}
 enableWhenReady()
}
function initSoloProcessSlider(){
 const root=document.querySelector("[data-process-studio]");if(!root)return
 const feature=root.querySelector("[data-process-feature]"),image=root.querySelector("[data-process-image]"),eyebrow=root.querySelector("[data-process-eyebrow]"),title=root.querySelector("[data-process-title]"),description=root.querySelector("[data-process-description]"),meta=root.querySelector("[data-process-meta]"),ghost=root.querySelector("[data-process-ghost]"),current=root.querySelector("[data-process-current]"),chapterButtons=[...root.querySelectorAll("[data-process-chapter]")],prev=root.querySelector("[data-process-prev]"),toggle=root.querySelector("[data-process-toggle]"),next=root.querySelector("[data-process-next]")
 const steps=detailStudioSteps(root.dataset.processProduct||"solo")
 const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches
 let activeIndex=0,touchStart=null,autoTimer=null,paused=reduced
 const updateToggle=()=>{toggle.textContent=paused?"▶":"Ⅱ";toggle.setAttribute("aria-pressed",String(paused));toggle.setAttribute("aria-label",paused?"자동 재생 시작":"자동 재생 일시정지")}
 const schedule=()=>{clearTimeout(autoTimer);if(paused||!root.isConnected)return;autoTimer=setTimeout(()=>{render((activeIndex+1)%steps.length);schedule()},3000)}
 const render=(requestedIndex,animate=true)=>{
  activeIndex=Math.min(Math.max(Number(requestedIndex)||0,0),steps.length-1)
  const step=steps[activeIndex],number=String(step.id).padStart(2,"0")
  if(animate){feature.classList.remove("is-entering");void feature.offsetWidth;feature.classList.add("is-entering")}
  if(image.getAttribute("src")!==step.image)image.src=step.image
  image.alt=step.short;eyebrow.textContent=step.eyebrow;title.innerHTML=step.title;description.textContent=step.description;meta.innerHTML=processStudioMeta(step);ghost.textContent=number;current.textContent=number
  chapterButtons.forEach((button,index)=>{const active=index===activeIndex;button.classList.toggle("is-active",active);button.setAttribute("aria-current",active?"step":"false")})
  prev.disabled=activeIndex===0;next.disabled=activeIndex===steps.length-1
 }
 const moveTo=index=>{render(index);schedule()}
 prev.addEventListener("click",()=>moveTo(activeIndex-1));next.addEventListener("click",()=>moveTo(activeIndex+1))
 toggle.addEventListener("click",()=>{paused=!paused;updateToggle();schedule()})
 chapterButtons.forEach(button=>button.addEventListener("click",()=>moveTo(Number(button.dataset.processChapter))))
 feature.addEventListener("keydown",event=>{if(event.key!=="ArrowLeft"&&event.key!=="ArrowRight")return;event.preventDefault();moveTo(activeIndex+(event.key==="ArrowRight"?1:-1))})
 feature.addEventListener("touchstart",event=>{const touch=event.changedTouches[0];touchStart={x:touch.clientX,y:touch.clientY}},{passive:true})
 feature.addEventListener("touchend",event=>{if(!touchStart)return;const touch=event.changedTouches[0],deltaX=touch.clientX-touchStart.x,deltaY=touch.clientY-touchStart.y;touchStart=null;if(Math.abs(deltaX)<45||Math.abs(deltaX)<=Math.abs(deltaY))return;moveTo(activeIndex+(deltaX<0?1:-1))},{passive:true})
 feature.addEventListener("touchcancel",()=>{touchStart=null},{passive:true})
 updateToggle();render(0,false);schedule()
}
function friendLyricsSelection(){
 const selected=finderChoice.role==="singer"?finderChoice.lyrics:""
 if(selected==="no")return '<section class="shell selected-song-result"><div>'+label("선택한 구성")+'<h2>사전 녹음 음원</h2><p>가사 영상 없이 예식에서 사용할 사전 녹음 음원만 준비합니다</p></div></section>'
 return '<section class="shell selected-song-result has-image"><div class="selected-song-image">'+img("assets/img/song-options/lyric-video-v2.webp","예식장 상영용 가사 영상 예시",true)+'</div><div>'+label(selected==="yes"?"선택한 구성":"가사 영상 예시")+'<h2>'+(selected==="yes"?"가사 영상 포함":"예식장에서 바로 사용하는 가사 영상")+'</h2><p>완성한 축가와 사진을 활용해 예식장에서 바로 재생할 수 있는 가사 영상을 제작합니다</p>'+(selected==="yes"?'<strong>+40,000원</strong>':'')+'</div></section>'
}
function renderArPurpose(key){
 const p=AR_PURPOSES[key];
 app.innerHTML='<section class="shell detail-hero"><div>'+label("WEDDING SONG AR")+'<h1>'+(key==="self"?"떨리는 축가에도<br>내 목소리 그대로":"소중한 사람에게<br>떨림 대신 진심을")+'</h1><p class="lead">'+p.title+'</p><p>'+p.useCase+'</p></div><div class="detail-cover">'+img("assets/img/song/solo.webp","축가 녹음을 위한 스튜디오 마이크",true)+'</div></section><section class="shell section detail-intro"><h2>'+p.productTitle+'</h2><p class="lead">'+p.lead+'</p></section>'+
 processSection(p.items)+arRatio()+
 (key==="friend"?friendLyricsSelection():(p.options||[]).map(option=>'<aside class="shell option-banner">'+label("선택 옵션")+'<div><h3>'+option[0]+'</h3><p>'+option[1]+'</p></div><strong>'+option[2]+'</strong></aside>').join(""))+
 reviews()+
 '<section class="shell section">'+heading("CHOOSE YOUR VOICE","한 사람 또는 두 사람","본식에서 함께 부를 인원에 맞춰 선택해 주세요")+'<div class="service-list">'+serviceRows(["solo","duo"])+'</div></section>'+footer()+priceBar("solo",key==="friend"?"friend":"")
}
function eventProductOptions(key,purpose=""){return [...(PRODUCT_OPTIONS[key]||[]),...(key==="solo"&&purpose==="friend"?FRIEND_PRODUCT_OPTIONS:[])]}
function calculate(){
  const baseProduct=PRODUCTS[currentEventProduct],baseFormat=BASE_FILM_FORMAT[currentEventProduct],basePrice=baseFormat?filmFormatPrice(currentEventProduct,baseFormat):baseProduct.normal,product={...baseProduct,normal:basePrice};const chosen=EVENTS.filter(e=>selectedEvents.has(e.key));
 const discount=Math.min(60000,chosen.reduce((sum,e)=>sum+e.discount,0));
 const optionEntries=eventProductOptions(currentEventProduct,currentEventPurpose).flatMap(o=>{const quantity=o.quantity?(optionQuantities[o.key]||0):(selectedOptions.has(o.key)?1:0);return quantity?[{...o,quantity,total:(o.price||0)*quantity}]:[]});
 const songOption=product.category==="song"?SONG_OPTIONS.find(o=>o.key===chosenOption):null;
  const formatUpgrade=baseFormat&&selectedFilmFormat!==baseFormat?filmFormatPrice(currentEventProduct,selectedFilmFormat)-basePrice:0;
  const optionPrice=formatUpgrade+(songOption?.price||0)+optionEntries.reduce((sum,o)=>sum+o.total,0);
  return {product,chosen,discount,optionEntries,songOption,formatUpgrade,optionPrice,finalPrice:product.normal+optionPrice-discount}
}
function renderProductOption(o){
 if(o.notice)return '<div class="option-notice"><span aria-hidden="true">※</span><div><strong>'+o.label+'</strong><small>'+o.detail+'</small></div></div>'
  if(o.quantity){const quantity=optionQuantities[o.key]||0,unit=o.unit||"회",priceUnit=o.priceUnit||"회당";return '<div class="option-choice quantity-option"><span class="option-symbol" aria-hidden="true">+</span><span><strong>'+o.label+'</strong><small>'+o.detail+'</small></span><div class="quantity-control" aria-label="'+o.label+' 인원수"><button type="button" data-option-minus="'+o.key+'" aria-label="'+o.label+' 인원수 줄이기">−</button><output data-option-count="'+o.key+'">'+quantity+unit+'</output><button type="button" data-option-plus="'+o.key+'" aria-label="'+o.label+' 인원수 늘리기">+</button><b>'+priceUnit+' +'+shortWon(o.price)+'</b></div></div>'}
  return '<label class="option-choice"><input type="checkbox" data-option="'+o.key+'" '+(selectedOptions.has(o.key)?"checked":"")+'><span><strong>'+o.label+'</strong><small>'+o.detail+'</small></span><b>'+(o.price?'+'+shortWon(o.price):'상담 후 안내')+'</b></label>'
}
function consultationFields(){const song=PRODUCTS[currentEventProduct]?.category==="song",purpose=song?'<label class="checkout-field" for="contactPurpose"><span>사용 시점</span><input id="contactPurpose" value="축가 순서" readonly></label>':'<label class="checkout-field" for="contactPurpose"><span>상영 시점</span><select id="contactPurpose"><option value="">선택해 주세요</option>'+["식전","식중","축가 순서","기타"].map(x=>'<option'+(consultationDraft.purpose===x?' selected':'')+'>'+x+'</option>').join("")+'</select></label>';return '<section class="calculator-step consultation-step"><span class="booking-step">01</span><h2>사전 정보를 알려주세요</h2><p>먼저 기본 정보를 입력하면 선택한 내용과 함께 상담 문의가 정리됩니다</p><div class="checkout-fields"><label class="checkout-field" for="contactSource"><span>알게 된 경로</span><select id="contactSource"><option value="">선택해 주세요</option>'+["인스타그램","스레드","광고","카페","블로그"].map(x=>'<option'+(consultationDraft.source===x?' selected':'')+'>'+x+'</option>').join("")+'</select></label><label class="checkout-field" for="contactName"><span>성함</span><input id="contactName" value="'+escapeHtml(consultationDraft.name)+'" placeholder="성함 입력"></label><label class="checkout-field" for="eventDate"><span>예식일 또는 사용 예정일</span><input type="text" id="eventDate" value="'+escapeHtml(consultationDraft.eventDate)+'" placeholder="미정이라면 미정이라고 적어주세요"></label>'+purpose+'</div></section>'}
function bookingExtraSection(p,purpose,options,step){const filmUpgrade=filmUpgradeOption(p.key),content=p.category==="song"?'<div class="song-option-grid">'+SONG_OPTIONS.map(o=>'<label class="song-option-card"><img src="'+o.image+'" alt="'+o.label+' 안내 이미지" loading="lazy"><span class="song-option-select"><input type="radio" name="songOption" data-song-option="'+o.key+'" '+(chosenOption===o.key?"checked":"")+'><span><strong>'+o.label+'</strong><small>'+o.detail+'</small></span><b>'+(o.price?'+'+shortWon(o.price):'상담 후 안내')+'</b></span></label>').join("")+'</div>'+(purpose==="friend"&&options.length?'<div class="friend-options">'+options.map(renderProductOption).join("")+'</div>':""):filmUpgrade+options.map(renderProductOption).join("");return '<section class="booking-extra calculator-step"><span class="booking-step">'+step+'</span><h2>추가 옵션</h2><p>녹음 메이킹 필름은 기본으로 포함되며, 필요한 항목만 더할 수 있습니다</p><div class="calculator-option-list">'+content+'</div></section>'}
function eventBenefitsSection(step){return '<details class="event-benefits calculator-step" open><summary><span><small>'+step+'</small><strong>이벤트 혜택 선택</strong><em>해당되는 혜택을 선택해 보세요</em></span><b aria-hidden="true">+</b></summary><div class="event-benefits-body"><div class="event-list">'+EVENTS.map(e=>'<label class="event-choice"><input type="checkbox" data-event="'+e.key+'" '+(selectedEvents.has(e.key)?"checked":"")+'><span><strong>'+e.label+'</strong><small>'+e.detail+'</small></span><b>−'+shortWon(e.discount)+'</b></label>').join("")+'</div><p class="fine">이벤트 참여 조건과 혜택 적용 시점은 예약 상담에서 최종 확인합니다</p></div></details>'}
function renderEvent(key,purpose=""){
 if(currentEventProduct!==key||currentEventPurpose!==purpose){selectedEvents.clear();selectedOptions.clear();optionQuantities={};chosenOption=""}
 if(key==="solo"&&purpose==="friend"&&finderChoice.role==="singer")chosenOption=finderChoice.lyrics==="yes"?"lyrics":"";
 if(["solo","duo"].includes(key)&&purpose==="lyrics")chosenOption="lyrics";
  currentEventProduct=key;currentEventPurpose=purpose;if(FILM_FORMAT_PRODUCTS.has(key))selectedFilmFormat=FILM_FORMATS[purpose]?purpose:BASE_FILM_FORMAT[key];const p=PRODUCTS[key];
 if(p.category==="song")consultationDraft.purpose="축가 순서";
 const finder=finderPriceContext(key);if(finder&&!consultationDraft.purpose)consultationDraft.purpose={pre:"식전",ceremony:"축가 순서",proposal:"기타",live:"축가 순서"}[finder.moment]||"";
 const options=eventProductOptions(key,purpose);
  const film=FILM_FORMAT_PRODUCTS.has(key),showFormat=key==="proposal",formatStep=showFormat?"02":null,optionStep=showFormat?"03":"02",benefitStep=showFormat?"04":"03",selection=showFormat?bookingFilmFormatSection(key,formatStep):'',choices=bookingExtraSection(p,purpose,options,optionStep)+eventBenefitsSection(benefitStep);
 app.innerHTML='<section class="shell section booking-calculator-wrap"><form id="consultForm" class="booking-calculator"><header class="calculator-intro"><a class="text-link" href="'+(film?'#/detail/'+key+'/'+BASE_FILM_FORMAT[key]:'#/detail/'+key)+'">'+p.title+' 상품 안내 '+arrow()+'</a><p class="eyebrow">PRICE CALCULATOR</p><h1>가격 계산기</h1></header>'+consultationFields()+selection+choices+'<div class="booking-mobile-bar booking-static-bar"><span id="mobilePrice"></span><button class="button dark" type="submit">카카오톡 상담 '+arrow()+'</button></div><div id="bookingSummary" hidden aria-live="polite"></div></form></section>'+footer()
 updatePrice()
}
function updatePrice(){let c=calculate();const formatRow=FILM_FORMAT_PRODUCTS.has(currentEventProduct)?'<div><dt>영상 구성</dt><dd>'+FILM_FORMATS[selectedFilmFormat].title+'</dd></div>':'';const finder=finderPriceContext(currentEventProduct),finderRow=finder?'<div class="finder-summary-line"><dt>선택한 조건</dt><dd>'+FINDER_LABELS.role[finder.role]+' · '+FINDER_LABELS.moment[finder.moment]+' · '+FINDER_LABELS.people[finder.people]+'</dd></div>':'';const formatOption=c.formatUpgrade?'<div><dt>뮤직 비디오 필름 업그레이드</dt><dd class="plus">'+(c.formatUpgrade>0?'+':'−')+won(Math.abs(c.formatUpgrade))+'</dd></div>':'',optionRows=formatOption+(c.songOption?'<div><dt>'+c.songOption.label+'</dt><dd class="plus">'+(c.songOption.price?'+'+won(c.songOption.price):'상담 후 안내')+'</dd></div>':'')+c.optionEntries.map(o=>'<div><dt>'+o.label+(o.quantity>1?' '+o.quantity+'회':'')+'</dt><dd class="plus">+'+won(o.total)+'</dd></div>').join("");const eventRows=c.chosen.map(e=>'<div><dt>'+e.label+'</dt><dd class="minus">−'+won(e.discount)+'</dd></div>').join("");document.querySelector("#bookingSummary").innerHTML='<p class="eyebrow"><span class="desktop-summary-label">가격 계산</span><span class="mobile-summary-label">선택한 구성</span></p><h2>'+c.product.title+'</h2><dl class="price-lines">'+finderRow+formatRow+'<div class="normal-line"><dt>기본가</dt><dd>'+won(c.product.normal)+'</dd></div>'+optionRows+eventRows+'</dl><div class="price-formula"><span><small>기본가</small>'+won(c.product.normal)+'</span><i>+</i><span><small>추가 옵션</small>'+won(c.optionPrice)+'</span><i>−</i><span><small>이벤트 혜택</small>'+won(c.discount)+'</span><i>=</i><strong><small>예상 금액</small>'+won(c.finalPrice)+'</strong></div><p class="fine">선택한 조건을 기준으로 계산한 예상 금액이며 최종 적용 여부는 상담에서 확인합니다</p>';const net=c.optionPrice-c.discount,normalPrice=c.discount>0?'<del>'+shortWon(c.product.normal)+'</del>':'<small class="normal-price">'+shortWon(c.product.normal)+'</small>';document.querySelector("#mobilePrice").innerHTML='<span><em>기본가</em>'+normalPrice+'</span><span><em>옵션·혜택</em><small class="'+(net>0?'plus':'minus')+'">'+(net>0?'+':net<0?'−':'')+shortWon(Math.abs(net))+'</small></span><span><em>예상 금액</em><strong>'+shortWon(c.finalPrice)+'</strong></span>'}
function consultationText(){let c=calculate(),picked=c.optionEntries.map(o=>o.label+' +'+won(o.total));if(c.formatUpgrade)picked.unshift('뮤직 비디오 필름 업그레이드 '+(c.formatUpgrade>0?'+':'−')+won(Math.abs(c.formatUpgrade)));if(c.songOption)picked.unshift(c.songOption.label+(c.songOption.price?' +'+won(c.songOption.price):' · 상담 후 안내'));return ["🤍 🇼 🇪 🇱 🇨 🇴 🇲 🇪  🤍","","아래 문의 양식을 복사한 후","내용을 작성해 보내주세요 :D","","보내주신 내용을 확인한 후","최대한 빠르게 안내드리겠습니다 :)","━━━━━","","[ 𝐂𝐨𝐧𝐭𝐚𝐜𝐭 𝐅𝐨𝐫𝐦 ]","","• 어디에서 보고 오셨나요? : "+(consultationDraft.source||""),"• 성함 : "+(consultationDraft.name||""),"• 희망 서비스 : "+c.product.title,FILM_FORMAT_PRODUCTS.has(currentEventProduct)?"• 선택한 영상 구성 : "+FILM_FORMATS[selectedFilmFormat].title:null,"• 예식일 또는 사용 예정일 : "+(consultationDraft.eventDate||""),"• 희망 예약일 : 상담 시 협의","• 희망 시간 : 상담 시 협의","• 상영 시점 : "+(consultationDraft.purpose||""),"","• 선택한 추가 옵션 : "+(picked.length?picked.join(" / "):"선택 없음"),"• 이벤트 혜택 : "+(c.chosen.length?c.chosen.map(e=>e.label+" −"+won(e.discount)).join(" / "):"선택 없음"),"• 예상 금액 : "+won(c.finalPrice)].filter(x=>x!==null).join("\n")}
function showDialog(html,type){
 lastDialogFocus=document.activeElement;dialog.innerHTML='<div class="dialog-content '+type+'"><button class="dialog-close" data-close aria-label="닫기">×</button>'+html+'</div>';
 dialog.showModal();document.body.classList.add("modal-open");document.querySelector("#siteHeader").inert=true;app.inert=true;document.querySelector("#floatingKakao").inert=true;dialog.querySelector("button").focus()
}
function closeDialog(){if(!dialog.open)return;dialog.close();dialog.innerHTML="";document.body.classList.remove("modal-open");document.querySelector("#siteHeader").inert=false;app.inert=false;document.querySelector("#floatingKakao").inert=false;if(lastDialogFocus?.isConnected)lastDialogFocus.focus()}
function openVideo(id){
 const w=WORKS.find(x=>x.id===id);if(!w)return;
 const url=new URL(w.video);url.searchParams.set("autoplay","1");
 showDialog('<div class="video-frame"><iframe src="'+escapeHtml(url.href)+'" title="'+w.title+'" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div><div class="dialog-caption"><div>'+label(w.category)+'<h2>'+w.title+'</h2></div><a class="text-link" href="#/detail/'+w.product+'" data-close>상품 알아보기 '+arrow()+'</a></div><p class="fine">영상이 재생되지 않으면 '+external("YouTube에서 보기",w.video.replace("/embed/","/watch?v=").replace("?rel=0",""))+'</p>',"video-dialog")
}
function playInlineVideo(button){
 const url=new URL(button.dataset.inlineYoutube);url.searchParams.set("autoplay","1");
 const frame=document.createElement("div");frame.className="detail-result-media detail-inline-video";frame.innerHTML='<iframe src="'+escapeHtml(url.href)+'" title="'+escapeHtml(button.getAttribute("aria-label")||"유튜브 영상")+'" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>';
 button.replaceWith(frame)
}
function consultationToast(message,failed=false){document.querySelector(".copy-toast")?.remove();const toast=document.createElement("div");toast.className="copy-toast"+(failed?" is-error":"");toast.setAttribute("role","status");toast.textContent=message;document.body.append(toast);requestAnimationFrame(()=>toast.classList.add("show"));setTimeout(()=>{toast.classList.remove("show");setTimeout(()=>toast.remove(),250)},3600)}
async function copyConsultationAndOpenKakao(){
 const popup=window.open(kakao(),"_blank");if(popup)popup.opener=null;const text=consultationText();let ok=false;
 try {await navigator.clipboard.writeText(text);ok=true}catch{
  const area=document.createElement("textarea");area.value=text;area.style.cssText="position:fixed;opacity:0";document.body.append(area);area.select();ok=document.execCommand("copy");area.remove()
 }
 consultationToast(ok?"채팅창에 복사되었습니다 · 카카오톡 채팅창에 붙여넣어 주세요":"자동 복사가 제한되었습니다 · 문의 양식을 직접 복사해 주세요",!ok)
 if(!popup)location.href=kakao()
}
function navigationMenu(){return '<nav id="mainMenu" aria-label="전체 메뉴"><p class="menu-title">메뉴</p>'+NAVIGATION_GROUPS.map(group=>'<section class="menu-group'+(group.kind?" is-"+group.kind:"")+'"><p class="menu-group-label">'+group.label+'</p><div class="menu-group-items">'+group.items.map(item=>'<a class="menu-item'+(item.kind?" is-"+item.kind:"")+'" href="'+item.href+'"><strong>'+item.title+(item.note?'<em>'+item.note+'</em>':"")+'</strong></a>').join("")+'</div></section>').join("")+'</nav>'}
function header(){
 document.querySelector("#mainMenu")?.remove()
 const siteHeader=document.querySelector("#siteHeader")
 siteHeader.innerHTML='<div class="header-inner shell"><div class="brand-group"><button id="headerBack" class="back-button" aria-label="이전 페이지로 돌아가기" hidden>←</button><a class="wordmark" href="#/" aria-label="WISTIA 홈">'+img("assets/img/wistia-logo-transparent.webp","")+'<span>WISTIA<small>VOICE & FILM</small></span></a></div><button id="menuToggle" aria-expanded="false" aria-controls="mainMenu" aria-label="메뉴 열기"><span></span><span></span><span></span></button></div>';
 siteHeader.insertAdjacentHTML("afterend",navigationMenu())
 document.querySelector("#floatingKakao").href=kakao()
 const soloCtaKakao=document.querySelector("#soloDesktopCtaKakao");if(soloCtaKakao)soloCtaKakao.href=kakao()
}
function enhanceMotion(){
 routeObserver?.disconnect()
 const nodes=[...document.querySelectorAll(".section-heading,.detail-hero>*:not(.detail-result-card),.detail-result-card,.scene-grid li,.process-list li,.service-row,.situation-group,.picker-grid article,.option-banner,.booking-options>section,.ar-story-meta,.ar-story-copy,.ar-story-image,.wistia-ba-copy,.bap-player,.wps-head,.wps-feature,.wistia-ar__copy,.wistia-ar__disc-stage,.solo-detail-scope>section:not(.ar-hook-hero),.solo-detail-scope>.solo-editorial-sheet")]
 nodes.forEach((node,index)=>{node.classList.add("motion-reveal");node.style.setProperty("--motion-delay",Math.min(index%4,3)*70+"ms")})
 if(matchMedia("(prefers-reduced-motion: reduce)").matches){nodes.forEach(node=>node.classList.add("is-visible"));return}
 routeObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");routeObserver.unobserve(entry.target)}}),{threshold:.12,rootMargin:"0px 0px -5% 0px"})
 nodes.forEach(node=>routeObserver.observe(node))
}
let arCdRatioInstance=null,beforeAfterInstance=null
let firstRender=true
function route(){
 closeDialog();routeObserver?.disconnect();arCdRatioInstance?.destroy();arCdRatioInstance=null;beforeAfterInstance?.destroy();beforeAfterInstance=null;const parts=(location.hash.replace(/^#/,"")||"/").split("/").filter(Boolean);const [type,key]=parts;
 const home=!type||type==="section"||type==="find";const detail=type==="detail"&&PRODUCTS[key];const choice=type==="choose"&&FILM_FORMAT_PRODUCTS.has(key);const ar=type==="ar"&&AR_PURPOSES[key];const event=type==="event"&&PRODUCTS[key];const info=type==="info"&&INFO_PAGES[key];const purpose=parts[2]||"";const validDetail=detail||choice;
 const nextHasRatio=Boolean(ar||(detail&&(key==="solo"||PRODUCTS[key]?.category==="song")));if(document.querySelector("#ratioAudio")&&!nextHasRatio)releaseRatioAudioSources()
 const unifiedDetail=Boolean(validDetail&&AR_DETAIL_CONTENT[key]),arDetail=Boolean(detail&&["solo","duo"].includes(key));document.body.dataset.page=home?"home":event?"event":validDetail?"detail":info?"info":"inner";document.body.classList.toggle("has-price-bar",Boolean(validDetail||ar));document.body.classList.toggle("is-solo-detail",unifiedDetail);document.body.classList.toggle("is-ar-detail",arDetail);
 const soloCta=document.querySelector("#soloDesktopCta");if(soloCta)soloCta.hidden=!unifiedDetail;
 document.body.classList.remove("menu-open");document.querySelector("#menuToggle")?.setAttribute("aria-expanded","false");
 const headerBack=document.querySelector("#headerBack");if(headerBack)headerBack.hidden=home&&type!=="find";
 if(home)renderHome(type==="find"?key:"role");else if(choice)renderDetail(key);else if(detail)renderDetail(key,purpose);else if(event)renderEvent(key,purpose);else if(info)renderInfoPage(key);else if(ar)renderArPurpose(key);else if(type==="song"||type==="film")renderPicker(type);else app.innerHTML='<section class="shell section"><h1>찾으시는 페이지가 없습니다</h1><p>상품 목록에서 준비 중인 순간을 다시 찾아보세요</p>'+cta("상품 찾아보기","#/")+'</section>'+footer();
 prepareRatioAudioSources();
 prepareArHookVideo();
 initArIndexWheel();
 initExpertSlider();
 initArCompare();
 initSoloTopCta();
 initSoloPersonTabs();
 initSoloArRatio();
 arCdRatioInstance=window.initArCdRatio?.()||null
 beforeAfterInstance=window.initWistiaBeforeAfter?.()||null
 initSoloProcessSlider();
 startReviewCarousel();
 enhanceMotion();
 window.initHeroEditor?.(validDetail ? key : "");
 window.initProcessEditor?.(validDetail ? key : "");
 document.title=home?"WISTIA — 우리의 목소리로 남기는 특별한 순간":(PRODUCTS[key]?.title||"축가 녹음 및 영상")+" | WISTIA";
 const target=type==="section"?document.getElementById(key):null;
 requestAnimationFrame(()=>{if(target)target.scrollIntoView({behavior:firstRender||matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});else window.scrollTo({top:0,behavior:"instant"});firstRender=false});
 app.focus({preventScroll:true});
 document.querySelectorAll("#mainMenu a").forEach(a=>{if(a.hash===location.hash)a.setAttribute("aria-current","location");else a.removeAttribute("aria-current")})
}
function goBack(){if((history.state?.wistiaDepth||0)>0)history.back();else location.hash="#/"}
history.replaceState({...history.state,wistiaDepth:history.state?.wistiaDepth||0},"");
document.addEventListener("click",e=>{
 const el=e.target.closest("a,button,summary[data-process-step]");if(!el)return;
 if(el.matches("[data-close]")){closeDialog();if(el.tagName==="BUTTON")return}
 if(el.id==="headerBack")goBack();
 if(el.id==="menuToggle"){const open=!document.body.classList.contains("menu-open");document.body.classList.toggle("menu-open",open);el.setAttribute("aria-expanded",String(open));el.setAttribute("aria-label",open?"메뉴 닫기":"메뉴 열기")}
 if(el.dataset.inlineYoutube)playInlineVideo(el);
 if(el.dataset.video)openVideo(el.dataset.video);
 if(el.hasAttribute("data-review-prev")){moveReviews(-1);startReviewCarousel(false)}
 if(el.hasAttribute("data-review-next")){moveReviews(1);startReviewCarousel(false)}
 if(el.dataset.optionPlus||el.dataset.optionMinus){const key=el.dataset.optionPlus||el.dataset.optionMinus,option=eventProductOptions(currentEventProduct,currentEventPurpose).find(item=>item.key===key),delta=el.dataset.optionPlus?1:-1,max=option?.max??Infinity;optionQuantities[key]=Math.min(max,Math.max(0,(optionQuantities[key]||0)+delta));const output=document.querySelector('[data-option-count="'+key+'"]');if(output)output.textContent=optionQuantities[key]+(option?.unit||'회');updatePrice()}
 if(el.dataset.ratio&&!el.closest(".solo-ratio")){voiceRatio=el.dataset.ratio;const value=document.querySelector("#ratioValue");if(value)value.innerHTML=voiceRatio+"<small>%</small>";document.querySelectorAll("[data-ratio]").forEach(b=>b.setAttribute("aria-pressed",String(b===el)));switchRatioAudio(voiceRatio)}
 if(el.hasAttribute("data-ar-video-toggle")){const video=el.closest(".ar-hook-media")?.querySelector("video");if(video){if(video.paused)video.play().catch(()=>{});else video.pause()}}
 if(el.dataset.processFormat){const section=el.closest(".film-process-section"),format=el.dataset.processFormat,expand=el.getAttribute("aria-expanded")!=="true";section?.querySelectorAll("[data-process-format]").forEach(button=>button.setAttribute("aria-expanded",String(expand&&button===el)));section?.querySelectorAll("[data-process-panel]").forEach(panel=>panel.hidden=!expand||panel.dataset.processPanel!==format)}
 if(el.matches("summary[data-process-step]")){const current=el.closest("details");current?.parentElement.querySelectorAll(":scope > details[open]").forEach(item=>{if(item!==current)item.open=false})}
 if(el.hasAttribute("data-reservation")){document.querySelector("#reservation")?.scrollIntoView({behavior:"smooth"});document.querySelector("#eventDate")?.focus({preventScroll:true})}
 if(el.tagName==="A"&&el.getAttribute("href")?.startsWith("#/")){e.preventDefault();const hash=el.getAttribute("href");if(hash!==location.hash){history.pushState({wistiaDepth:(history.state?.wistiaDepth||0)+1},"",hash)}route()}
})
document.addEventListener("change",e=>{
 const el=e.target;
 if(el.dataset.event){el.checked?selectedEvents.add(el.dataset.event):selectedEvents.delete(el.dataset.event);updatePrice()}
 if(el.dataset.option){el.checked?selectedOptions.add(el.dataset.option):selectedOptions.delete(el.dataset.option);updatePrice()}
 if(el.dataset.filmUpgrade){selectedFilmFormat=el.checked?"live":BASE_FILM_FORMAT[currentEventProduct];updatePrice()}
 if(el.dataset.filmFormat){const pageY=scrollY;selectedFilmFormat=el.dataset.filmFormat;const list=document.querySelector('[data-package-list]'),title=document.querySelector('[data-package-title]'),details=document.querySelector('.package-section'),preview=document.querySelector('[data-proposal-format-preview]');if(preview)preview.innerHTML=proposalFormatPreview();if(list)list.innerHTML=bookingPackageList(currentEventProduct,PRODUCTS[currentEventProduct]);if(title)title.textContent=FILM_FORMATS[selectedFilmFormat].title+' 기본 구성';const body=details?.querySelector('.package-section-body');if(body){const oldNotes=body.querySelector('ul:not(.package-list)');if(oldNotes)oldNotes.remove();body.insertAdjacentHTML('beforeend',filmFormatNotes(FILM_FORMATS[selectedFilmFormat]))}if(details?.tagName==='DETAILS')details.open=true;updatePrice();requestAnimationFrame(()=>requestAnimationFrame(()=>scrollTo({top:pageY,behavior:'instant'})))}
 if(el.dataset.songOption){chosenOption=el.checked?el.dataset.songOption:"";updatePrice()}
 if(el.id==="contactSource")consultationDraft.source=el.value;
 if(el.id==="contactName")consultationDraft.name=el.value;
 if(el.id==="eventDate")consultationDraft.eventDate=el.value;
 if(el.id==="contactPurpose")consultationDraft.purpose=el.value
})
document.addEventListener("input",e=>{const el=e.target;if(el.id==="contactName")consultationDraft.name=el.value;if(el.id==="eventDate")consultationDraft.eventDate=el.value})
document.addEventListener("submit",e=>{if(e.target.id==="consultForm"){e.preventDefault();copyConsultationAndOpenKakao()}})
dialog.addEventListener("cancel",e=>{e.preventDefault();closeDialog()})
dialog.addEventListener("click",e=>{if(e.target===dialog)closeDialog()})
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&document.body.classList.contains("menu-open")){document.body.classList.remove("menu-open");document.querySelector("#menuToggle")?.setAttribute("aria-expanded","false");document.querySelector("#menuToggle")?.focus()}})
window.addEventListener("popstate",route)
window.addEventListener("hashchange",route)
window.addEventListener("scroll",()=>document.querySelector("#siteHeader")?.classList.toggle("is-scrolled",scrollY>12),{passive:true})
async function init(){
 try{const r=await fetch("wistia-config.json",{cache:"no-store",signal:AbortSignal.timeout(2500)});if(r.ok)config={...config,...await r.json()}}catch{}
 if(!document.querySelector("#siteHeader")||!document.querySelector("#app"))return
 header();route()
}
init()
