import { NextResponse } from "next/server";
import { getCampaignById } from "@/lib/mock-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const campaign = getCampaignById(id);

  await new Promise((r) => setTimeout(r, 200));

  if (!campaign) {
    return NextResponse.json(
      { message: "존재하지 않는 캠페인입니다." },
      { status: 404 }
    );
  }
  return NextResponse.json(campaign);
}
