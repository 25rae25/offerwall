"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CampaignCard from "@/components/campaign/CampaignCard";
import CampaignFilter from "@/components/campaign/CampaignFilter";
import { useCampaigns } from "@/lib/queries";
import type { CampaignCategory, CampaignSort } from "@/types/campaign";

function CampaignListPage() {
  const searchParams = useSearchParams();
  const category =
    (searchParams.get("category") as CampaignCategory) ?? undefined;
  const sort = (searchParams.get("sort") as CampaignSort) ?? undefined;

  const { data, isLoading, isError, refetch } = useCampaigns({
    category,
    sort,
  });

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-6">
      <h1 className="text-xl font-bold">오퍼월</h1>
      <p className="mt-1 text-sm text-gray-500">
        미션에 참여하고 포인트를 모아보세요
      </p>

      <CampaignFilter />

      <div className="mt-4">
        {isLoading && (
          <p className="py-16 text-center text-sm text-gray-400">
            불러오는 중...
          </p>
        )}

        {isError && (
          <div className="py-16 text-center">
            <p className="text-sm text-gray-500">목록을 불러오지 못했어요</p>
            <button
              onClick={() => refetch()}
              className="mt-3 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white"
            >
              다시 시도
            </button>
          </div>
        )}

        {data && data.campaigns.length === 0 && (
          <p className="py-16 text-center text-sm text-gray-400">
            조건에 맞는 캠페인이 없어요
          </p>
        )}

        {data && data.campaigns.length > 0 && (
          <ul className="space-y-3">
            {data.campaigns.map((campaign) => (
              <li key={campaign.id}>
                <CampaignCard campaign={campaign} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

export default function Home() {
  // useSearchParams를 쓰는 컴포넌트는 Suspense로 감싸야 빌드 에러가 안 남
  return (
    <Suspense>
      <CampaignListPage />
    </Suspense>
  );
}
