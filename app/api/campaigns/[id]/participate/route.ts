import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { decrementRemaining, getCampaignById } from "@/lib/mock-data";
import { addParticipation, hasParticipated } from "@/lib/participations";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "로그인이 필요합니다." },
      { status: 401 }
    );
  }
  const payload = verifyToken(auth.slice(7));
  if (!payload) {
    return NextResponse.json(
      { message: "유효하지 않은 토큰입니다." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const campaign = getCampaignById(id);
  if (!campaign) {
    return NextResponse.json(
      { message: "존재하지 않는 캠페인입니다." },
      { status: 404 }
    );
  }

  if (hasParticipated(payload.sub, id)) {
    return NextResponse.json(
      { message: "이미 참여한 캠페인입니다." },
      { status: 409 }
    );
  }

  if (!decrementRemaining(id)) {
    return NextResponse.json(
      { message: "모두 소진된 캠페인입니다." },
      { status: 409 }
    );
  }
  addParticipation(payload.sub, id);

  return NextResponse.json({
    campaignId: id,
    rewardPoint: campaign.rewardPoint,
  });
}
