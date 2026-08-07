"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchCampaign,
  fetchCampaigns,
  type CampaignListParams,
} from "@/lib/api";

export function useCampaigns(params: CampaignListParams = {}) {
  return useQuery({
    queryKey: ["campaigns", params],
    queryFn: () => fetchCampaigns(params),
  });
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: ["campaign", id],
    queryFn: () => fetchCampaign(id),
    enabled: !!id,
  });
}
