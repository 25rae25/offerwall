import type { Campaign } from "@/types/campaign";

// 마감일은 절대 날짜로 넣으면 시간이 지나면 전부 만료되므로
// "오늘 기준 N일 뒤"로 계산해서 내려준다
function daysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

interface SeedCampaign extends Omit<Campaign, "deadline"> {
  dday: number;
}

const seeds: SeedCampaign[] = [
  {
    id: "c1",
    title: "토스 앱 설치하고 송금 미션",
    advertiser: "토스",
    category: "app",
    emoji: "💸",
    rewardPoint: 5000,
    summary: "앱 설치 후 첫 송금 완료 시 적립",
    description:
      "토스 앱을 설치하고 첫 송금을 완료하면 포인트가 적립됩니다. 신규 가입자만 참여할 수 있어요.",
    steps: ["참여하기 버튼으로 앱 설치", "회원가입 후 송금 1회", "확인 후 자동 적립"],
    totalQuantity: 1000,
    remainingQuantity: 412,
    dday: 4,
  },
  {
    id: "c2",
    title: "쿠팡 와우 멤버십 체험",
    advertiser: "쿠팡",
    category: "subscribe",
    emoji: "📦",
    rewardPoint: 3000,
    summary: "와우 멤버십 무료체험 신청 시 적립",
    description:
      "쿠팡 와우 멤버십 30일 무료체험을 신청하면 포인트가 적립됩니다. 기존 회원은 제외됩니다.",
    steps: ["쿠팡 앱으로 이동", "무료체험 신청", "신청 확인 후 적립"],
    totalQuantity: 2000,
    remainingQuantity: 8,
    dday: 2,
  },
  {
    id: "c3",
    title: "신한카드 발급 이벤트",
    advertiser: "신한카드",
    category: "signup",
    emoji: "💳",
    rewardPoint: 15000,
    summary: "카드 신규 발급 + 1회 사용 시 적립",
    description:
      "신한카드를 새로 발급받고 한 번 이상 결제하면 고액 포인트가 적립됩니다. 최근 6개월 내 보유 이력이 없어야 합니다.",
    steps: ["발급 페이지 접속", "카드 발급", "1회 이상 결제", "확인 후 적립"],
    totalQuantity: 500,
    remainingQuantity: 133,
    dday: 8,
  },
  {
    id: "c4",
    title: "배달앱 이용 경험 설문",
    advertiser: "배달의민족",
    category: "survey",
    emoji: "🍕",
    rewardPoint: 500,
    summary: "2분 설문 참여 시 바로 적립",
    description: "배달 앱 이용 경험에 대한 짧은 설문입니다. 제출 즉시 적립됩니다.",
    steps: ["설문 페이지 이동", "문항 응답", "제출 시 적립"],
    totalQuantity: 10000,
    remainingQuantity: 8104,
    dday: 15,
  },
  {
    id: "c5",
    title: "무신사 가입하고 첫 구매",
    advertiser: "무신사",
    category: "purchase",
    emoji: "👕",
    rewardPoint: 8000,
    summary: "신규 가입 후 첫 구매 시 적립",
    description:
      "무신사에 가입하고 첫 구매를 완료하면 포인트가 적립됩니다. 구매 확정 후 지급됩니다.",
    steps: ["무신사 가입", "상품 첫 구매", "구매 확정 후 적립"],
    totalQuantity: 1500,
    remainingQuantity: 902,
    dday: 6,
  },
  {
    id: "c6",
    title: "넷플릭스 신규 구독",
    advertiser: "넷플릭스",
    category: "subscribe",
    emoji: "🎬",
    rewardPoint: 4000,
    summary: "신규 구독 시 적립",
    description: "넷플릭스를 새로 구독하면 포인트가 적립됩니다. 재구독은 제외됩니다.",
    steps: ["넷플릭스 이동", "요금제 선택 후 구독", "확인 후 적립"],
    totalQuantity: 800,
    remainingQuantity: 297,
    dday: 11,
  },
  {
    id: "c7",
    title: "당근 앱 설치하고 동네인증",
    advertiser: "당근",
    category: "app",
    emoji: "🥕",
    rewardPoint: 1000,
    summary: "앱 설치 + 동네인증 완료 시 적립",
    description: "당근 앱을 설치하고 동네인증까지 마치면 포인트가 적립됩니다.",
    steps: ["앱 설치", "동네인증", "확인 후 적립"],
    totalQuantity: 3000,
    remainingQuantity: 0,
    dday: 7,
  },
  {
    id: "c8",
    title: "여행 취향 설문조사",
    advertiser: "야놀자",
    category: "survey",
    emoji: "🏖️",
    rewardPoint: 700,
    summary: "3분 설문 참여 시 적립",
    description: "여행과 숙박 취향에 대한 설문입니다. 제출 즉시 적립됩니다.",
    steps: ["설문 페이지 이동", "응답 후 제출", "즉시 적립"],
    totalQuantity: 5000,
    remainingQuantity: 4230,
    dday: 20,
  },
  {
    id: "c9",
    title: "29CM 신규 회원가입",
    advertiser: "29CM",
    category: "signup",
    emoji: "🛍️",
    rewardPoint: 2000,
    summary: "가입만 해도 적립",
    description: "29CM에 신규 가입하면 포인트가 적립됩니다.",
    steps: ["가입 페이지 이동", "회원가입", "즉시 적립"],
    totalQuantity: 4000,
    remainingQuantity: 1620,
    dday: 3,
  },
  {
    id: "c10",
    title: "올리브영 온라인몰 첫 구매",
    advertiser: "올리브영",
    category: "purchase",
    emoji: "🧴",
    rewardPoint: 6000,
    summary: "3만원 이상 첫 구매 시 적립",
    description:
      "올리브영 온라인몰에서 3만원 이상 첫 구매 시 포인트가 적립됩니다. 신규 회원 대상입니다.",
    steps: ["올리브영 가입", "3만원 이상 구매", "구매 확정 후 적립"],
    totalQuantity: 1200,
    remainingQuantity: 511,
    dday: 10,
  },
];

export function getCampaigns(): Campaign[] {
  return seeds.map(({ dday, ...rest }) => ({
    ...rest,
    deadline: daysFromNow(dday),
  }));
}

export function getCampaignById(id: string) {
  return getCampaigns().find((c) => c.id === id);
}
