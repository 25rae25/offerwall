import { NextResponse } from "next/server";
import { signToken } from "@/lib/jwt";
import { createUser, userExists } from "@/lib/users";

// 프론트에서 이미 검사하지만, API가 직접 호출될 수 있으므로 서버에서도 다시 검사한다
export async function POST(request: Request) {
  const { userId, email, password } = await request.json().catch(() => ({}));

  const id = String(userId ?? "").trim();
  const mail = String(email ?? "").trim();

  if (id.length < 3) {
    return NextResponse.json(
      { message: "아이디는 3자 이상이어야 합니다." },
      { status: 400 }
    );
  }
  if (!/^\S+@\S+\.\S+$/.test(mail)) {
    return NextResponse.json(
      { message: "이메일 형식이 올바르지 않습니다." },
      { status: 400 }
    );
  }
  // 영문/숫자/특수문자를 모두 포함한 8~16자 (프론트와 동일한 규칙)
  if (!/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^*+=-]).{8,16}$/.test(String(password ?? ""))) {
    return NextResponse.json(
      { message: "영문, 숫자, 특수문자를 조합해 8자 이상 입력해 주세요." },
      { status: 400 }
    );
  }
  if (userExists(id)) {
    return NextResponse.json(
      { message: "이미 사용 중인 아이디입니다." },
      { status: 409 }
    );
  }

  // 가입 버튼의 로딩 상태를 확인할 수 있도록 넣은 인위적 지연
  await new Promise((r) => setTimeout(r, 500));

  const user = createUser(id, mail, String(password));

  // 가입 직후 다시 로그인시키지 않도록 토큰을 바로 발급한다
  const token = signToken({ sub: user.userId, name: user.name });
  return NextResponse.json({ token, name: user.name }, { status: 201 });
}
