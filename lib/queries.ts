"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchCampaign,
  fetchCampaigns,
  participateCampaign,
  type CampaignListParams,
} from "@/lib/api";

export function useCampaigns(params: CampaignListParams = {}) {
  return useInfiniteQuery({
    queryKey: ["campaigns", params],
    queryFn: ({ pageParam }) => fetchCampaigns(params, pageParam),
    initialPageParam: 1,
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

export function useParticipateCampaign(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (token: string) => participateCampaign(id, token),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["campaign", id] });
      qc.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}
