const KAKAO_FALLBACK = "http://pf.kakao.com/_GbExjX/chat"

const PRODUCTS = {
  solo: {
    key: "solo", category: "song", kicker: "WEDDING SONG AR", title: "AR 축가 · SOLO(1인) · 1시간",
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
      ["맞춤 제작 상담 · 곡과 키 확인", "예식 분위기와 음역을 확인해 곡·키·본식에서 사용할 AR 방향을 함께 정합니다", "assets/img/process-no-people/01.svg"],
      ["스튜디오 방문 · 녹음 준비", "예약한 날짜에 위스티아 스튜디오를 방문해 마이크와 헤드폰을 맞추고 편안하게 녹음을 준비합니다", "assets/img/process-no-people/02.svg"],
      ["1:1 보컬 디렉팅 & 구간별 녹음", "엔지니어가 호흡·발음·감정 표현을 안내하며 한 소절씩 나누어 녹음합니다", "assets/img/process-no-people/03.svg"],
      ["AR 속 내 목소리 비율 선택", "스튜디오에서 리허설과 AR 연습 방법을 안내해 드리며, 실제 노래 방식에 맞춰 1:1 맞춤 비율을 결정합니다", "assets/img/process-no-people/04.svg"],
      ["멜로다인 수작업 보컬 보정", "원래 목소리의 느낌은 살리면서 음정·박자·호흡을 한 음씩 세밀하게 다듬습니다", "assets/img/process-no-people/05.svg"],
      ["전문 엔지니어 믹싱 & AR 제작", "보컬과 반주의 밸런스를 맞춰 예식장에서 바로 재생할 수 있는 AR 음원으로 완성합니다", "assets/img/process-no-people/06.svg"],
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
    key: "duo", category: "song", kicker: "WEDDING SONG AR", title: "AR 축가 · DUET(2인) · 2시간",
    sub: "1곡 기준 두 분이 2시간 동안 구간별로 녹음하고, 자연스럽고 안정적인 축가 AR로 완성합니다",
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
      ["맞춤 제작 상담 · 곡과 파트 확인", "두 분의 음역과 예식 분위기를 확인해 곡·키·파트·화음 구성을 함께 정합니다", "assets/img/process-no-people/01.svg"],
      ["스튜디오 방문 · 듀엣 녹음 준비", "두 분의 마이크와 헤드폰을 맞추고 각자 부를 파트와 함께 부를 구간을 확인합니다", "assets/img/duet-film/duet-recording.webp"],
      ["1:1 보컬 디렉팅 & 구간별 녹음", "각자의 파트를 한 소절씩 녹음하고 두 목소리의 호흡과 타이밍을 맞춥니다", "assets/img/process-no-people/03.svg"],
      ["AR 속 목소리 비율 선택", "30% · 50% · 70% · 100%를 실제 음원으로 비교해 두 분이 함께 부르기 편한 비율을 선택합니다", "assets/img/process-no-people/04.svg"],
      ["멜로다인 수작업 보컬 보정", "각자의 음색은 살리면서 음정·박자·화음과 함께 부르는 구간의 타이밍을 세밀하게 다듬습니다", "assets/img/process-no-people/05.svg"],
      ["전문 엔지니어 믹싱 & 듀엣 AR 제작", "두 보컬과 반주의 밸런스를 맞춰 예식장에서 바로 재생할 수 있는 AR로 완성합니다", "assets/img/process-no-people/06.svg"],
      ["최종 검수 & 완성본 전달", "본식에서 바로 사용할 수 있도록 두 보컬과 전체 음원을 검수한 뒤 전달합니다", {duration:"약 7일",note:"녹음 완료 후 일정 확정"}]
    ],
    included: ["두 사람 녹음 및 디렉팅", "파트 · 화음 구성", "음정 · 박자 보정", "믹싱 · 마스터링", "최종 음원 전달"],
    faq: [
      ["DUET 상품은 몇 명이 이용하나요", "1곡 기준 두 분이 이용하실 수 있습니다 표기된 2시간에는 기본 안내와 연습 등 부가 시간이 포함됩니다"],
      ["두 사람이 함께 녹음할 수 있나요", "DUET은 1곡 기준 2인 상품입니다 두 분의 파트와 녹음 순서를 안내합니다"],
      ["어떤 파일을 받나요", "예식장에서 사용할 AR과 보컬 보정·믹싱·마스터링을 마친 완성 음원을 전달합니다"]
    ]
  },
  wedding: {
    key: "wedding", category: "wedding", kicker: "WEDDING FILM", title: "듀엣 식전 스토리 필름",
    sub: "직접 부른 노래와 이야기를 식전 또는 축가 순서에 상영할 한 편의 웨딩 필름으로 완성합니다",
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
      ["하객 메시지", "두 분의 새로운 시작을 함께해 주신 하객에게 감사의 인사를 전합니다", "assets/img/wedding/01-guest-message.webp"],
      ["두 사람의 인터뷰", "처음 만난 순간과 함께하며 달라진 점처럼 두 분만이 들려줄 수 있는 이야기를 담습니다", "assets/img/wedding/02-interview.webp"],
      ["립싱크 뮤직비디오", "직접 완성한 노래에 맞춰 두 분이 함께 부르는 모습을 한 편의 뮤직비디오처럼 구성합니다", "assets/img/wedding/03-lipsync-mv.webp"],
      ["녹음 메이킹 영상", "서로의 목소리를 맞추고 노래를 완성해 가는 자연스러운 녹음 과정을 보여드립니다", "assets/img/wedding/04-recording-making.webp"],
      ["우리 둘의 사진", "처음 만난 날부터 결혼을 준비하는 지금까지 두 분의 추억을 완성된 노래와 함께 보여드립니다", "assets/img/wedding/05-couple-memories.webp"],
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
      ["녹음 장면", "서로의 목소리를 맞추고 노래를 완성해 가는 실제 녹음 과정을 담습니다", "assets/img/duet-film/duet-recording.webp"],
      ["노래 뮤비 클립", "직접 완성한 노래에 맞춰 두 분이 함께 부르는 모습을 뮤직비디오처럼 구성합니다", "assets/img/duet-film/duet-music-video.webp"],
      ["서로에게 전하는 편지", "영상의 마지막에는 노래만으로 다 전하지 못한 진심을 두 분의 목소리로 남깁니다", ["assets/img/duet-film/duet-letter-bride.webp", "assets/img/duet-film/duet-letter-groom.webp"]]
    ],
    included: ["두 사람 녹음 및 1대1 디렉팅", "파트 · 화음 구성", "음정 · 박자 보정", "믹싱 · 마스터링", "녹음 메이킹 및 립싱크 촬영", "영상 편집", "축가 상영용 최종본과 완성 음원 전달"],
    faq: [
      ["AR 축가와 축가 스토리 필름은 어떻게 다른가요", "축가 스토리 필름은 직접 녹음한 노래에 두 분의 이야기와 촬영 장면을 더해, 본식 축가 순서에 상영하는 영상입니다<br><br>AR 축가는 미리 녹음한 목소리가 담긴 음원을 틀고, 그 위에 직접 노래하는 방식입니다"],
      ["축가 스토리 필름에는 어떤 장면이 포함되나요", "직접 부른 노래와 녹음 장면에 뮤직비디오 클립, 하객 메시지, 인터뷰와 전하는 편지를 더해 두 사람의 이야기를 담습니다"],
      ["어떤 파일을 받나요", "본식 축가 순서에 상영할 영상과 두 분이 함께 부른 완성 음원을 전달합니다"],
      ["완성까지 얼마나 걸리나요", "기본 제작 기간은 촬영과 자료 전달이 완료된 뒤 약 14일입니다"]
    ]
  },
  "solo-film": {
    key: "solo-film", category: "wedding", kicker: "WEDDING SONG MAKING FILM", title: "축가 녹음 메이킹 필름",
    sub: "한 사람 또는 두 사람이 직접 부른 노래와 녹음 장면을 영상으로 완성해 본식에 상영합니다",
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
      ["녹음 메이킹 촬영", "한 소절씩 노래를 완성해 가는 모습과 녹음실의 자연스러운 장면을 촬영합니다"],
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
    key: "proposal", category: "proposal", kicker: "PROPOSAL FILM", title: "프로포즈 · 답프로포즈",
    sub: "직접 부른 노래와 전하고 싶은 이야기를 녹음 메이킹 또는 스토리형 영상으로 완성합니다",
    normal: 220000,
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
  { key: "blog", type: "payback", label: "블로그 리뷰", discount: 30000, detail: "일 방문자 100명 이상 · 안내 가이드에 따라 작성" },
  { key: "reaction", type: "payback", label: "현장 리액션 영상", discount: 10000, detail: "본식 현장 촬영 파일 제공" },
  { key: "cafe", type: "payback", label: "웨딩 카페 후기", discount: 10000, detail: "300자 이상 · 관련 사진 4장 이상" },
  { key: "instagram", type: "payback", label: "인스타그램 후기", discount: 10000, detail: "후기 50자 이상 · 사진 4장 이상 · BGM 추가 · 공식 계정 태그 · 공개 계정" },
]

const ACTUAL_REVIEW_IMAGES = Array.from({ length: 16 }, (_, index) => index===5?"assets/img/reviews/review-06-clean.webp":`assets/img/reviews/review-${String(index + 1).padStart(2, "0")}.webp`)
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
      ["맞춤 제작 상담 · 곡과 키 확인", "예식 분위기와 음역을 확인해 곡·키·본식에서 사용할 AR 방향을 함께 정합니다", "assets/img/process-no-people/01.svg"],
      ["스튜디오 방문 · 녹음 준비", "예약한 날짜에 위스티아 스튜디오를 방문해 마이크와 헤드폰을 맞추고 편안하게 녹음을 준비합니다", "assets/img/process-no-people/02.svg"],
      ["1:1 보컬 디렉팅 & 구간별 녹음", "엔지니어가 호흡·발음·감정 표현을 안내하며 한 소절씩 나누어 녹음합니다", "assets/img/process-no-people/03.svg"],
      ["AR 속 내 목소리 비율 선택", "30% · 50% · 70% · 100% 중 본식에서 가장 편안한 비율을 실제 음원으로 비교해 선택합니다", "assets/img/process-no-people/04.svg"],
      ["멜로다인 수작업 보컬 보정", "원래 목소리의 느낌은 살리면서 음정·박자·호흡을 한 음씩 세밀하게 다듬습니다", "assets/img/process-no-people/05.svg"],
      ["전문 엔지니어 믹싱 & AR 제작", "보컬과 반주의 밸런스를 맞춰 예식장에서 바로 재생할 수 있는 AR 음원으로 완성합니다", "assets/img/process-no-people/06.svg"],
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
      ["맞춤 제작 상담 · 곡과 키 확인", "축가 분위기와 음역을 확인해 곡·키·현장에서 사용할 AR 방향을 함께 정합니다", "assets/img/process-no-people/01.svg"],
      ["스튜디오 방문 · 녹음 준비", "예약한 날짜에 스튜디오를 방문해 마이크와 헤드폰을 맞추고 편안하게 녹음을 준비합니다", "assets/img/process-no-people/02.svg"],
      ["1:1 보컬 디렉팅 & 구간별 녹음", "엔지니어가 호흡·발음·감정 표현을 안내하며 한 소절씩 나누어 녹음합니다", "assets/img/process-no-people/03.svg"],
      ["AR 속 내 목소리 비율 선택", "30% · 50% · 70% · 100% 중 현장에서 가장 편안한 비율을 실제 음원으로 비교해 선택합니다", "assets/img/process-no-people/04.svg"],
      ["멜로다인 수작업 보컬 보정", "원래 목소리의 느낌은 살리면서 음정·박자·호흡을 한 음씩 세밀하게 다듬습니다", "assets/img/process-no-people/05.svg"],
      ["전문 엔지니어 믹싱 & AR 제작", "보컬과 반주의 밸런스를 맞춰 예식장에서 바로 재생할 수 있는 AR 음원으로 완성합니다", "assets/img/process-no-people/06.svg"],
      ["최종 검수 & 완성본 전달", "예식장에서 바로 사용할 수 있도록 전체 음원을 검수한 뒤 전달합니다", {duration:"약 7일",note:"녹음 완료 후 일정 확정"}]
    ],
  }
}

