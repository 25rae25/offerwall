import { NextResponse } from "next/server";
import { signToken } from "@/lib/jwt";

// 데모용 계정. 실서비스라면 DB에서 조회한다
const DEMO_ID = "demo";
const DEMO_PASSWORD = "1234";

export async function POST(request: Request) {
  const { userId, password } = await request.json().catch(() => ({}));

  // 로그인 버튼의 로딩 상태를 확인할 수 있도록 넣은 인위적 지연
  await new Promise((r) => setTimeout(r, 500));

  if (userId !== DEMO_ID || password !== DEMO_PASSWORD) {
    return NextResponse.json(
      { message: "아이디 또는 비밀번호가 올바르지 않습니다." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    token: signToken({ sub: DEMO_ID, name: "데모유저" }),
    name: "데모유저",
  });
}
