"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import BackLink from "@/components/common/BackLink";
import TextField from "@/components/common/TextField";
import { resolveReturnTo } from "@/lib/return-to";
import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  USER_ID_MIN_LENGTH,
  VALIDATION_MESSAGE,
} from "@/lib/validation";
import { useAuthStore } from "@/store/authStore";


type Field = "userId" | "email" | "password" | "passwordConfirm";

function getMessage(field: Field, value: string, password: string) {
  if (!value) return "";

  switch (field) {
    case "userId":
      return value.trim().length < USER_ID_MIN_LENGTH
        ? VALIDATION_MESSAGE.userId
        : "";
    case "email":
      return EMAIL_REGEX.test(value) ? "" : VALIDATION_MESSAGE.email;
    case "password":
      return PASSWORD_REGEX.test(value) ? "" : VALIDATION_MESSAGE.password;
    case "passwordConfirm":
      return value === password ? "" : VALIDATION_MESSAGE.passwordConfirm;
  }
}

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

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "userId") setDuplicateId("");
    setFormError("");
  };

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
        if (res.status === 409) {
          setDuplicateId(form.userId.trim());
        } else {
          setFormError(data.message ?? "가입에 실패했습니다.");
        }
        return;
      }
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
