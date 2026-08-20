import { NextResponse } from "next/server";
import { signToken } from "@/lib/jwt";
import { findUser } from "@/lib/users";

export async function POST(request: Request) {
  const { userId, password } = await request.json().catch(() => ({}));

  // 로그인 버튼의 로딩 상태를 확인할 수 있도록 넣은 인위적 지연
  await new Promise((r) => setTimeout(r, 500));

  const user = findUser(String(userId ?? "").trim());
  if (!user || user.password !== password) {
    return NextResponse.json(
      { message: "아이디 또는 비밀번호가 올바르지 않습니다." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    token: signToken({ sub: user.userId, name: user.name }),
    name: user.name,
  });
}
