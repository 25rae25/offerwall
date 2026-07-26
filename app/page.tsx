"use client";

import CampaignCard from "@/components/campaign/CampaignCard";
import { useCampaigns } from "@/lib/queries";

export default function Home() {
  const { data, isLoading, isError, refetch } = useCampaigns();

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-6">
      <h1 className="text-xl font-bold">오퍼월</h1>
      <p className="mt-1 text-sm text-gray-500">
        미션에 참여하고 포인트를 모아보세요
      </p>

      <div className="mt-5">
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

        {data && (
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
