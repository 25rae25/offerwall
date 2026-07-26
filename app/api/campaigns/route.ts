import { NextResponse } from "next/server";
import { getCampaigns } from "@/lib/mock-data";
import type { CampaignCategory, CampaignSort } from "@/types/campaign";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") as CampaignCategory | null;
  const sort = (searchParams.get("sort") ?? "latest") as CampaignSort;

  let campaigns = getCampaigns();

  if (category) {
    campaigns = campaigns.filter((c) => c.category === category);
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

  return NextResponse.json({ campaigns, total: campaigns.length });
}
