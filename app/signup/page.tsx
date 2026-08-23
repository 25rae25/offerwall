"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import BackLink from "@/components/common/BackLink";
import TextField from "@/components/common/TextField";
import { resolveReturnTo } from "@/lib/return-to";
import { useAuthStore } from "@/store/authStore";

const EMAIL_REGEX = /^[\w.-]+@[\w-]+(\.[\w-]+)+$/;
// 영문/숫자/특수문자를 모두 포함한 8~16자
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^*+=-]).{8,16}$/;

type Field = "userId" | "email" | "password" | "passwordConfirm";

// 입력값 하나를 받아 에러 메시지를 돌려준다 (통과하면 빈 문자열)
function getMessage(field: Field, value: string, password: string) {
  if (!value) return ""; // 아직 입력 전이면 잔소리하지 않는다

  switch (field) {
    case "userId":
      return value.trim().length < 3 ? "아이디는 3자 이상 입력해 주세요." : "";
    case "email":
      return EMAIL_REGEX.test(value)
        ? ""
        : "이메일 형식이 올바르지 않습니다. 다시 확인해 주세요.";
    case "password":
      return PASSWORD_REGEX.test(value)
        ? ""
        : "영문, 숫자, 특수문자를 조합해 8자 이상 입력해 주세요.";
    case "passwordConfirm":
      return value === password ? "" : "비밀번호가 일치하지 않습니다.";
  }
}

// useSearchParams를 쓰는 컴포넌트는 Suspense로 감싸야 빌드 에러가 안 남
export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((s) => s.login);

  const [form, setForm] = useState<Record<Field, string>>({
    userId: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [duplicateId, setDuplicateId] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  // input의 name 속성으로 어느 필드를 바꿀지 구분 (필드가 늘어도 핸들러는 하나)
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "userId") setDuplicateId("");
    setFormError("");
  };

  // 입력할 때마다 계산하는 실시간 메시지 — 상태로 들고 있지 않아도 된다
  const messages: Record<Field, string> = {
    userId:
      duplicateId && form.userId.trim() === duplicateId
        ? "이미 사용 중인 아이디입니다."
        : getMessage("userId", form.userId, form.password),
    email: getMessage("email", form.email, form.password),
    password: getMessage("password", form.password, form.password),
    passwordConfirm: getMessage(
      "passwordConfirm",
      form.passwordConfirm,
      form.password
    ),
  };

  // 네 필드가 모두 채워지고 에러가 하나도 없어야 가입 버튼이 열린다
  const canSubmit =
    Object.values(form).every((v) => v.trim()) &&
    Object.values(messages).every((m) => !m);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setFormError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: form.userId.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        // 아이디 중복(409)은 해당 필드 아래에, 나머지는 폼 전체 에러로
        if (res.status === 409) {
          setDuplicateId(form.userId.trim());
        } else {
          setFormError(data.message ?? "가입에 실패했습니다.");
        }
        return;
      }
      // 가입 즉시 로그인 — 로그인 화면을 한 번 더 거치지 않는다
      login(data.token, data.name);
      router.replace(resolveReturnTo(searchParams.get("returnTo")));
    } catch {
      setFormError("잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-6">
      <BackLink />

      <div className="mx-auto mt-8 max-w-sm">
        <h1 className="text-center text-xl font-bold">회원가입</h1>
        <p className="mt-1 text-center text-sm text-gray-500">
          가입하고 바로 포인트를 모아보세요
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          <TextField
            label="아이디"
            name="userId"
            value={form.userId}
            placeholder="아이디를 입력해 주세요 (3자 이상)"
            message={messages.userId}
            onChange={handleInput}
            autoComplete="username"
          />
          <TextField
            label="이메일"
            name="email"
            type="email"
            value={form.email}
            placeholder="이메일을 입력해 주세요"
            message={messages.email}
            onChange={handleInput}
            autoComplete="email"
          />
          <TextField
            label="비밀번호"
            name="password"
            type="password"
            value={form.password}
            placeholder="영문, 숫자, 특수문자 조합 8자 이상"
            message={messages.password}
            onChange={handleInput}
            autoComplete="new-password"
          />
          <TextField
            label="비밀번호 확인"
            name="passwordConfirm"
            type="password"
            value={form.passwordConfirm}
            placeholder="비밀번호를 확인해 주세요"
            message={messages.passwordConfirm}
            onChange={handleInput}
            autoComplete="new-password"
          />

          {formError && <p className="text-xs text-red-500">{formError}</p>}

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="w-full rounded-xl bg-orange-500 py-3 font-semibold text-white disabled:bg-gray-200 disabled:text-gray-400"
          >
            {loading ? "가입 중..." : "가입하기"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="font-medium text-orange-500">
            로그인
          </Link>
        </p>
      </div>
    </main>
  );
}
