import { NextResponse } from "next/server";

// 데모용 계정. 실서비스라면 DB 조회와 서명된 토큰(JWT) 발급을 서버가 담당한다
const DEMO_ID = "demo";
const DEMO_PASSWORD = "1234";

export async function POST(request: Request) {
  const { userId, password } = await request.json().catch(() => ({}));

  await new Promise((r) => setTimeout(r, 500));

  if (userId !== DEMO_ID || password !== DEMO_PASSWORD) {
    return NextResponse.json(
      { message: "아이디 또는 비밀번호가 올바르지 않습니다." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    token: `token-${Date.now()}`,
    name: "데모유저",
  });
}
