"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import BackLink from "@/components/common/BackLink";
import TextField from "@/components/common/TextField";
import { resolveReturnTo } from "@/lib/return-to";
import { useAuthStore } from "@/store/authStore";

// useSearchParams를 쓰는 컴포넌트는 Suspense로 감싸야 빌드 에러가 안 남
export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((s) => s.login);

  const [loginValue, setLoginValue] = useState({ userId: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // input의 name 속성으로 어느 필드를 바꿀지 구분 (필드가 늘어도 핸들러는 하나)
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginValue.userId.trim() || !loginValue.password) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: loginValue.userId.trim(),
          password: loginValue.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "로그인에 실패했습니다.");
        return;
      }
      login(data.token, data.name);
      // 가드에 막혀서 온 경우 원래 가려던 곳으로 복귀
      // replace라서 뒤로가기 눌러도 로그인 폼으로 안 돌아온다
      router.replace(resolveReturnTo(searchParams.get("returnTo")));
    } catch {
      setError("잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-6">
      <BackLink />

      <div className="mx-auto mt-10 max-w-sm">
        <h1 className="text-center text-xl font-bold">로그인</h1>
        <p className="mt-1 text-center text-sm text-gray-500">
          로그인하고 포인트를 관리하세요
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <TextField
            name="userId"
            value={loginValue.userId}
            onChange={handleInput}
            placeholder="아이디"
            autoComplete="username"
          />
          <TextField
            name="password"
            type="password"
            value={loginValue.password}
            onChange={handleInput}
            placeholder="비밀번호"
            autoComplete="current-password"
          />

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-orange-500 py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          계정이 없으신가요?{" "}
          <Link
            // 가입 후에도 원래 가려던 곳으로 복귀하도록 returnTo를 그대로 넘긴다
            href={
              searchParams.get("returnTo")
                ? `/signup?returnTo=${encodeURIComponent(searchParams.get("returnTo")!)}`
                : "/signup"
            }
            className="font-medium text-orange-500"
          >
            회원가입
          </Link>
        </p>

        <p className="mt-3 rounded-xl bg-gray-100 px-4 py-2.5 text-center text-xs text-gray-500">
          데모 계정: demo / 1234
        </p>
      </div>
    </main>
  );
}
