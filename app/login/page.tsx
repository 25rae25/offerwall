"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
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
      router.replace("/mypage");
    } catch {
      setError("잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-6">
      <Link href="/" className="text-sm text-gray-400">
        ← 목록으로
      </Link>

      <div className="mx-auto mt-10 max-w-sm">
        <h1 className="text-center text-xl font-bold">로그인</h1>
        <p className="mt-1 text-center text-sm text-gray-500">
          로그인하고 포인트를 관리하세요
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input
            name="userId"
            value={loginValue.userId}
            onChange={handleInput}
            placeholder="아이디"
            autoComplete="username"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
          />
          <input
            name="password"
            type="password"
            value={loginValue.password}
            onChange={handleInput}
            placeholder="비밀번호"
            autoComplete="current-password"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
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

        <p className="mt-4 rounded-xl bg-gray-100 px-4 py-2.5 text-center text-xs text-gray-500">
          데모 계정: demo / 1234
        </p>
      </div>
    </main>
  );
}
