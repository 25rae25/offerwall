import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function GET(request: Request) {
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

  return NextResponse.json({ name: payload.name });
}
