"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import CampaignCard from "@/components/campaign/CampaignCard";
import EmptyState from "@/components/common/EmptyState";
import CampaignFilter from "@/components/campaign/CampaignFilter";
import { useCampaigns } from "@/lib/queries";
import type { CampaignCategory, CampaignSort } from "@/types/campaign";

function CampaignListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category =
    (searchParams.get("category") as CampaignCategory) ?? undefined;
  const sort = (searchParams.get("sort") as CampaignSort) ?? undefined;
  const q = searchParams.get("q") ?? "";

  const [keyword, setKeyword] = useState(q);

  // 타이핑이 멈추고 300ms 뒤에 URL에 반영 (입력마다 요청하지 않도록)
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (keyword.trim()) {
        params.set("q", keyword.trim());
      } else {
        params.delete("q");
      }
      const query = params.toString();
      router.replace(query ? `/?${query}` : "/", { scroll: false });
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword, searchParams, router]);

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCampaigns({ category, sort, q: q || undefined });

  const campaigns = data ? data.pages.flatMap((p) => p.campaigns) : [];

  // 목록 맨 아래 div가 화면에 보이면 다음 페이지 요청
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = bottomRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, campaigns.length]);

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">오퍼월</h1>
        <Link href="/mypage" className="text-sm text-gray-500">
          마이페이지
        </Link>
      </div>
      <p className="mt-1 text-sm text-gray-500">
        미션에 참여하고 포인트를 모아보세요
      </p>

      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="캠페인이나 브랜드 검색"
        className="mt-5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-400"
      />

      <CampaignFilter />

      <div className="mt-4">
        {isLoading && <EmptyState message="불러오는 중..." />}

        {isError && (
          <EmptyState message="목록을 불러오지 못했어요">
            <button
              onClick={() => refetch()}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white"
            >
              다시 시도
            </button>
          </EmptyState>
        )}

        {data && campaigns.length === 0 && (
          <EmptyState message="조건에 맞는 캠페인이 없어요" />
        )}

        {data && campaigns.length > 0 && (
          <ul className="space-y-3">
            {campaigns.map((campaign) => (
              <li key={campaign.id}>
                <CampaignCard campaign={campaign} />
              </li>
            ))}
          </ul>
        )}

        <div ref={bottomRef} />

        {isFetchingNextPage && (
          <p className="py-4 text-center text-sm text-gray-400">
            더 불러오는 중...
          </p>
        )}
        {data && campaigns.length > 0 && !hasNextPage && (
          <p className="py-4 text-center text-xs text-gray-400">
            모든 캠페인을 확인했어요
          </p>
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
