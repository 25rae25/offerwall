import { NextResponse } from "next/server";
import { getCampaigns } from "@/lib/mock-data";
import type { CampaignCategory, CampaignSort } from "@/types/campaign";

const PAGE_SIZE = 6;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") as CampaignCategory | null;
  const sort = (searchParams.get("sort") ?? "latest") as CampaignSort;
  const q = searchParams.get("q")?.trim().toLowerCase();
  const page = Number(searchParams.get("page") ?? "1");

  let campaigns = getCampaigns();

  if (category) {
    campaigns = campaigns.filter((c) => c.category === category);
  }

  if (q) {
    campaigns = campaigns.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.advertiser.toLowerCase().includes(q)
    );
  }

  if (sort === "reward") {
    campaigns = [...campaigns].sort((a, b) => b.rewardPoint - a.rewardPoint);
  } else if (sort === "deadline") {
    campaigns = [...campaigns].sort(
      (a, b) => +new Date(a.deadline) - +new Date(b.deadline)
    );
  }

  // 로딩 상태 확인용 지연
  await new Promise((r) => setTimeout(r, 300));

  const start = (page - 1) * PAGE_SIZE;
  return NextResponse.json({
    campaigns: campaigns.slice(start, start + PAGE_SIZE),
    total: campaigns.length,
    hasMore: start + PAGE_SIZE < campaigns.length,
  });
}
