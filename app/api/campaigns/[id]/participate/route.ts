import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { decrementRemaining, getCampaignById } from "@/lib/mock-data";
import { addParticipation, hasParticipated } from "@/lib/participations";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // 참여는 포인트가 걸린 쓰기 동작이라 반드시 토큰 검증부터
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

  // 중복 참여 방지 — 같은 요청이 두 번 와도 두 번 적립되지 않는다
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
