import type { Campaign, CampaignCategory, CampaignSort } from "@/types/campaign";

export interface CampaignListParams {
  category?: CampaignCategory;
  sort?: CampaignSort;
  q?: string;
}

export async function fetchCampaigns(params: CampaignListParams, page: number) {
  const qs = new URLSearchParams();
  if (params.category) qs.set("category", params.category);
  if (params.sort && params.sort !== "latest") qs.set("sort", params.sort);
  if (params.q) qs.set("q", params.q);
  qs.set("page", String(page));

  const res = await fetch(`/api/campaigns?${qs.toString()}`);
  if (!res.ok) {
    throw new Error("캠페인 목록을 불러오지 못했습니다.");
  }
  return res.json() as Promise<{
    campaigns: Campaign[];
    total: number;
    hasMore: boolean;
  }>;
}

export async function fetchCampaign(id: string) {
  const res = await fetch(`/api/campaigns/${id}`);
  if (!res.ok) {
    throw new Error("캠페인을 불러오지 못했습니다.");
  }
  return res.json() as Promise<Campaign>;
}

// 호출한 쪽에서 상태코드로 분기할 수 있도록 (401=재로그인, 409=중복/소진 안내)
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

export async function participateCampaign(id: string, token: string) {
  const res = await fetch(`/api/campaigns/${id}/participate`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new ApiError(data.message ?? "참여에 실패했습니다.", res.status);
  }
  return data as { campaignId: string; rewardPoint: number };
}