const app = document.querySelector("#app")
const won = value => value.toLocaleString("ko-KR") + "원"
const shortWon = value => value === 0 ? "0원" : Number.isInteger(value / 10000) ? (value / 10000).toLocaleString("ko-KR") + "만원" : won(value)
const regularPriceForSale = value => value + (value < 50000 ? 30000 : value < 100000 ? 50000 : 100000)
const escapeHtml = value => String(value).replace(/[&<>'"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" })[c])
let config = {accounts:{kakao:KAKAO_FALLBACK}}
let selectedEvents = new Set()
let selectedOptions = new Set()
let optionQuantities = {}
let currentEventProduct = "solo"
let currentEventPurpose = ""
let chosenOption = ""
let selectedFilmFormat = "live"
let selectedFilmPeople = 1
let voiceRatio = "70"
let ratioSwitchToken = 0
let lastDialogFocus = null
let scrollMediaCleanup=null
let reviewFrame
let reviewTarget=0
let reviewDisplay=0
let reviewLast=0
let reviewCleanup=null,reviewHoldUntil=0
const dialog = document.querySelector("#mediaDialog")
const MENU = []
const NAVIGATION_GROUPS = [
 {label:"직접 부른다면",items:[
  {title:"AR 축가 사전녹음",href:"#/detail/solo"}
 ]},
 {label:"영상으로 상영한다면",items:[
  {title:"축가 스토리 필름",href:"#/detail/duet-film"}
 ]},
 {label:"목소리의 변화",items:[
  {title:"보컬 보정 전 후 비교 보기",href:"#/before-after"}
 ]},
 {label:"위스티아",kind:"utility",items:[
  {title:"위스티아는 어떤 곳인가요?",href:"#/info/about"},
  {title:"오시는 길",href:"#/info/location"},
  {title:"이벤트",href:"#/events"},
  {title:"자주 묻는 질문",href:"#/info/faq"}
 ]}
]
const INFO_PAGES = {
 about:{eyebrow:"위스티아 소개",title:"위스티아는\n어떤 곳인가요?",description:"위스티아는 경기도 부천에 위치한 웨딩 축가 전문 스튜디오입니다 AR 축가 사전녹음과 축가 스토리 필름으로 본식에서 전할 노래를 함께 준비합니다"},
 process:{eyebrow:"준비부터 전달까지",title:"진행 안내",description:"상담과 예약부터 녹음, 제작과 완성본 전달까지 네 단계로 준비합니다"},
 location:{eyebrow:"방문 안내",title:"오시는 길",description:"위스티아는 경기도 부천에 있습니다 녹음과 촬영을 위해 방문하실 때 아래 주소를 확인해 주세요"},
 faq:{eyebrow:"",title:"자주 묻는 질문",description:"방문부터 녹음·영상 제작과 수정까지, 자주 궁금해하시는 내용을 모았습니다"}
}
const INFO_FAQ_GROUPS=[
 {title:"방문 안내",items:[
  ["스튜디오는 어디에 있나요?","부천시청역 1번 출구에서 도보 약 300m 거리입니다 주소는 부천시 석천로170번길 19, 2층입니다"],
  ["주차는 가능한가요?","스튜디오 바로 옆 공영주차장을 이용하실 수 있습니다 공영주차장 이용 요금은 별도로 발생하므로 주차비 지원은 어려운 점 참고해 주세요"]
 ]},
 {title:"녹음 안내",items:[
  ["녹음 시간이 남으면 다른 곡도 녹음할 수 있나요?","모든 상품은 1곡 기준이에요. 곡마다 녹음·튠·믹스 작업이 따로 들어가서, 녹음 시간이 남아도 다른 곡은 '1절 녹음 추가'로 진행돼요. 1절 녹음 추가는 +60,000원이며 녹음·튠·믹스를 포함합니다."],
  ["노래를 잘 못해도 괜찮나요?","물론입니다 한 곡을 처음부터 끝까지 부르는 대신 구간별로 나누어 녹음하고, 옆에서 1:1로 디렉팅해 드립니다 녹음 후에는 음정과 박자를 자연스럽게 보정합니다"],
  ["곡의 키는 어떻게 정하나요?","원키가 어렵다면 목소리에 맞게 편한 키로 조정할 수 있습니다 녹음 전 직접 불러보며 가장 자연스럽게 부를 수 있는 키를 함께 정합니다"],
  ["녹음 전에 무엇을 준비하면 되나요?","진행할 곡의 MR과 원하는 키를 미리 보내주시면 좋습니다 듀엣이라면 파트 분배도 알려주세요 가사나 원하는 구성, 축가하고 싶은 영상이나 분위기가 있다면 함께 보내주셔도 됩니다"],
  ["녹음이나 촬영이 길어지면 추가금이 있나요?","아니요 당일 녹음이나 촬영이 예상보다 길어지더라도 별도의 현장 추가금은 받지 않습니다"]
 ]},
 {title:"제작 및 수정 안내",items:[
  ["결과물은 언제 받을 수 있나요?","녹음과 촬영이 끝나고 제작에 필요한 자료를 모두 전달해 주신 날을 기준으로, 음원은 최대 7일 이내, 영상은 최대 14일 이내 전달합니다 정확한 일정은 상담에서 안내드립니다"],
  ["수정도 가능한가요?","네, 수정은 3회까지 무료로 진행합니다 4회차부터는 회당 10,000원의 추가 비용이 발생합니다"]
 ]},
 {title:"영상 상품 안내",items:[
  ["영상 상품과 AR 축가 사전녹음은 무엇이 다른가요?","영상 상품은 예식에서 상영할 영상과 완성 음원을 함께 받는 구성입니다 AR 축가 사전녹음은 예식 당일 직접 노래할 때 함께 재생할 AR 음원을 미리 준비하는 구성입니다"],
  ["축가 스토리 필름에는 어떤 장면이 포함되나요?","노래와 녹음 장면에 협업 촬영 스튜디오의 뮤직비디오 클립, 하객 메시지·인터뷰·전하는 편지를 더해 두 사람의 이야기를 완성합니다"],
  ["축가 스토리 필름에 직접 촬영한 영상도 넣을 수 있나요?","네, 직접 촬영한 영상을 보내주시면 완성 영상에 삽입할 수 있습니다 휴대폰으로 편하게 촬영하셔도 되며, 녹음 당일 스튜디오에서 직접 촬영하셔도 됩니다"],
  ["영상과 음원을 원하는 방향으로 제작할 수 있나요?","네, 영상의 구성과 순서, 사진·영상 활용뿐 아니라 음원 구성과 원하는 분위기도 상담에서 함께 정합니다 다만 꼭 반영하고 싶은 내용은 제작이 시작되기 전에 말씀해 주세요"]
 ]},
 {title:"AR 축가 안내",items:[
  ["AR 축가에서 내 목소리 비율은 어떻게 정하나요?","녹음 당일 여러 비율을 직접 들어보고 실제로 리허설도 해 본 뒤, 가장 편하고 자연스럽게 부를 수 있는 비율을 함께 결정합니다"],
  ["AR을 사용하면 티가 나지 않을까요?","미리 녹음한 목소리와 현장에서 직접 부르는 목소리가 자연스럽게 어우러지도록 비율을 조정합니다 녹음 당일 AR과 함께 직접 불러보는 리허설도 진행합니다"]
 ]}
]
const SERVICE_ORDER = ["duet-film","solo","duo"]
const SERVICE_META = {
  wedding:{type:"OUR STORY",label:"듀엣 식전 스토리 필름",use:"식전 또는 축가 순서",who:"참여 인원 상담 후 결정",result:"이야기가 있는 영상 + 완성 음원",short:"우리의 노래와 이야기를 담는 웨딩 영상",image:"assets/img/wedding/02-interview.webp"},
  "duet-film":{type:"OUR DUET",label:"듀엣 축가 영상",use:"본식 축가 순서",who:"신랑신부 두 사람",result:"본식에서 바로 상영하는 듀엣 축가 영상 + 보컬 보정·믹싱을 마친 완성 음원",short:"우리 둘의 노래로 채우는 축가 시간",image:"assets/img/song-film/duet-video-cover.jpg"},
  "solo-film":{type:"A SONG FOR YOU",label:"축가 녹음 메이킹 필름",use:"본식 축가 순서",who:"한 사람 또는 두 사람",result:"본식에서 바로 상영하는 녹음 메이킹 영상 + 보컬 보정·믹싱을 마친 완성 음원",short:"직접 부른 노래를 녹음 장면과 함께 영상으로",image:"assets/img/solo-film/solo-film-cover-v2.webp"},
  solo:{type:"직접 부르는 축가",label:"AR 축가 · SOLO(1인) · 1시간",use:"현장에서 직접 노래",who:"1곡 기준 · 1인",result:"본식용 AR + 완성 음원",short:"1시간 동안 목소리를 세심하게 준비하는 AR",image:"assets/img/song/solo.webp"},
  duo:{type:"직접 부르는 축가",label:"AR 축가 · DUET(2인) · 2시간",use:"현장에서 직접 노래",who:"1곡 기준 · 2인",result:"본식용 AR + 완성 음원",short:"2시간 동안 넉넉하게 준비하는 AR",image:"assets/img/song/duo.webp"},
  proposal:{type:"ONLY FOR YOU",label:"프로포즈 · 답프로포즈",use:"둘만의 고백 순간",who:"마음을 전하는 한 사람",result:"프로포즈 상영용 영상 + 보컬 보정·믹싱을 마친 완성 음원",short:"말로 다 전하지 못한 마음을 한 편의 영상으로",image:"assets/img/proposal-video-cover.jpg"}
}
const FILM_FORMAT_PRODUCTS = new Set(["wedding","duet-film","solo-film","proposal"])
const FILM_FORMATS = {
  live:{
    title:"스토리형 영상",
    summary:"협업 촬영 스튜디오의 뮤직비디오 클립 · 하객 메시지 · 인터뷰 · 전하는 편지",
    notes:[]
  },
  making:{
    title:"녹음 메이킹 필름",
    summary:"녹음과 촬영 장면을 중심으로 완성하는 영상 편집",
    notes:[
      "협업 촬영 스튜디오 촬영과 인터뷰는 포함되지 않습니다",
      "하객 메시지와 전하는 편지는 직접 촬영한 영상을 보내주시면 삽입할 수 있습니다",
      "녹음 당일 스튜디오에서 휴대폰으로 직접 촬영하셔도 됩니다"
    ]
  }
}
const FILM_FORMAT_IMAGES = {
  wedding:{live:"assets/img/song-film/duet-video-cover.jpg",making:"assets/img/process-no-people/02.svg"},
  "duet-film":{live:"assets/img/song-film/duet-video-cover.jpg",making:"assets/img/process-no-people/02.svg"},
  "solo-film":{live:"assets/img/song-film/duet-video-cover.jpg",making:"assets/img/process-no-people/02.svg"},
  proposal:{live:"assets/img/song-film/duet-video-cover.jpg",making:"assets/img/process-no-people/02.svg"}
}
const FILM_PROCESS_IMAGES = {
  wedding:["assets/img/process-no-people/01.svg",["assets/img/process-no-people/02.svg","assets/img/process-no-people/02.svg"],"assets/img/song-film/duet-video-cover.jpg","assets/img/process-no-people/05.svg","assets/img/process-no-people/06.svg","assets/img/process-no-people/06.svg"],
  "duet-film":["assets/img/process-no-people/01.svg",["assets/img/process-no-people/02.svg","assets/img/process-no-people/02.svg"],"assets/img/song-film/duet-video-cover.jpg","assets/img/process-no-people/05.svg","assets/img/process-no-people/06.svg","assets/img/process-no-people/06.svg"],
  "solo-film":["assets/img/process-no-people/01.svg","assets/img/process-no-people/03.svg","assets/img/solo-film/solo-film-cover-v2.webp","assets/img/process-no-people/05.svg","assets/img/process-no-people/06.svg","assets/img/process-no-people/06.svg"],
  proposal:["assets/img/process-no-people/01.svg","assets/img/process-no-people/03.svg","assets/img/proposal/process-02.webp","assets/img/process-no-people/05.svg","assets/img/process-no-people/06.svg","assets/img/process-no-people/06.svg"]
}
const FILM_PRICE_IMAGES = {
  wedding:{making:["assets/img/process-no-people/02.svg","assets/img/process-no-people/02.svg"]},
  "duet-film":{making:["assets/img/process-no-people/02.svg","assets/img/process-no-people/02.svg"]}
}
const FILM_FORMAT_PRICES = {
  wedding:{live:350000,making:280000},
  "duet-film":{live:350000,making:280000},
  "solo-film":{live:290000,making:220000},
  proposal:{live:290000,making:220000}
}
const BASE_FILM_FORMAT = {
  wedding:"live",
  "duet-film":"live",
  "solo-film":"making",
  proposal:"live"
}

const EXTRA_RECORDING_OPTIONS = [
  {key:"extra-verse",label:"1절 녹음 추가",detail:"다른 곡 1절(입장곡 등)을 추가로 녹음해요. 녹음·튠·믹스 포함",price:60000}
]
const PRODUCT_OPTIONS = {
  solo:[{key:"lyrics-video",label:"가사 영상 추가",detail:"가사를 담은 영상 추가",price:40000},...EXTRA_RECORDING_OPTIONS],
  duo:[{key:"lyrics-video",label:"가사 영상 추가",detail:"가사를 담은 영상 추가",price:40000},...EXTRA_RECORDING_OPTIONS],
  wedding:[...EXTRA_RECORDING_OPTIONS],
  "duet-film":[...EXTRA_RECORDING_OPTIONS],
  "solo-film":[...EXTRA_RECORDING_OPTIONS],
  proposal:[...EXTRA_RECORDING_OPTIONS]
}
const FRIEND_PRODUCT_OPTIONS = [
]
const WORKS = [
 {id:"duet-film",category:"축가 영상",product:"duet-film",title:"위스티아 듀엣 웨딩 필름",description:"두 사람이 함께 부른 노래로 완성한 본식 축가 영상",image:"assets/img/song-film/duet-video-cover.jpg",video:PRODUCTS["duet-film"].videoUrl},
 {id:"proposal-film",category:"프로포즈",product:"proposal",title:"위스티아 프로포즈 필름",description:"직접 부른 노래와 고백을 담은 프로포즈 영상",image:"assets/img/proposal-video-cover.jpg",video:PRODUCTS.proposal.videoUrl}
]
const GENERAL_FAQ = [
 ["녹음 시간이 남으면 다른 곡도 녹음할 수 있나요","모든 상품은 1곡 기준이에요. 곡마다 녹음·튠·믹스 작업이 따로 들어가서, 녹음 시간이 남아도 다른 곡은 '1절 녹음 추가'로 진행돼요. 1절 녹음 추가는 +60,000원이며 녹음·튠·믹스를 포함합니다."],
 ["노래를 잘 못해도 가능한가요","가능합니다 처음 녹음하는 분도 한 구간씩 편하게 부를 수 있도록 안내합니다 원래 목소리와 감정을 살리고 음정과 박자는 자연스럽게 다듬습니다"],
 ["AR은 무엇이고, 본식에서는 어떻게 사용하나요","AR은 미리 녹음한 목소리가 포함된 반주 음원입니다 예식장에서 AR을 틀고 그 위에 직접 노래합니다 목소리 비율과 재생 방법을 상담하고, 본식 전에 예식장 담당자와 음향 리허설을 확인해 주세요"],
 ["곡이나 키를 아직 정하지 못했어요","괜찮습니다 원하는 분위기와 음역을 확인해 곡과 편하게 부를 수 있는 키를 함께 정합니다"],
 ["녹음 시간과 영상 제작 기간은 얼마나 걸리나요","상품과 촬영 구성, 일정에 따라 달라집니다 예식일 또는 영상 사용 예정일을 알려주시면 가능한 일정과 소요 시간을 안내합니다"],
 ["수정은 몇 번 가능한가요","수정 범위와 횟수는 선택한 상품과 제작 구성에 따라 상담 시 안내합니다 꼭 넣고 싶은 장면이나 문구는 제작 전에 함께 정리해 주세요"],
 ["사진이 많이 없어도 가능한가요","보유한 사진과 영상의 양을 확인한 뒤 녹음 장면, 촬영 장면 등 활용 가능한 구성으로 상담합니다"],
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
function kakao(){return (config.accounts?.kakao || KAKAO_FALLBACK).replace(/^http:\/\/pf\.kakao\.com\//,'https://pf.kakao.com/')}
const STUDIO_GRAPHIC_ASSETS={
 "assets/img/process-no-people/01.svg":["consultation","상담 과정을 설명하는 인물 없는 스튜디오 그래픽"],
 "assets/img/process-no-people/02.svg":["recording","녹음 과정을 설명하는 인물 없는 스튜디오 그래픽"],
 "assets/img/process-no-people/03.svg":["directing","디렉팅 과정을 설명하는 인물 없는 스튜디오 그래픽"],
 "assets/img/process-no-people/04.svg":["balance","AR 비율 선택을 설명하는 인물 없는 스튜디오 그래픽"],
 "assets/img/process-no-people/05.svg":["vocal-editing","보컬 보정을 설명하는 인물 없는 스튜디오 그래픽"],
 "assets/img/process-no-people/06.svg":["mixing","믹싱 과정을 설명하는 인물 없는 스튜디오 그래픽"],
 "assets/img/process-studio/07-delivery.svg":["delivery","최종 검수와 완성본 전달을 설명하는 스튜디오 그래픽"],
}
const STUDIO_ICON_PATHS={
 microphone:'<rect x="9" y="2.5" width="6" height="12" rx="3"/><path d="M6 10v2a6 6 0 0 0 12 0v-2M12 18v3.5M8.5 21.5h7M10.5 6h3m-3 3h3"/>',
 camera:'<rect x="2.5" y="6" width="14" height="12" rx="1"/><path d="m16.5 10 5-3v10l-5-3M6 3.5h7"/>',
 tune:'<path d="M3 6h18M3 12h18M3 18h18"/><rect x="6" y="4" width="3" height="4" fill="currentColor" stroke="none"/><rect x="14" y="10" width="3" height="4" fill="currentColor" stroke="none"/><rect x="9" y="16" width="3" height="4" fill="currentColor" stroke="none"/>',
 mix:'<path d="M5 3v18M12 3v18M19 3v18"/><rect x="3" y="6" width="4" height="3" fill="currentColor" stroke="none"/><rect x="10" y="14" width="4" height="3" fill="currentColor" stroke="none"/><rect x="17" y="9" width="4" height="3" fill="currentColor" stroke="none"/>',
 master:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="6"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
 edit:'<rect x="2.5" y="4" width="19" height="16" rx="1"/><path d="M7 4v16M17 4v16M3 9h4m-4 6h4m10-6h4m-4 6h4M10 8v8m4-8v8"/>',
 mv:'<rect x="2.5" y="5" width="19" height="14" rx="1"/><path d="m10 8.5 5.5 3.5-5.5 3.5Z"/>',
 chat:'<path d="M3 4h18v13H8l-5 4V4Z"/><path d="M7 8h10M7 12h7"/>',
 letter:'<rect x="2.5" y="5" width="19" height="14" rx="1"/><path d="m3 6 9 7 9-7M3 18l6-6m12 6-6-6"/>',
 cut:'<circle cx="5" cy="6" r="2.5"/><circle cx="5" cy="18" r="2.5"/><path d="m7 7.5 13 13M7 16.5 20 3.5M11.5 12l2 2"/>',
 join:'<path d="M9.5 14.5l5-5M8.5 16.5l-1.2 1.2a4 4 0 0 1-5.6-5.6l5-5a4 4 0 0 1 5.6 0m-.6 10a4 4 0 0 0 5.6 0l5-5a4 4 0 0 0-5.6-5.6l-1.2 1.2"/>',
 pin:'<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/>',
 check:'<path d="m5 12 4.5 4.5L19 7"/>',
 send:'<path d="m3 4 19 8-19 8 4-8-4-8ZM7 12h15"/>',
 gift:'<path d="M4 10h16v11H4ZM3 7h18v3H3ZM12 7v14"/><path d="M12 7C7 7 5 6 5 4.5A2.5 2.5 0 0 1 9 2.6L12 7Zm0 0c5 0 7-1 7-2.5a2.5 2.5 0 0 0-4-1.9L12 7Z"/>',
 swap:'<path d="M3 8h17m-4-4 4 4-4 4M21 16H4m4-4-4 4 4 4"/>',
 play:'<path d="m7 4 14 8-14 8Z" fill="currentColor" stroke="none"/>',
 pause:'<path d="M7 4v16M17 4v16" stroke-width="3"/>',
 arrow:'<path d="M3 12h18m-7-7 7 7-7 7"/>',
 down:'<path d="M12 3v18m-7-7 7 7 7-7"/>',
 up:'<path d="M12 21V3m-7 7 7-7 7 7"/>',
 chevron:'<path d="m5 9 7 7 7-7"/>',
 package:'<path d="m3 7 9-4 9 4-9 4-9-4Zm0 0v10l9 4 9-4V7M12 11v10M7.5 5l9 4"/>',
 receipt:'<path d="M5 3h14v18l-3-2-4 2-4-2-3 2V3Z"/><path d="M8 7h8M8 11h8M8 15h4"/>',
 workflow:'<rect x="3" y="3" width="6" height="6" rx="1.5"/><rect x="15" y="15" width="6" height="6" rx="1.5"/><path d="M12 6h6v6M6 12v6h6m-3-3 3 3-3 3"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M7 14h2m6 0h2m-10 3h2m6 0h2"/>',
 help:'<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4M12 16.5h.01"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 minus:'<path d="M5 12h14"/>',
 tag:'<path d="M3 3h8l10 10-8 8L3 11V3Z"/><circle cx="7.5" cy="7.5" r="1"/>',
 refund:'<path d="M4 8a8 8 0 1 1-1 7M4 3v5h5M10 8h4m-4 4h4m-2-4v8"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
 people:'<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M17 4a3 3 0 0 1 0 6m1 3a5 5 0 0 1 3 5v3"/>',
 note:'<path d="M9 17V5l11-2v12M9 9l11-2"/><ellipse cx="6" cy="18" rx="3" ry="2.5"/><ellipse cx="17" cy="16" rx="3" ry="2.5"/>',
 file:'<path d="M5 3h9l5 5v13H5V3Zm9 0v5h5M8 12h8M8 16h6"/>',
 shield:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
 headphones:'<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="12" width="4" height="8" rx="2"/><rect x="17" y="12" width="4" height="8" rx="2"/>',
 compare:'<path d="M12 3v18M3 8h6m-3-3L3 8l3 3M21 16h-6m3-3 3 3-3 3"/>',
 menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',
 close:'<path d="m6 6 12 12M18 6 6 18"/>',
 previous:'<path d="M21 12H3m7-7-7 7 7 7"/>',
 next:'<path d="M3 12h18m-7-7 7 7-7 7"/>',
 external:'<path d="M9 5H4v15h15v-5M13 4h7v7m0-7L10 14"/>',
 drag:'<path d="M3 12h18M7 8l-4 4 4 4m10-8 4 4-4 4M10 6h4m-4 12h4"/>',
 speaker:'<path d="M3 9h4l5-4v14l-5-4H3V9Zm13-1a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
 copy:'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M5 16H3V3h13v2"/>'
}
function studioIcon(name){return '<svg class="studio-icon" data-icon="'+(STUDIO_ICON_PATHS[name]?name:'check')+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true" focusable="false">'+(STUDIO_ICON_PATHS[name]||STUDIO_ICON_PATHS.check)+'</svg>'}
function prepareSvgPlayerControls(){
 app.querySelectorAll('.bap-play-icon,.wistia-ar__play-icon').forEach(span=>{span.innerHTML=studioIcon('play')+studioIcon('pause');span.setAttribute('aria-hidden','true')})
 app.querySelectorAll('.bap-play').forEach(button=>button.setAttribute('aria-pressed','false'))
 const arPlay=app.querySelector('.wistia-ar__play')
 if(arPlay&&!arPlay.querySelector('.wistia-ar__play-label'))arPlay.insertAdjacentHTML('beforeend','<span class="wistia-ar__play-label">재생</span>')
 app.querySelectorAll('.bap-switch').forEach(button=>{button.innerHTML=studioIcon('swap')+'<span>전환</span>';button.setAttribute('aria-label','보정 후로 전환하여 듣기')})
 const ratio=app.querySelector('.wistia-ar__ratio')
 if(ratio&&!ratio.querySelector('.wistia-ar__ratio-hint'))ratio.insertAdjacentHTML('beforeend','<p class="wistia-ar__ratio-hint">'+studioIcon('drag')+'<span>손잡이를 좌우로 움직여 비교하세요</span></p>')
 const input=ratio?.querySelector('.wistia-ar__ratio-input')
 if(input){input.setAttribute('aria-describedby','arRatioDragHint');ratio.querySelector('.wistia-ar__ratio-hint').id='arRatioDragHint'}
}
function processFolderArt(){return '<span class="studio-folder-art studio-folder-3d" aria-hidden="true"><img src="assets/img/studio-3d/folder.webp" alt="" loading="eager" decoding="async"></span>'}
function studioKeyArtwork(comfortable=false){const shift=comfortable?17:0;return '<svg class="studio-key-art" viewBox="0 0 180 90" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width=".7" opacity=".3"><path d="M8 16h164M8 31h164M8 46h164M8 61h164M8 76h164M8 16v60m41-60v60m41-60v60m41-60v60m41-60v60"/></g><g fill="currentColor"><rect x="16" y="'+(45+shift)+'" width="27" height="8"/><rect x="56" y="'+(30+shift)+'" width="27" height="8"/><rect x="96" y="'+(15+shift)+'" width="27" height="8"/><rect x="136" y="'+(30+shift)+'" width="27" height="8"/></g><path d="M20 '+(57+shift)+'H43m17-15h23m17-15h23m17 15h23" fill="none" stroke="currentColor" stroke-width="1"/></svg>'}
function studioWaveformGraphic(){const bars=[4,8,15,23,17,9,20,29,14,6,18,24,13,7,11,5];return '<svg class="studio-wave-art" viewBox="0 0 120 32" aria-hidden="true"><path d="M3 16h6'+bars.map((h,i)=>'M'+(13+i*6)+' '+(16-h/2)+'v'+h).join('')+'M110 16h7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="butt"/></svg>'}
function img(src,alt,eager=false){const graphic=STUDIO_GRAPHIC_ASSETS[src];if(graphic){src=graphic[0]==="broadcast"?"assets/img/studio-graphics/broadcast.svg":"assets/img/studio-3d/"+graphic[0]+".webp";alt=graphic[1].replace("스튜디오 그래픽","3D 제작 안내 그래픽")}else if(/^assets\/img\/studio-graphics\/(?!broadcast|priority)[a-z-]+\.svg$/.test(src)){src=src.replace("/studio-graphics/","/studio-3d/").replace(".svg",".webp")}return '<img src="'+escapeHtml(src)+'" alt="'+escapeHtml(alt)+'" loading="'+(eager?"eager":"lazy")+'" decoding="async"'+(eager?' fetchpriority="high"':"")+'>'}
function arrow(){return '<span class="svg-link-arrow" aria-hidden="true">'+studioIcon('external')+'</span>'}
function label(text){return '<p class="eyebrow">'+text+'</p>'}
function heading(kicker,title,description=""){return '<div class="section-heading'+(kicker?"":" no-kicker")+'">'+(kicker?label(kicker):"")+'<div><h2>'+title+'</h2>'+(description?'<p>'+description+'</p>':"")+'</div></div>'}
function cta(text,href,style="dark"){return '<a class="button '+style+'" href="'+href+'">'+text+arrow()+'</a>'}
function external(text,url,cls="text-link"){return '<a class="'+cls+'" href="'+escapeHtml(url)+'" target="_blank" rel="noopener noreferrer">'+text+arrow()+'</a>'}
function priceBar(key,purpose=""){
 return ''
}
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
function footer(){const channels=[['instagram','Instagram',config.accounts?.instagram||'https://www.instagram.com/wistia.film/'],['youtube','YouTube',config.accounts?.youtube||'https://www.youtube.com/@wistia_film'],['kakao','Kakao 상담',kakao()]];return '<footer class="footer shell"><div class="footer-main"><a class="footer-brand" href="#/">'+img('assets/img/wistia-logo-transparent.webp','')+'<span><b>WISTIA</b><small>웨딩 축가 전문 스튜디오</small></span></a><div class="footer-message"><strong class="mas-footer-slogan">완성도는 높이고, 부담은 줄인 가격을 약속드립니다</strong></div></div><div class="footer-divider" aria-hidden="true"></div><nav class="footer-social" aria-label="WISTIA 채널">'+channels.map(channel=>'<a href="'+escapeHtml(channel[2])+'" target="_blank" rel="noopener noreferrer" aria-label="'+channel[1]+' 열기"><i>'+footerIcon(channel[0])+'</i><span>'+channel[1]+'</span></a>').join('')+'</nav><div class="footer-bottom"><small>© '+new Date().getFullYear()+' WISTIA. All rights reserved.</small><a href="/privacy">개인정보처리방침</a><a href="https://aidoc.kr/support/" target="_blank" rel="noopener noreferrer">고객지원</a><span>웨딩 · 목소리 · 영상</span></div></footer>'}
function serviceRows(keys){return keys.map((key,i)=>{let p=PRODUCTS[key],m=SERVICE_META[key];return '<a class="service-row" href="#/detail/'+key+'"><span class="index">'+String(i+1).padStart(2,"0")+'</span><div><h3>'+p.title+'</h3><p>'+m.short+'</p></div><span class="row-use">'+m.use+'</span>'+arrow()+'</a>'}).join("")}
function reviewCard(src,i,clone=false){return '<figure class="review-capture review-crop-'+String(i+1).padStart(2,"0")+'"'+(clone?' aria-hidden="true"':'')+'><span class="review-capture-image"><img src="'+escapeHtml(src)+'" alt="실제 고객 카카오톡 후기 '+(i+1)+'" loading="eager" decoding="async"></span></figure>'}
function homeReviews(){
 const featured=[
  {src:ACTUAL_REVIEW_IMAGES[1],excerpt:"여자친구가 너무 좋아하네요 예쁘게 잘 만들어주셔서 감사합니다",alt:"여자친구에게 보여주기 전 혼자 보며 옛날 생각이 많이 떠올랐고, 여자친구도 너무 좋아했다며 예쁘게 만들어주셔서 감사하다는 고객의 카카오톡 후기"},
  {src:ACTUAL_REVIEW_IMAGES[3],excerpt:"실수를 많이 한거 같아서 걱정했는데 너무너무 만족스럽습니다!",alt:"실수를 많이 한 것 같아 걱정했지만 결과물에 만족했고 영상과 노래가 예뻐 무한 재생하게 된다는 고객의 카카오톡 후기"},
  {src:ACTUAL_REVIEW_IMAGES[4],excerpt:"영상보면서 디테일한 포인트를 잡고 신경 써주신게 느껴지더라구요",alt:"예상보다 파일이 빨리 나왔고 목소리의 변화와 영상의 디테일한 편집이 마음에 들어 감사하다는 고객의 카카오톡 후기"}
 ]
 return '<section class="finder-home-reviews" aria-labelledby="homeReviewsTitle"><header><span class="finder-home-reviews-kicker">고객의 이야기</span><h2 id="homeReviewsTitle">고객님이 직접 보내주신 후기</h2><p>실제 카카오톡 후기 중 일부를 그대로 보여드립니다.</p></header><div class="finder-home-review-list">'+featured.map((review,i)=>'<figure class="finder-home-review"><figcaption><span>'+String(i+1).padStart(2,"0")+' / 03</span><p>“'+escapeHtml(review.excerpt)+'”</p></figcaption><a href="'+escapeHtml(review.src)+'" target="_blank" rel="noopener noreferrer"><img src="'+escapeHtml(review.src)+'" alt="'+escapeHtml(review.alt)+'" loading="lazy" decoding="async"><span>원문 크게 보기 <span aria-hidden="true">↗</span></span></a></figure>').join("")+'</div></section>'
}
function homeClosing(){return '<section class="finder-home-closing" aria-labelledby="homeClosingTitle"><h2 id="homeClosingTitle">노래를 못해도 괜찮습니다.<br>진심만 챙겨오세요.</h2><p>완벽한 디렉팅과 영상으로 기적 같은 하루를 만들어 드립니다.</p><a class="finder-home-closing-contact consult-copy-action" href="'+escapeHtml(kakao())+'" target="_blank" rel="noopener noreferrer">카카오톡으로 상담하기 <span aria-hidden="true">↗</span></a></section>'}
function homeVocalHighlight(){return '<section class="finder-home-highlight" id="homeVocalHighlight" aria-labelledby="homeVocalHighlightTitle"><span class="finder-home-highlight-kicker">목소리 미리듣기</span><h2 id="homeVocalHighlightTitle">같은 구절, 보정 전·후를 차례로</h2><p>보정 전과 후의 보컬 소스는 같은 녹음본입니다.</p><div class="finder-home-highlight-player"><div class="finder-home-highlight-controls"><button class="finder-home-highlight-play" type="button" aria-label="보컬 보정 전후 하이라이트 재생"><span aria-hidden="true">▶</span><b>비교 재생</b></button><div class="finder-home-highlight-now" role="status" aria-live="polite">재생 버튼을 눌러 비교해 보세요</div></div><div class="finder-home-highlight-progress" aria-hidden="true"><span></span></div><div class="finder-home-highlight-meta"><span class="finder-home-highlight-time">0:00 / 1:32</span><div class="finder-home-highlight-modes" aria-hidden="true"><span data-kind="before">보정 전</span><span data-kind="after">보정 후</span></div></div><p class="finder-home-highlight-error" role="alert" hidden>음원을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p></div></section>'}
function reviews(productKey=""){const cards=ACTUAL_REVIEW_IMAGES.map((src,i)=>reviewCard(src,i)).join("");const clones=ACTUAL_REVIEW_IMAGES.map((src,i)=>reviewCard(src,i,true)).join("");return '<section class="section reviews-section'+(productKey==="proposal"?' proposal-reviews':'')+'" id="reviews"><div class="shell"><div class="review-carousel-head">'+heading("","실제 고객 후기","직접 보내주신 카카오톡 후기 원문입니다")+'<div class="review-carousel-controls"><button type="button" data-review-prev aria-label="이전 후기">←</button><button type="button" data-review-next aria-label="다음 후기">→</button></div></div><div class="review-captures" id="reviewTrack" aria-label="실제 고객 후기가 자동으로 순환합니다"><div class="review-loop"><div class="review-set">'+cards+'</div><div class="review-set" aria-hidden="true">'+clones+'</div></div></div></div></section>'}
function soloReviewShowcase(){const total=SOLO_REVIEW_IMAGES.length;return '<section class="solo-review-showcase" id="reviews" data-review-showcase aria-labelledby="soloReviewTitle"><div class="solo-review-copy" data-solo-section-intro><span class="solo-review-kicker" data-solo-kicker>고객 후기</span><h2 id="soloReviewTitle" data-solo-title><span class="solo-type-line">실제 고객</span><span class="solo-type-line">후기</span></h2><span class="solo-review-rule" aria-hidden="true"></span><p data-solo-sub><span class="solo-type-line">위스티아와 함께한 고객님들이</span><span class="solo-type-line">직접 보내주신 카카오톡 후기입니다.</span></p><div class="solo-review-index" aria-label="후기 위치"><span class="solo-review-status" data-review-status>01</span><span class="solo-review-index-line" aria-hidden="true"></span><span>'+String(total).padStart(2,"0")+'</span></div></div><div class="solo-review-visual" aria-label="고객 후기 화면"><span class="solo-review-phone-shadow" aria-hidden="true"></span><div class="solo-review-phone"><div class="solo-review-phone-bezel"><div class="solo-review-phone-screen" aria-live="polite"><div class="solo-review-statusbar" aria-hidden="true"><span>9:41</span><span class="solo-review-status-icons"><span class="solo-review-signal"><i></i><i></i><i></i><i></i></span><span>⌁</span><span class="solo-review-battery"></span></span></div>'+SOLO_REVIEW_IMAGES.map((src,i)=>'<figure class="solo-review-slide'+(i===0?' is-active':'')+'" data-review-slide="'+i+'" data-screen-fill="'+(i<8?'#050505':'#f1f1f1')+'" aria-hidden="'+(i!==0)+'">'+img(src,'실제 고객 카카오톡 후기 '+(i+1))+'</figure>').join('')+'<span class="solo-review-screen-shade" aria-hidden="true"></span></div></div></div></div><nav class="solo-review-navigation" aria-label="후기 넘기기"><span class="solo-review-rail-label">다음 후기</span><span class="solo-review-rail-dot" aria-hidden="true"></span><span class="solo-review-rail-line" aria-hidden="true"></span><button type="button" data-solo-review-next aria-label="다음 후기">›</button></nav></section>'}
function soloReviewCarousel(){
 const cards=ACTUAL_REVIEW_IMAGES.map((src,i)=>reviewCard(src,i)).join("")
 const clones=ACTUAL_REVIEW_IMAGES.map((src,i)=>reviewCard(src,i,true)).join("")
 return '<section class="solo-review-carousel section reviews-section" id="reviews" aria-labelledby="soloReviewTitle"><div class="shell"><div class="review-carousel-head"><header data-solo-section-intro><span data-solo-kicker>고객 후기</span><h2 id="soloReviewTitle" data-solo-title>실제 고객 후기</h2><p data-solo-sub>직접 보내주신 카카오톡 후기 원문입니다</p></header><div class="review-carousel-controls"><button type="button" data-review-prev aria-label="이전 후기">←</button><button type="button" data-review-next aria-label="다음 후기">→</button></div></div><div class="review-captures" id="reviewTrack" aria-label="실제 고객 후기가 자동으로 순환합니다"><div class="review-loop"><div class="review-set">'+cards+'</div><div class="review-set" aria-hidden="true">'+clones+'</div></div></div></div></section>'
}
const AR_DETAIL_CONTENT={
 solo:{
  kicker:"AR 축가 사전녹음 · 1시간",poster:"assets/img/ar-detail/solo-live-proof.jpg",videoLabel:"실제 고객의 본식 AR 축가 현장 영상",
  heroLine1:"떨리는 본식 무대,",heroLine2:"미리 준비한 내 목소리가 함께합니다",
  heroDescription:"미리 녹음하고 자연스럽게 보정한 내 목소리를 AR로 함께 재생해,<br>현장에서는 노래와 마음에만 집중할 수 있습니다.",
  benefitLine1:"라이브의 감동은 그대로,",benefitEmphasis:"AR로 안정감까지 더합니다",
  benefitDescription:["정교하게 보정한 AR이 목소리를 받쳐주고,","본식에서도 자연스럽게 노래를 이어갑니다."],
  keywords:[["01","프로 녹음 퀄리티"],["02","1:1 디렉팅"],["03","노래 못해도 OK"],["04","AR 밸런스"],["05","라이브 안정"]]
 },
 duo:{
  kicker:"AR 축가 사전녹음 · 2시간",poster:"assets/img/song/duo.webp",videoLabel:"실제 고객의 본식 AR 축가 현장 영상",
  heroLine1:"넉넉한 두 시간의 녹음,",heroLine2:"우리의 목소리를 세심하게 완성합니다",
  heroDescription:"두 분이 한 구간씩 녹음하고 음정과 박자를 수작업으로 다듬어,<br>본식에서 함께 부를 AR 음원으로 완성합니다.",
  benefitLine1:"녹음 시간은 넉넉하게,",benefitEmphasis:"한 소절씩 더 세심하게",
  benefitDescription:["2시간 동안 구간별로 녹음하고 목소리를 다듬어,","본식에서 자연스럽게 노래를 이어갈 수 있도록 돕습니다."],
  keywords:[["01","2시간 녹음"],["02","1곡 기준 · 2인"],["03","구간별 디렉팅"],["04","수작업 보정"],["05","믹싱·마스터링"]]
 },
 wedding:{
  kicker:"듀엣 식전 스토리 필름",poster:"assets/img/wedding/03-lipsync-mv.webp",videoLabel:"위스티아 웨딩 영상 예시",
  heroLine1:"우리의 목소리로,",heroLine2:"예식의 장면을 완성합니다",
  heroDescription:"직접 부른 노래와 이야기를 한 편의 웨딩 필름으로 완성해,<br>식전 또는 축가 순서에 마음을 전합니다.",
  benefitLine1:"익숙한 영상 대신,",benefitEmphasis:"우리의 목소리를 담습니다",
  benefitDescription:["노래와 장면을 하나의 흐름으로 엮어,","식전 또는 축가 순서에 상영할 영상으로 완성합니다."],
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
  kicker:"축가 녹음 메이킹 필름",poster:"assets/img/solo-film/solo-film-cover-v2.webp",videoLabel:"위스티아 녹음 메이킹 필름 예시",
  heroLine1:"직접 부른 목소리로,",heroLine2:"가장 진한 마음을 전합니다",
  heroDescription:"직접 부른 노래와 녹음 장면을 축가 영상으로 완성해,<br>본식에서는 편안하게 상영하고 마음은 오래 남깁니다.",
  benefitLine1:"축가 가수 대신,",benefitEmphasis:"내 목소리로 직접 전합니다",
  benefitDescription:["한 소절씩 편안하게 녹음하고 자연스럽게 보정해,","본식 축가 순서에 바로 상영할 한 편의 영상으로 만듭니다."],
  keywords:[["01","1:1 디렉팅"],["02","구간별 녹음"],["03","보컬 보정"],["04","메이킹 촬영"],["05","상영본 전달"]]
 },
 proposal:{
  kicker:"프로포즈 · 답프로포즈",poster:"assets/img/proposal-video-cover.jpg",videoLabel:"위스티아 프로포즈 필름 예시",
  heroLine1:"말로 다 전하지 못한 마음을,",heroLine2:"노래와 장면으로 남깁니다",
  heroDescription:"직접 부른 노래와 두 사람의 이야기를 한 편의 필름으로 완성해,<br>오직 한 사람을 위한 고백의 순간을 만듭니다.",
  benefitLine1:"평범한 선물 대신,",benefitEmphasis:"내 목소리로 마음을 전합니다",
  benefitDescription:["녹음부터 편지와 장면의 흐름까지 함께 완성해,","프로포즈가 끝난 뒤에도 오래 꺼내 볼 고백을 만듭니다."],
  keywords:[["01","곡 방향 상담"],["02","1:1 녹음"],["03","고백 촬영"],["04","스토리 편집"],["05","완성 필름"]]
 }
}
function detailHookHero(p,key="solo"){const content=AR_DETAIL_CONTENT[key]||AR_DETAIL_CONTENT.solo,localVideo=Boolean(p.resultVideo),video=localVideo?'<video loop playsinline preload="metadata" poster="'+escapeHtml(content.poster)+'" aria-label="'+escapeHtml(content.videoLabel)+'"><source src="'+escapeHtml(p.resultVideo)+'" type="video/mp4">영상을 재생할 수 없는 브라우저입니다</video>':"",control=localVideo?'<button type="button" class="ar-hook-video-control" data-ar-video-toggle aria-label="영상 재생"><span class="ar-icon-play" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M4 2.5v11l9-5.5-9-5.5Z" fill="currentColor"/></svg></span><span class="ar-icon-pause" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 16 16"><rect x="3" y="2" width="3" height="12" rx="1" fill="currentColor"/><rect x="10" y="2" width="3" height="12" rx="1" fill="currentColor"/></svg></span></button>':p.videoUrl?'<button type="button" class="ar-hook-video-control ar-hook-video-play" data-inline-youtube="'+escapeHtml(p.videoUrl)+'" aria-label="'+escapeHtml(p.title)+' 실제 영상 재생"><span class="ar-icon-play" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M4 2.5v11l9-5.5-9-5.5Z" fill="currentColor"/></svg></span></button>':"",note=localVideo?"실제 고객님이 보내주신 현장 영상입니다":p.videoUrl?"※ 실제 제작 영상입니다":"※ 위스티아 제작 장면입니다";return '<section class="ar-hook-hero" aria-labelledby="arHookTitle"><div class="ar-hook-media">'+img(content.poster,content.videoLabel,true).replace('<img ','<img class="ar-hook-fallback" ')+video+'<span class="ar-hook-video-source">'+note+'</span>'+control+'</div><div class="ar-hook-copy shell">'+label(content.kicker)+'<h1 id="arHookTitle"><span class="hero-line hero-line1">'+content.heroLine1+'</span><br><strong class="hero-line hero-line2">'+content.heroLine2+'</strong></h1><p>'+content.heroDescription+'</p></div></section>'}
const AR_MIC_ICON='<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3"></rect><path d="M5 10v1a7 7 0 0 0 14 0v-1"></path><line x1="12" y1="18" x2="12" y2="22"></line><line x1="8" y1="22" x2="16" y2="22"></line></svg>'
function arPrimaryBenefit(key="solo"){const content=AR_DETAIL_CONTENT[key]||AR_DETAIL_CONTENT.solo,ar=["solo","duo"].includes(key),benefitLabel=ar?"AR 축가의 장점":"영상 상품의 장점",serviceName=ar?"WISTIA AR 축가":"WISTIA 영상 제작";return '<section class="shell section ar-primary-benefit" aria-labelledby="arPrimaryBenefitTitle"><div class="ar-benefit-copy" data-solo-section-intro><p class="ar-tags" data-solo-kicker>'+benefitLabel+'</p><h2 id="arPrimaryBenefitTitle" data-solo-title><span class="solo-type-line ar-copy-line1">'+content.benefitLine1+'</span><span class="solo-type-line ar-copy-emphasis"><span class="ar-copy-emphasis-bg" aria-hidden="true"></span><span class="ar-copy-emphasis-text">'+content.benefitEmphasis+'</span></span></h2><p class="ar-benefit-desc" data-solo-sub><span class="solo-type-line">'+content.benefitDescription[0]+'</span><span class="solo-type-line">'+content.benefitDescription[1]+'</span></p></div><div class="ar-index-wheel" role="group" aria-label="'+serviceName+'의 다섯 가지 강점"><div class="ar-index-ring ar-index-ring-1" aria-hidden="true"></div><div class="ar-index-ring ar-index-ring-2" aria-hidden="true"></div><div class="ar-index-center" aria-hidden="true">'+AR_MIC_ICON+'</div><ul class="ar-index-items">'+content.keywords.map((k,i)=>'<li><button type="button" class="ar-index-item" data-ar-index="'+i+'" aria-pressed="'+(i===0)+'"><span class="ar-index-dot" aria-hidden="true"></span><span class="ar-index-num">'+k[0]+'</span><span class="ar-index-label">'+k[1]+'</span></button></li>').join("")+'</ul></div></section>'}
let arIndexTimer=null
function stopArIndexAuto(){clearInterval(arIndexTimer);arIndexTimer=null}
function startArIndexAuto(wheel){stopArIndexAuto();if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;arIndexTimer=setInterval(()=>{const items=[...wheel.querySelectorAll(".ar-index-item")];const current=items.findIndex(b=>b.classList.contains("is-active"));setArIndexActive(wheel,(current+1)%items.length)},2500)}
function setArIndexActive(wheel,index){const items=[...wheel.querySelectorAll(".ar-index-item")];items.forEach((b,i)=>{const active=i===index;b.classList.toggle("is-active",active);b.setAttribute("aria-pressed",String(active))})}
function initArIndexWheel(){const wheel=document.querySelector(".ar-index-wheel");stopArIndexAuto();if(!wheel)return;const items=[...wheel.querySelectorAll(".ar-index-item")];if(!items.length)return;setArIndexActive(wheel,0);let resumeTimer=null;const pauseAuto=()=>{stopArIndexAuto();clearTimeout(resumeTimer)};const resumeAuto=()=>{clearTimeout(resumeTimer);resumeTimer=setTimeout(()=>startArIndexAuto(wheel),3200)};items.forEach((b,i)=>{b.addEventListener("mouseenter",()=>{pauseAuto();setArIndexActive(wheel,i)});b.addEventListener("focus",()=>{pauseAuto();setArIndexActive(wheel,i)});b.addEventListener("click",()=>{pauseAuto();setArIndexActive(wheel,i);resumeAuto()});b.addEventListener("blur",()=>{if(!wheel.matches(":hover"))resumeAuto()})});wheel.addEventListener("mouseleave",()=>{if(!wheel.matches(":focus-within"))resumeAuto()});startArIndexAuto(wheel)}
const EXPERT_CARDS=[
 {index:"",keyword:"영상 연출",sub:"크몽 7년 디자이너",detail:"한 곡의 감정이 본식 장면까지<br>자연스럽게 이어지도록 설계합니다.",image:"assets/img/story-polish/film-expert-v2.webp",alt:"영상 연출, 크몽 7년 디자이너를 담은 3D 타이포그래피"},
 {index:"",keyword:"사운드 완성",sub:"〈싱어게인2〉·〈불후의 명곡〉 방송 음악 작업 참여",detail:"<span class=\"ar-essential-line\"><span class=\"ar-line-full\">목소리의 음정과 밸런스를 다듬어, 자연스럽게 들리는 AR을 완성합니다</span><span class=\"ar-line-compact\">음정과 밸런스를 다듬어 자연스러운 AR로</span></span>",image:"assets/img/ar-detail/broadcast-typography-noir-v3.webp",alt:"싱어게인2와 불후의 명곡 타이틀을 담은 위스티아 차콜 실버 3D 그래픽"}
]
const EXPERT_CARD_ICONS=[
 '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="2"></rect><path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none"></path></svg>',
 '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 14v-4m4 8V6m4 10V8m4 10V5m4 9v-4"></path></svg>'
]
function arExpertStory(key){
 const arOnly=["solo","duo"].includes(key)
 const cards=arOnly?[EXPERT_CARDS[1]]:EXPERT_CARDS.map(card=>card.keyword==='사운드 완성'?{...card,detail:'목소리의 음정과 밸런스를 다듬어,<br>자연스럽게 들리는 AR을 완성합니다'}:card)
 return '<section class="ar-expert-story ar-expert-readable section" aria-labelledby="arExpertStoryTitle"><div class="shell"><header class="ar-story-intro" data-solo-section-intro><h2 id="arExpertStoryTitle" data-solo-title><span class="solo-type-line">같은 소스여도,</span><span class="solo-type-line">'+(arOnly?'사운드 완성도는 달라집니다':'전문가들과 함께라면 다릅니다')+'</span></h2></header><div class="ar-expert-split'+(arOnly?' is-single':'')+'" data-expert-split data-active="0">'+cards.map((c,i)=>'<'+(arOnly?'div':'button type="button"')+' class="ar-expert-panel'+(i===0?' is-active':'')+'"'+(arOnly?'':' data-expert-panel="'+i+'" aria-pressed="'+(i===0)+'"')+'><span class="ar-expert-panel-media'+(c.keyword==='사운드 완성'?' ar-expert-broadcast':'')+'">'+img(c.image,c.alt)+'</span><span class="ar-expert-panel-content">'+(c.index?'<small class="ar-expert-panel-index">'+c.index+'</small>':'')+'<strong class="ar-expert-panel-keyword">'+c.keyword+'</strong><span class="ar-expert-panel-sub">'+c.sub+'</span><span class="ar-expert-panel-detail">'+c.detail.replace(/\./g,'')+'</span></span></'+(arOnly?'div':'button')+'>').join('')+'</div></div></section>'
}
function wistiaBeforeAfterSection(compact=false){return '<section class="wistia-ba-section" id="wistiaBeforeAfter" data-before-src="assets/audio/before-after/before.mp3" data-after-src="assets/audio/before-after/after.mp3" aria-labelledby="wistiaBeforeAfterTitle"><div class="wistia-ba-layout"><header class="wistia-ba-copy" data-solo-section-intro><p class="wistia-ba-eyebrow" data-solo-kicker>보컬 보정 전후 비교</p><h2 id="wistiaBeforeAfterTitle" data-solo-title>노래를 잘 못해도 괜찮습니다</h2>'+(compact?'<p data-solo-sub class="ba-essential">구간별 녹음, 자연스러운 보정</p>':'<p data-solo-sub><span class="ba-paragraph">처음부터 끝까지 완벽하게 부를 필요 없이 구간별 녹음과 1:1 디렉팅으로 차근차근 완성합니다</span><span class="ba-paragraph">녹음 후에는 음정·박자를 수작업으로 세밀하게 보정해 원래 목소리의 느낌은 살리고 더욱 자연스럽게 완성합니다</span></p>')+'</header><div class="bap-player"><div class="bap-body"><div class="bap-controls"><button class="bap-play mode-before" type="button" aria-label="재생"><span class="bap-play-icon">▶</span><b class="bap-play-label">재생</b></button><div class="bap-time"><b>0:00</b> / <span>0:00</span></div></div><div class="bap-badge mode-before"><span></span><b>보정 전과 후는 <u class="wistia-emphasis-underline">같은 녹음본</u>입니다</b></div><canvas class="bap-wave" aria-label="오디오 파형. 클릭하여 재생 위치 이동"></canvas><div class="bap-tabs" role="group" aria-label="보정 전후 음원 선택"><button class="bap-tab active" type="button" data-mode="before" aria-pressed="true"><small>원본 녹음</small><strong>보정 전</strong></button><button class="bap-switch" type="button" aria-label="보정 전후 전환">'+studioIcon('swap')+'</button><button class="bap-tab" type="button" data-mode="after" aria-pressed="false"><small>보정 음원</small><strong>보정 후</strong></button></div><p class="bap-error" role="status" hidden>음원을 불러오지 못했습니다. 파일 경로를 확인해 주세요.</p></div></div></div></section>'}
function setExpertPanel(split,index){split.dataset.active=index;const panels=[...split.querySelectorAll("[data-expert-panel]")];panels.forEach((panel,i)=>{const active=i===index;panel.classList.toggle("is-active",active);panel.setAttribute("aria-pressed",String(active));const keyword=panel.querySelector(".ar-expert-panel-keyword")?.textContent||"";panel.setAttribute("aria-label",keyword+" 소개 선택")})}
let expertSplitTimer=0,expertSplitObserver=null
// 설명은 항상 고정해서 보여주고, 사진의 강조 상태만 천천히 전환한다
function initExpertSplitPanel(){stopExpertAuto();clearTimeout(expertResumeTimer);clearInterval(expertSplitTimer);expertSplitObserver?.disconnect();expertSplitObserver=null;const split=document.querySelector("[data-expert-split]");if(!split)return;const panels=[...split.querySelectorAll("[data-expert-panel]")];setExpertPanel(split,Number(split.dataset.active||0));let visible=false,holdUntil=0;const hold=ms=>{holdUntil=Date.now()+ms};panels.forEach((panel,i)=>{panel.addEventListener("click",()=>{hold(9000);if(Number(split.dataset.active)===i)return;setExpertPanel(split,i)})});split.addEventListener("pointerenter",event=>{if(event.pointerType==="mouse")hold(6e4)});split.addEventListener("pointerleave",event=>{if(event.pointerType==="mouse")hold(2500)});split.addEventListener("focusin",()=>hold(6e4));split.addEventListener("focusout",()=>hold(2500));if(panels.length<2||matchMedia('(prefers-reduced-motion: reduce)').matches)return;if("IntersectionObserver" in window){expertSplitObserver=new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting)},{threshold:.35});expertSplitObserver.observe(split)}else visible=true;expertSplitTimer=setInterval(()=>{if(!split.isConnected){clearInterval(expertSplitTimer);expertSplitObserver?.disconnect();return}if(!visible||document.hidden||Date.now()<holdUntil)return;setExpertPanel(split,(Number(split.dataset.active||0)+1)%panels.length)},8000)}
let expertAutoTimer=null,expertResumeTimer=null
function stopExpertAuto(){clearInterval(expertAutoTimer);expertAutoTimer=null}
function startExpertAuto(root,count){stopExpertAuto();if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;expertAutoTimer=setInterval(()=>{const track=root.querySelector("[data-expert-track]");if(!track)return;const current=Number(track.dataset.index||0);setExpertIndex(root,(current+1)%count)},5000)}
function setExpertIndex(root,index){const track=root.querySelector("[data-expert-track]");if(!track)return;const cards=[...root.querySelectorAll("[data-expert-card]")],dots=[...root.querySelectorAll("[data-expert-goto]")],status=root.querySelector("[data-expert-status]"),progress=root.querySelector(".ar-story-progress i");track.dataset.index=index;track.style.transform="translateX(-"+(index*100)+"%)";cards.forEach((c,i)=>{const active=i===index;c.classList.toggle("is-active",active);c.setAttribute("aria-hidden",String(!active))});dots.forEach((d,i)=>d.setAttribute("aria-selected",String(i===index)));if(status)status.textContent=String(index+1).padStart(2,"0")+" / "+String(cards.length).padStart(2,"0");if(progress)progress.style.width=((index+1)/cards.length*100)+"%"}
function initExpertSlider(){const root=document.querySelector(".ar-expert-story");stopExpertAuto();clearTimeout(expertResumeTimer);if(!root)return;const track=root.querySelector("[data-expert-track]"),cards=[...root.querySelectorAll("[data-expert-card]")];if(!track||!cards.length)return;const count=cards.length;setExpertIndex(root,0);const pause=()=>{stopExpertAuto();clearTimeout(expertResumeTimer)},resume=()=>{clearTimeout(expertResumeTimer);expertResumeTimer=setTimeout(()=>{if(!root.matches(":hover")&&!root.matches(":focus-within"))startExpertAuto(root,count)},4200)},go=delta=>{const i=Number(track.dataset.index||0);setExpertIndex(root,(i+delta+count)%count);pause();resume()};root.addEventListener("mouseenter",pause);root.addEventListener("mouseleave",()=>{if(!root.matches(":focus-within"))resume()});root.addEventListener("focusin",pause);root.addEventListener("focusout",()=>{if(!root.matches(":hover"))resume()});root.querySelector("[data-expert-prev]")?.addEventListener("click",()=>go(-1));root.querySelector("[data-expert-next]")?.addEventListener("click",()=>go(1));root.querySelectorAll("[data-expert-goto]").forEach(btn=>btn.addEventListener("click",()=>{setExpertIndex(root,Number(btn.dataset.expertGoto));pause();resume()}));const viewport=root.querySelector(".ar-expert-viewport");viewport.addEventListener("keydown",e=>{if(e.key==="ArrowRight"){e.preventDefault();go(1)}else if(e.key==="ArrowLeft"){e.preventDefault();go(-1)}});let dragging=false,startX=0,deltaX=0;viewport.addEventListener("pointerdown",e=>{dragging=true;startX=e.clientX;deltaX=0;track.style.transition="none";pause();viewport.setPointerCapture(e.pointerId)});viewport.addEventListener("pointermove",e=>{if(!dragging)return;deltaX=e.clientX-startX;if(Math.abs(deltaX)>6)e.preventDefault();const i=Number(track.dataset.index||0);track.style.transform="translateX(calc(-"+(i*100)+"% + "+deltaX+"px))"});const endDrag=()=>{if(!dragging)return;dragging=false;track.style.transition="";const i=Number(track.dataset.index||0);if(Math.abs(deltaX)>60)setExpertIndex(root,Math.min(count-1,Math.max(0,i+(deltaX<0?1:-1))));else setExpertIndex(root,i);resume()};viewport.addEventListener("pointerup",endDrag);viewport.addEventListener("pointercancel",endDrag);startExpertAuto(root,count)}
const WISTIA_ADVANTAGES=[
 ["녹음 방식","구간별 녹음 + 1:1 디렉팅","한 곡을 처음부터 끝까지 부르지 않고 구간별로 나누어 디렉팅하며 완성합니다"],
 ["보컬 보정","음정·박자 수작업 보정","자동 보정에만 의존하지 않고 원래 목소리의 느낌을 살려 세밀하게 보정합니다"],
 ["추가 비용","상담 시 안내드린 금액 그대로","녹음·촬영 시간이 길어져도 당일 추가 비용은 없습니다"]
]
function detailPriceReason(){return '<section class="arc-section detail-price-reason" aria-labelledby="detailPriceReasonTitle"><div class="shell"><header><span class="we-section-tag price-reason-label">가격 안내</span><h2 id="detailPriceReasonTitle">왜 저렴한가요?</h2></header><p class="price-reason-lead"><u class="wistia-emphasis-underline">서울이 아닌 부천</u>에서 운영해 가격 부담을 낮췄습니다</p><p>보컬 디렉팅·수작업 보정·믹싱·마스터링은 기본 구성에 포함합니다</p></div>'+'<p class="single-song-note">모든 상품은 1곡 기준이에요. 곡마다 녹음·튠·믹스 작업이 따로 들어가서, 녹음 시간이 남아도 다른 곡은 \'1절 녹음 추가\'로 진행돼요.</p>'+'</section>'}
function wistiaAdvantagesSection(){return '<section class="wistia-advantages section" aria-labelledby="wistiaAdvantagesTitle"><div class="shell"><header><h2 id="wistiaAdvantagesTitle">위스티아의 장점</h2><p>한 곡을 준비하는 과정부터 완성본까지, 필요한 작업에 집중합니다</p></header><ol>'+WISTIA_ADVANTAGES.map(([category,title,description],index)=>'<li><span class="wistia-advantage-number">'+String(index+1).padStart(2,"0")+'</span><div><small>'+category+'</small><h3>'+title+'</h3><p>'+description+'</p></div></li>').join("")+'</ol></div></section>'+detailPriceReason()}
function productComparisonSection(){return wistiaAdvantagesSection()}
function prepareArHookVideo(){document.querySelectorAll(".ar-hook-media video").forEach(video=>{const button=video.closest('.ar-hook-media')?.querySelector("[data-ar-video-toggle]");if(!button)return;const update=()=>{const playing=!video.paused&&!video.ended;video.classList.toggle("is-playing",playing);button.classList.toggle("is-playing",playing);button.setAttribute("aria-label",playing?"영상 일시정지":"영상 재생")};video.addEventListener("playing",update);video.addEventListener("pause",update);video.addEventListener("ended",update);video.addEventListener("waiting",update);update()})}
const arVideoFeedbackTimers=new WeakMap()
function flashMobileArVideoFeedback(button,state){clearTimeout(arVideoFeedbackTimers.get(button));button.removeAttribute('data-feedback');void button.offsetWidth;button.dataset.feedback=state;arVideoFeedbackTimers.set(button,setTimeout(()=>button.removeAttribute('data-feedback'),650))}
function detailBenefit(p){const highlights=p.highlights||[],main=highlights[0]||[p.oneLine,p.sub],support=highlights.slice(1,3);return '<section class="shell section detail-benefit" aria-labelledby="detailBenefitTitle"><div class="detail-benefit-intro">'+label("핵심 장점")+'<h2 id="detailBenefitTitle">'+main[0]+'</h2><p>'+main[1]+'</p></div><div class="detail-benefit-points">'+support.map((item,i)=>'<article><span>'+String(i+2).padStart(2,"0")+'</span><h3>'+item[0]+'</h3><p>'+item[1]+'</p></article>').join("")+'</div></section>'}
function detailComparison(){return wistiaAdvantagesSection()}
function detailIncluded(p){const items=p.included||[];if(!items.length)return "";return '<section class="shell section detail-included" aria-labelledby="detailIncludedTitle">'+heading("","최종 완성본에 포함됩니다","상담부터 제작과 전달까지 기본 구성에 포함되는 항목입니다")+'<ul>'+items.map((item,i)=>'<li><span>'+String(i+1).padStart(2,"0")+'</span><strong>'+item+'</strong></li>').join("")+'</ul></section>'}
function reviewMetrics(){const loop=document.querySelector(".review-loop"),set=loop?.querySelector(".review-set"),card=set?.querySelector(".review-capture");if(!loop||!set||!card)return null;const gap=parseFloat(getComputedStyle(set).gap)||0;return{loop,setWidth:set.getBoundingClientRect().width,step:card.getBoundingClientRect().width+gap}}
function paintReviews(metrics=reviewMetrics()){if(!metrics||!metrics.setWidth)return;const offset=((reviewDisplay%metrics.setWidth)+metrics.setWidth)%metrics.setWidth;metrics.loop.style.transform='translate3d('+(-offset)+'px,0,0)'}
function moveReviews(direction=1){const metrics=reviewMetrics();if(!metrics)return;reviewTarget=reviewDisplay+direction*metrics.step;reviewDisplay=reviewTarget;reviewHoldUntil=Date.now()+5000;paintReviews(metrics)}
function startReviewCarousel(reset=true){
 cancelAnimationFrame(reviewFrame)
 reviewCleanup?.();reviewCleanup=null
 const initial=reviewMetrics();if(!initial)return
 if(reset){reviewTarget=0;reviewDisplay=0;reviewHoldUntil=0}
 reviewLast=0
 paintReviews(initial)
 const track=document.querySelector('#reviewTrack'),listeners=[]
 let hovered=false,focused=false,gesture=null
 const listen=(type,handler,options)=>{track.addEventListener(type,handler,options);listeners.push(()=>track.removeEventListener(type,handler,options))}
 const hold=()=>{reviewHoldUntil=Date.now()+5000}
 track.tabIndex=0
 track.setAttribute('aria-label','실제 고객 후기, 좌우로 밀거나 방향키로 넘기세요')
 listen('pointerenter',event=>{if(event.pointerType==='mouse')hovered=true})
 listen('pointerleave',event=>{if(event.pointerType==='mouse')hovered=false})
 listen('focusin',()=>{focused=true})
 listen('focusout',()=>{focused=false;hold()})
 listen('dragstart',event=>event.preventDefault())
 listen('pointerdown',event=>{if(event.button!==0||!event.isPrimary)return;hold();gesture={id:event.pointerId,x:event.clientX,y:event.clientY,start:reviewDisplay,axis:null};reviewTarget=reviewDisplay})
 listen('pointermove',event=>{
  if(!gesture||event.pointerId!==gesture.id)return
  const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y
  if(!gesture.axis&&Math.max(Math.abs(dx),Math.abs(dy))>6){gesture.axis=Math.abs(dx)>Math.abs(dy)?'x':'y';if(gesture.axis==='x'){track.setPointerCapture(event.pointerId);track.classList.add('is-dragging')}}
  if(gesture.axis!=='x')return
  event.preventDefault();reviewDisplay=gesture.start-dx;reviewTarget=reviewDisplay;paintReviews()
 },{passive:false})
 const endGesture=event=>{if(!gesture||event.pointerId!==gesture.id)return;const id=gesture.id;gesture=null;track.classList.remove('is-dragging');if(track.hasPointerCapture(id))track.releasePointerCapture(id);hold()}
 listen('pointerup',endGesture)
 listen('pointercancel',endGesture)
 listen('lostpointercapture',endGesture)
 listen('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();moveReviews(event.key==='ArrowRight'?1:-1)}})
 reviewCleanup=()=>{listeners.forEach(remove=>remove());track.classList.remove('is-dragging')}
 const speed=matchMedia("(prefers-reduced-motion: reduce)").matches?0:.04
 const tick=now=>{
  if(!document.querySelector("#reviewTrack"))return
  const metrics=reviewMetrics();if(!metrics)return
  const elapsed=reviewLast?Math.min(now-reviewLast,50):0;reviewLast=now
  if(hovered||focused||gesture||Date.now()<reviewHoldUntil){reviewFrame=requestAnimationFrame(tick);return}
  reviewTarget+=elapsed*speed
  const ease=1-Math.exp(-elapsed/320)
  reviewDisplay+=(reviewTarget-reviewDisplay)*ease
  paintReviews(metrics)
  reviewFrame=requestAnimationFrame(tick)
 }
 reviewFrame=requestAnimationFrame(tick)
}
function processMedia(step){const media=step[2];if(!media)return "";if(Array.isArray(media))return '<div class="process-image is-pair">'+media.map((source,index)=>img(source,step[0]+' 예시 사진 '+(index+1))).join("")+'</div>';if(typeof media==="object"&&media.duration)return '<div class="process-duration-card"><span>PRODUCTION PERIOD</span><strong>'+escapeHtml(media.duration)+'</strong><small>'+escapeHtml(media.note||"")+'</small></div>';return '<div class="process-image">'+img(media,step[0]+' 과정 이미지')+'</div>'}
function processSection(steps=PROCESS){const hasImages=steps.some(step=>step[2]);return '<section class="shell section" id="process">'+heading("","진행 과정","상담부터 최종본 전달까지 순서대로 진행합니다")+'<ol class="process-list'+(hasImages?' has-images':'')+'">'+steps.map((s,i)=>'<li>'+processMedia(s)+'<span>'+String(i+1).padStart(2,"0")+'</span><div><h3>'+s[0]+'</h3><p>'+s[1]+'</p></div></li>').join("")+'</ol></section>'}
function processList(steps){const hasImages=steps.some(step=>step[2]);return '<ol class="process-list'+(hasImages?' has-images':'')+'">'+steps.map((s,i)=>'<li>'+processMedia(s)+'<span>'+String(i+1).padStart(2,"0")+'</span><div><h3>'+s[0]+'</h3><p>'+s[1]+'</p></div></li>').join("")+'</ol>'}
function processAccordionMedia(step){const media=step[2];if(typeof media==="object"&&media?.duration)return '<div class="process-duration-line"><span>제작 기간</span><strong>'+escapeHtml(media.duration)+'</strong><small>촬영과 자료 전달 완료 후 정확한 일정을 안내합니다</small></div>';return processMedia(step)}
function processAccordionList(steps){return '<div class="process-accordion">'+steps.map((s,i)=>'<details><summary data-process-step><span>'+String(i+1).padStart(2,"0")+'</span><h3>'+s[0]+'</h3><b aria-hidden="true">+</b></summary><div class="process-accordion-body">'+processAccordionMedia(s)+'<p>'+s[1]+'</p></div></details>').join("")+'</div>'}
function songProcessSection(steps){return '<section class="shell section song-process-section" id="process">'+heading("","진행 과정","항목을 누르면 사진과 자세한 설명을 볼 수 있습니다")+processAccordionList(steps)+'</section>'}
const SOLO_STUDIO_PROCESS=[
 {id:1,eyebrow:"CONSULTATION",title:"맞춤 제작 상담<br>곡과 키 확인",short:"맞춤 제작 상담",description:"예식 분위기와 음역을 확인해 곡과 키를 정하고, 본식에서 사용할 AR의 방향을 함께 설계합니다.",meta:[["방식","1:1 상담"],["준비","원하는 곡"]],image:"assets/img/process-no-people/01.svg"},
 {id:2,eyebrow:"RECORDING",title:"스튜디오 방문<br>녹음 준비",short:"녹음 준비",description:"마이크와 헤드폰을 편안하게 맞춘 뒤, 컨디션과 호흡을 확인하며 녹음을 준비합니다.",meta:[["장소","위스티아 스튜디오"],["안내","장비 세팅"]],image:"assets/img/process-no-people/02.svg"},
 {id:3,eyebrow:"VOCAL DIRECTING",title:"1:1 보컬 디렉팅<br>구간별 녹음",short:"1:1 보컬 디렉팅",description:"엔지니어가 호흡·발음·감정 표현을 안내하고, 부담 없는 길이로 나누어 한 구간씩 녹음합니다.",meta:[["방식","구간별 녹음"],["진행","1:1 디렉팅"]],image:"assets/img/process-no-people/03.svg"},
 {id:4,eyebrow:"AR BALANCE",title:"AR 속 내 목소리<br>비율 선택",short:"AR 비율 선택",description:"같은 노래를 여러 비율로 직접 들어보고, 실제 본식에서 가장 편안한 목소리 비율을 결정합니다.",meta:[["비교","30–100%"],["결정","맞춤 비율"]],image:"assets/img/process-no-people/04.svg"},
 {id:5,eyebrow:"VOCAL EDITING",title:"멜로다인 수작업<br>보컬 보정",short:"수작업 보정",description:"원래 목소리의 느낌은 살리면서 음정·박자·호흡을 한 음씩 세밀하게 다듬습니다.",meta:[["보정","수작업"],["기준","음색 유지"]],image:"assets/img/process-no-people/05.svg"},
 {id:6,eyebrow:"MIXING & MASTERING",title:"전문 엔지니어 믹싱<br>AR 제작",short:"믹싱 · AR 제작",description:"보컬과 반주의 밸런스를 맞춰 예식장에서 바로 재생할 수 있는 AR 음원으로 완성합니다.",meta:[["작업","믹싱"],["출력","본식용 AR"]],image:"assets/img/process-no-people/06.svg"},
 {id:7,eyebrow:"FINAL DELIVERY",title:"최종 검수<br>완성본 전달",short:"최종 검수 · 전달",description:"본식에서 바로 사용할 수 있도록 전체 음원을 최종 검수한 뒤 완성 파일을 전달합니다.",meta:[["제작","약 7일"],["전달","완성 음원"]],image:"assets/img/process-studio/07-delivery.svg"}
]
const DUO_STUDIO_PROCESS=[
 {id:1,eyebrow:"CONSULTATION",title:"함께하는 맞춤 상담<br>곡·키·파트 확인",short:"맞춤 제작 상담",description:"예식 분위기와 두 사람의 음역을 확인해 곡과 키, 파트를 정하고 본식용 듀엣 AR의 방향을 함께 설계합니다.",meta:[["방식","1:1 상담"],["준비","원하는 곡"]],image:"assets/img/process-no-people/01.svg"},
 {id:2,eyebrow:"RECORDING",title:"스튜디오 방문<br>듀엣 녹음 준비",short:"듀엣 녹음 준비",description:"두 사람의 마이크와 헤드폰을 편안하게 맞춘 뒤, 각자의 컨디션과 호흡을 확인하며 녹음을 준비합니다.",meta:[["장소","위스티아 스튜디오"],["안내","장비 세팅"]],image:"assets/img/process-no-people/02.svg"},
 {id:3,eyebrow:"DUET DIRECTING",title:"듀엣 보컬 디렉팅<br>파트별 구간 녹음",short:"듀엣 보컬 디렉팅",description:"각자의 파트와 화음이 자연스럽게 맞물리도록 안내하고, 부담 없는 길이로 나누어 구간별로 녹음합니다.",meta:[["방식","파트별 녹음"],["진행","듀엣 디렉팅"]],image:"assets/img/process-no-people/03.svg"},
 {id:4,eyebrow:"DUET BALANCE",title:"두 목소리의 AR<br>밸런스 확인",short:"듀엣 밸런스",description:"각자의 목소리와 화음이 가장 자연스럽게 들리는 지점을 확인해 본식용 AR 밸런스를 결정합니다.",meta:[["비교","보컬 · 화음"],["결정","맞춤 밸런스"]],image:"assets/img/process-no-people/04.svg"},
 {id:5,eyebrow:"VOCAL EDITING",title:"멜로다인 수작업<br>보컬 보정",short:"수작업 보정",description:"두 사람의 원래 음색은 살리면서 음정·박자·호흡을 한 음씩 세밀하게 다듬습니다.",meta:[["보정","수작업"],["기준","음색 유지"]],image:"assets/img/process-no-people/05.svg"},
 {id:6,eyebrow:"MIXING & MASTERING",title:"듀엣 믹싱과<br>본식용 AR 제작",short:"듀엣 AR 제작",description:"두 보컬과 반주의 밸런스를 맞춰 예식장에서 바로 재생할 수 있는 듀엣 AR 음원으로 완성합니다.",meta:[["작업","듀엣 믹싱"],["출력","본식용 AR"]],image:"assets/img/process-no-people/06.svg"},
 {id:7,eyebrow:"FINAL DELIVERY",title:"최종 검수<br>완성본 전달",short:"최종 검수 · 전달",description:"본식에서 바로 사용할 수 있도록 듀엣 AR과 완성 음원을 최종 검수한 뒤 전달합니다.",meta:[["제작","약 7일"],["전달","듀엣 AR · 완성 음원"]],image:"assets/img/process-studio/07-delivery.svg"}
]
const DETAIL_PROCESS_IMAGES={
 wedding:["assets/img/wedding/01-guest-message.webp","assets/img/wedding/02-interview.webp","assets/img/wedding/03-lipsync-mv.webp","assets/img/wedding/04-recording-making.webp","assets/img/wedding/05-couple-memories.webp","assets/img/wedding/06-letter.webp","assets/img/wedding/03-lipsync-mv.webp"],
 "duet-film":["assets/img/song-film/duet-scene-01.jpg","assets/img/song-film/duet-scene-02.jpg","assets/img/song-film/duet-scene-03.jpg","assets/img/song-film/duet-scene-04.jpg","assets/img/song-film/duet-video-cover.jpg","assets/img/song-film/duet-video-cover.jpg","assets/img/song-film/duet-video-cover.jpg"],
 "solo-film":["assets/img/process-no-people/01.svg","assets/img/process-no-people/02.svg","assets/img/solo-film/solo-film-cover-v2.webp","assets/img/process-no-people/05.svg","assets/img/process-no-people/06.svg","assets/img/process-no-people/06.svg","assets/img/process-studio/07-delivery.svg"],
 proposal:["assets/img/proposal/process-01.webp","assets/img/proposal/process-02.webp","assets/img/proposal/process-03.webp","assets/img/proposal/process-04.webp","assets/img/proposal/process-05.webp","assets/img/proposal-video-cover.jpg","assets/img/proposal-video-cover.jpg"]
}
function detailStudioSteps(key="solo"){
 if(key==="solo")return SOLO_STUDIO_PROCESS
 if(key==="duo")return SOLO_STUDIO_PROCESS.map(step=>({...step,description:step.id===3?"두 분의 파트와 호흡을 안내하며, 2시간 안에서 한 구간씩 세심하게 녹음합니다":step.description}))
 const product=PRODUCTS[key],images=DETAIL_PROCESS_IMAGES[key]||[],steps=product?.steps||[]
 return steps.map(([title,description],index)=>{
  const number=index+1,last=index===steps.length-1,short=String(title).replace(/\s*·.*$/,"").replace(/\s*&.*$/,"").replace(/\s*\(.*/,"")
  return {id:number,eyebrow:last?"FINAL DELIVERY":"STEP "+String(number).padStart(2,"0"),title,short,description,meta:last?[["전달",key==="proposal"?"완성 필름":"상영본 · 완성 음원"],["안내","일정 상담"]]:index===0?[["방식","1:1 상담"],["준비","원하는 곡"]]:[["진행","맞춤 제작"],["확인","중간 피드백"]],image:images[index%images.length]||AR_DETAIL_CONTENT[key]?.poster||AR_DETAIL_CONTENT.solo.poster}
 })
}
function processStudioMeta(step){return step.meta.map(([label,value])=>'<span><strong>'+escapeHtml(label)+'</strong>'+escapeHtml(value)+'</span>').join("")}
function soloProcessSlider(key="solo"){const steps=detailStudioSteps(key),ar=["solo","duo"].includes(key),first=steps[0],total=String(steps.length).padStart(2,"0"),description=key==="duo"?["두 사람의 파트와 화음을 맞춘 뒤, 본식용 AR 전달까지","일곱 단계를 순서대로 확인해 보세요."]:ar?["상담부터 녹음과 보정, 본식용 AR 전달까지","일곱 단계를 순서대로 확인해 보세요."]:["상담부터 녹음과 촬영, 상영본 전달까지","상품별 제작 과정을 순서대로 확인해 보세요."];return '<section class="wistia-process-studio solo-process-section" id="process" data-process-studio data-process-product="'+key+'" aria-labelledby="processStudioTitle">'
 +'<header class="wps-head" data-solo-section-intro><div><p class="wps-kicker" data-solo-kicker>위스티아 제작 과정</p><h2 id="processStudioTitle" data-solo-title><span class="solo-type-line">처음부터 끝까지,</span><span class="solo-type-line">맞춤형으로 케어해드립니다.</span></h2><p class="wps-sub" data-solo-sub><span class="solo-type-line">'+description[0]+'</span><span class="solo-type-line">'+description[1]+'</span></p></div><div class="wps-counter" aria-label="현재 프로세스 01 / '+total+'"><span data-process-current>01</span><i></i><span>'+total+'</span></div></header>'
 +'<div class="wps-feature" data-process-feature tabindex="0" role="group" aria-label="작업과정 단계 슬라이더. 좌우 방향키로 단계를 이동할 수 있습니다."><div class="wps-photo"><span class="wps-badge" data-process-badge>01 / '+total+'</span>'+img(first.image,first.short,true).replace('<img ','<img data-process-image ')+'</div><article class="wps-content" aria-live="polite" aria-atomic="true"><span class="wps-ghost" data-process-ghost>01</span><p class="wps-step" data-process-eyebrow>'+first.eyebrow+'</p><h3 data-process-title>'+first.title+'</h3><p class="wps-description" data-process-description>'+first.description+'</p><div class="wps-detail" data-process-meta>'+processStudioMeta(first)+'</div><div class="wps-controls"><button type="button" data-process-prev aria-label="이전 단계" disabled>←</button><button type="button" class="is-next" data-process-next aria-label="다음 단계">→</button></div></article></div>'
 +'<nav class="wps-chapters" aria-label="제작 단계 선택" hidden>'+steps.map((step,index)=>'<button type="button" class="wps-chapter'+(index===0?' is-active':'')+'" data-process-chapter="'+index+'" data-image="'+step.image+'" aria-current="'+(index===0?'step':'false')+'" aria-label="'+String(step.id).padStart(2,"0")+' '+escapeHtml(step.short)+' 단계 보기"><b>'+String(step.id).padStart(2,"0")+'</b><span>'+escapeHtml(step.short)+'</span></button>').join("")+'</nav></section>'}
function storyProcessCards(steps){
 const last=steps[steps.length-1]
 const summaries=[['곡·파트 상담','곡·키·파트와 본식 상영 시점을 함께 정합니다'],['구간별 녹음','1:1 디렉팅으로 두 목소리와 화음을 맞춰 녹음합니다'],['축가 영상 촬영','노래와 이야기에 맞춘 뮤직비디오·메시지 장면을 촬영합니다'],['수작업 보컬 보정','음색은 살리고 음정·박자·호흡을 세밀하게 다듬습니다'],['믹싱·마스터링','목소리와 반주의 균형을 맞춰 최종 사운드를 완성합니다'],['영상 편집','컷·색감·싱크·자막을 노래의 흐름에 맞춰 편집합니다'],['최종 검수','음원과 영상의 싱크·밸런스·흐름을 확인합니다'],['완성본 전달','영상과 완성 음원을 전달합니다 · 촬영·자료 전달 후 약 14일']]
 const cards=[...steps.slice(0,-1),last,last].map((step,i)=>({...step,title:summaries[i][0],description:summaries[i][1]}))
 const photos=[
  ["assets/img/studio-3d/consultation.webp","곡과 파트를 상담하는 3D 제작 안내"],
  ["assets/img/studio-3d/recording.webp","헤드폰과 마이크로 보컬을 녹음하는 3D 제작 안내"],
  ["assets/img/story-polish/filming-v1.webp","카메라와 슬레이트로 축가 영상을 촬영하는 3D 제작 안내"],
  ["assets/img/studio-3d/vocal-editing.webp","음정과 박자를 보정하는 3D 제작 안내"],
  ["assets/img/studio-3d/mixing.webp","목소리와 반주를 믹싱하는 3D 제작 안내"],
  ["assets/img/studio-3d/film-editing.webp","영상의 컷과 색감을 편집하는 3D 제작 안내"],
  ["assets/img/studio-3d/sound-review.webp","완성 사운드를 확인하는 3D 제작 안내"],
  ["assets/img/studio-3d/delivery.webp","영상과 완성 음원을 전달하는 3D 제작 안내"]
 ]
 return '<section class="wistia-process-studio story-process-cards" id="process" aria-labelledby="processStudioTitle"><div class="shell"><header class="wps-head"><p class="wps-kicker">제작 과정</p><h2 id="processStudioTitle">처음부터 끝까지,<br>맞춤형으로 케어해드립니다</h2><p>상담부터 완성본 전달까지, 여덟 단계로 준비합니다</p></header><details class="story-process-folder" open><summary>'+processFolderArt()+'<span class="process-folder-label"><strong>제작 과정 살펴보기</strong><small>클릭하면 단계별 사진과 설명이 펼쳐집니다</small></span><span class="process-folder-cue"><span class="folder-open-label"><span class="folder-open-text">클릭하여 열기</span><span class="folder-cue-arrow" aria-hidden="true">'+studioIcon('down')+'</span></span><span class="folder-close-label">접어두기 '+studioIcon('up')+'</span></span></summary><div class="process-folder-content"><p class="process-flow" aria-label="제작 순서 1단계부터 8단계까지">'+cards.map((_,i)=>'<span>'+String(i+1).padStart(2,'0')+'</span>'+(i<cards.length-1?'<i aria-hidden="true">→</i>':'')).join('')+'</p><ol class="story-process-grid">'+cards.map((step,i)=>'<li class="story-process-card" style="--process-index:'+i+';--process-row:'+(Math.floor(i/2)+1)+';--process-column:'+(i%2+1)+'"><div class="story-process-media">'+img(photos[i][0],photos[i][1],true)+'</div><div class="story-process-copy"><span class="story-process-number">'+String(i+1).padStart(2,"0")+'</span><h3>'+escapeHtml(step.title.replace(/ & /g," · "))+'</h3><p>'+escapeHtml(step.description)+'</p></div></li>').join('')+'</ol><p class="process-photo-note">일러스트는 제작 과정 안내용이며, 촬영·완성 영상은 실제 제작 사례입니다</p></div></details></div></section>'
}
function verticalProcessSection(key="solo"){
 const steps=detailStudioSteps(key)
 if(key==="duet-film")return storyProcessCards(steps)
 return '<section class="wistia-process-studio solo-process-section wps-vertical" id="process" aria-labelledby="processStudioTitle"><div class="shell"><header class="wps-head" data-solo-section-intro><div><p class="wps-kicker" data-solo-kicker>위스티아 제작 과정</p><h2 id="processStudioTitle" data-solo-title>처음부터 끝까지,<br>맞춤형으로 케어해드립니다</h2><p class="wps-sub" data-solo-sub>단계를 누르면 각 과정의 사진과 설명을 볼 수 있습니다</p></div></header><div class="wps-accordion">'+steps.map((step,index)=>'<details'+(index===0?' open':'')+'><summary data-process-step><span class="wps-accordion-num">'+String(step.id).padStart(2,"0")+'</span><strong>'+escapeHtml(step.short)+'</strong><span class="wps-accordion-plus" aria-hidden="true">+</span></summary><div class="wps-accordion-body"><div class="wps-accordion-photo">'+img(step.image,step.short+' 제작 과정',index===0)+'</div><div class="wps-accordion-copy"><p>'+escapeHtml(step.eyebrow)+'</p><h3>'+step.title+'</h3><p>'+escapeHtml(step.description)+'</p></div></div></details>').join("")+'</div></div></section>'
}
function processTypeButton(productKey,formatKey,icon){const format=FILM_FORMATS[formatKey],expanded=selectedFilmFormat===formatKey;return '<button type="button" aria-expanded="'+expanded+'" aria-controls="processType'+(formatKey==="live"?'Live':'Making')+'" data-process-format="'+formatKey+'"><span class="process-type-preview">'+img(FILM_FORMAT_IMAGES[productKey][formatKey],format.title+' 예시 사진')+'</span><span class="process-type-label"><span class="process-type-marker" aria-hidden="true"></span><strong><span aria-hidden="true">'+icon+'</span> '+format.title+'</strong></span></button>'}
function filmProcessSection(productKey,steps){const live=filmProcessSteps(productKey,steps,"live"),making=filmProcessSteps(productKey,steps,"making");if(productKey==="proposal")return '<section class="shell section film-process-section proposal-process-section" id="process">'+heading("","진행 과정","녹음부터 영상 완성까지의 과정을 확인해 주세요")+'<div id="processTypeLive" class="process-type-panel proposal-single-process" role="region" aria-label="뮤직 비디오 필름 진행 과정" data-process-panel="live">'+processAccordionList(live)+'</div></section>';return '<section class="shell section film-process-section" id="process">'+heading("","녹음 메이킹 필름 진행 과정","항목을 누르면 사진과 자세한 설명을 볼 수 있습니다")+'<div id="processTypeMaking" class="process-type-panel" role="region" aria-label="녹음 메이킹 필름 진행 과정" data-process-panel="making">'+processAccordionList(making)+'</div></section>'}
function filmUpgradeDetail(productKey){if(productKey==="proposal")return "";const difference=filmFormatPrice(productKey,"live")-filmFormatPrice(productKey,"making"),price="+"+shortWon(difference);return '<section class="shell section film-upgrade-detail"><div class="film-upgrade-detail-media">'+img(FILM_FORMAT_IMAGES[productKey].live,"뮤직 비디오 필름 실제 예시 사진",true)+'</div><div class="film-upgrade-detail-copy">'+label("선택 업그레이드")+'<h2>뮤직 비디오 필름으로 업그레이드</h2><p>기본 녹음 메이킹 필름에 아래 구성이 추가됩니다</p><ul>'+filmUpgradeFeatures(productKey).map(item=>'<li>'+item+'</li>').join("")+'</ul><div><strong>'+price+'</strong></div></div></section>'}
function productionGuide(p){const film=p.category!=="song";return '<section class="shell production-guide" aria-labelledby="productionGuideTitle"><h2 id="productionGuideTitle">제작 안내</h2><div><article><span>작업 기간</span><strong>'+(film?"촬영·자료 전달 후 일정 확정":"녹음 완료 후 일정 확정")+'</strong><p>사용 예정일과 제작 구성을 확인한 뒤 정확한 전달 일정을 안내합니다</p></article><article><span>수정 안내</span><strong>상품별 기본 범위 적용</strong><p>수정 가능 범위와 횟수는 예약 전 상담에서 명확히 안내합니다</p></article><article><span>최종 전달</span><strong>'+(film?"상영용 영상 + 완성 음원":"본식용 AR + 완성 음원")+'</strong><p>사용 환경을 확인해 현장에서 바로 쓸 수 있는 파일로 전달합니다</p></article></div></section>'}
function resultSection(p,m,w,song){return '<section class="result-band"><div class="shell"><div>'+label("THE RESULT")+'<h2>이렇게 완성됩니다</h2></div><div><p>'+m.result+'</p><span>'+escapeHtml(p.resultCopy|| (song?"보정과 믹싱·마스터링을 거친 최종 음원으로 전달합니다":"직접 부른 노래와 촬영 장면을 하나의 영상으로 완성합니다"))+'</span></div></div>'+(w?'<div class="shell result-film"><button class="film-poster" data-video="'+w.id+'" aria-label="'+w.title+' 실제 결과물 재생">'+img(w.image,w.title,true)+'<span class="play" aria-hidden="true">▶</span><span class="poster-note">실제 결과물 재생하기</span></button></div>':'')+'</section>'}
function detailNext(key,purpose=""){const eventHref="#/event/"+key+(purpose?"/"+purpose:"");return '<section class="detail-next section"><div class="shell"><h2>상품 구성과 가격을<br>확인해 보세요</h2><p>포함 작업과 이벤트 혜택을 확인한 뒤 예약 상담으로 이어집니다</p>'+cta("상품 구성·가격 확인하기",eventHref)+'</div></section>'}
function homeDirectionsSection(){
 const address='경기도 부천시 석천로170번길 19, 2층'
 return '<section class="we-shell we-section we-home-location" id="homeLocation" aria-labelledby="homeLocationTitle"><header class="we-heading"><span class="we-kicker we-section-tag">POINT 08 · 오시는 길</span><h2 id="homeLocationTitle">부천에서 만나요</h2></header><div class="we-directions-grid"><figure class="wistia-directions-map"><a href="'+location.origin+'/assets/img/wistia-directions.png" target="_blank" rel="noopener noreferrer" aria-label="오시는 길 지도 크게 보기">'+img('assets/img/wistia-directions.png','부천시청역, 위스티아 스튜디오와 공영주차장 위치 안내 지도')+'</a><figcaption>지도를 누르면 크게 볼 수 있습니다</figcaption></figure><div class="we-directions-copy"><h3 class="studio-address"><span class="studio-address-city">경기도 부천시</span><span class="studio-address-street">석천로170번길 19</span><span class="studio-address-floor">2층</span></h3><p>부천시청역 1번 출구에서 도보 약 300m</p><p>스튜디오 바로 옆 공영주차장을 이용하실 수 있습니다</p><div class="wistia-location-links"><a href="https://map.naver.com/p/search/'+encodeURIComponent(address)+'" target="_blank" rel="noopener noreferrer">네이버 지도 ↗</a><a href="https://map.kakao.com/link/search/'+encodeURIComponent(address)+'" target="_blank" rel="noopener noreferrer">카카오맵 ↗</a></div></div></div></section>'
}
function studioSculpture(kind="voice"){
 const record='<div class="studio-record"><div class="studio-record-face"><span>WISTIA<small>우리의 목소리</small></span></div><div class="studio-record-back"></div><div class="studio-record-edge"></div></div>'
 const microphone='<div class="studio-mic"><div class="studio-mic-mesh"></div><div class="studio-mic-side"></div><div class="studio-mic-body"></div><div class="studio-mic-yoke"></div><div class="studio-mic-stem"></div><div class="studio-mic-base"></div></div>'
 return '<div class="studio-scene studio-scene-'+kind+'" aria-hidden="true"><div class="studio-scene-shadow"></div><div class="studio-world"><div class="studio-orbit studio-orbit-one"></div><div class="studio-orbit studio-orbit-two"></div>'+record+microphone+'<div class="studio-wave">'+Array.from({length:13},(_,i)=>'<i style="--wave:'+i+';--height:'+(20+Math.round(Math.sin(i/12*Math.PI)*64))+'px"></i>').join('')+'</div><div class="studio-plinth"><i></i><i></i><i></i></div></div><span class="studio-scene-note">VOICE / WISTIA</span></div>'
}
function renderApprovedHomeThumbnails(){
 const thumbnails=[
  ['aSKrlQwmnHI','위스티아 실제 축가 영상 썸네일, 노을 아래 두 사람'],
  ['5ZuTmQWCRJk','위스티아 실제 축가 영상 썸네일, 실내에서 춤추는 두 사람'],
  ['AQ9Z1flOUPo','위스티아 실제 축가 영상 썸네일, 숲길을 걷는 두 사람']
 ]
 return '<div class="we-hero-collage" aria-label="위스티아가 제작한 서로 다른 세 축가 영상">'+thumbnails.map(([id,alt],i)=>'<figure class="we-hero-thumbnail"><img src="/assets/img/home-approved/'+id+'.jpg" alt="'+alt+'" width="1280" height="720" loading="eager" decoding="async"'+(i===0?' fetchpriority="high"':'')+'></figure>').join('')+'</div>'
}
function renderWeddingHome(){
 const service=(key,title,hook,photo,number)=>'<a class="we-service" href="/detail/'+key+'" data-cursor="자세히 보기"><figure>'+img(photo,title)+'</figure><div class="we-service-copy"><span class="we-product-number">상품 '+number+'</span><h3>'+title+'</h3><p><strong>'+hook+'</strong></p><span class="we-service-link">상품과 가격 보기 ↗</span></div></a>'
 const cases=[['스토리 필름','우리 목소리로 완성한 축가 영상','aSKrlQwmnHI'],['녹음 장면','녹음하는 순간까지 담은 축가','pTBfPEWlyZU'],['스토리 필름','두 사람의 이야기를 담은 영상','5ZuTmQWCRJk'],['스토리 필름','직접 부른 노래로 완성한 웨딩 영상','AQ9Z1flOUPo']]
 const affordability='<section class="we-shell we-section we-affordability" id="homePriceReason"><div class="we-location"><span class="we-kicker we-section-tag">POINT 02 · 가격 안내</span><h2>왜 저렴한가요?</h2><p><u class="wistia-emphasis-underline">서울이 아닌 부천</u>에서 운영해 가격 부담을 낮췄습니다</p><p>보컬 디렉팅·수작업 보정·믹싱·마스터링은 기본 구성에 포함합니다</p></div>'+'<p class="single-song-note">모든 상품은 1곡 기준이에요. 곡마다 녹음·튠·믹스 작업이 따로 들어가서, 녹음 시간이 남아도 다른 곡은 \'1절 녹음 추가\'로 진행돼요.</p>'+'</section>'
 app.innerHTML='<div class="we-home"><section class="we-hero we-shell we-hero-thumbnails"><div class="we-meta"><span>WISTIA · 웨딩 축가 전문 스튜디오</span></div><div class="we-hero-grid we-hero-text">'+renderApprovedHomeThumbnails()+'<div class="we-hero-copy"><p class="we-kicker">목소리로 전하는 결혼식</p><h1><span class="type-line">웨딩 축가</span><span class="type-line">전문 스튜디오</span></h1></div></div></section>'+
 '<section class="we-shell we-section" id="homeServices"><header class="we-heading"><span class="we-kicker we-section-tag">POINT 01</span><h2>상품 소개</h2><p>직접 부르는 축가와 우리 목소리로 만든 영상<br>두 가지 방식으로 준비합니다</p></header><div class="we-services">'+service('solo','AR 축가 사전녹음','결혼식에서 직접 축가를 부른다면','assets/img/ar-detail/solo-live-proof.jpg','01')+service('duet-film','축가 스토리 필름','우리 목소리로 축가 영상을 만든다면','https://i.ytimg.com/vi/AQ9Z1flOUPo/maxresdefault.jpg','02')+'</div></section>'+
 affordability+'<section class="we-section we-cases" id="homeCases"><header class="we-heading we-shell"><span class="we-kicker we-section-tag">POINT 03 · 실제 제작 영상</span><h2>말보다 먼저,<br>목소리가 전한 마음</h2><p class="we-cases-guide"><span class="we-cases-guide-full">위스티아의 실제 제작 영상입니다, 재생 버튼을 눌러 바로 확인하세요</span><span class="we-cases-guide-compact">실제 제작 영상, 눌러 확인하세요</span></p></header><div class="we-carousel" data-case-carousel tabindex="0" role="region" aria-label="축가 사례, 좌우 방향키 또는 드래그로 넘기기" data-cursor="넘기기">'+cases.map(([type,title,id],i)=>'<article class="we-case"><button type="button" class="we-case-video" data-inline-youtube="https://www.youtube.com/embed/'+id+'?rel=0" data-cursor="재생" aria-label="'+title+' 유튜브 영상 재생"><figure>'+img('https://i.ytimg.com/vi/'+id+'/hqdefault.jpg',title)+'<span class="we-case-play">▶ <b>영상 보기</b></span></figure></button><div class="we-case-bar"><span>0'+(i+1)+'</span><strong>'+title+'</strong><span>'+type+'</span></div><a class="we-case-source" href="https://www.youtube.com/watch?v='+id+'" target="_blank" rel="noopener noreferrer">YouTube에서 보기 ↗</a></article>').join('')+'</div><div class="we-carousel-controls we-shell"><span data-case-count>01 / '+String(cases.length).padStart(2,'0')+'</span><div><button type="button" data-case-prev aria-label="이전 사례">←</button><button type="button" data-case-next aria-label="다음 사례">→</button></div></div></section>'+
 '<div class="we-review-wrap"><div class="we-shell"><span class="we-kicker we-section-tag">POINT 04 · 고객 후기</span></div>'+soloReviewCarousel()+'</div>'+
 '<section class="we-section we-proof we-shell" id="homeSound"><header class="we-heading"><span class="we-kicker we-section-tag">POINT 05 · 보컬 보정</span><h2>보컬 보정<br>비포 애프터</h2><p>같은 녹음본의 보정 전후를 직접 들어보세요</p></header>'+wistiaBeforeAfterSection(true)+'</section>'+
 '<section class="we-section we-shell" id="homeExpert"><header class="we-heading"><span class="we-kicker we-section-tag">POINT 06 · 제작 과정</span><h2>어떻게 완성할까요?</h2></header><details class="story-process-folder home-process-folder" open><summary>'+processFolderArt()+'<span class="process-folder-label"><strong>제작 과정 살펴보기</strong><small>클릭하면 단계별 사진과 설명이 펼쳐집니다</small></span><span class="process-folder-cue"><span class="folder-open-label"><span class="folder-open-text">클릭하여 열기</span><span class="folder-cue-arrow" aria-hidden="true">'+studioIcon('down')+'</span></span><span class="folder-close-label">접어두기 '+studioIcon('up')+'</span></span></summary><div class="process-folder-content"><div class="we-craft-grid"><div class="we-craft-list">'+[['구간별 녹음 · 1:1 디렉팅','처음부터 끝까지 완벽하게 부를 필요 없이, 어려운 구간부터 차근차근 맞춰갑니다','assets/img/process-no-people/03.svg'],['수작업 음정·박자 보정','목소리의 느낌을 살리며 음정과 박자를 세밀하게 다듬습니다','assets/img/process-no-people/05.svg'],['방송 음악 작업 엔지니어','〈싱어게인2〉·〈불후의 명곡〉 방송 음악 작업에 참여한 엔지니어가 음원을 완성합니다</p><p>음정과 박자는 한 구간씩 수작업으로 다듬고, 목소리와 반주의 균형은 믹싱·마스터링으로 조율합니다</p><p>원래 목소리의 느낌을 살리면서 본식에서 선명하게 들리도록 완성합니다','assets/img/process-no-people/06.svg']].map(([title,copy,photo],i)=>'<details name="home-craft"'+(i===0?' open':'')+'><summary><span>0'+(i+1)+'</span><strong>'+title+'</strong><em>살펴보기</em><b>+</b></summary><div class="we-craft-content"><figure>'+img(photo,title)+'</figure><div><p>'+copy+'</p></div></div></details>').join('')+'</div></div></div></details></section>'+


 '<section class="we-shell we-section we-home-faq"><header class="we-heading"><span class="we-kicker we-section-tag">POINT 07 · 자주 묻는 질문</span><h2>궁금한 것부터<br>확인하세요</h2></header>'+faq(GENERAL_FAQ.slice(0,4))+'</section>'+homeDirectionsSection()+
 footer()+'</div>'
}
function detailPriceData(key,purpose=""){
 const variant=key==="solo-film"?(purpose==="duo"?"duo":"solo"):FILM_FORMAT_PRICES[key]?"live":"base"
 const current=key==="solo-film"?(variant==="duo"?280000:FILM_FORMAT_PRICES[key].making):FILM_FORMAT_PRICES[key]?FILM_FORMAT_PRICES[key].live:PRODUCTS[key].normal
 return {current,regular:regularPriceForSale(current)}
}
function detailPriceDisplay(key,purpose=""){
 const {current,regular}=detailPriceData(key,purpose)
 return '<div class="detail-price-display"><p class="detail-price-regular"><span>정가</span><del>'+shortWon(regular)+'</del></p><p class="detail-price-current"><span>현재 판매가</span><strong>'+shortWon(current)+'</strong></p></div>'
}
function detailBenefitTeaser(key,purpose=""){
 const eventHref="#/event/"+key+(purpose?"/"+purpose:"")
 return '<section class="detail-benefit-teaser shell" aria-label="상품 정가와 현재 판매가"><div><small>WISTIA PRICE</small>'+detailPriceDisplay(key,purpose)+'<p>기본 구성 기준 · 추가 옵션 별도</p></div><a href="'+eventHref+'">구성·가격 확인하기 <span aria-hidden="true">↗</span></a></section>'
}
function detailDecisionSection(key,purpose=""){
 const eventHref="#/event/"+key+(purpose?"/"+purpose:"")
 const dayLabel=key==="proposal"?"프로포즈 날짜가":"예식일이"
 return '<section class="detail-decision shell" aria-labelledby="detailDecisionTitle"><div class="detail-decision-copy"><p class="detail-decision-kicker">예약을 생각하고 있다면</p><h2 id="detailDecisionTitle">'+dayLabel+' 가까워지고,<br>준비할 시간은 짧아집니다.</h2><p>녹음과 제작, 수정과 최종 전달까지 여유롭게 준비할 수 있도록 지금 구성과 가격을 확인해 보세요.</p></div><div class="detail-decision-action"><div class="detail-decision-benefit">'+detailPriceDisplay(key,purpose)+'<p>카카오톡 상담 시 <strong>1만원 추가 할인</strong></p><small>추가 옵션·이벤트 혜택은 가격 계산기에서 확인해 주세요.</small></div><a class="detail-decision-cta" href="'+eventHref+'">가격 확인하고 예약 상담하기 <span aria-hidden="true">↗</span></a><p>제작 가능 일정과 최종 금액은 상담에서 확인합니다.</p></div></section>'
}
function renderHome(requested="role"){
 if(requested==="role"){renderWeddingHome();return}
 const stage=requested==="people"&&finderChoice.moment?"people":requested==="service"&&finderChoice.role==="couple"?"service":"role"
 if(stage==="role"){renderWeddingHome();return} // Unselected finder entry uses the approved home
 const visuals={role:{singer:["assets/img/ar-detail/duet-live-proof-v2.jpg","01","축가 음원","내 목소리로 전하는 축가"],couple:["assets/img/ar-detail/duet-live-proof-v2.jpg","02","식전 상영 영상","노래와 장면을 함께"],proposal:["assets/img/ar-detail/duet-live-proof-v2.jpg","03","프로포즈 영상","마음을 담은 한 편의 영상"],making:["assets/img/ar-detail/duet-live-proof-v2.jpg","04","녹음 메이킹 영상","녹음하는 순간을 영상으로"]},service:{pre:["assets/img/wedding/01-guest-message.webp","01","BEFORE CEREMONY",""],ceremony:["assets/img/solo-film/solo-film-cover-v2.webp","02","AT THE CEREMONY",""]},people:{one:["assets/img/ar-detail/solo-live-proof.jpg","01","SOLO",""],two:["assets/img/song-film/duet-video-cover.jpg","02","TOGETHER",""]}}
 const choices=(name,items)=>items.map(([value,title,example])=>{const [photo,number,eyebrow,caption]=visuals[stage][value];const role=stage==="role";return '<label class="finder-choice"><input type="radio" name="'+name+'" value="'+value+'"><span class="finder-choice-photo" aria-hidden="true"><img src="'+photo+'" alt="" loading="lazy"></span><span class="finder-choice-body"><span class="finder-choice-overline">'+number+' <i></i> '+eyebrow+'</span><strong>'+title+'</strong>'+(example||caption?'<small>'+(example||caption)+'</small>':'')+(role?'<span class="finder-choice-action">자세히 보기 <b>→</b></span>':'')+'</span>'+(role?'':'<span class="finder-choice-arrow" aria-hidden="true">↗</span>')+'</label>'}).join("")
 Object.values(visuals.role).forEach(visual=>visual[1]="")
 visuals.role.making[2]="STORY FILM"
 const configs={
  role:{number:"",title:"어떤 순간을 남기고 싶으신가요?",description:"직접 부르는 축가와 우리 이야기를 담은 축가 영상 중 선택해 주세요",name:"finderRole",items:[["singer","AR 축가 사전녹음",'<b class="finder-product-hook">결혼식에서 직접 축가를 부른다면</b><br>내 목소리를 미리 녹음해<br>당일 축가를 더 안정적으로'],["making","축가 스토리 필름",'<b class="finder-product-hook">우리 목소리로 축가 영상을 만든다면</b><br>우리의 이야기를 담아<br>하객들도 함께 즐기는 영상으로']]},
  service:{number:"02",title:"무엇을 준비하시나요?",description:"예식에서 상영할 영상을 선택해 주세요",name:"finderMoment",items:[["ceremony","축가 순서에 상영할 영상","축가를 따로 섭외하지 않고, 우리가 직접 부른 영상을 축가 시간에 상영해요"]]},
  people:{number:"03",title:"혼자 준비하시나요, 두 분이 함께 준비하시나요?",description:"노래를 녹음하고 영상에 참여하는 인원을 선택해 주세요",name:"finderPeople",items:[["one","1인 · 혼자 준비해요","신랑 또는 신부 한 분이 노래하고 준비하는 경우"],["two","2인 · 두 분이 함께 준비해요","신랑신부 두 분이 함께 노래하고 준비하는 경우"]]}
 }
 const config=configs[stage],back=stage==="service"?"#/":"#/find/service"
 const editorialHero="" // Never restore the rejected AI portrait hero
 const editorialStory=stage==="role"?'<section class="editorial-home-story"><div class="editorial-story-heading"><span class="eyebrow">WEDDING SONG SPECIALISTS</span><h2>직접 부르는 축가,<br>우리 이야기로 만든 축가 영상</h2><p>경기도 부천의 웨딩 축가 전문 스튜디오<br>내 목소리를 미리 준비하는 AR 축가 사전녹음과<br>우리의 이야기를 담는 축가 스토리 필름을 만납니다</p><a class="text-link" href="#/info/about">위스티아는 어떤 곳인가요? <span aria-hidden="true">↗</span></a></div><figure><img src="assets/img/process-no-people/06.svg" alt="축가 음원 보정과 믹싱 작업" loading="lazy"><figcaption>AR 축가 사전녹음 — 내 목소리를 미리 녹음해 당일 축가를 더 안정적으로</figcaption></figure><figure><img src="assets/img/wedding/04-recording-making.webp" alt="축가 영상 녹음 제작 현장" loading="lazy"><figcaption>축가 스토리 필름 — 우리의 이야기를 담아 하객들도 함께 즐기는 영상으로</figcaption></figure><a class="editorial-location-link" href="#/info/location"><span>경기도 부천 · 웨딩 축가 전문 스튜디오</span><span>오시는 길 ↗</span></a></section>':''
 const headingTag=stage==="role"?"h2":"h1"
 app.innerHTML=editorialHero+'<section id="homeServices" class="finder-home shell finder-stage-'+stage+'" aria-labelledby="finderTitle"><div class="finder-content">'+(stage==="role"?"":'<a class="finder-back" href="'+back+'">← 이전 질문</a>')+'<header class="finder-intro"><span class="eyebrow">'+(stage==="role"?'OUR SERVICES':config.number)+'</span><'+headingTag+' id="finderTitle">'+config.title+'</'+headingTag+'><p>'+config.description+'</p></header><div class="finder-steps"><fieldset class="finder-step"><legend class="sr-only">'+config.title+'</legend><div class="finder-options">'+choices(config.name,config.items)+'</div></fieldset></div></div></section>'+editorialStory
 updateHomeFinder()
 app.querySelectorAll(".finder-choice").forEach(choice=>choice.addEventListener("click",event=>{event.preventDefault();const input=choice.querySelector("input");if(input)handleFinderChoice(input)}))
}
function renderInfoPage(key){
 const page=INFO_PAGES[key]||INFO_PAGES.about
 const aboutContent='<div class="wistia-about"><section class="wistia-about-story"><div><p class="info-section-kicker">WEDDING VOCAL · FILM STUDIO</p><h2>말로 다 전하지 못한 마음을<br>직접 부른 노래와 영상에 담습니다</h2><p>한 곡의 노래가 한 편의 영상이 되기까지, 목소리에 담긴 마음이 장면까지 자연스럽게 이어지도록 녹음부터 음원 작업, 촬영과 편집을 함께합니다</p></div><figure>'+img("assets/img/wedding/04-recording-making.webp","위스티아 웨딩 보컬 녹음 현장",true)+'</figure></section><section class="wistia-specialists" aria-labelledby="specialistTitle"><header><p class="info-section-kicker">ONE TEAM, THREE SPECIALISTS</p><h2 id="specialistTitle">각 분야의 전문가가<br>하나의 결과물을 완성합니다</h2></header><div class="wistia-specialist-grid"><article><span>01</span>'+img("assets/img/process-no-people/03.svg","1대1 보컬 디렉팅",true)+'<p>현장</p><h3>편안하게 부를 수 있도록</h3><small>1:1 보컬 디렉팅과 구간별 녹음으로 목소리의 장점을 찾습니다</small></article><article><span>02</span>'+img("assets/img/process-no-people/06.svg","음원 보정과 믹싱 작업",true)+'<p>음원</p><h3>내 목소리는 그대로, 더 안정적으로</h3><small>〈싱어게인2〉와 〈불후의 명곡〉 등 방송 음악 작업에 참여한 엔지니어가 보정부터 믹싱·마스터링까지 완성합니다</small></article><article><span>03</span>'+img("assets/img/wedding/03-lipsync-mv.webp","웨딩 영상 촬영과 편집",true)+'<p>영상</p><h3>노래의 감정이 장면까지 이어지도록</h3><small>7년 경력 영상 편집 디자이너가 이야기와 예식 분위기에 맞춰 촬영본을 한 편의 작품으로 엮습니다</small></article></div></section><blockquote class="wistia-about-closing"><p>노래를 얼마나 잘 부르는지보다<br><strong>그 안에 담긴 마음이 온전히 전해지는 것</strong></p><small>한 분 한 분의 목소리와 이야기에 귀 기울이겠습니다</small></blockquote></div>'
 const address="경기도 부천시 석천로170번길 19, 2층"
 const locationContent='<div class="wistia-location"><div class="wistia-location-address"><span>WISTIA STUDIO · BUCHEON</span><h2 class="studio-address"><span class="studio-address-city">경기도 부천시</span><span class="studio-address-street">석천로170번길 19</span><span class="studio-address-floor">2층</span></h2><p>부천시청역 1번 출구에서<br class="mobile-copy-break"> 도보 약 300m 거리입니다</p><div class="wistia-location-links"><a href="https://map.naver.com/p/search/'+encodeURIComponent(address)+'" target="_blank" rel="noopener noreferrer">네이버 지도에서 보기 <span aria-hidden="true">↗</span></a><a href="https://map.kakao.com/link/search/'+encodeURIComponent(address)+'" target="_blank" rel="noopener noreferrer">카카오맵에서 보기 <span aria-hidden="true">↗</span></a></div></div><div class="wistia-location-details"><article><span>01 / SUBWAY</span><h3>지하철로 오실 때</h3><p>부천시청역 1번 출구에서 도보 약 300m 이동해 주세요</p></article><article><span>02 / PARKING</span><h3>차량으로 오실 때</h3><p>스튜디오 바로 옆 공영주차장을 이용하실 수 있습니다 주차 요금은 별도이며 주차비 지원은 어렵습니다</p></article></div></div>'
 const directionsMap='<figure class="wistia-directions-map"><a href="'+location.origin+'/assets/img/wistia-directions.png" target="_blank" rel="noopener noreferrer" aria-label="오시는 길 지도 크게 보기">'+img("assets/img/wistia-directions.png","부천시청역 출구, 위스티아 스튜디오와 시의회 옆 공영주차장 위치 안내 지도",true)+'</a><figcaption>지도 이미지를 누르면 크게 볼 수 있습니다</figcaption></figure>'
 const faqContent='<div class="info-faq">'+INFO_FAQ_GROUPS.map((group,index)=>'<section class="info-faq-group" aria-labelledby="infoFaqGroup'+index+'"><h2 id="infoFaqGroup'+index+'">'+group.title+'</h2>'+faq(group.items)+'</section>').join("")+'</div>'
 const processContent='<div class="info-process"><ol class="we-process">'+[['상담·예약','원하는 곡과 상품, 본식 일정을 확인합니다'],['방문·녹음','부천 스튜디오에서 디렉팅을 받으며 녹음합니다'],['음원·영상 제작','선택한 상품에 맞춰 목소리와 장면을 완성합니다'],['완성본 전달','최종 파일을 받고 예식장 재생 환경을 확인합니다']].map(([title,copy],i)=>'<li><span>0'+(i+1)+'</span><h2>'+title+'</h2><p>'+copy+'</p></li>').join('')+'</ol>'+bookingGuideSection()+'<div class="info-process-actions"><a href="/detail/solo">AR 축가 알아보기 →</a><a href="/detail/duet-film">축가 스토리 필름 알아보기 →</a></div></div>'
 const content=key==="faq"?faqContent:key==="process"?processContent:key==="location"?locationContent.replace('<div class="wistia-location">','<div class="wistia-location">'+directionsMap).replace('WISTIA STUDIO · BUCHEON','위스티아 · 경기도 부천').replace('01 / SUBWAY','지하철 안내').replace('02 / PARKING','주차 안내'):aboutContent.replace('WEDDING VOCAL · FILM STUDIO','목소리와 이야기를 담는 스튜디오').replace('ONE TEAM, THREE SPECIALISTS','함께 완성하는 전문가들')
 app.innerHTML='<section class="shell section info-page info-page-'+key+'" aria-labelledby="infoPageTitle"><header class="info-page-intro">'+(page.eyebrow?label(page.eyebrow):'')+'<h1 id="infoPageTitle">'+page.title.replace("\n","<br>")+'</h1><p>'+page.description+'</p></header>'+content+'</section>'+footer()
}
function renderEventsPage(){
 const group=(type,title,timing,note)=>{const items=EVENTS.filter(item=>(item.type||'discount')===type),maximum=items.reduce((total,item)=>total+item.discount,0);return '<section class="wistia-event-group benefit-kind-card" data-benefit-type="'+type+'" aria-label="'+title+' 안내"><header class="benefit-kind-header"><h2>'+title+'</h2><strong class="benefit-kind-limit">최대 '+shortWon(maximum)+'</strong><span class="benefit-kind-timing">'+timing+'</span></header><p class="benefit-kind-note">'+note+'</p><div class="wistia-events-list">'+items.map(item=>'<article class="wistia-event-card"><div class="wistia-event-card-top"><span>'+String(EVENTS.indexOf(item)+1).padStart(2,"0")+' / 0'+EVENTS.length+'</span><strong>'+(type==='payback'?'페이백 ':'할인 −')+shortWon(item.discount)+'</strong></div><h3>'+item.label+'</h3><p><span>참여 조건</span>'+item.detail+'</p></article>').join("")+'</div></section>'}
 app.innerHTML='<section class="wistia-events shell" aria-labelledby="wistiaEventsTitle"><header class="wistia-events-intro"><p class="wistia-events-kicker">WISTIA EVENTS</p><h1 id="wistiaEventsTitle">함께 남기는 순간,<br>더해지는 혜택</h1><p>참여 가능한 이벤트와 조건을 확인해 보세요</p></header><div class="wistia-events-heading"><span>BENEFITS · 01—0'+EVENTS.length+'</span><h2>진행 중인 이벤트</h2></div><div class="benefit-kind-grid wistia-event-groups">'+group('payback','후기 페이백','조건 확인 후 지급','참여 조건 충족 확인 후 돌려드리는 금액이며, 결제 금액에서 미리 차감하지 않습니다')+'</div><p class="wistia-events-note">이벤트 참여 조건과 혜택 적용 시점은 예약 상담에서 최종 확인합니다</p></section>'+footer()
}
let contactQuote=null
let inquiryUndecided=false,inquiryObserver=null
function renderContactPage(){renderEvent('solo','')}
const FINDER_LABELS={role:{couple:"듀엣 식전 스토리 필름",singer:"AR 축가 사전녹음",proposal:"프로포즈 · 답프로포즈",making:"축가 녹음 메이킹 필름"},people:{one:"1인",two:"2인"},moment:{pre:"예식 전 식전 영상",ceremony:"축가 순서에 상영할 영상",live:"예식에서 직접 부를 축가"},lyrics:{yes:"가사 영상 필요",no:"사전 녹음 음원만 필요"}}
const FINDER_PRODUCTS={"pre/one":"duet-film","pre/two":"duet-film","ceremony/one":"duet-film","ceremony/two":"duet-film","live/one":"solo","live/two":"duo"}
let finderChoice=(()=>{try{const value=JSON.parse(sessionStorage.getItem("wistia:finder-selection"));return {role:value.role||"",people:value.people||"",moment:value.moment||"",lyrics:value.lyrics||""}}catch{return {role:"",people:"",moment:"",lyrics:""}}})()
function finderProduct(){return FINDER_PRODUCTS[[finderChoice.moment,finderChoice.people].join("/")]}
function finderPriceContext(key){return finderProduct()===key?finderChoice:null}
function handleFinderChoice(el){
 if(el.name==="finderRole"){
  finderChoice={role:el.value,moment:"",people:"",lyrics:""}
  sessionStorage.setItem("wistia:finder-selection",JSON.stringify(finderChoice))
  const next=el.value==="singer"?"#/detail/solo":el.value==="proposal"?"#/detail/proposal":el.value==="making"?"#/detail/solo-film/solo":"#/detail/wedding"
  history.pushState({wistiaDepth:(history.state?.wistiaDepth||0)+1},"",next.slice(1)+location.search);route();return
 }
 if(el.name==="finderMoment"){
  finderChoice.moment=el.value;finderChoice.people=""
  sessionStorage.setItem("wistia:finder-selection",JSON.stringify(finderChoice))
  history.pushState({wistiaDepth:(history.state?.wistiaDepth||0)+1},"","/find/people"+location.search);route();return
 }
 if(el.name==="finderPeople"){
  finderChoice.people=el.value
  sessionStorage.setItem("wistia:finder-selection",JSON.stringify(finderChoice))
  const product=finderProduct()
  history.pushState({wistiaDepth:(history.state?.wistiaDepth||0)+1},"",(product?"/detail/"+product:"/")+location.search);route()
 }
}
function updateHomeFinder(){
 const home=document.querySelector(".finder-home");if(!home)return
 home.querySelectorAll('input[name="finderRole"]').forEach(input=>input.checked=input.value===finderChoice.role)
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
 const song=kind==="song";const keys=song?["solo","duo"]:["duet-film"];
 app.innerHTML='<section class="shell section picker">'+label(song?"VOICE RECORDING":"WEDDING SONG FILM")+'<h1>'+(song?"현장에서는 편안하게<br>목소리는 미리 준비하세요":"축가 시간에 상영하는<br>우리의 뮤직비디오")+'</h1><p class="lead">'+(song?"미리 녹음한 목소리가 함께 흐르는 AR로 본식의 긴장을 덜어보세요":"하객 앞에서 직접 부르지 않아도, 직접 부른 노래로 마음을 전합니다")+'</p><div class="picker-grid">'+keys.map((k,i)=>{const p=PRODUCTS[k],m=SERVICE_META[k],href="#/detail/"+k;return '<article>'+label(m.type)+(m.image?'<a class="picker-photo" href="'+href+'" aria-label="'+p.title+' 상품 알아보기">'+img(m.image,p.title+' 안내 이미지')+'</a>':'<div class="type-art" aria-hidden="true">'+(k==="duet-film"?"DUET":"SOLO")+'</div>')+'<h2>'+p.title+'</h2><p>'+m.short+'</p><dl><div><dt>노래하는 사람</dt><dd>'+m.who+'</dd></div><div><dt>받는 결과물</dt><dd>'+m.result+'</dd></div></dl>'+cta("상품 알아보기",href)+'</article>'}).join("")+'</div></section>'+footer()
}
function compositionMedia(scene,index){const media=scene[2];if(!media)return "";if(Array.isArray(media))return '<div class="scene-image scene-pair">'+media.map((src,i)=>img(src,scene[0]+" 실제 영상 장면 "+(i+1))).join("")+'</div>';if(media.includes("-scenes.png"))return '<div class="scene-image scene-sprite" role="img" aria-label="'+escapeHtml(scene[0]+' 연출 이미지')+'" style="--scene-image:url(\'/'+media+'\');--scene-position:'+index*25+'%"></div>';return '<div class="scene-image">'+img(media.replace(".png",".webp"),scene[0]+" 실제 영상 장면")+'</div>'}
function composition(p){if(!p.composition)return "";const hasImages=p.composition.some(s=>s[2]);return '<section class="shell section composition-section">'+heading("",p.compositionTitle||"구성은 이렇습니다",p.compositionDescription||"원하는 장면은 더하고, 필요 없는 구성은 덜어낼 수 있습니다")+'<ol class="scene-grid '+(hasImages?"with-images":"text-scenes")+'">'+p.composition.map((s,i)=>'<li>'+compositionMedia(s,i)+'<div class="scene-copy"><span class="index">'+String(i+1).padStart(2,"0")+'</span><div><h3>'+s[0]+'</h3><p>'+s[1]+'</p></div></div></li>').join("")+'</ol><aside class="custom-note">'+label("1:1 맞춤 제작")+'<h3>정해진 틀보다, 두 분의 이야기</h3><p>구성을 빼거나 순서를 바꾸는 것도 가능합니다<br>원하는 컷이나 스토리가 있다면 1대1 상담으로 맞춤 반영합니다</p></aside></section>'}
function filmFormatNotes(format){return format.notes.length?'<ul>'+format.notes.map(note=>'<li>'+note+'</li>').join("")+'</ul>':""}
function bookingFilmFormatMedia(productKey,formatKey){const sources=FILM_PRICE_IMAGES[productKey]?.[formatKey]||[FILM_FORMAT_IMAGES[productKey][formatKey]];return '<span class="booking-format-media'+(sources.length>1?' is-pair':'')+'">'+sources.map((src,index)=>img(src,FILM_FORMATS[formatKey].title+' 예시 '+(index+1))).join("")+'</span>'}
function filmFormatPrice(productKey,formatKey=selectedFilmFormat){return FILM_FORMAT_PRICES[productKey]?.[formatKey]||PRODUCTS[productKey].normal}
function proposalFormatPreview(formatKey=selectedFilmFormat){const format=FILM_FORMATS[formatKey];return bookingFilmFormatMedia("proposal",formatKey)+'<div><strong>'+format.title+'</strong><p>'+format.summary+'</p></div>'}
function filmFormatSummary(productKey,formatKey){if(formatKey==="making"){if(productKey==="wedding"||productKey==="duet-film")return "녹음 메이킹 클립 6컷(인당 3컷) · 다양한 인서트 컷";if(productKey==="solo-film")return "녹음 메이킹 클립 2컷 · 다양한 인서트 컷"}if(formatKey==="live"&&(productKey==="wedding"||productKey==="duet-film"))return "뮤비 클립 4컷 · 다양한 인서트 컷 · 하객 메시지 · 인터뷰 · 전하는 편지";return FILM_FORMATS[formatKey].summary}
function bookingFilmFormatSection(productKey,step="02"){
 if(productKey==="solo-film")return '<div class="booking-base-choice"><p>녹음 인원</p><div class="calculator-option-list"><label class="option-choice"><input type="radio" name="filmPeople" value="1" data-film-people="1" '+(selectedFilmPeople===1?'checked':'')+'><span><strong>1인</strong></span><b>22만원</b></label><label class="option-choice"><input type="radio" name="filmPeople" value="2" data-film-people="2" '+(selectedFilmPeople===2?'checked':'')+'><span><strong>2인</strong></span><b>28만원</b></label></div></div>'
 if(productKey==="proposal"||productKey==="wedding"||productKey==="duet-film")return '<p class="booking-base-note">스토리형 영상이 기본 구성입니다</p>'
 return ""
}
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
function soloTopCta(key="solo"){const song=["solo","duo"].includes(key),copy=song?"1시간·2시간 AR 축가, 이벤트 가격 확인하기":"식전·축가 영상, 이벤트 가격 확인하기";return '<div class="solo-top-cta"><a href="#/event/'+key+'" aria-label="'+copy+'로 이동">'+copy+' <b aria-hidden="true">→</b></a></div>'}
function initSoloTopCta(){const bar=document.querySelector(".solo-top-cta");if(!bar)return;bar.classList.remove("is-stuck");bar.previousElementSibling?.classList.contains("solo-top-cta-sentinel")&&bar.previousElementSibling.remove()}
const SOLO_PERSON_ITEMS=[{key:"solo",title:"SOLO(1인)",desc:"1곡 기준 · 1시간 · 12만원"},{key:"duo",title:"DUET(2인)",desc:"1곡 기준 · 2시간 · 16만원"}]
function soloPersonTabs(key){const activeIndex=SOLO_PERSON_ITEMS.findIndex(item=>item.key===key);return '<section class="shell solo-person-picker" aria-label="녹음 시간 선택"><div class="solo-person-tabs" role="tablist" aria-label="AR 축가 1시간·2시간 선택" data-active="'+Math.max(activeIndex,0)+'">'+SOLO_PERSON_ITEMS.map((item,i)=>{const active=item.key===key;return '<a class="solo-person-tab'+(active?' is-active':'')+'" role="tab" aria-selected="'+active+'" tabindex="'+(active?"0":"-1")+'" href="#/detail/'+item.key+'" data-solo-person-tab="'+i+'"><strong>'+item.title+'</strong><span>'+item.desc+'</span></a>'}).join("")+'<span class="solo-person-indicator" aria-hidden="true"></span></div></section>'}
function initSoloPersonTabs(){const tabs=document.querySelector(".solo-person-tabs");if(!tabs)return;const links=[...tabs.querySelectorAll("[data-solo-person-tab]")];links.forEach((link,i)=>{link.addEventListener("keydown",e=>{if(e.key!=="ArrowRight"&&e.key!=="ArrowLeft")return;e.preventDefault();const next=links[(i+(e.key==="ArrowRight"?1:-1)+links.length)%links.length];links.forEach(l=>l.tabIndex=-1);next.tabIndex=0;next.focus()})})}
const DETAIL_PRODUCT_FAMILIES={
 wedding:[{key:"wedding",title:"식전 영상",desc:"예식의 첫 장면"},{key:"duet-film",title:"듀엣 축가 영상",desc:"축가 순서 상영"}],
 "duet-film":[],
 "solo-film":[],
 proposal:[]
}
function detailProductTabs(key){const items=DETAIL_PRODUCT_FAMILIES[key]||[];if(!items.length)return "";const activeIndex=items.findIndex(item=>item.key===key);return '<section class="shell solo-person-picker detail-product-picker" aria-label="영상 상품 선택"><div class="solo-person-tabs" role="tablist" aria-label="영상 상품 선택" data-active="'+Math.max(activeIndex,0)+'">'+items.map((item,i)=>{const active=item.key===key;return '<a class="solo-person-tab'+(active?' is-active':'')+'" role="tab" aria-selected="'+active+'" tabindex="'+(active?"0":"-1")+'" href="#/detail/'+item.key+'" data-solo-person-tab="'+i+'"><strong>'+item.title+'</strong><span>'+item.desc+'</span></a>'}).join("")+'<span class="solo-person-indicator" aria-hidden="true"></span></div></section>'}
function compactFilmHeroMedia(productKey){return '<div class="detail-result-card compact-film-hero-media"><div class="detail-result-media">'+img(FILM_FORMAT_IMAGES[productKey].making,PRODUCTS[productKey].title+' 실제 촬영 사진',true)+'</div></div>'}
function weddingFilmUseSection(){return '<section class="shell section wedding-film-use" aria-labelledby="weddingFilmUseTitle"><header><p class="eyebrow">WEDDING FILM</p><h2 id="weddingFilmUseTitle">한 페이지에서 보는 두 가지 상영 순간</h2><p>어느 순서에 상영할지에 따라 이야기의 흐름을 함께 정합니다</p></header><div class="wedding-film-use-grid"><article><span>01 · BEFORE CEREMONY</span><h3>식전 영상</h3><p>예식이 시작되기 전, 두 분의 노래와 이야기로 하객을 맞이합니다</p></article><article><span>02 · WEDDING SONG</span><h3>축가 영상</h3><p>축가 순서에 직접 부른 노래와 장면을 상영합니다</p></article></div></section>'}
function detailVariantPicker(key,purpose=""){
 const variants=key==="solo-film"?[["solo","1인"],["duo","2인"]]:null
 if(!variants)return ""
 const active=key==="solo-film"?(purpose==="duo"?"duo":"solo"):(FILM_FORMATS[purpose]?purpose:BASE_FILM_FORMAT[key])
 const title=key==="proposal"?"프로포즈 영상 구성":key==="solo-film"?"녹음 메이킹 인원":"식전 / 축가 영상 구성"
 return '<section class="shell detail-variant-picker" aria-label="'+title+'"><p>'+title+'</p><div class="detail-variant-grid">'+variants.map(([value,label])=>'<a href="#/detail/'+key+'/'+value+'" class="detail-variant'+(active===value?' is-active':'')+'"'+(active===value?' aria-current="page"':'')+'><strong>'+label+'</strong></a>').join("")+'</div><a class="detail-variant-price" href="#/event/'+key+'/'+active+'">선택한 구성 가격 보기 <span aria-hidden="true">→</span></a></section>'
}
const PACKAGE_ICONS={
 microphone:'<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4m-4 0h8"/>',
 camera:'<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
 tune:'<path d="M3 7h18M3 17h18M8 3v8m8 2v8"/><circle cx="8" cy="7" r="2" fill="currentColor" stroke="none"/><circle cx="16" cy="17" r="2" fill="currentColor" stroke="none"/>',
 mix:'<path d="M5 4v16M12 4v16M19 4v16"/><path d="M2 9h6m1 6h6m1-5h6"/>',
 master:'<path d="m12 2 2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2Z"/>',
 edit:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16m10-16v16M3 9h4m-4 6h4m10-6h4m-4 6h4"/>',
 mv:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 5 3-5 3V9Z"/>',
 message:'<path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 9h8m-8 3h6"/>',
 interview:'<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4m-4 0h8"/>',
 letter:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>'
}
function packageIcon(name){return studioIcon({message:'chat',interview:'microphone'}[name]||name)}
function filmMakingNotes(key){const message=key==="proposal"?"메시지":"하객 메시지";return ["협업 촬영 스튜디오의 뮤직비디오 클립과 인터뷰 촬영은 제외됩니다","전하는 편지와 "+message+"는 직접 촬영해 보내주시면 영상에 삽입할 수 있습니다","녹음 당일 스튜디오에서 휴대폰으로 직접 촬영하셔도 됩니다"]}
function filmStoryUpgradeNotes(){return ["협업 촬영 스튜디오에서 뮤직비디오 클립을 추가 촬영합니다","노래 시작 전 하객 메시지와 인터뷰를 담습니다","노래가 끝난 뒤 전하는 편지로 마무리합니다"]}
function productPackageOverview(key,purpose=""){
 const ar=["solo","duo"].includes(key),twoMaking=key==="solo-film"&&purpose==="duo",proposal=key==="proposal",story=["wedding","duet-film","proposal"].includes(key)
 const duration=ar?(key==="solo"?"녹음 60분":"녹음 120분"):proposal||key==="solo-film"&&!twoMaking?"녹음·촬영 총 90분":"녹음·촬영 총 180분"
 const title=ar?"AR 축가 사전녹음 구성":key==="solo-film"?(twoMaking?"2인":"1인")+" 축가 녹음 메이킹 필름 구성":proposal?"프로포즈 · 답프로포즈 스토리형 구성":key==="duet-film"?"듀엣 축가 영상 구성":"듀엣 식전 스토리 필름 구성"
 const storyItems=story?proposal?[["mv","뮤직비디오 클립"],["interview","인터뷰"],["letter","전하는 편지"]]:[["mv","뮤직비디오 클립"],["message","하객 메시지"],["interview","인터뷰"],["letter","전하는 편지"]]:[]
 const items=[[ar?"microphone":"camera",duration],["tune","수작업 음정·박자 보정"],["mix","믹싱"],["master","마스터링"],...storyItems]
 const description=ar?"1곡 기준으로 마디·구간별로 녹음하고 음정과 박자를 수작업으로 다듬습니다 가사 영상은 4만원, 다른 곡 1절 녹음은 녹음·튠·믹스 포함 6만원에 추가할 수 있습니다":key==="solo-film"?"녹음 메이킹은 노래를 완성하는 실제 과정을 담습니다 스토리형으로 업그레이드하면 협업 촬영 스튜디오의 뮤직비디오 클립, 노래 전 하객 메시지, 인터뷰와 노래 후 전하는 편지가 추가됩니다":proposal?"협업 촬영 스튜디오의 뮤직비디오 클립과 인터뷰, 전하는 편지를 더해 고백의 이야기를 완성합니다":"협업 촬영 스튜디오의 뮤직비디오 클립과 하객 메시지, 인터뷰, 전하는 편지를 노래와 함께 엮습니다"
 return '<section class="package-overview" aria-labelledby="packageOverviewTitle"><div class="shell"><p class="package-overview-eyebrow">상품 구성</p><h2 id="packageOverviewTitle">'+title+'</h2><div class="package-feature-grid">'+items.map(([icon,text])=>'<div class="package-feature"><span class="package-feature-icon" aria-hidden="true">'+packageIcon(icon)+'</span><strong>'+text+'</strong></div>').join("")+'</div><p class="package-overview-description">'+description+'</p>'+'</div></section>'
}
function bookingGuideSection(){return '<section class="booking-guide shell" aria-labelledby="bookingGuideTitle"><h2 id="bookingGuideTitle">이용 전 기본 안내</h2><div><article><span>01 이용 시간</span><p>표기된 시간에는 기본 안내, 연습 및 기타 부가 시간이 포함됩니다</p></article><article><span>02 추가 수정</span><p>3회까지 무료이며, 4회차부터 회당 10,000원입니다</p></article></div></section>'}
// Long-form AR product story, existing players and consultation flow are reused
function arSalesDetail(p,key){
 const hours=key==="duo"?2:1
 const proof=detailHookHero(p,key).replace(/<h1 id="arHookTitle">/, '<h2 id="arHookTitle">').replace('</h1>','</h2>')
 return '<div class="solo-detail-scope ar-detail-scope ar-sales-detail" data-ar-product="'+key+'">'+
 '<section class="ar-sales-intro" aria-labelledby="arSalesTitle"><p class="sales-brand">WISTIA <span>목소리와 영상</span></p><p class="sales-product">AR 축가 사전녹음 · '+hours+'시간</p><h1 id="arSalesTitle">떨리는 축가,<br><strong>내 목소리는<br>미리 완성하세요</strong></h1><p class="sales-lead">마음은 직접 전하고,<br>목소리는 미리 준비할 수 있으니까</p><div class="sales-tags"><span>#구간별녹음</span><span>#자연스러운보정</span><span>#내목소리AR</span></div><div class="sales-intro-photo"><img src="assets/img/process-no-people/03.svg" alt="스튜디오에서 마이크 앞에 서서 보컬을 녹음하는 모습" fetchpriority="high"><span>경기도 부천 · WISTIA STUDIO</span></div><div class="sales-checks"><div><b>01</b><strong>한 소절씩</strong><span>구간별 녹음</span></div><div><b>02</b><strong>목소리는 그대로</strong><span>수작업 보정</span></div><div><b>03</b><strong>본식에 맞게</strong><span>AR 비율 조절</span></div></div></section>'+
 '<section class="sales-proof"><header class="sales-section-heading"><p class="sales-point">THE MOMENT</p><h2>그날의 긴장보다,<br><strong>전하고 싶은 마음이 먼저</strong></h2><p>실제 고객님의 본식 영상으로 확인해 보세요</p></header>'+proof+'</section>'+
 '<section class="sales-recording"><header class="sales-section-heading"><p class="sales-point">핵심 01 · 구간별 녹음</p><h2>한 곡을 한 번에?<br><strong>한 소절씩이면 괜찮습니다</strong></h2><p>처음부터 끝까지 완벽하게 부를 필요 없이<br>구간별 녹음과 1:1 디렉팅으로 차근차근 완성합니다</p></header><figure><img src="assets/img/process-no-people/02.svg" alt="위스티아 스튜디오에서 헤드폰을 착용하고 녹음하는 실제 현장" loading="lazy"><figcaption>편한 키를 찾고, 내 속도에 맞춰 녹음합니다</figcaption></figure><ol class="sales-recording-steps"><li><span>01</span><strong>편한 키 찾기</strong></li><li><span>02</span><strong>구간별 녹음</strong></li><li><span>03</span><strong>1:1 디렉팅</strong></li></ol></section>'+
 '<div class="sales-tuning"><header class="sales-section-heading"><p class="sales-point">핵심 02 · 자연스러운 보정</p><h2>음정과 박자는 다듬고,<br><strong>내 목소리의 느낌은 그대로</strong></h2></header>'+wistiaBeforeAfterSection()+'</div>'+
 '<div class="sales-engineer">'+arExpertStory(key)+'</div>'+
 (key==="solo"?'<div class="sales-ratio"><p class="sales-point">핵심 03 · 목소리 비율</p>'+arCdRatioSection()+'</div>':'')+
 soloReviewCarousel()+productComparisonSection(key)+
 '<section class="sales-offer"><header class="sales-section-heading"><p class="sales-point">YOUR RECORDING</p><h2>필요한 녹음 시간만<br><strong>선택하세요</strong></h2><p>1곡 기준 SOLO(1인) 1시간 / DUET(2인) 2시간 상품입니다</p></header>'+soloPersonTabs(key)+'<div class="sales-price"><span>선택한 '+hours+'시간 기본 가격</span><strong>'+shortWon(p.normal)+'</strong><small>추가 옵션과 이벤트 혜택은 계산기에서 확인하세요</small></div>'+productPackageOverview(key)+'<a class="sales-price-link" href="#/event/'+key+'">옵션·이벤트 적용 가격 보기 <span aria-hidden="true">→</span></a></section>'+
 verticalProcessSection(key)+bookingGuideSection()+
 '<section class="shell section worry-section"><header class="sales-section-heading"><p class="sales-point">BEFORE YOU VISIT</p><h2>예약 전,<br><strong>궁금한 점을 확인하세요</strong></h2></header>'+faq(p.faq)+'<a class="solo-inline-contact" href="#/event/'+key+'"><strong>후기 페이백 혜택 보기</strong><span aria-hidden="true">›</span></a></section>'+footer()+'</div>'+priceBar(key)
}
function renderBeforeAfterPage(){
 app.innerHTML='<div class="solo-detail-scope ar-detail-scope before-after-page"><section class="shell section info-page info-page-comparison" aria-labelledby="comparisonPageTitle"><header class="info-page-intro"><span class="eyebrow">같은 녹음, 다른 완성도</span><h1 id="comparisonPageTitle">보컬 보정 전후 비교</h1><p>같은 녹음본의 음정과 박자를 다듬은 전후 차이를 직접 들어보세요</p></header>'+wistiaBeforeAfterSection()+'</section>'+footer()+'</div>'
}
// Two active product families, legacy making URLs remain available
// Number existing headings without duplicating shared player titles
function detailPointSection(html,number){
 const badge='POINT '+number,kicker=/<(span|p) class="([^"]*(?:kicker|eyebrow)[^"]*)"([^>]*)>[^<]*<\/\1>/
 if(kicker.test(html))return html.replace(kicker,(_,tag,classes,attributes)=>'<'+tag+' class="'+classes+' detail-point-label"'+attributes+'>'+badge+'</'+tag+'>')
 return html.replace(/(<header[^>]*>)/,'$1<span class="arc-kicker detail-point-label">'+badge+'</span>')
}
function storyVocalSection(){
 return detailPointSection(wistiaBeforeAfterSection(),'03')
 .replace('노래를 잘 못해도 괜찮습니다','영상에 담길 목소리도<br>자연스럽게 완성합니다')
 .replace('처음부터 끝까지 완벽하게 부를 필요 없이 구간별 녹음과 1:1 디렉팅으로 차근차근 완성합니다','한 소절씩 녹음하고 1:1 디렉팅을 받으며, 스토리 필름에 담길 두 분의 노래를 준비합니다')
}
function filmCommerceDetail(p,key,purpose=""){
 const story=key==="duet-film",title=story?'위스티아 축가 스토리 필름':'위스티아 축가 녹음 메이킹 필름'
 const price=story?filmFormatPrice(key,'live'):selectedFilmPeople===2?280000:220000
 const path='/event/'+key+(purpose?'/'+purpose:'')
 const action=(text,primary=false)=>'<a class="arc-button'+(primary?' is-primary':'')+'" href="'+path+'">'+text+'</a>'
 const content=AR_DETAIL_CONTENT[key]
 const media=img(content.poster,content.videoLabel,true)+'<button type="button" class="ar-hook-video-control ar-hook-video-play" data-inline-youtube="'+escapeHtml(p.videoUrl)+'" aria-label="'+escapeHtml(title)+' 실제 영상 재생"><span class="ar-icon-play" aria-hidden="true">▶</span></button>'
 const steps=[['상담·구성 결정','곡, 영상에 담을 이야기와 사용 일정을 함께 확인합니다'],['녹음·촬영','구간별 디렉팅으로 녹음하고 선택한 구성에 맞춰 촬영합니다'],['음원·영상 제작','수작업 보정과 믹싱·마스터링, 영상 제작을 진행합니다'],['완성본 확인·전달','완성 영상을 확인한 뒤 예식장 담당자와 재생을 준비합니다']]
return '<div class="solo-detail-scope ar-detail-scope ar-commerce-detail film-commerce-detail" data-ar-product="'+key+'"><section class="arc-product"><div class="arc-product-media ar-hook-media">'+media+'</div><div class="arc-summary"><span class="arc-kicker">WISTIA · 경기도 부천</span><h1>'+title+'</h1><p class="arc-hook">우리 목소리로,<br>하객들도 함께 즐기는 축가 영상</p><a class="arc-review-link" href="#reviews" data-ar-section="reviews">카카오톡 실제 후기 보기 →</a><div class="arc-price"><span>기본 가격 · '+(story?'스토리형 / 2인':selectedFilmPeople+'인')+'</span><strong>'+price.toLocaleString('ko-KR')+'<small>원</small></strong></div>'+(story?'<p class="arc-included">녹음·촬영 · 보컬 보정 · 믹싱·마스터링<br>뮤직비디오 클립 · 하객 메시지 · 인터뷰 · 전하는 편지</p>':detailVariantPicker(key,purpose)+'<p class="arc-included">녹음·메이킹 촬영 · 보컬 보정 · 믹싱·마스터링</p>')+'<div class="arc-actions">'+action('가격·옵션 확인')+action('카카오톡 상담',true)+'</div><p class="arc-online-note">옵션 선택 → 상담 내용 복사 → 확인 후 카카오톡 이동</p></div></section><nav class="arc-tabs" aria-label="상품 상세 메뉴">'+[['arcDetails','상세정보'],['reviews','실제 후기'],['arcFaq','자주 묻는 질문'],['arcProcess','진행 안내']].map(([id,name])=>'<a href="#'+id+'" data-ar-section="'+id+'">'+name+'</a>').join('')+'</nav><section class="arc-section" id="arcDetails"><span class="arc-kicker detail-point-label">POINT 01</span><h2>우리의 이야기를 담아<br>한 편의 축가로</h2><p>직접 부른 목소리에 녹음 장면'+(story?'과 두 사람의 이야기를':'을')+' 더합니다<br>본식 축가 순서에 상영할 영상으로 마음을 전하세요</p>'+productPackageOverview(key,purpose)+'</section>'+soloReviewCarousel()+'<div class="arc-engineer">'+detailPointSection(arExpertStory(key).replace('자연스럽게 들리는 AR을 완성합니다','영상과 어우러지는 완성 음원을 만듭니다'),'02')+'</div><section class="arc-point arc-point-tuning">'+storyVocalSection()+'</section>'+productComparisonSection(key)+'<section class="arc-section arc-process" id="arcProcess"><span class="arc-kicker">진행 순서</span><h2>목소리부터 영상까지</h2><ol>'+steps.map(([name,copy],i)=>'<li><span>0'+(i+1)+'</span><div><h3>'+name+'</h3><p>'+copy+'</p></div></li>').join('')+'</ol></section>'+detailPointSection(verticalProcessSection(key),'04')+bookingGuideSection()+'<section class="arc-section arc-faq" id="arcFaq"><h2>예약 전 궁금한 것들</h2>'+faq(p.faq)+'</section><section class="arc-section arc-final"><h2>우리 축가를 준비해 볼까요?</h2><p>구성과 가격을 확인한 뒤 카카오톡에서 일정을 상담합니다</p><div class="arc-actions">'+action('가격·옵션 확인')+action('카카오톡 상담',true)+'</div></section>'+footer()+'<aside class="arc-bottom" aria-label="상품 가격과 상담"><span><small>'+(story?'스토리형 · 2인':'녹음 메이킹')+'</small><b>'+price.toLocaleString('ko-KR')+'원</b></span>'+action('가격 보기')+action('카카오톡 상담',true)+'</aside></div>'
}
// Conversion helpers are reused unchanged, consultation first goes to the calculator
function arRecordingPoster(){
 const wave='<svg viewBox="0 0 140 28" aria-hidden="true"><path d="M2 14h4m4-4v8m5-13v18m5-22v26m5-19v12m5-17v22m5-14v6m5-13v20m5-16v12m5-20v28m5-22v16m5-13v10m5-8v6m5-12v18m5-16v14m5-19v24m5-20v16m5-13v10m5-8v6m5-12v18m5-15v12m5-8v4m5-7v10m5-8v6m5-5v4m5-2h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
 return '<section class="arc-point arc-point-recording" id="arcRecording"><header><span class="arc-kicker detail-point-label">POINT 01</span><h2>한 곡을 한 번에?<br><mark>한 소절씩 녹음하세요</mark></h2><p>어려운 구간은 나누어 녹음하고<br>1:1 디렉팅으로 차근차근 맞춰갑니다</p></header><figure class="arc-recording-poster" aria-label="한 소절씩 녹음하고 연결하는 과정 안내"><div class="arc-recording-photos"><div>'+img('assets/img/process-no-people/02.svg','마이크 앞에서 한 소절씩 녹음하는 장면')+'<span>한 소절씩 녹음</span></div><div>'+img('assets/img/process-no-people/06.svg','녹음 파형과 구간이 표시된 음원 작업 프로그램 화면')+'<span>프로그램에서 구간 확인</span></div></div><ol class="arc-recording-flow"><li><b>01 · 첫 소절</b>'+wave+'</li><li><b>02 · 다음 소절</b>'+wave+'</li><li><b>03 · 자연스럽게 연결</b>'+wave.replace('<path','<defs><linearGradient id="arJoinedWave"><stop offset="0%" stop-color="#506f88"/><stop offset="49%" stop-color="#506f88"/><stop offset="51%" stop-color="#638779"/><stop offset="100%" stop-color="#638779"/></linearGradient></defs><path').replace('stroke="currentColor"','stroke="url(#arJoinedWave)"')+'</li></ol><figcaption>녹음 → 듣고 디렉팅 → 다음 구간 녹음<br>구간별 녹음 방식을 설명하는 이미지입니다</figcaption></figure></section>'
}
const AR_CUSTOMER_DUET_POSTER='assets/img/ar-detail/duet-live-proof-v2.jpg'
function arCustomerVideoData(key){
 const duet=key==='duo'
 return {src:PRODUCTS[duet?'duo':'solo'].resultVideo,poster:duet?AR_CUSTOMER_DUET_POSTER:AR_DETAIL_CONTENT.solo.poster,label:duet?'신랑신부가 함께 부르는 본식 듀엣 AR 축가 장면':'신랑이 혼자 부르는 본식 SOLO AR 축가 장면'}
}
function updateArCustomerVideo(root,key){
 const video=root.querySelector('.ar-hook-media video'),data=arCustomerVideoData(key),source=video?.querySelector('source')
 if(!source||source.getAttribute('src')===data.src)return
 video.pause()
 source.setAttribute('src',data.src)
 video.setAttribute('poster',data.poster)
 video.setAttribute('aria-label',data.label)
 const fallback=root.querySelector('.ar-hook-fallback')
 if(fallback){fallback.setAttribute('src',data.poster);fallback.setAttribute('alt',data.label)}
 video.classList.remove('is-playing')
 const control=root.querySelector('[data-ar-video-toggle]')
 control?.classList.remove('is-playing')
 control?.setAttribute('aria-label','영상 재생')
 video.load()
}
function arCommerceDetail(p,key="solo"){
 const hours=key==='duo'?'2':'1',amount=(p.normal||120000).toLocaleString('ko-KR'),content=AR_DETAIL_CONTENT[key]||AR_DETAIL_CONTENT.solo
 const action=(text,consult=false)=>'<a class="arc-button'+(consult?' is-primary':'')+'" href="/event/'+key+'" data-ar-price-link>'+text+'</a>'
 const point=(number,title,copy,photo,alt)=>'<section class="arc-point arc-point-key" id="arcKey"><header><span class="arc-kicker detail-point-label">POINT '+number+'</span><h2>'+title+'</h2><p>'+copy+'</p><p class="arc-free-edit"><strong>음원 편집 · 키 조절 무료</strong><span>추가금 없음</span></p></header><figure>'+img(photo,alt)+'<figcaption>목소리에 맞춰 녹음 방향을 상담하는 과정 예시</figcaption></figure></section>'
 const questions=[
  ['노래를 잘 못해도 괜찮을까요?','괜찮습니다, 한 곡을 처음부터 끝까지 완벽하게 부르실 필요는 없습니다<br>구간별 녹음과 1:1 디렉팅으로 완성하고 음정·박자는 수작업으로 다듬습니다'],
  ['어려운 부분은 다시 부를 수 있나요?','<span data-ar-hours>'+hours+'</span>시간 안에서 어려운 구간은 충분히 다시 녹음하며 맞춰갑니다<br>한 소절씩 듣고 디렉팅을 받아 편하게 진행하실 수 있습니다'],
  ['원곡의 키가 너무 높은데 괜찮을까요?','예약 상담 때 원하는 곡과 MR을 먼저 보내주세요<br>목소리에 맞는 키와 녹음 방향을 함께 확인합니다'],
  ['완성 음원은 언제 받을 수 있나요?','녹음과 필요한 자료 전달이 모두 끝난 뒤 최대 7일 이내에 전달합니다<br>본식 일정이 가까우면 예약 전에 제작 가능 일정을 먼저 확인해 주세요'],
  ['본식에서는 어떻게 사용하나요?','예식장에 본식용 AR 음원을 미리 전달하고 재생하며 직접 노래하시면 됩니다<br>담당자와 파일 재생 및 리허설 시간을 사전에 확인해 주세요'],
  ['녹음한 목소리의 비율도 고를 수 있나요?','가능합니다, 스튜디오에서 리허설과 AR 연습 방법을 안내합니다<br>직접 부르는 방식에 맞춰 함께 들어보고 목소리 비율을 결정합니다']
 ]
 const customerVideo=arCustomerVideoData(key)
 const media='<div class="arc-product-media ar-hook-media"><img class="ar-hook-fallback" src="'+customerVideo.poster+'" alt="'+customerVideo.label+'" fetchpriority="high"><video loop playsinline preload="metadata" poster="'+customerVideo.poster+'" aria-label="'+customerVideo.label+'"><source src="'+customerVideo.src+'" type="video/mp4"></video><button class="ar-hook-video-control" type="button" data-ar-video-toggle aria-label="영상 재생"><span class="ar-icon-play">▶</span><span class="ar-icon-pause">Ⅱ</span></button><span class="arc-media-note">고객님이 직접 보내주신 본식 영상</span></div>'
 const desktopHtml='<div class="solo-detail-scope ar-detail-scope ar-commerce-detail" data-ar-product="'+key+'">'+
 '<section class="arc-product" aria-labelledby="arcProductTitle">'+media+'<div class="arc-summary"><p class="arc-kicker">WISTIA · 경기도 부천</p><h1 id="arcProductTitle">위스티아 AR 축가<br><span data-ar-format>'+(key==='duo'?'DUET(2인)':'SOLO(1인)')+'</span> · <span data-ar-hours>'+hours+'</span>시간</h1><p class="arc-hook">축가, 직접 부르세요!<br>목소리는 미리 준비하세요</p><div class="arc-price" data-price-block><span>1곡 기준 · 기본 가격</span><strong><span data-ar-price>'+amount+'</span><small>원</small></strong></div><div class="arc-options" role="group" aria-label="녹음 시간 선택"><button type="button" data-ar-time="solo" aria-pressed="'+(key==='solo')+'"><b>SOLO(1인)</b><span>1시간 · 12만원</span></button><button type="button" data-ar-time="duo" aria-pressed="'+(key==='duo')+'"><b>DUET(2인)</b><span>2시간 · 16만원</span></button></div><p class="arc-included">보컬 디렉팅 · 음정·박자 보정<br>믹싱·마스터링 포함</p><div class="arc-actions">'+action('가격·옵션 확인')+action('카카오톡 상담',true)+'</div><p class="arc-online-note">사이트 결제 없이 상담으로 일정과 구성을 확인합니다</p></div></section>'+
 '<nav class="arc-tabs" aria-label="상품 상세 메뉴">'+[['arcDetails','상세정보'],['reviews','실제 후기'],['arcFaq','자주 묻는 질문'],['arcProcess','진행 안내']].map(([id,title])=>'<a href="#'+id+'" data-ar-section="'+id+'">'+title+'</a>').join('')+'</nav>'+
 '<section class="arc-point arc-package" id="arcDetails"><header><span class="arc-kicker">상품 기본 구성</span><h2>녹음부터 완성 음원까지<br><mark>기본 구성에 포함</mark></h2><p>보컬 디렉팅, 수작업 보정, 믹싱·마스터링<br>본식용 AR과 완성 음원을 전달합니다</p></header>'+productPackageOverview(key).replace(key==='duo'?'녹음 120분':'녹음 60분','녹음 <span data-ar-minutes>'+(key==='duo'?'120':'60')+'</span>분')+'</section>'+
 '<section class="arc-empathy arc-section" id="arcEmpathy"><span class="arc-kicker">축가가 걱정되신다면</span><h2>노래 실력보다<br><mark>내 목소리가 먼저입니다</mark></h2><p>떨려서 음정이 흔들릴까 봐, 가사를 놓칠까 봐<br>혼자 걱정하지 마세요</p><div class="arc-emphasis">미리 녹음한 내 목소리가<br>본식에서 함께합니다</div><p>내 목소리가 담긴 AR을 재생하며 직접 부르는 축가<br>마음은 직접 전하고, 목소리는 미리 준비합니다</p></section>'+
 '<div class="arc-reviews">'+soloReviewCarousel().replace('직접 보내주신 카카오톡 후기 원문입니다','녹음·영상 상품 고객님이 직접 보내주신 카카오톡 후기 원문입니다')+'</div>'+
 arRecordingPoster()+
 point('02','원곡이 높다면?<br><mark>내 목소리에 맞춥니다</mark>','원하는 곡과 MR을 먼저 보내주세요<br>편한 키와 녹음 방향을 상담에서 확인합니다','assets/img/process-no-people/03.svg','목소리에 맞는 키와 녹음 방향을 상담하는 과정 예시')+
 '<section class="arc-point arc-point-tuning" aria-label="보컬 보정 전후 듣기">'+detailPointSection(wistiaBeforeAfterSection(),'03')+'</section>'+
 '<section class="arc-point arc-point-ratio" aria-label="본식 AR 비율 체험">'+detailPointSection(arCdRatioSection(),'04')+'</section>'+

 '<section class="arc-section arc-lyrics"><div><span class="arc-kicker detail-point-label">POINT 05</span><p class="arc-option-fee">가사 영상 추가 옵션 · +40,000원</p><h2>뒤에 띄울 가사 영상도<br>필요하세요?</h2><p class="ar-essential-line"><span class="ar-line-full">두 분의 사진과 영상이 자연스럽게 전환되면서 노래의 가사가 함께 나옵니다</span><span class="ar-line-compact">사진·영상과 함께 노래 가사가 나옵니다</span></p>'+action('가사 영상 옵션 견적 뽑기')+'</div><figure>'+img('assets/img/song-options/lyric-video-v2.webp','두 사람의 사진과 노래 가사가 함께 나오는 가사 영상 예시')+'</figure></section>'+
 '<div class="arc-advantages">'+productComparisonSection('solo')+'</div>'+
 '<div class="arc-engineer">'+arExpertStory('solo')+'</div>'+
 '<section class="arc-section arc-process" id="arcProcess"><span class="arc-kicker">진행 순서</span><h2>준비부터 전달까지<br>이렇게 진행합니다</h2><ol>'+[['상담·예약','원하는 곡, 녹음 시간과 본식 일정을 확인합니다'],['방문·녹음','경기도 부천 스튜디오에서 구간별 녹음과 1:1 디렉팅을 진행합니다'],['보정·완성','음정·박자를 수작업으로 다듬고 믹싱·마스터링을 진행합니다'],['음원 전달','본식용 AR과 완성 음원을 받고 예식장 담당자와 재생을 확인합니다']].map(([title,copy],i)=>'<li><span>0'+(i+1)+'</span><div><h3>'+title+'</h3><p>'+copy+'</p></div></li>').join('')+'</ol></section>'+
 '<section class="arc-section arc-faq" id="arcFaq"><span class="arc-kicker">Q & A</span><h2>자주 묻는 질문</h2>'+faq(questions)+'</section>'+
 '<section class="arc-section arc-time-guide"><span class="arc-kicker">인원과 녹음 시간</span><h2>혼자 또는 함께,<br>인원에 맞게 선택하세요</h2><div class="arc-time-cards"><article><h3>SOLO(1인)</h3><strong>12만원</strong><p>1곡 기준 · 1시간</p></article><article><h3>DUET(2인)</h3><strong>16만원</strong><p>1곡 기준 · 2시간</p></article></div><p>SOLO는 1인, DUET은 2인 녹음 상품입니다<br>표시 시간에는 안내·연습·부가 시간이 포함됩니다</p></section>'+
 '<section class="arc-section arc-notices"><span class="arc-kicker">BEFORE YOU BOOK</span><h2>예약 전에 확인하세요</h2><ul><li><strong>납기</strong> <span>녹음과 필요한 자료 전달 완료 후 최대 7일 이내</span></li><li><strong>수정</strong> <span>3회까지 무료, 4회차부터 회당 1만원</span></li><li><strong>추가 옵션</strong> <span>가사 영상 +4만원<br>1절 녹음 추가 +6만원</span></li><li><strong>본식 사용</strong> <span>예식장 담당자와 음원 재생·리허설을 사전에 확인해 주세요<br>현장 음향에 따라 들리는 느낌은 달라질 수 있습니다</span></li></ul><a href="/info/location" class="arc-location-link">경기도 부천 스튜디오 오시는 길 →</a></section>'+
 '<section class="arc-section arc-final"><h2>축가는 직접,<br>준비는 위스티아와 함께</h2><p>선택한 구성과 가격을 복사한 뒤<br>카카오톡에서 일정을 확인하세요</p><div class="arc-actions">'+action('가격·옵션 확인')+'</div></section>'+footer()+
 '<aside class="arc-bottom" aria-label="상품 가격과 상담"><span><small>AR 축가 · <span data-ar-hours>'+hours+'</span>시간</small><b><span data-ar-price>'+amount+'</span>원</b></span>'+action('가격 보기')+action('카카오톡 상담',true)+'</aside></div>'
 // The approved mobile composition is canonical at every width; CSS handles sizing only.
 return ['solo','duo'].includes(key)?mobileArSoloDetail(p,desktopHtml,key):desktopHtml
}
function mobileArDesignIcon(name){
 return studioIcon(name==='record'?'microphone':name)
}
function mobileArCutPoster(){
 const wave=studioWaveformGraphic()
 return '<figure class="mas-cut-poster" aria-label="소절별로 나누어 녹음한 뒤 두 녹음 구간을 자연스럽게 연결합니다"><div class="mas-cut-heading">'+mobileArDesignIcon('cut')+'<strong>한 소절씩 나누어 녹음</strong></div><div class="mas-cut-clips"><div><b>첫 소절</b>'+wave+'</div><span class="mas-cut-seam" aria-hidden="true">'+mobileArDesignIcon('cut')+'</span><div><b>다음 소절</b>'+wave+'</div></div><div class="mas-join-heading">'+mobileArDesignIcon('join')+'<strong>좋은 구간을 이어 붙여요</strong></div><div class="mas-joined-clip"><div>'+wave+'</div><span aria-hidden="true">'+mobileArDesignIcon('join')+'</span><div>'+wave+'</div></div><figcaption class="ar-essential-line"><span class="ar-line-full">어려운 구간은 나누어 녹음하고 1:1 디렉팅으로 차근차근 맞춰갑니다</span><span class="ar-line-compact">구간별 녹음과 1:1 디렉팅으로 완성합니다</span></figcaption></figure>'
}
function mobileArProcess(key="solo"){
 const steps=detailStudioSteps(key)
 return '<section class="arc-section arc-process mas-detailed-process story-process-cards" id="arcProcess"><h2>진행 순서</h2><details class="story-process-folder" open><summary>'+processFolderArt()+'<span class="process-folder-label"><strong>제작 과정 살펴보기</strong><small>클릭하면 단계별 사진과 설명이 펼쳐집니다</small></span><span class="process-folder-cue"><span class="folder-open-label"><span class="folder-open-text">클릭하여 열기</span><span class="folder-cue-arrow" aria-hidden="true">'+studioIcon('down')+'</span></span><span class="folder-close-label">접어두기 '+studioIcon('up')+'</span></span></summary><div class="process-folder-content"><ol class="story-process-grid">'+steps.map((step,i)=>'<li class="story-process-card" style="--process-index:'+i+';--process-row:'+(Math.floor(i/2)+1)+';--process-column:'+(i%2+1)+'"><div class="story-process-media">'+img(step.image,step.short+' 제작 과정',true)+'</div><div class="story-process-copy"><span class="story-process-number">'+String(step.id).padStart(2,"0")+'</span><h3>'+escapeHtml(step.short)+'</h3><p>'+escapeHtml(step.description)+'</p></div></li>').join('')+'</ol></div></details></section>'
}
function mobileArNotices(story=false){
 const address=encodeURIComponent('경기도 부천시 석천로170번길 19, 2층')
 return '<section class="arc-section arc-notices mas-notices"><h2>예약 전에 확인하세요</h2><ul><li><strong>납기</strong><div><b>'+(story?'약 14일':'최대 7일 이내')+'</b><small>'+(story?'촬영·자료 전달 완료 후':'녹음 후')+'</small></div></li><li><strong>수정</strong><div><b>3회까지 무료</b><small>4회차부터 회당 1만원</small></div></li><li class="mas-rush-notice"><strong>빠른 작업</strong><div><b>요청 시 3일 이내 · 추가 3만원</b><small>제작 일정과 자료 준비 상태를 상담에서 확인한 뒤, 가능한 경우에만 진행합니다</small></div></li></ul></section><section class="arc-section mas-location" aria-labelledby="masLocationTitle"><header>'+mobileArDesignIcon('pin')+'<h2 id="masLocationTitle">오시는 길</h2></header><p class="mas-location-city">경기도 부천시</p><address>석천로170번길 19 <span>2층</span></address><dl><div><dt>지하철</dt><dd>부천시청역 1번 출구<br>도보 약 300m</dd></div><div><dt>주차</dt><dd>스튜디오 바로 옆 공영주차장<small>주차 요금 별도 · 주차비 지원 불가</small></dd></div></dl><div class="wistia-location-links mas-map-links"><a href="https://map.naver.com/p/search/'+address+'" target="_blank" rel="noopener noreferrer">네이버 지도 <span aria-hidden="true">↗</span></a><a href="https://map.kakao.com/link/search/'+address+'" target="_blank" rel="noopener noreferrer">카카오맵 <span aria-hidden="true">↗</span></a></div></section>'
}
// Read-only disclosure shares the calculator's approved benefit names, amounts and conditions.
function mobileDetailEvents(){
 const maximum=EVENTS.reduce((total,event)=>total+event.discount,0)
 const group=(type,title,timing,note)=>{const items=EVENTS.filter(event=>(event.type||'discount')===type),limit=items.reduce((total,event)=>total+event.discount,0);return '<section class="mas-event-group benefit-kind-card" data-benefit-type="'+type+'" aria-label="'+title+' 안내"><header class="benefit-kind-header"><h4>'+title+'</h4><strong class="benefit-kind-limit">최대 '+shortWon(limit)+'</strong><span class="benefit-kind-timing">'+timing+'</span></header><p class="benefit-kind-note">'+note+'</p><ul>'+items.map(event=>'<li><div><strong>'+escapeHtml(event.label)+'</strong><b>'+(type==='payback'?'페이백 ':'할인 −')+shortWon(event.discount)+'</b></div><p>'+escapeHtml(event.detail)+'</p></li>').join('')+'</ul></section>'}
 return '<details class="mas-event-disclosure"><summary><span class="mas-event-gift" aria-hidden="true"><img src="/assets/img/studio-3d/gift-benefits-yellow-v1.webp" alt="" width="48" height="48" loading="eager" decoding="async"></span><span><strong>이벤트 목록 확인하기</strong><small>참여 혜택 최대 '+shortWon(maximum)+'</small></span><span class="mas-event-chevron" aria-hidden="true">'+studioIcon('chevron')+'</span></summary><div class="mas-event-content"><div class="benefit-kind-grid">'+group('payback','후기 페이백','조건 확인 후 지급','참여 조건 충족 확인 후 돌려드리는 금액이며, 결제 금액에서 미리 차감하지 않습니다')+'</div><p class="mas-event-note">참여 조건과 최종 혜택 적용 여부는 상담에서 확인합니다</p></div></details>'
}
function mobileDetailReviews(){return soloReviewCarousel().replace('<span data-solo-kicker>고객 후기</span>','').replace('<p data-solo-sub>직접 보내주신 카카오톡 후기 원문입니다</p>','').replace(/<div class="review-carousel-controls">[\s\S]*?<\/div>/,'')}
function mobileDetailFooter(){return footer()}
function mobileStudioBrand(){return '<div class="mas-brand">'+img('assets/img/wistia-logo-transparent.webp','')+'<span><b>WISTIA</b><small>웨딩 축가 전문 스튜디오</small></span></div>'}
function storySceneImage(src,alt){const name=src.match(/^assets\/img\/duet-film\/(duet-(?:guest-message|interview|memories|recording|music-video|letter-bride|letter-groom))\.webp$/);return img(name?'assets/img/story-scenes-retouched/'+name[1]+'-face-v1.webp':src,name?alt+' · 얼굴 보정한 구성 안내 예시':alt)}
function mobileStoryFilmDetail(p){
 const key='duet-film',price=filmFormatPrice(key,'live'),eventPrice=Math.max(0,price-EVENTS.reduce((total,event)=>total+event.discount,0)),content=AR_DETAIL_CONTENT[key]
 const info=[['상품','축가 스토리 필름'],['인원 · 곡수','2인 · 1곡'],['녹음·촬영 시간','총 180분 <small>안내·연습·부가 시간 포함</small>'],['포함 작업','녹음 · 보컬 디렉팅 · 음정·박자 보정<br>믹싱 · 마스터링 · 영상 제작'],['전달 파일','본식 상영용 영상 · 완성 음원'],['제작 기간','촬영·자료 전달 완료 후 약 14일']]
 const chapters=p.composition.map(([title,copy,photo],i)=>'<li><figure>'+storySceneImage(Array.isArray(photo)?photo[0]:photo,title+' 제작 영상 장면')+'</figure><div><span>0'+(i+1)+'</span><h3>'+title+'</h3><p>'+copy+'</p></div></li>').join('')
 const experts=detailPointSection(arExpertStory(key).replace('자연스럽게 들리는 AR을 완성합니다','영상과 어우러지는 완성 음원을 만듭니다'),'02')
 const vocal=storyVocalSection().replace('한 소절씩 녹음하고 1:1 디렉팅을 받으며, 스토리 필름에 담길 두 분의 노래를 준비합니다','한 소절씩 녹음하고, 두 목소리를 함께 맞춥니다').replace('녹음 후에는 음정·박자를 수작업으로 세밀하게 보정해 원래 목소리의 느낌은 살리고 더욱 자연스럽게 완성합니다','보정·믹싱의 마법, 티 나지 않게 자연스럽게').replace('<span class="ba-paragraph">보정·믹싱의 마법','<span class="ba-paragraph mas-tuning-line">보정·믹싱의 마법')
 const process=detailPointSection(verticalProcessSection(key),'04').replace('story-process-cards"','story-process-cards arc-section arc-process mas-story-process"').replace('id="process"','id="arcProcess"').replace('처음부터 끝까지,<br>맞춤형으로 케어해드립니다','진행 순서')
 const advantages=productComparisonSection(key).replace('한 곡을 준비하는 과정부터 완성본까지, 필요한 작업에 집중합니다','준비부터 완성까지, 필요한 작업에 집중합니다')
return '<div class="solo-detail-scope ar-detail-scope ar-commerce-detail mobile-ar-solo mobile-story-film" data-ar-product="duet-film"><section class="mas-intro" aria-labelledby="arcProductTitle"><div class="mas-gallery"><p class="mas-gallery-caption">위스티아 실제 제작 영상</p><div class="mas-story-media"><button type="button" class="mas-story-video" data-inline-youtube="'+escapeHtml(p.videoUrl)+'" aria-label="축가 스토리 필름 실제 영상 재생">'+img(content.poster,content.videoLabel,true)+'<span class="mas-story-play"><span aria-hidden="true">▶</span> 실제 영상 보기</span></button></div></div><div class="mas-summary">'+mobileStudioBrand()+'<h1 id="arcProductTitle">축가 스토리 필름<br><span>우리 목소리와 이야기를 담은 영상</span></h1><p class="mas-description">하객과 함께 즐기는, 두 사람의 축가</p><p class="mas-included"><span>구간별 1:1 디렉팅</span><span>음정·박자 보정</span><span>스토리 영상 제작</span></p><p class="mas-price"><strong>'+price.toLocaleString('ko-KR')+'<small>원</small></strong><span>(1곡 · 2인 · 스토리형)</span></p><p class="mas-event-price"><span>페이백 완료 후 혜택가</span><strong>'+eventPrice.toLocaleString('ko-KR')+'원</strong></p>'+mobileDetailEvents()+'</div></section><section class="mas-information" aria-labelledby="masInfoTitle"><h2 id="masInfoTitle">상품정보</h2><dl>'+info.map(([label,value])=>'<div><dt>'+label+'</dt><dd>'+value+'</dd></div>').join('')+'</dl></section><div class="arc-reviews">'+mobileDetailReviews()+'</div><section class="arc-section mas-story-chapters" id="arcDetails"><header><span class="arc-kicker detail-point-label">POINT 01</span><h2>우리의 이야기를 담아<br>한 편의 축가로</h2><p>직접 부른 노래와 두 사람의 이야기가<br>본식에서 함께 즐기는 영상이 됩니다</p></header><ol>'+chapters+'</ol></section><div class="arc-engineer">'+experts+'</div><section class="arc-point arc-point-tuning">'+vocal+'</section>'+advantages+process+'<section class="arc-section arc-faq" id="arcFaq"><h2>자주 묻는 질문</h2>'+faq(p.faq)+'</section>'+mobileArNotices(true)+mobileDetailFooter()+'<aside class="mas-bottom" aria-label="상품 문의"><a href="/event/duet-film">카카오톡 문의</a></aside></div>'
}
function mobileArSoloDetail(p,desktopHtml,key='solo'){
 // SOLO and DUET share one compact mobile sales layout while desktop keeps its existing renderer.
 const duet=key==='duo',people=duet?'2':'1',hours=duet?'2':'1',format=duet?'DUET':'SOLO',eventPrice=Math.max(0,p.normal-EVENTS.reduce((total,event)=>total+event.discount,0))
 const galleryVideos=['solo','duo'].map((galleryKey,index)=>{const item=arCustomerVideoData(galleryKey);return '<div class="mas-gallery-slide" id="masVideoSlide'+index+'"><div class="arc-product-media ar-hook-media mas-video-surface"><img class="ar-hook-fallback" src="'+item.poster+'" alt="'+item.label+'" '+(galleryKey===key?'fetchpriority="high"':'loading="lazy"')+'><video loop playsinline preload="metadata" poster="'+item.poster+'" aria-label="'+item.label+'"><source src="'+item.src+'" type="video/mp4"></video><button class="ar-hook-video-control" type="button" data-ar-video-toggle aria-label="영상 재생"><span class="ar-icon-play" aria-hidden="true">'+studioIcon('play')+'</span><span class="ar-icon-pause" aria-hidden="true">'+studioIcon('pause')+'</span></button></div></div>'}).join('')
 const info=[['상품','AR 축가 사전녹음'],['인원 · 곡수',people+'인 · 1곡'],['녹음시간',hours+'시간 <small>안내·연습·부가 시간 포함</small>'],['포함 작업','녹음 · 보컬 디렉팅 · 음정·박자 보정 · 믹싱 · 마스터링'],['전달 파일','본식용 AR · 완성 음원'],['제작 기간','녹음 후 최대 7일 이내']]
 const variants=['solo','duo'].map(option=>{
  const selected=option===key,isDuet=option==='duo',label=(isDuet?'DUET · 2인':'SOLO · 1인')
  return '<'+(selected?'div':'a')+' class="mas-variant'+(selected?' is-selected':'')+'" '+(selected?'aria-label="현재 선택한 상품 '+label+'"':'href="/detail/'+option+'"')+'><i aria-hidden="true"></i><div><b>'+label+'</b><span>1곡 · '+(isDuet?'2':'1')+'시간</span><strong>'+PRODUCTS[option].normal.toLocaleString('ko-KR')+'원</strong></div><small>'+(selected?'선택됨':'변경 ›')+'</small></'+(selected?'div':'a')+'>'
 }).join('')
 // Reuse the existing media, POINTs, FAQ and notices without duplicating player IDs.
 let details=desktopHtml.slice(desktopHtml.indexOf('<section class="arc-point arc-point-recording"'),desktopHtml.indexOf('<aside class="arc-bottom"'))
 details=details.replace(/<section class="arc-section arc-time-guide">[\s\S]*?<\/section>/,'').replace(/<section class="arc-section arc-final">[\s\S]*?<\/section>/,'')
 details=details.replace('처음부터 끝까지 완벽하게 부를 필요 없이 구간별 녹음과 1:1 디렉팅으로 차근차근 완성합니다','한 구간씩 녹음하고, 1:1로 방향을 잡습니다').replace('녹음 후에는 음정·박자를 수작업으로 세밀하게 보정해 원래 목소리의 느낌은 살리고 더욱 자연스럽게 완성합니다','보정·믹싱의 마법, 티 나지 않게 자연스럽게')
 details=details.replace('<span class="ba-paragraph">보정·믹싱의 마법','<span class="ba-paragraph mas-tuning-line">보정·믹싱의 마법')
 details=details.replace('뒤에 띄울 가사 영상도<br>필요하세요?','가사 영상 제작 필요하신가요?').replace('한 곡을 준비하는 과정부터 완성본까지, 필요한 작업에 집중합니다','준비부터 완성까지, 필요한 작업에 집중합니다')
 details=details.replace('녹음과 필요한 자료 전달이 모두 끝난 뒤 최대 7일 이내에 전달합니다','녹음 후 최대 7일 이내에 전달합니다')
 details=details.replace(/<a class="arc-button[^\"]*" href="\/event\/(?:solo|duo)" data-ar-price-link>가사 영상 옵션 견적 뽑기<\/a>/,'')
 details=details.replace(/<figure class="arc-recording-poster"[\s\S]*?<\/figure>/,mobileArCutPoster())
 details=details.replace('<p>어려운 구간은 나누어 녹음하고<br>1:1 디렉팅으로 차근차근 맞춰갑니다</p>','')
details=details.replace(/<section class="arc-point arc-point-key"[\s\S]*?<\/section>/,'<section class="arc-point arc-point-key mas-key-editorial" id="arcKey"><header><span class="arc-kicker detail-point-label">POINT 02</span><h2>음원 편집 · 키 조절 무료</h2><p>원하는 곡과 MR을 먼저 보내주세요<br>편한 키와 녹음 방향을 함께 확인합니다</p></header><div class="mas-key-note"><span class="mas-key-caption">편안한 음역, 더 자연스러운 노래</span><img class="mas-key-3d" src="assets/img/studio-3d/key-shift.webp" alt="같은 멜로디의 키를 내 음역에 맞게 조절합니다, 피아노와 음표 3D 안내" loading="lazy" decoding="async"><p>노래의 감정은 그대로, 내 목소리에 맞게</p></div></section>')
 details=details.replace(/<section class="arc-section arc-process"[\s\S]*?<\/section>/,mobileArProcess(key))
 details=details.replace(/<section class="arc-section arc-notices">[\s\S]*?<\/section>/,mobileArNotices())
 const mobileReviews=soloReviewCarousel().replace('<span data-solo-kicker>고객 후기</span>','').replace('<p data-solo-sub>직접 보내주신 카카오톡 후기 원문입니다</p>','').replace(/<div class="review-carousel-controls">[\s\S]*?<\/div>/,'')
 return '<div class="solo-detail-scope ar-detail-scope ar-commerce-detail mobile-ar-solo" data-ar-product="'+key+'">'+
 // Section 01 follows the supplied compact commerce reference without invented sales metrics.
 '<section class="mas-intro" aria-labelledby="arcProductTitle"><div class="mas-gallery" aria-label="AR 축가 본식 영상" data-mobile-gallery data-mobile-gallery-start="'+(duet?1:0)+'"><p class="mas-gallery-caption">위스티아와 함께 준비한 실제 본식 축가</p><div class="mas-gallery-viewport"><div class="mas-gallery-track">'+galleryVideos+'</div></div><div class="mas-gallery-tools"><span class="mas-format-badge">'+format+' · '+people+'인</span><div class="mas-gallery-dots" role="group" aria-label="본식 영상 선택"><button type="button" data-mobile-video-slide="0" aria-label="SOLO 영상 보기" aria-pressed="'+(!duet)+'"></button><button type="button" data-mobile-video-slide="1" aria-label="DUET 영상 보기" aria-pressed="'+duet+'"></button></div></div></div>'+
 '<div class="mas-summary">'+mobileStudioBrand()+'<h1 id="arcProductTitle">AR 축가 사전녹음<br><span>'+format+' · '+people+'인</span></h1><p class="mas-description">'+(duet?'우리 목소리로':'내 목소리로')+' 완성하는 본식 AR 축가</p><p class="mas-included"><span>구간별 1:1 디렉팅</span><span>음정·박자 보정</span><span>믹싱·마스터링</span></p><p class="mas-price"><strong>'+p.normal.toLocaleString('ko-KR')+'<small>원</small></strong><span>(1곡 · '+people+'인 · '+hours+'시간)</span></p><p class="mas-event-price"><span>페이백 완료 후 혜택가</span><strong>'+eventPrice.toLocaleString('ko-KR')+'원</strong></p>'+mobileDetailEvents()+'</div></section>'+
 '<section class="mas-selection" aria-labelledby="masSelectionTitle"><h2 id="masSelectionTitle">인원 선택</h2>'+variants+'</section>'+
 '<section class="mas-information" aria-labelledby="masInfoTitle"><h2 id="masInfoTitle">상품정보</h2><dl>'+info.map(([label,value])=>'<div><dt>'+label+'</dt><dd>'+value+'</dd></div>').join('')+'</dl></section>'+
 '<div class="arc-reviews">'+mobileReviews+'</div>'+
 '<span id="arcDetails" hidden></span>'+details+
 '<aside class="mas-bottom" aria-label="상품 문의"><a href="/event/'+key+'">카카오톡 문의</a></aside></div>'
}
function initMobileArGallery(){document.querySelectorAll('[data-mobile-gallery]').forEach(gallery=>{const track=gallery.querySelector('.mas-gallery-track'),slides=[...gallery.querySelectorAll('.mas-gallery-slide')],dots=[...gallery.querySelectorAll('[data-mobile-video-slide]')];if(!track||slides.length<2)return;let current=Number(gallery.dataset.mobileGalleryStart)||0;const select=(index,smooth=true)=>{current=Math.max(0,Math.min(slides.length-1,index));track.scrollTo({left:current*track.clientWidth,behavior:smooth&&!matchMedia('(prefers-reduced-motion: reduce)').matches?'smooth':'auto'});dots.forEach((dot,i)=>dot.setAttribute('aria-pressed',String(i===current)));slides.forEach((slide,i)=>{slide.classList.toggle('is-current',i===current);if(i!==current)slide.querySelector('video')?.pause()})};dots.forEach(dot=>dot.addEventListener('click',()=>select(Number(dot.dataset.mobileVideoSlide))));let scrollTimer=0;track.addEventListener('scroll',()=>{clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>select(Math.round(track.scrollLeft/Math.max(track.clientWidth,1)),false),80)},{passive:true});requestAnimationFrame(()=>select(current,false))})}
function initArCommerceDetail(){
 const root=document.querySelector('.ar-commerce-detail');if(!root)return
 root.querySelectorAll('[data-ar-time]').forEach(button=>button.addEventListener('click',()=>{
  const key=button.dataset.arTime,product=PRODUCTS[key];root.dataset.arProduct=key
  updateArCustomerVideo(root,key)
  root.querySelectorAll('[data-ar-time]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)))
  root.querySelectorAll('[data-ar-price]').forEach(item=>item.textContent=product.normal.toLocaleString('ko-KR'))
  root.querySelectorAll('[data-ar-hours]').forEach(item=>item.textContent=key==='duo'?'2':'1')
  root.querySelectorAll('[data-ar-minutes]').forEach(item=>item.textContent=key==='duo'?'120':'60')
  root.querySelectorAll('[data-ar-format]').forEach(item=>item.textContent=key==='duo'?'DUET(2인)':'SOLO(1인)')
  root.querySelectorAll('[data-ar-price-link]').forEach(item=>item.href='/event/'+key)
 }))
 root.querySelectorAll('[data-ar-section]').forEach(link=>link.addEventListener('click',event=>{
  event.preventDefault();const target=document.getElementById(link.dataset.arSection)
  target?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})
  root.querySelectorAll('.arc-tabs a').forEach(item=>{if(item.dataset.arSection===link.dataset.arSection)item.setAttribute('aria-current','location');else item.removeAttribute('aria-current')})
 }))
}
function renderDetail(key,purpose=""){
  if(["wedding","duet-film","proposal"].includes(key))purpose=""
  if(FILM_FORMAT_PRODUCTS.has(key))selectedFilmFormat="live"
  if(key==="solo-film")selectedFilmPeople=purpose==="duo"?2:1
 const p=PRODUCTS[key],m=SERVICE_META[key],w=WORKS.find(w=>w.product===key),song=p.category==="song",filmProduct=FILM_FORMAT_PRODUCTS.has(key);
 const compactFilm=["wedding","duet-film","solo-film"].includes(key),result=compactFilm?compactFilmHeroMedia(key):detailResult(p,m,w,song),process=filmProduct?filmProcessSection(key,p.steps):song?songProcessSection(p.steps):processSection(p.steps);
 if(["solo","duo"].includes(key)){
  app.innerHTML=arCommerceDetail(p,key)
  return
 }
 if(key==="duet-film"||key==="solo-film"){
  app.innerHTML=key==='duet-film'?mobileStoryFilmDetail(p):filmCommerceDetail(p,key,purpose)
  return
 }
 if(AR_DETAIL_CONTENT[key]){
  const productTabs=["solo","duo"].includes(key)?soloPersonTabs(key):""
  app.innerHTML=productTabs+detailVariantPicker(key,purpose)+'<div class="solo-detail-scope ar-detail-scope" data-ar-product="'+key+'">'+detailHookHero(p,key)+productPackageOverview(key,purpose)+detailBenefitTeaser(key,purpose)+(key==="wedding"?weddingFilmUseSection():"")+arPrimaryBenefit(key)+soloReviewCarousel()+'<div class="solo-editorial-sheet">'+arExpertStory(key)+'</div>'+wistiaBeforeAfterSection()+productComparisonSection(key)+verticalProcessSection(key)+(key==="solo"?arCdRatioSection():"")+bookingGuideSection()+'<section class="shell section worry-section"><header class="solo-faq-intro" data-solo-section-intro><p data-solo-kicker>FAQ</p><h2 data-solo-title><span class="solo-type-line">자주 묻는 질문을</span><span class="solo-type-line">확인해 보세요.</span></h2><p data-solo-sub><span class="solo-type-line">예약 전 궁금한 내용을 모았습니다.</span><span class="solo-type-line">더 필요한 내용은 편하게 문의해 주세요.</span></p></header>'+faq(p.faq)+'</section>'+detailDecisionSection(key,purpose)+footer()+'</div>'+priceBar(key)
  return
 }
 app.innerHTML=detailPersonTabs(key)+'<section class="shell detail-hero'+(compactFilm?' film-summary-hero':'')+'"><div><h1>'+p.title+'</h1><p class="lead">'+p.sub+'</p><div class="detail-facts"><span><b>사용 시점</b>'+m.use+'</span><span><b>참여 인원</b>'+m.who+'</span></div></div>'+result+'</section>'+detailBenefit(p)+detailBenefitTeaser(key,purpose)+reviews(key)+
 (song?detailNext(key)+process+arRatio():(filmProduct?process+filmUpgradeDetail(key):composition(p)+process))+
 detailComparison(p)+detailIncluded(p)+'<section class="shell section worry-section">'+heading("","자주 묻는 질문")+faq(p.faq)+'</section>'+detailDecisionSection(key,purpose)+footer()+priceBar(key)
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
function arCdRatioSection(){return '<section class="wistia-ar solo-section-reveal" id="arRatioExperience" data-wistia-ar-ratio data-tone="70" data-audio-30="'+ratioSource('30')+'" data-audio-50="'+ratioSource('50')+'" data-audio-70="'+ratioSource('70')+'" data-audio-100="'+ratioSource('100')+'" aria-labelledby="wistiaArTitle"><div class="wistia-ar__artboard"><header class="wistia-ar__copy" data-solo-section-intro><p class="wistia-ar__eyebrow" data-solo-kicker>AR RATIO EXPERIENCE</p><h2 class="wistia-ar__title" id="wistiaArTitle" data-solo-title><span class="solo-type-line ar-copy-emphasis wistia-ar__emphasis"><span class="ar-copy-emphasis-bg" aria-hidden="true"></span><span class="ar-copy-emphasis-text">내 목소리에 맞게</span></span><span class="solo-type-line wistia-ar__title-line">AR 비율을 골라보세요</span></h2><p class="wistia-ar__lead" data-solo-sub><span class="solo-type-line wistia-ar__lead-line">같은 노래를 라이브와 AR 비율별로 직접 비교해 들어보세요.</span></p></header><div class="wistia-ar__ratio" aria-label="AR 비율 선택"><div class="wistia-ar__ratio-head"><span class="wistia-ar__mood-wrap"><span class="wistia-ar__scroll-hint" aria-hidden="true"><i></i></span><span class="wistia-ar__mood" data-ratio-mood>균형 있게</span></span><output class="wistia-ar__ratio-current">70%</output></div><div class="wistia-ar__ratio-field"><span class="wistia-ar__ratio-end wistia-ar__ratio-end--live" aria-hidden="true">LIVE</span><span class="wistia-ar__ratio-end wistia-ar__ratio-end--ar" aria-hidden="true">AR</span><div class="wistia-ar__coach" aria-hidden="true"><span class="wistia-ar__coach-path"></span><svg class="wistia-ar__coach-hand" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 9.5V4a2 2 0 0 0-4 0v10l-1.4-1.4a2 2 0 0 0-2.83 2.82l3.6 3.6C6.86 20.5 8.6 22 11.4 22H14a8 8 0 0 0 8-8v-3a2 2 0 0 0-4 0v-1a2 2 0 0 0-4 0v-1a2 2 0 0 0-4 0z"/></svg></div><input class="wistia-ar__ratio-input" type="range" min="30" max="100" step="1" value="70" aria-label="AR 비율" aria-valuetext="70%"></div><div class="wistia-ar__ratio-marks" aria-hidden="true"><span data-value="30">30%</span><span data-value="50">50%</span><span data-value="70">70%</span><span data-value="100">100%</span></div></div><div class="wistia-ar__disc-stage" tabindex="0" role="button" aria-label="턴테이블 재생"><div class="wistia-ar__deck" aria-hidden="true"><span class="wistia-ar__brand">WISTIA</span><span class="wistia-ar__speed">33<i>·</i>45</span><div class="wistia-ar__platter"><div class="wistia-ar__record"><img class="wistia-ar__vinyl" src="assets/img/studio-3d/vinyl.webp" alt="" width="720" height="720" loading="lazy" decoding="async"><span class="wistia-ar__label"><img src="assets/img/ar-ratio/wistia-label-logo.webp" alt="" width="200" height="220" loading="lazy" decoding="async"></span></div><span class="wistia-ar__ar-ring"></span><span class="wistia-ar__spindle"></span></div><svg class="wistia-ar__tonearm" viewBox="0 0 100 96" aria-hidden="true"><defs><linearGradient id="wistiaArmMetal" x1="0" x2="1"><stop offset="0" stop-color="#8d9296"/><stop offset=".5" stop-color="#f4f5f5"/><stop offset="1" stop-color="#7f8488"/></linearGradient><radialGradient id="wistiaArmBase" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#6a6f73"/><stop offset=".7" stop-color="#2b2f31"/><stop offset="1" stop-color="#1b1d1e"/></radialGradient></defs><circle class="wistia-ar__arm-base" cx="86" cy="13" r="8.2" fill="url(#wistiaArmBase)"/><circle cx="86" cy="13" r="5.2" fill="#b9bdc0" stroke="#6f7478" stroke-width=".5"/><g class="wistia-ar__arm"><rect x="83.6" y="1.2" width="4.8" height="8" rx="1.3" fill="url(#wistiaArmMetal)" stroke="#6b7074" stroke-width=".4"/><path d="M86 6 L86 13 L77.5 70 L70 81.5" fill="none" stroke="#5f6468" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M86 6 L86 13 L77.5 70 L70 81.5" fill="none" stroke="url(#wistiaArmMetal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="86" cy="13" r="2.4" fill="#e7e9ea" stroke="#6f7478" stroke-width=".5"/><g transform="rotate(34 70 81.5)"><rect x="66.2" y="80" width="7.6" height="5.2" rx="1" fill="#2a2d2f"/><rect x="67" y="80.6" width="6" height="1.4" rx=".5" fill="#8d9296"/><path d="M73.8 81.4 l3.4 -1.2" stroke="#9ea3a6" stroke-width=".9" stroke-linecap="round"/></g></g></svg><span class="wistia-ar__lever"><i></i></span><span class="wistia-ar__lever-label"><b>OFF</b><b>ON</b></span><span class="wistia-ar__switch"><i></i></span></div></div><div class="wistia-ar__player" aria-label="AR 미리듣기 플레이어"><button class="wistia-ar__play" type="button" aria-label="재생" aria-pressed="false"><span class="wistia-ar__play-icon" aria-hidden="true"></span></button><span class="wistia-ar__time"><span data-current-time>0:00</span></span><input class="wistia-ar__seek" aria-label="재생 위치" type="range" min="0" max="32" step="0.1" value="0"><span class="wistia-ar__time wistia-ar__time--total"><span data-duration>0:00</span></span><button class="wistia-ar__volume" type="button" aria-label="음소거" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path class="wistia-ar__vol-body" d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z"/><path class="wistia-ar__vol-wave" d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.6a7.6 7.6 0 0 1 0 10.8"/><path class="wistia-ar__vol-mute" d="M16 9.5l5 5M21 9.5l-5 5"/></svg></button><p class="wistia-ar__error" role="status" hidden>음원을 불러오지 못했습니다</p></div></div></section>'}
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
 const feature=root.querySelector("[data-process-feature]"),image=root.querySelector("[data-process-image]"),eyebrow=root.querySelector("[data-process-eyebrow]"),title=root.querySelector("[data-process-title]"),description=root.querySelector("[data-process-description]"),meta=root.querySelector("[data-process-meta]"),ghost=root.querySelector("[data-process-ghost]"),current=root.querySelector("[data-process-current]"),badge=root.querySelector("[data-process-badge]"),chapterButtons=[...root.querySelectorAll("[data-process-chapter]")],prev=root.querySelector("[data-process-prev]"),next=root.querySelector("[data-process-next]")
 const steps=detailStudioSteps(root.dataset.processProduct||"solo")
 let activeIndex=0,touchStart=null
 const render=(requestedIndex,animate=true)=>{
  activeIndex=Math.min(Math.max(Number(requestedIndex)||0,0),steps.length-1)
  const step=steps[activeIndex],number=String(step.id).padStart(2,"0")
  if(animate){feature.classList.remove("is-entering");void feature.offsetWidth;feature.classList.add("is-entering")}
  if(image.getAttribute("src")!==step.image)image.src=step.image
  image.alt=step.short;eyebrow.textContent=step.eyebrow;title.innerHTML=step.title;description.textContent=step.description;meta.innerHTML=processStudioMeta(step);ghost.textContent=number;current.textContent=number;if(badge)badge.textContent=number+" / "+String(steps.length).padStart(2,"0")
  chapterButtons.forEach((button,index)=>{const active=index===activeIndex;button.classList.toggle("is-active",active);button.setAttribute("aria-current",active?"step":"false")})
  prev.disabled=activeIndex===0;next.disabled=activeIndex===steps.length-1
 }
 const moveTo=index=>render(index)
 prev.addEventListener("click",()=>moveTo(activeIndex-1));next.addEventListener("click",()=>moveTo(activeIndex+1))
 chapterButtons.forEach(button=>button.addEventListener("click",()=>moveTo(Number(button.dataset.processChapter))))
 feature.addEventListener("keydown",event=>{if(event.key!=="ArrowLeft"&&event.key!=="ArrowRight")return;event.preventDefault();moveTo(activeIndex+(event.key==="ArrowRight"?1:-1))})
 feature.addEventListener("touchstart",event=>{const touch=event.changedTouches[0];touchStart={x:touch.clientX,y:touch.clientY}},{passive:true})
 feature.addEventListener("touchend",event=>{if(!touchStart)return;const touch=event.changedTouches[0],deltaX=touch.clientX-touchStart.x,deltaY=touch.clientY-touchStart.y;touchStart=null;if(Math.abs(deltaX)<45||Math.abs(deltaX)<=Math.abs(deltaY))return;moveTo(activeIndex+(deltaX<0?1:-1))},{passive:true})
 feature.addEventListener("touchcancel",()=>{touchStart=null},{passive:true})
 render(0,false)
}
function renderArPurpose(key){
 const p=AR_PURPOSES[key];
 app.innerHTML='<section class="shell detail-hero"><div>'+label("WEDDING SONG AR")+'<h1>'+(key==="self"?"떨리는 축가에도<br>내 목소리 그대로":"소중한 사람에게<br>떨림 대신 진심을")+'</h1><p class="lead">'+p.title+'</p><p>'+p.useCase+'</p></div><div class="detail-cover">'+img("assets/img/song/solo.webp","축가 녹음을 위한 스튜디오 마이크",true)+'</div></section><section class="shell section detail-intro"><h2>'+p.productTitle+'</h2><p class="lead">'+p.lead+'</p></section>'+
 processSection(p.items)+arRatio()+
 reviews()+
 '<section class="shell section">'+heading("녹음 인원 선택","한 사람 또는 두 사람","본식에서 함께 부를 인원에 맞춰 선택해 주세요")+'<div class="service-list">'+serviceRows(["solo","duo"])+'</div></section>'+footer()+priceBar("solo",key==="friend"?"friend":"")
}
function eventProductOptions(key,purpose=""){return [...(PRODUCT_OPTIONS[key]||[]),...(key==="solo"&&purpose==="friend"?FRIEND_PRODUCT_OPTIONS:[])]}
function calculate(){
 const baseProduct=PRODUCTS[currentEventProduct],baseFormat=BASE_FILM_FORMAT[currentEventProduct],storyBase=["wedding","duet-film","proposal"].includes(currentEventProduct),basePrice=currentEventProduct==="solo-film"?(selectedFilmPeople===2?280000:220000):storyBase?filmFormatPrice(currentEventProduct,"live"):baseFormat?filmFormatPrice(currentEventProduct,selectedFilmFormat):baseProduct.normal,product={...baseProduct,normal:basePrice};const chosen=EVENTS.filter(e=>selectedEvents.has(e.key));
 const discount=0,payback=chosen.filter(e=>e.type==='payback').reduce((sum,e)=>sum+e.discount,0);
 const optionEntries=eventProductOptions(currentEventProduct,currentEventPurpose).flatMap(o=>{const quantity=o.quantity?(optionQuantities[o.key]||0):(selectedOptions.has(o.key)?1:0);return quantity?[{...o,quantity,total:(o.price||0)*quantity}]:[]});
 const songOption=null;
  const formatUpgrade=0;
  const optionPrice=(songOption?.price||0)+optionEntries.reduce((sum,o)=>sum+o.total,0);
  const finalPrice=product.normal+optionPrice-discount;
  return {product,chosen,discount,payback,optionEntries,songOption,formatUpgrade,optionPrice,finalPrice,effectivePrice:finalPrice-payback}
}
function renderProductOption(o){
  if(o.quantity){const quantity=optionQuantities[o.key]||0,unit=o.unit||"회",priceUnit=o.priceUnit||"회당";return '<div class="option-choice quantity-option"><span class="option-symbol" aria-hidden="true">+</span><span><strong>'+o.label+'</strong><small>'+o.detail+'</small></span><div class="quantity-control" aria-label="'+o.label+' 선택 수"><button type="button" data-option-minus="'+o.key+'" aria-label="'+o.label+' 줄이기">−</button><output data-option-count="'+o.key+'">'+quantity+unit+'</output><button type="button" data-option-plus="'+o.key+'" aria-label="'+o.label+' 늘리기">+</button><b>'+priceUnit+' +'+shortWon(o.price)+'</b></div></div>'}
  const photos={"lyrics-video":["assets/img/song-options/lyric-video-v2.webp","가사 영상 웨딩 장면 예시"]}
  const photo=photos[o.key],image=photo?'<span data-option-art class="option-photo'+(o.key==="lyrics-video"?' lyric-option-image':'')+'"'+(o.key==="lyrics-video"?' data-lyric-example':'')+'>'+img(photo[0],photo[1],o.key==="lyrics-video")+'</span>':''
  return '<label class="option-choice'+(image?' has-option-photo'+(o.key==="lyrics-video"?' has-lyric-image':''):'')+'">'+image+'<input type="checkbox" data-option="'+o.key+'" '+(selectedOptions.has(o.key)?"checked":"")+'><span class="option-copy"><strong>'+o.label+'</strong><small>'+o.detail+'</small></span><b>'+(o.price?'+'+shortWon(o.price):'상담 후 안내')+'</b></label>'
}
function bookingBaseSection(key){
 const service=["solo","duo"].includes(key)?"solo":key
 const services=[["solo","AR 축가 사전녹음"],["duet-film","축가 스토리 필름"]]
 const serviceSelect='<label class="booking-product-select" for="bookingService"><span class="sr-only">상품</span><select id="bookingService" name="quoteProduct" data-product-select>'+services.map(([value,label])=>'<option value="'+value+'"'+(service===value?' selected':'')+'>'+label+'</option>').join('')+'</select></label>'
 const people=inquiryUndecided?'':["solo","duo"].includes(key)?'<div class="booking-base-choice"><p>1곡 기준 · 녹음 인원과 시간</p><div class="calculator-option-list"><label class="option-choice"><input type="radio" name="arDuration" data-base-product="solo" '+(key==="solo"?'checked':'')+'><span><strong>SOLO(1인)</strong><small>1곡 기준 · 1시간</small></span><b>12만원</b></label><label class="option-choice"><input type="radio" name="arDuration" data-base-product="duo" '+(key==="duo"?'checked':'')+'><span><strong>DUET(2인)</strong><small>1곡 기준 · 2시간</small></span><b>16만원</b></label></div></div>':bookingFilmFormatSection(key)
 const note=key==="wedding"||key==="duet-film"?'<p class="booking-base-note">2인 기준</p>':''
 return '<section class="booking-base calculator-step consultation-step"><span class="booking-step">01</span><h2>상품 선택</h2><p>원하시는 상품을 선택해 주세요</p>'+serviceSelect+people+note+'<div class="booking-base-amount"'+(inquiryUndecided?' hidden':'')+'><span>기본 가격</span><strong id="basePrice"></strong></div></section>'
}
function bookingExtraSection(p,purpose,options,step){
 const content=options.map(renderProductOption).join("")
 return '<div class="booking-extra"><h3 class="consultation-subtitle">추가 옵션</h3>'+'<p class="single-song-note">모든 상품은 1곡 기준이에요. 곡마다 녹음·튠·믹스 작업이 따로 들어가서, 녹음 시간이 남아도 다른 곡은 \'1절 녹음 추가\'로 진행돼요.</p>'+'<div class="calculator-option-list">'+content+'</div></div>'
}
function eventBenefitsSection(step){
 const group=(type,title,timing,note)=>{const items=EVENTS.filter(e=>e.type===type),maximum=items.reduce((total,e)=>total+e.discount,0);return '<section class="event-benefit-group benefit-kind-card" data-benefit-type="'+type+'" aria-label="'+title+' 선택"><header class="benefit-kind-header"><h4>'+title+'</h4><strong class="benefit-kind-limit">최대 '+shortWon(maximum)+'</strong><span class="benefit-kind-timing">'+timing+'</span></header><p class="event-group-note">'+note+'</p><div class="event-list">'+items.map(e=>'<div class="event-benefit-card"><label class="event-choice"><input type="checkbox" data-event="'+e.key+'" '+(selectedEvents.has(e.key)?'checked':'')+'><span><strong>'+e.label+'</strong></span><b>'+(type==='payback'?'페이백 ':'할인 −')+shortWon(e.discount)+'</b></label><p class="event-terms">'+e.detail+'</p></div>').join('')+'</div></section>'}
 return '<section class="event-benefits consultation-gifts" aria-labelledby="giftTitle"><header class="consultation-gift-heading"><div><h3 id="giftTitle">후기 참여 이벤트</h3><p>후기 페이백 최대 6만원</p></div><span class="benefit-total" id="eventDiscountTotal" aria-live="polite">페이백 0원</span></header><div class="benefit-kind-grid">'+group('payback','후기 페이백','조건 확인 후 지급','참여 조건 충족 확인 후 돌려드리는 금액이며, 결제 금액에서 미리 차감하지 않습니다')+'</div><p class="fine">참여 조건과 최종 혜택 적용 여부는 상담에서 확인합니다</p></section>'
}
function priceSidebarSection(){return '<aside class="booking-mobile-bar booking-static-bar booking-follow-total booking-price-sidebar" aria-label="선택한 구성의 예상 가격"><div class="booking-price-card"><p class="quote-eyebrow">선택한 구성</p><h2 id="quoteService"></h2><div class="quote-regular" id="quoteRegular" hidden><span>할인 적용 전</span><s id="quoteBeforePrice"></s></div><div class="booking-live-total"><span>결제 예상 금액</span><strong id="mobilePrice" aria-live="polite"></strong></div><dl class="quote-price-rows"><div><dt>기본 가격</dt><dd id="quoteBase"></dd></div><div><dt>추가 옵션</dt><dd id="quoteOptions"></dd></div><div><dt>후기 페이백</dt><dd id="quotePayback"></dd></div></dl><dl class="quote-selected-lines" id="quoteSelections"></dl><p class="quote-effective" id="quoteEffectiveRow" hidden>페이백 완료 후 혜택가 <strong id="quoteEffective"></strong></p><p class="quote-note">페이백은 참여 조건 충족 확인 후 지급되며 결제 시 미리 차감되지 않습니다</p></div><p class="quote-conditions">최종 금액과 제작 가능 일정은 상담에서 확인합니다</p></aside>'}
function renderEvent(key,purpose=""){
 inquiryUndecided=false
 if(currentEventProduct!==key||currentEventPurpose!==purpose){selectedEvents.clear();selectedOptions.clear();optionQuantities={};chosenOption=""}
  currentEventProduct=key;currentEventPurpose=purpose;if(FILM_FORMAT_PRODUCTS.has(key))selectedFilmFormat="live";if(key==="solo-film")selectedFilmPeople=purpose==="duo"?2:1;const p=PRODUCTS[key];
 const options=eventProductOptions(key,purpose);
 const choices=bookingExtraSection(p,purpose,options,"03")+eventBenefitsSection("03");
 const sidebar=priceSidebarSection()
 const actions=window.WistiaContact.submit().replace('<button type="submit"','<button form="contactInquiryForm" type="submit"')
 app.innerHTML='<section class="shell section booking-calculator-wrap consultation-flow"><div class="booking-calculator"><div class="calculator-content"><form id="contactInquiryForm" novalidate><div id="consultForm"><header class="calculator-intro"><h1>상담 신청</h1><p>원하시는 상품과 일정을 알려주세요</p></header>'+bookingBaseSection(key)+window.WistiaContact.render(null,{integrated:true})+'<section class="consultation-step consultation-options" aria-labelledby="optionsTitle"><header class="consultation-step-heading"><span class="booking-step">04</span><h2 id="optionsTitle">옵션과 이벤트 혜택</h2><p>선택 사항이므로 건너뛰셔도 괜찮습니다</p></header>'+choices+'</section></div></form></div>'+sidebar+'</div>'+actions+'</section>'+footer()
 updatePrice()
 mountInquiryObserver()
}
function inquiryQuoteDetails(c){return {product:c.product.title,base:c.product.normal,total:c.finalPrice,options:c.optionEntries.map(o=>({label:o.label,amount:o.total,quantity:o.quantity,unit:o.unit||'회'})),paybacks:c.chosen.filter(e=>e.type==='payback').map(e=>({label:e.label,amount:e.discount})),paybackTotal:c.payback}}
function refreshInquiryQuote(){
 const c=calculate()
 contactQuote=inquiryUndecided?null:{service:["solo","duo"].includes(currentEventProduct)?"AR 축가 사전녹음":"축가 스토리 필름",summary:c.product.title+" · "+shortWon(c.finalPrice),text:consultationText(),details:inquiryQuoteDetails(c)}
 window.WistiaContact?.syncQuote(contactQuote)
 window.WistiaBooking?.mount(document.querySelector('#contactInquiryForm'),inquiryUndecided?'undecided':currentEventProduct)
}
function jumpToInquiry(){
 requestAnimationFrame(()=>requestAnimationFrame(()=>{
  document.querySelector("#bookingInquiry")?.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"})
  document.querySelector('[name="eventDateMode"]')?.focus({preventScroll:true})
 }))
}
function mountInquiryObserver(){
 inquiryObserver?.disconnect();document.body.classList.remove("inquiry-visible")
 const sections=[...document.querySelectorAll("#bookingInquiry,#bookingReview")];if(!sections.length)return
 const visible=new Set()
 inquiryObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)visible.add(entry.target);else visible.delete(entry.target)});document.body.classList.toggle("inquiry-visible",visible.size>0)},{rootMargin:"-80px 0px -100px 0px"})
 sections.forEach(section=>inquiryObserver.observe(section))
}
function updatePrice(){
 const c=calculate(),finder=finderPriceContext(currentEventProduct)
 const formatName=FILM_FORMATS.live.title
 const formatRow=FILM_FORMAT_PRODUCTS.has(currentEventProduct)?'<div><dt>영상 구성</dt><dd>'+formatName+'</dd></div>':''
 const peopleRow=currentEventProduct==="solo-film"?'<div><dt>녹음 인원</dt><dd>'+selectedFilmPeople+'인</dd></div>':["solo","duo"].includes(currentEventProduct)?'<div><dt>녹음 시간</dt><dd>'+(currentEventProduct==="solo"?"1시간":"2시간")+'</dd></div>':''
 const finderRow=finder?'<div class="finder-summary-line"><dt>선택한 조건</dt><dd>'+FINDER_LABELS.role[finder.role]+' · '+FINDER_LABELS.moment[finder.moment]+' · '+FINDER_LABELS.people[finder.people]+'</dd></div>':''
 const optionRows=c.optionEntries.map(o=>'<div><dt>'+o.label+(o.quantity>1?' '+o.quantity+(o.unit||'회'):'')+'</dt><dd class="'+(o.total<0?'minus':'plus')+'">'+(o.total<0?'−':'+')+won(Math.abs(o.total))+'</dd></div>').join("")
 const eventRows=c.chosen.map(e=>'<div><dt>'+e.label+'</dt><dd class="minus">'+(e.type==='payback'?'페이백 ':'−')+won(e.discount)+'</dd></div>').join("")
 const summary=document.querySelector('#bookingSummary');if(summary)summary.innerHTML=inquiryUndecided?'<dl class="price-lines"><div><dt>상품</dt><dd>상담 후 결정</dd></div><div><dt>예상 금액</dt><dd>상담 후 안내</dd></div></dl>':'<dl class="price-lines"><div><dt>상품</dt><dd>'+c.product.title+'</dd></div>'+finderRow+formatRow+peopleRow+'<div class="normal-line"><dt>기본 가격</dt><dd>'+won(c.product.normal)+'</dd></div>'+optionRows+eventRows+'<div class="consultation-final-total"><dt>결제 예상 금액</dt><dd>'+won(c.finalPrice)+'</dd></div></dl><p class="fine">최종 금액과 제작 가능 일정은 상담에서 확인합니다</p>'
 document.querySelector("#mobilePrice").textContent=shortWon(c.finalPrice)
 document.querySelector("#basePrice").textContent=shortWon(c.product.normal)
 const setQuoteText=(id,value)=>{const node=document.querySelector('#'+id);if(node)node.textContent=value}
 setQuoteText('quoteService',FILM_FORMAT_PRODUCTS.has(currentEventProduct)?'축가 스토리 필름 · 2인':c.product.title)
 setQuoteText('quoteBeforePrice',shortWon(c.product.normal+c.optionPrice))
 setQuoteText('quoteBase',shortWon(c.product.normal))
 setQuoteText('quoteOptions',(c.optionPrice<0?'−':c.optionPrice>0?'+':'')+shortWon(Math.abs(c.optionPrice)))
 setQuoteText('quoteDiscount',c.discount?'−'+shortWon(c.discount):'선택 없음')
 setQuoteText('quotePayback',c.payback?shortWon(c.payback):'선택 없음')
 setQuoteText('quoteEffective',won(c.effectivePrice))
 const effectiveRow=document.querySelector('#quoteEffectiveRow');if(effectiveRow)effectiveRow.hidden=!c.payback||inquiryUndecided
 setQuoteText('eventDiscountTotal','페이백 '+shortWon(c.payback))
 const selectedLines=document.querySelector('#quoteSelections');if(selectedLines)selectedLines.innerHTML=inquiryUndecided?'':optionRows+eventRows
 const regular=document.querySelector('#quoteRegular');if(regular)regular.hidden=c.discount===0||inquiryUndecided
 if(inquiryUndecided){setQuoteText('quoteService','상담 후 결정');setQuoteText('mobilePrice','미정');setQuoteText('quoteBase','상담 후 안내');setQuoteText('quoteOptions','선택 없음');setQuoteText('quoteDiscount','선택 없음');setQuoteText('quotePayback','선택 없음')}
 refreshInquiryQuote()
}
// The question dialog shares the existing calculator, never a second price table
function quoteState(){return {key:currentEventProduct,purpose:currentEventPurpose,format:selectedFilmFormat,people:selectedFilmPeople,options:[...selectedOptions],events:[...selectedEvents]}}
function setQuoteState(state){
 currentEventProduct=["solo","duo","duet-film"].includes(state.key)?state.key:"solo";currentEventPurpose=state.purpose==="making"?"":state.purpose||"";selectedFilmFormat="live";selectedFilmPeople=state.people||1
 selectedOptions=new Set((state.options||[]).filter(key=>eventProductOptions(currentEventProduct,currentEventPurpose).some(option=>option.key===key)));selectedEvents=new Set(state.events||[]);optionQuantities={};chosenOption=""
}
window.WistiaQuote={
 options:key=>eventProductOptions(key).map(item=>({...item})),events:()=>EVENTS.map(item=>({...item})),
 context:()=>{const key=routePath().split('/')[2];return {key:["solo","duo","duet-film"].includes(key)?key:"solo",format:"live",...(document.body.dataset.page==="event"&&["solo","duo","duet-film"].includes(currentEventProduct)?quoteState():{})}},
 preview:state=>{const previous=quoteState(),quantities=optionQuantities,option=chosenOption;try{setQuoteState(state);return calculate()}finally{setQuoteState(previous);optionQuantities=quantities;chosenOption=option}},
 apply:state=>{
  const key=["solo","duo","duet-film"].includes(state.key)?state.key:"solo",purpose="",path="/event/"+key
  if(path!==routePath())history.pushState({wistiaDepth:(history.state?.wistiaDepth||0)+1},"",path+location.search)
  route();setQuoteState({...state,key,purpose});renderEvent(key,purpose);normalizeInternalLinks()
 },consult:()=>jumpToInquiry(),
 consultKakao:state=>{
  // Copy just the explicit quote; keep the page and any inquiry draft intact.
  const previous=quoteState(),quantities=optionQuantities,option=chosenOption
  let text
  try{setQuoteState(state);text=consultationText()}finally{setQuoteState(previous);optionQuantities=quantities;chosenOption=option}
  return copyConsultationAndShowDialog(text)
 }
}
function consultationText(){
 const c=calculate(),picked=c.optionEntries.map(o=>o.label+(o.quantity>1?' '+o.quantity+(o.unit||'회'):'')+' '+(o.total<0?'−':'+')+won(Math.abs(o.total)))
 const formatName=FILM_FORMATS.live.title
 const benefitLines=type=>{const entries=c.chosen.filter(e=>e.type===type);return entries.length?entries.map(e=>e.label+' '+won(e.discount)):['선택 없음']}
 const optionTotal=c.optionEntries.reduce((total,entry)=>total+entry.total,0)
 return ['선택하신 구성으로 상담 부탁드립니다','━━━━━','','1) 예약 희망 구성','희망 상품 : '+c.product.title,FILM_FORMAT_PRODUCTS.has(currentEventProduct)?'영상 구성 : '+formatName:null,['solo','duo'].includes(currentEventProduct)?'녹음 시간 : '+(currentEventProduct==='duo'?2:1)+'시간 · '+(currentEventProduct==='duo'?'DUET(2인)':'SOLO(1인)')+' · 1곡 기준':null,currentEventProduct==='solo-film'?'녹음 인원 : '+selectedFilmPeople+'인':null,'추가 옵션 :',...(picked.length?picked:['선택 없음']),'','2) 결제 안내','기본 가격 : '+won(c.product.normal),picked.length?'추가 옵션 합계 : '+(optionTotal<0?'−':'+')+won(Math.abs(optionTotal)):null,'결제 예상 금액 : '+won(c.finalPrice),'','3) 선택한 후기 페이백',...benefitLines('payback'),'후기 페이백 합계 : '+won(c.payback),c.payback?'':null,c.payback?'페이백 완료 후 혜택가 : '+won(c.effectivePrice):null,c.payback?'선택한 후기 조건을 모두 충족했을 때의 금액입니다':null,c.payback?'페이백은 참여 조건 충족 확인 후 별도 지급':null,c.payback?'결제 시 미리 차감하지 않습니다':null].filter(x=>x!==null).join('\n')
}
function showDialog(html,type){
 lastDialogFocus=document.activeElement;dialog.innerHTML='<div class="dialog-content '+type+'"><button class="dialog-close" data-close aria-label="닫기">×</button>'+html+'</div>';
 window.WistiaSvgUI?.mountChrome(dialog,studioIcon)
 dialog.classList.toggle("consult-copy-modal",type==="consult-copy-dialog");dialog.setAttribute("aria-label",type==="consult-copy-dialog"?"상담 양식 복사 안내":"영상, 고객 후기 및 상담 내용")
 dialog.showModal();document.body.classList.add("modal-open");document.querySelector("#siteHeader").inert=true;app.inert=true;document.querySelector("#floatingKakao").inert=true;dialog.querySelector(type==="consult-copy-dialog"?".consult-copy-action":"button").focus()
}
function closeDialog(){if(!dialog.open)return;dialog.close();dialog.innerHTML="";dialog.classList.remove("consult-copy-modal");document.body.classList.remove("modal-open");document.querySelector("#siteHeader").inert=false;app.inert=false;document.querySelector("#floatingKakao").inert=false;if(lastDialogFocus?.isConnected)lastDialogFocus.focus()}
function showContactValidationDialog(issues){
 const form=issues[0].control.form
 showDialog('<h2>필수 항목을 작성해 주세요</h2><p>이 창에서 바로 수정하실 수 있어요</p><form id="contactValidationForm" novalidate>'+window.WistiaContact.validationEditor(issues)+'<p class="consult-validation-hint">정해지지 않은 일정은 미정으로 두셔도 괜찮아요</p><button type="submit" class="button dark consult-copy-action inquiry-edit-submit"><span data-submit-label>(작성이 필요해요😭)</span></button></form><a class="button consult-copy-action consult-direct-action" href="'+escapeHtml(kakao())+'" target="_blank" rel="noopener noreferrer" data-close>문의 양식 없이 바로 상담할래요</a>',"consult-copy-dialog")
 dialog.setAttribute('aria-label','문의 작성 안내')
 const editor=dialog.querySelector('#contactValidationForm'),button=editor.querySelector('button')
 const sync=()=>window.WistiaContact.syncSubmitState(form,button)
 const edit=e=>{
  const input=e.target.closest('[data-inquiry-edit]');if(!input)return
  const control=issues[Number(input.dataset.inquiryEdit)].control
  control.value=input.value;control.dispatchEvent(new Event('change',{bubbles:true}))
  const issue=window.WistiaContact.validationIssues(form,{mark:false}).find(item=>item.control===control)
  input.setAttribute('aria-invalid',String(Boolean(issue)));control.setAttribute('aria-invalid',String(Boolean(issue)))
  editor.querySelector('#'+input.id+'-error').textContent=issue?issue.label+' '+issue.message:''
  sync()
 }
 editor.addEventListener('input',edit);editor.addEventListener('change',edit)
 editor.addEventListener('submit',e=>{e.preventDefault();const remaining=window.WistiaContact.validationIssues(form);if(remaining.length){showContactValidationDialog(remaining);return}closeDialog();form.requestSubmit()})
 sync();editor.querySelector('[data-inquiry-edit]').focus()
 // Closing the editor preserves its changes and returns to the original field
 lastDialogFocus=issues[0].control
}
function showKakaoInquiryDialog(formPath){
 showDialog('<h2>어떻게 상담할까요?</h2><p>편하신 방법을 선택해 주세요</p><a class="button dark consult-copy-action" href="'+escapeHtml(formPath)+'" data-close>문의 양식 작성할게요!</a><a class="button consult-copy-action consult-direct-action" href="'+escapeHtml(kakao())+'" target="_blank" rel="noopener noreferrer" data-close>바로 상담할래요!</a>',"consult-copy-dialog")
 dialog.setAttribute('aria-label','카카오톡 문의 방법 선택')
}
function openVideo(id){
 const w=WORKS.find(x=>x.id===id);if(!w)return;
 window.wistiaClaimPlayback?.("video-frame")
 const url=new URL(w.video);url.searchParams.set("autoplay","1");url.searchParams.set("enablejsapi","1");
 showDialog('<div class="video-frame"><iframe src="'+escapeHtml(url.href)+'" title="'+w.title+'" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div><div class="dialog-caption"><div>'+label(w.category)+'<h2>'+w.title+'</h2></div><a class="text-link" href="#/detail/'+w.product+'" data-close>상품 알아보기 '+arrow()+'</a></div><p class="fine">영상이 재생되지 않으면 '+external("YouTube에서 보기",w.video.replace("/embed/","/watch?v=").replace("?rel=0",""))+'</p>',"video-dialog")
}
function playInlineVideo(button){
 window.wistiaClaimPlayback?.("video-frame")
 const url=new URL(button.dataset.inlineYoutube);url.searchParams.set("autoplay","1");url.searchParams.set("enablejsapi","1");
 const frame=document.createElement("div");frame.className="detail-result-media detail-inline-video"+(button.classList.contains("we-case-video")?" we-case-video":"");frame.innerHTML='<iframe src="'+escapeHtml(url.href)+'" title="'+escapeHtml(button.getAttribute("aria-label")||"유튜브 영상")+'" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>';
 const track=button.closest('[data-case-carousel]');if(track){track.dataset.casePlaying='true';const restore=button.cloneNode(true),stop=document.createElement('button');stop.type='button';stop.className='we-case-stop';stop.textContent='영상 닫기';stop.setAttribute('aria-label','영상 닫고 쇼케이스 이어 보기');stop.addEventListener('click',()=>{frame.replaceWith(restore);if(!track.querySelector('iframe'))delete track.dataset.casePlaying;restore.focus({preventScroll:true})});frame.append(stop)}
 button.replaceWith(frame)
}
async function copyConsultationAndShowDialog(customText){
 const text=typeof customText==='string'?customText:consultationText();let copied=false
 try{await navigator.clipboard.writeText(text);copied=true}catch{
  const area=document.createElement("textarea");area.value=text;area.style.cssText="position:fixed;opacity:0";document.body.append(area);area.select()
  try{copied=document.execCommand("copy")}catch{}finally{area.remove()}
 }
 const kakaoLink='<a class="button dark consult-copy-action" href="'+escapeHtml(kakao())+'" target="_blank" rel="noopener noreferrer" data-close>확인했습니다! 카카오톡으로 이동</a>'
 if(copied){showDialog('<span class="consult-copy-mark" aria-hidden="true">✓</span><h2>상담양식이 복사되었습니다</h2><p>카카오톡에 붙여넣기 해주세요!</p>'+kakaoLink,"consult-copy-dialog")}
 else{showDialog('<h2>상담양식을 자동으로 복사하지 못했습니다</h2><p>아래 내용을 직접 복사한 뒤 카카오톡에 붙여넣어 주세요</p><textarea class="consult-copy-fallback" readonly aria-label="직접 복사할 상담양식">'+escapeHtml(text)+'</textarea>'+kakaoLink,"consult-copy-dialog")}
}
function navigationMenu(){const groups=[{label:'웨딩 축가',items:[['AR 축가 사전녹음','/detail/solo'],['축가 스토리 필름','/detail/duet-film']]},{label:'목소리와 이야기',items:[['축가 사례','/section/homeCases'],['보컬 보정 전후 비교','/before-after'],['진행 안내','/info/process']]},{label:'위스티아',items:[['위스티아는 어떤 곳인가요?','/info/about'],['이벤트','/events'],['문의 양식','/contact'],['자주 묻는 질문','/info/faq'],['오시는 길','/info/location']]}];return '<nav id="mainMenu" aria-label="전체 메뉴"><p class="menu-title">메뉴</p>'+groups.map(group=>'<section class="menu-group"><p class="menu-group-label">'+group.label+'</p><div class="menu-group-items">'+group.items.map(([title,href])=>'<a class="menu-item" href="'+href+'"><strong>'+title+'</strong></a>').join('')+'</div></section>').join('')+'</nav>'}
function header(){
 document.querySelector("#mainMenu")?.remove()
 const siteHeader=document.querySelector("#siteHeader")
 siteHeader.innerHTML='<div class="header-inner shell"><div class="brand-group"><button id="headerBack" class="back-button" aria-label="이전 페이지로 돌아가기" hidden>'+studioIcon('arrow')+'</button><a class="wordmark" href="#/" aria-label="WISTIA 홈">'+img("assets/img/wistia-logo-transparent.webp","")+'<span>WISTIA</span></a></div><button id="menuToggle" aria-expanded="false" aria-controls="mainMenu" aria-label="메뉴 열기"><span></span><span></span><span></span></button></div>';
 siteHeader.insertAdjacentHTML("afterend",navigationMenu())
 document.querySelector("#floatingKakaoChat").href=kakao()
 const soloCtaKakao=document.querySelector("#soloDesktopCtaKakao");if(soloCtaKakao)soloCtaKakao.href=kakao()
}
let arCdRatioInstance=null,beforeAfterInstance=null,homeHighlightInstance=null
function initScrollMediaPlayback(){
 if(document.querySelector('.we-home,.ar-commerce-detail'))return null
 const sections=[
  {element:document.querySelector(".ar-hook-hero:has(video)"),play(){const video=this.element.querySelector("video");video.muted=false;return video.play()},pause(){this.element.querySelector("video").pause()}},
  {element:document.querySelector("#wistiaBeforeAfter"),play(){return beforeAfterInstance?.play()},pause(){beforeAfterInstance?.pause()}},
  {element:document.querySelector("#arRatioExperience"),play(){return arCdRatioInstance?.play()},pause(){arCdRatioInstance?.pause()}}
 ].filter(section=>section.element)
 if(!sections.length)return null
 let active=null,attempted=false,frame=0
 const check=()=>{
  frame=0
  if(document.hidden){active?.pause();active=null;attempted=false;return}
  const height=window.innerHeight
  let next=null,best=0
  sections.forEach(section=>{const rect=section.element.getBoundingClientRect(),visible=Math.max(0,Math.min(rect.bottom,height)-Math.max(rect.top,0)),share=visible/Math.min(rect.height,height);if(share>=.45&&share>best){best=share;next=section}})
  if(next!==active){active?.pause();active=next;attempted=false}
  if(active&&!attempted&&(navigator.userActivation?.hasBeenActive??true)){
   attempted=true
   Promise.resolve(active.play()).catch(()=>{})
  }
 }
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(check)}
 const onActivation=event=>{if(event.target.closest?.(".bap-play,.wistia-ar__play,.wistia-ar__disc-stage,[data-ar-video-toggle]"))attempted=true;else schedule()}
 window.addEventListener("scroll",schedule,{passive:true})
 window.addEventListener("resize",schedule)
 document.addEventListener("visibilitychange",schedule)
 document.addEventListener("pointerdown",onActivation)
 document.addEventListener("keydown",onActivation)
 schedule()
 return()=>{window.removeEventListener("scroll",schedule);window.removeEventListener("resize",schedule);document.removeEventListener("visibilitychange",schedule);document.removeEventListener("pointerdown",onActivation);document.removeEventListener("keydown",onActivation);cancelAnimationFrame(frame);active?.pause()}
}
window.wistiaClaimPlayback=owner=>{
 if(owner!=="before-after")beforeAfterInstance?.pause()
 if(owner!=="ar-ratio")arCdRatioInstance?.pause?.()
 if(owner!=="home-highlight")homeHighlightInstance?.pause()
 document.querySelectorAll("audio,video").forEach(media=>{
  if(media===owner||media.paused||media.tagName==="VIDEO"&&media.muted)return
  media.pause()
 })
 document.querySelectorAll('iframe[src*="youtube.com/embed"]').forEach(frame=>{
  if(frame===owner)return
  frame.contentWindow?.postMessage(JSON.stringify({event:"command",func:"pauseVideo",args:[]}),"https://www.youtube.com")
 })
}
document.addEventListener("play",event=>{
 const media=event.target
 if(media instanceof HTMLMediaElement&&(media.tagName==="AUDIO"||!media.muted))window.wistiaClaimPlayback(media)
},true)
document.addEventListener("volumechange",event=>{
 const media=event.target
 if(media instanceof HTMLVideoElement&&!media.muted&&!media.paused)window.wistiaClaimPlayback(media)
},true)
let firstRender=true
let metaEngagementCleanup=null
function detailViewContent(key,purpose=""){
 const product=PRODUCTS[key]
 if(!product)return null
 let contentId=key,contentName=product.title,value=product.normal
 if(key==="solo-film"){
  const twoPeople=purpose==="duo"
  contentId=twoPeople?"solo-film-2p":"solo-film-1p"
  contentName=product.title+" · "+(twoPeople?"2인":"1인")
  value=twoPeople?FILM_FORMAT_PRICES["duet-film"].making:FILM_FORMAT_PRICES["solo-film"].making
 }else if(FILM_FORMAT_PRICES[key])value=FILM_FORMAT_PRICES[key][BASE_FILM_FORMAT[key]]
 return {content_name:contentName,content_ids:[contentId],content_type:"product",value,currency:"KRW"}
}
function initMetaEngagementTracking(pagePath,pricePage){
 const onScroll=()=>{
  const height=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight)
  const percent=height?Math.min(100,Math.floor((window.scrollY+window.innerHeight)/height*100)):0
  for(const threshold of [25,50,75,100])if(percent>=threshold)window.wistiaMeta?.trackScrollDepth?.(threshold,pagePath)
 }
 window.addEventListener("scroll",onScroll,{passive:true})
 const timers=[30,60,120].map(seconds=>window.setTimeout(()=>window.wistiaMeta?.trackTimeOnPage?.(seconds,pagePath),seconds*1000))
 let observer=null
 const priceBlock=pricePage?document.querySelector(".booking-base-amount"):null
 if(priceBlock&&typeof IntersectionObserver==="function"){
  observer=new IntersectionObserver(entries=>{
   if(!entries.some(entry=>entry.isIntersecting&&entry.intersectionRatio>=0.5))return
   const purpose=currentEventProduct==="solo-film"?(selectedFilmPeople===2?"duo":"solo"):currentEventPurpose
   const payload=detailViewContent(currentEventProduct,purpose)
   if(!payload)return
   payload.value=calculate().product.normal
   if(window.wistiaMeta?.trackViewPrice?.(payload,pagePath))observer.disconnect()
  },{threshold:0.5})
  observer.observe(priceBlock)
 }
 return ()=>{window.removeEventListener("scroll",onScroll);timers.forEach(timer=>window.clearTimeout(timer));observer?.disconnect()}
}
const SEO_HOME=window.WISTIA_SEO.home,SEO_DETAIL=window.WISTIA_SEO.detail,SEO_EVENT=window.WISTIA_SEO.event;
function setPageMeta({title,description,image,robots=""}){
 document.title=title;
 const url="https://www.wistiastudio.com"+location.pathname.replace(/\/$/,"")+(location.pathname==="/"?"/":"");
 const values={"meta[name='description']":description,"meta[property='og:title']":title,"meta[property='og:description']":description,"meta[property='og:url']":url,"meta[property='og:image']":image||"https://www.wistiastudio.com/assets/img/wedding/03-lipsync-mv.webp"};
 Object.entries(values).forEach(([selector,value])=>{const tag=document.querySelector(selector);if(tag)tag.content=value});
 const canonical=document.querySelector('link[rel="canonical"]');if(canonical)canonical.href=url;
 let robotsTag=document.querySelector("meta[name='robots']");
 if(robots){
  if(!robotsTag){robotsTag=document.createElement("meta");robotsTag.setAttribute("name","robots");document.head.appendChild(robotsTag)}
  robotsTag.setAttribute("content",robots);
 }else robotsTag?.remove();
}
function routePath(){return location.pathname.replace(/\/$/,"")||"/"}
function cleanHashRoute(){
 if(!location.hash.startsWith("#/"))return false;
 const path=location.hash.slice(1);
 history.replaceState(history.state,"",path+location.search);
 return true;
}
function normalizeInternalLinks(){
 document.querySelectorAll('a[href^="#/"]').forEach(link=>link.setAttribute("href",link.getAttribute("href").slice(1)));
}
function route({preserveScroll=false,reuseEventForm=false,scrollAnchor=""}={}){
 window.WistiaMotion?.destroy()
 inquiryObserver?.disconnect();inquiryObserver=null;document.body.classList.remove("inquiry-visible")
 if(routePath()==='/section/homeProcess')history.replaceState(history.state,"",'/info/process'+location.search)
 if(/^\/(detail|event|choose)\/(wedding|proposal|solo-film)(?:\/|$)/.test(routePath())){
  closeDialog();
  history.replaceState(history.state,"","/"+location.search);
 }
 if(/^\/(detail|event|choose)\/duet-film\/making(?:\/|$)/.test(routePath())){
  history.replaceState(history.state,"",routePath().replace(/\/making(?:\/.*)?$/,"")+location.search)
 }
 const previousScrollY=preserveScroll?window.scrollY:0
 const previousAnchorTop=scrollAnchor?document.querySelector(scrollAnchor)?.getBoundingClientRect().top:null
 closeDialog();metaEngagementCleanup?.();metaEngagementCleanup=null;scrollMediaCleanup?.();scrollMediaCleanup=null;arCdRatioInstance?.destroy();arCdRatioInstance=null;beforeAfterInstance?.destroy();beforeAfterInstance=null;homeHighlightInstance?.destroy();homeHighlightInstance=null;const parts=routePath().split("/").filter(Boolean);const [type,key]=parts;
 const home=!type||type==="section"||type==="find";const detail=type==="detail"&&PRODUCTS[key];const choice=type==="choose"&&FILM_FORMAT_PRODUCTS.has(key);const ar=type==="ar"&&AR_PURPOSES[key];const event=type==="event"&&PRODUCTS[key];const eventsPage=type==="events";const info=type==="info"&&INFO_PAGES[key];const purpose=parts[2]||"";const validDetail=detail||choice;
 const reuseArPriceForm=reuseEventForm&&event&&["solo","duo"].includes(key)&&["solo","duo"].includes(currentEventProduct)&&Boolean(app.querySelector("#consultForm"));
 const nextHasRatio=Boolean(ar||(detail&&(key==="solo"||PRODUCTS[key]?.category==="song")));if(document.querySelector("#ratioAudio")&&!nextHasRatio)releaseRatioAudioSources()
 const unifiedDetail=Boolean(validDetail&&AR_DETAIL_CONTENT[key]),arDetail=Boolean(detail&&["solo","duo"].includes(key));document.body.dataset.page=home?"home":type==="contact"?"event":event?"event":eventsPage?"events":validDetail?"detail":info?"info":"inner";document.body.classList.toggle("has-price-bar",Boolean(validDetail||ar));document.body.classList.toggle("is-solo-detail",unifiedDetail);document.body.classList.toggle("is-ar-detail",arDetail);
 const soloCta=document.querySelector("#soloDesktopCta");if(soloCta)soloCta.hidden=!unifiedDetail;
 document.body.classList.remove("menu-open");document.querySelector("#menuToggle")?.setAttribute("aria-expanded","false");document.querySelector("#menuToggle")?.setAttribute("aria-label","메뉴 열기");
 const headerBack=document.querySelector("#headerBack");if(headerBack)headerBack.hidden=home&&type!=="find";
 if(home)renderHome(type==="find"?key:"role");else if(type==="contact")renderContactPage();else if(type==="before-after")renderBeforeAfterPage();else if(eventsPage)renderEventsPage();else if(choice)renderDetail(key);else if(detail)renderDetail(key,purpose);else if(event){if(reuseArPriceForm){currentEventProduct=key;currentEventPurpose=purpose;updatePrice()}else renderEvent(key,purpose)}else if(info)renderInfoPage(key);else if(ar)renderArPurpose(key);else if(type==="song"||type==="film")renderPicker(type);else app.innerHTML='<section class="shell section"><h1>찾으시는 페이지가 없습니다</h1><p>상품 목록에서 준비 중인 순간을 다시 찾아보세요</p>'+cta("상품 찾아보기","#/")+'</section>'+footer();
 window.WistiaGuide?.destroy?.()
 document.querySelector('#guideLayer')?.remove()
 prepareSvgPlayerControls()
 window.WistiaSvgUI?.mount(app,studioIcon)
 window.WistiaBooking?.mount(document.querySelector('#contactInquiryForm'),inquiryUndecided?'undecided':currentEventProduct)
 prepareRatioAudioSources();
 prepareArHookVideo();
 initArCommerceDetail();
 initMobileArGallery();
 initArIndexWheel();
 initExpertSplitPanel();
 initSoloTopCta();
 initSoloPersonTabs();
 initSoloArRatio();
 arCdRatioInstance=window.initArCdRatio?.()||null
 beforeAfterInstance=window.initWistiaBeforeAfter?.()||null
 homeHighlightInstance=window.initWistiaHomeHighlight?.()||null
 initSoloProcessSlider();
 startReviewCarousel();
 scrollMediaCleanup=initScrollMediaPlayback();
 window.initHeroEditor?.(validDetail ? key : "");
 window.initProcessEditor?.(validDetail ? key : "");
 const fallbackTitle=eventsPage?"이벤트 | WISTIA":info?INFO_PAGES[key].title.replace("\n"," ")+" | WISTIA":type==="before-after"?"보컬 보정 전후 비교 | WISTIA":(PRODUCTS[key]?.title||"축가 녹음 및 영상")+" | WISTIA";
 const path=routePath();
 const orphan=window.WISTIA_SEO.noindex?.[path];
 const recognized=home||validDetail||Boolean(ar)||Boolean(event)||eventsPage||Boolean(info)||type==="song"||type==="film"||type==="before-after"||type==="contact";
 const noindex=Boolean(orphan)||path==="/before-after"||path==="/find"||path.startsWith("/find/")||path.startsWith("/choose/")||!recognized;
 const pageMeta=orphan||(home?SEO_HOME:detail&&SEO_DETAIL[key]?SEO_DETAIL[key]:event?SEO_EVENT:info&&key==="location"?window.WISTIA_SEO?.location||{title:fallbackTitle,description:INFO_PAGES.location.description}:{title:fallbackTitle,description:SEO_HOME.description});
 setPageMeta({...pageMeta,robots:noindex?"noindex, follow":""});
 window.wistiaMeta?.trackPageView();
 if(detail){
  const payload=detailViewContent(key,purpose);
  if(typeof window.wistiaMeta?.trackViewContent==="function"){
   window.wistiaMeta.trackViewContent(payload);
  }else{
   console.warn("[wistiaMeta] trackViewContent missing",window.wistiaMeta);
  }
 }
 metaEngagementCleanup=initMetaEngagementTracking(routePath(),Boolean(event))
 window.wistiaAnalytics?.startPageTracking(routePath(),event?()=>{
  const selectedPurpose=currentEventProduct==="solo-film"?(selectedFilmPeople===2?"duo":"solo"):currentEventPurpose
  const payload=detailViewContent(currentEventProduct,selectedPurpose)
  if(payload)payload.value=calculate().product.normal
  return payload
 }:null)
 const target=type==="section"?document.getElementById(key):null;
 if(reuseArPriceForm)firstRender=false;else requestAnimationFrame(()=>{const anchor=scrollAnchor?document.querySelector(scrollAnchor):null;if(anchor&&previousAnchorTop!=null)window.scrollTo({top:window.scrollY+anchor.getBoundingClientRect().top-previousAnchorTop,behavior:"instant"});else if(preserveScroll)window.scrollTo({top:previousScrollY,behavior:"instant"});else if(target?.id==='homeCases'){const title=target.querySelector('h2')||target;window.scrollTo({top:window.scrollY+title.getBoundingClientRect().top-innerHeight*.35,behavior:firstRender||matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"})}else if(target)target.scrollIntoView({behavior:firstRender||matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});else window.scrollTo({top:0,behavior:"instant"});firstRender=false});
 if(!reuseArPriceForm)app.focus({preventScroll:true});
 normalizeInternalLinks();
 normalizeInquiryLinks();window.WistiaSvgUI?.mountChrome(document,studioIcon);mountInquiryObserver()
 window.WistiaMotion?.mount()
 document.querySelectorAll("#mainMenu a").forEach(a=>{if(a.pathname===routePath())a.setAttribute("aria-current","location");else a.removeAttribute("aria-current")})
}
function normalizeInquiryLinks(){
 document.querySelectorAll('.arc-actions').forEach(group=>{const links=group.querySelectorAll('a[href^="/event/"]');if(links.length>1)links[1].remove()})
 document.querySelectorAll('.arc-actions a[href^="/event/"],.detail-benefit-teaser a[href^="/event/"],.detail-next a[href^="/event/"]').forEach(link=>{link.innerHTML='문의 양식 작성으로 '+studioIcon('next');link.classList.add('is-primary');link.removeAttribute("data-ar-consult")})
 document.querySelectorAll('.arc-online-note').forEach(note=>note.textContent='구성 선택 → 문의 양식 작성 → 복사 후 카카오톡 상담')
}
function goBack(){if((history.state?.wistiaDepth||0)>0)history.back();else{history.replaceState(history.state,"","/"+location.search);route()}}
history.replaceState({...history.state,wistiaDepth:history.state?.wistiaDepth||0},"");
cleanHashRoute();
document.addEventListener("click",e=>{
 if(document.body.classList.contains('menu-open')&&!e.target.closest('#mainMenu,#menuToggle')){document.body.classList.remove('menu-open');const toggle=document.querySelector('#menuToggle');toggle?.setAttribute('aria-expanded','false');toggle?.setAttribute('aria-label','메뉴 열기');e.preventDefault();return}
 const el=e.target.closest("a,button,summary[data-process-step]");if(!el)return;
 if(el.id==='floatingKakaoChat'||el.matches('.mas-bottom > a')){e.preventDefault();showKakaoInquiryDialog(el.id==='floatingKakaoChat'?'/contact':el.getAttribute('href'));return}
 if(el.hasAttribute("data-inquiry-jump")){e.preventDefault();jumpToInquiry();return}
 if(el.hasAttribute('data-booking-refresh')){window.WistiaBooking?.refresh();return}
 if(el.matches(".skip-link")){e.preventDefault();app.focus();return}
 if(el.matches("[data-close]")){closeDialog();if(el.tagName==="BUTTON")return}
 if(el.id==="headerBack")goBack();
 if(el.id==="menuToggle"){const open=!document.body.classList.contains("menu-open");document.body.classList.toggle("menu-open",open);el.setAttribute("aria-expanded",String(open));el.setAttribute("aria-label",open?"메뉴 닫기":"메뉴 열기")}
 if(el.dataset.inlineYoutube)playInlineVideo(el);
 if(el.dataset.video)openVideo(el.dataset.video);
 if(el.hasAttribute("data-review-prev")){moveReviews(-1);startReviewCarousel(false)}
 if(el.hasAttribute("data-review-next")){moveReviews(1);startReviewCarousel(false)}
 if(el.dataset.optionPlus||el.dataset.optionMinus){const key=el.dataset.optionPlus||el.dataset.optionMinus,option=eventProductOptions(currentEventProduct,currentEventPurpose).find(item=>item.key===key),delta=el.dataset.optionPlus?1:-1,max=option?.max??Infinity;optionQuantities[key]=Math.min(max,Math.max(0,(optionQuantities[key]||0)+delta));const output=document.querySelector('[data-option-count="'+key+'"]');if(output)output.textContent=optionQuantities[key]+(option?.unit||'회');updatePrice()}
 if(el.dataset.ratio&&!el.closest(".solo-ratio")){voiceRatio=el.dataset.ratio;const value=document.querySelector("#ratioValue");if(value)value.innerHTML=voiceRatio+"<small>%</small>";document.querySelectorAll("[data-ratio]").forEach(b=>b.setAttribute("aria-pressed",String(b===el)));switchRatioAudio(voiceRatio)}
 if(el.hasAttribute("data-ar-video-toggle")){const video=el.closest(".ar-hook-media")?.querySelector("video"),mobileGallery=Boolean(el.closest('.mobile-ar-solo .mas-gallery'));if(video){if(video.paused){video.muted=false;video.play().then(()=>{if(mobileGallery&&!video.paused)flashMobileArVideoFeedback(el,'play')}).catch(()=>{})}else{video.pause();if(mobileGallery)flashMobileArVideoFeedback(el,'pause')}}}
 if(el.dataset.processFormat){const section=el.closest(".film-process-section"),format=el.dataset.processFormat,expand=el.getAttribute("aria-expanded")!=="true";section?.querySelectorAll("[data-process-format]").forEach(button=>button.setAttribute("aria-expanded",String(expand&&button===el)));section?.querySelectorAll("[data-process-panel]").forEach(panel=>panel.hidden=!expand||panel.dataset.processPanel!==format)}
 if(el.matches("summary[data-process-step]")){const current=el.closest("details");current?.parentElement.querySelectorAll(":scope > details[open]").forEach(item=>{if(item!==current)item.open=false})}
 if(el.hasAttribute("data-reservation")){document.querySelector("#reservation")?.scrollIntoView({behavior:"smooth"});document.querySelector("#eventDate")?.focus({preventScroll:true})}
 if(el.tagName==="A"&&(el.getAttribute("href")?.startsWith("/")||el.getAttribute("href")?.startsWith("#/"))){e.preventDefault();if(el.hasAttribute('data-contact-quote')){const c=calculate();contactQuote={service:["solo","duo"].includes(currentEventProduct)?'AR 축가 사전녹음':'축가 스토리 필름',summary:c.product.title+' · '+shortWon(c.finalPrice),text:consultationText(),details:inquiryQuoteDetails(c)}}else if(el.getAttribute('href')==='/contact')contactQuote=null;const consult=el.hasAttribute("data-ar-consult");const scrollAnchor=el.matches(".mobile-ar-solo .mas-selection .mas-variant")?".mobile-ar-solo .mas-selection":el.matches(".ar-sales-detail [data-solo-person-tab]")?".sales-offer":"";const path=el.getAttribute("href").replace(/^#/,"");if(path!==routePath()){history.pushState({wistiaDepth:(history.state?.wistiaDepth||0)+1},"",path+location.search)}route({scrollAnchor});if(consult)jumpToInquiry()}
})
document.addEventListener("change",e=>{
 const el=e.target;
 if(el.closest('[data-contact-fields]')){window.WistiaContact.update(el);updatePrice();return}
 const priceScrollY=document.body.dataset.page==="event"?window.scrollY:null;
 if(el.matches('[data-product-select],[data-base-product]')){const next=el.dataset.baseProduct||el.value,draft=window.WistiaContact.snapshot(document.querySelector('#contactInquiryForm'));if(next!==currentEventProduct||inquiryUndecided){history.pushState({wistiaDepth:(history.state?.wistiaDepth||0)+1},"",next==='undecided'?"/contact"+location.search:"/event/"+next+location.search);route({preserveScroll:true,reuseEventForm:!!el.dataset.baseProduct});window.WistiaContact.restore(document.querySelector('#contactInquiryForm'),draft);updatePrice()}return}
 if(el.dataset.event){el.checked?selectedEvents.add(el.dataset.event):selectedEvents.delete(el.dataset.event);updatePrice()}
 if(el.dataset.option){el.checked?selectedOptions.add(el.dataset.option):selectedOptions.delete(el.dataset.option);updatePrice()}
 if(el.dataset.filmPeople){selectedFilmPeople=Number(el.dataset.filmPeople);updatePrice()}
 if(el.dataset.filmFormat){selectedFilmFormat=el.dataset.filmFormat;const list=document.querySelector('[data-package-list]'),title=document.querySelector('[data-package-title]'),details=document.querySelector('.package-section'),preview=document.querySelector('[data-proposal-format-preview]');if(preview)preview.innerHTML=proposalFormatPreview();if(list)list.innerHTML=bookingPackageList(currentEventProduct,PRODUCTS[currentEventProduct]);if(title)title.textContent=FILM_FORMATS[selectedFilmFormat].title+' 기본 구성';const body=details?.querySelector('.package-section-body');if(body){const oldNotes=body.querySelector('ul:not(.package-list)');if(oldNotes)oldNotes.remove();body.insertAdjacentHTML('beforeend',filmFormatNotes(FILM_FORMATS[selectedFilmFormat]))}if(details?.tagName==='DETAILS')details.open=true;updatePrice()}
 if(el.dataset.songOption){chosenOption=el.checked?el.dataset.songOption:"";updatePrice()}
 if(priceScrollY!==null)requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo({top:priceScrollY,behavior:"instant"})))
})
document.addEventListener('input',e=>{if(e.target.closest('#contactInquiryForm'))e.target.removeAttribute('aria-invalid');if(e.target.closest('[data-contact-fields]'))window.WistiaContact.syncReview()})
document.addEventListener("submit",async e=>{if(e.target.id==='contactInquiryForm'){e.preventDefault();const form=e.target;if(form.dataset.copyPending==='true')return;form.dataset.copyPending='true';try{await window.WistiaBooking?.refresh();if(!form.isConnected)return;const issues=window.WistiaContact.validationIssues(e.target);if(issues.length){showContactValidationDialog(issues);return}refreshInquiryQuote();const values=Object.fromEntries(new FormData(e.target));copyConsultationAndShowDialog(window.WistiaContact.text(values,contactQuote))}finally{delete form.dataset.copyPending}}})
dialog.addEventListener("cancel",e=>{e.preventDefault();closeDialog()})
dialog.addEventListener("click",e=>{if(e.target===dialog)closeDialog()})
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&document.body.classList.contains("menu-open")){document.body.classList.remove("menu-open");document.querySelector("#menuToggle")?.setAttribute("aria-expanded","false");document.querySelector("#menuToggle")?.setAttribute("aria-label","메뉴 열기");document.querySelector("#menuToggle")?.focus()}})
window.addEventListener("popstate",()=>{
 // 옛 #/ 주소 변경은 hashchange에서 경로 정규화 후 한 번만 렌더링한다
 if(location.hash.startsWith("#/"))return
 route()
})
window.addEventListener("hashchange",()=>{cleanHashRoute();route()})
// Shared detail markup survives viewport changes, preserving playback, disclosure and focus state.
async function init(){
 try{const r=await fetch("wistia-config.json",{cache:"no-store",signal:AbortSignal.timeout(2500)});if(r.ok)config={...config,...await r.json()}}catch{}
 if(!document.querySelector("#siteHeader")||!document.querySelector("#app"))return
 header();route()
}
init()
