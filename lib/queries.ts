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

export function useParticipateCampaign(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (token: string) => participateCampaign(id, token),
    onSuccess: () => {
      // 참여로 서버의 남은 수량이 바뀌었으니 캐시를 낡은 것으로 표시 —
      // 상세/목록을 보는 화면이 알아서 다시 가져간다
      qc.invalidateQueries({ queryKey: ["campaign", id] });
      qc.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}
