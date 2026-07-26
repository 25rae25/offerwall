export type CampaignCategory =
  | "app"
  | "signup"
  | "purchase"
  | "survey"
  | "subscribe";

export type CampaignSort = "latest" | "reward" | "deadline";

export interface Campaign {
  id: string;
  title: string;
  advertiser: string;
  category: CampaignCategory;
  emoji: string;
  rewardPoint: number;
  summary: string;
  description: string;
  steps: string[];
  totalQuantity: number;
  remainingQuantity: number;
  deadline: string;
}

export const CATEGORY_LABEL: Record<CampaignCategory, string> = {
  app: "앱설치",
  signup: "회원가입",
  purchase: "구매",
  survey: "설문",
  subscribe: "구독",
};

export const SORT_LABEL: Record<CampaignSort, string> = {
  latest: "최신순",
  reward: "리워드순",
  deadline: "마감임박순",
};
