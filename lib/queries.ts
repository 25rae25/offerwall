"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  fetchCampaign,
  fetchCampaigns,
  type CampaignListParams,
} from "@/lib/api";

export function useCampaigns(params: CampaignListParams = {}) {
  return useInfiniteQuery({
    queryKey: ["campaigns", params],
    queryFn: ({ pageParam }) => fetchCampaigns(params, pageParam),
    initialPageParam: 1,
    // 서버가 더 있다고 하면 다음 페이지 번호는 지금까지 받은 페이지 수 + 1
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
  });
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: ["campaign", id],
    queryFn: () => fetchCampaign(id),
    enabled: !!id,
  });
}
