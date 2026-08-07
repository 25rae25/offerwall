import type { Campaign, CampaignCategory, CampaignSort } from "@/types/campaign";

export interface CampaignListParams {
  category?: CampaignCategory;
  sort?: CampaignSort;
}

export async function fetchCampaigns(params: CampaignListParams = {}) {
  const qs = new URLSearchParams();
  if (params.category) qs.set("category", params.category);
  if (params.sort && params.sort !== "latest") qs.set("sort", params.sort);

  const query = qs.toString();
  const res = await fetch(`/api/campaigns${query ? `?${query}` : ""}`);
  if (!res.ok) {
    throw new Error("캠페인 목록을 불러오지 못했습니다.");
  }
  return res.json() as Promise<{ campaigns: Campaign[]; total: number }>;
}

export async function fetchCampaign(id: string) {
  const res = await fetch(`/api/campaigns/${id}`);
  if (!res.ok) {
    throw new Error("캠페인을 불러오지 못했습니다.");
  }
  return res.json() as Promise<Campaign>;
}
