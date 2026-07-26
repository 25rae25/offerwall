"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCampaigns, type CampaignListParams } from "@/lib/api";

export function useCampaigns(params: CampaignListParams = {}) {
  return useQuery({
    queryKey: ["campaigns", params],
    queryFn: () => fetchCampaigns(params),
  });
}
