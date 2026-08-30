"use client";

import { useEffect } from "react";
import Link from "next/link";

// 렌더링 중 에러가 나면 Next가 이 화면으로 대체한다 (error.tsx는 클라이언트 컴포넌트여야 함)
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // 사용자에게는 원인을 숨기고, 개발 중에는 콘솔로 확인한다
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-6">
      <div className="py-24 text-center">
        <p className="text-5xl font-bold text-gray-300">!</p>
        <p className="mt-3 text-sm text-gray-500">문제가 생겼어요</p>
        <p className="mt-1 text-xs text-gray-400">
          잠시 후 다시 시도해주세요
        </p>

        <div className="mt-4 flex justify-center gap-2">
          {/* reset은 에러가 난 구간만 다시 렌더한다 (새로고침이 아님) */}
          <button
            onClick={reset}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white"
          >
            다시 시도
          </button>
          <Link
            href="/"
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600"
          >
            목록으로
          </Link>
        </div>
      </div>
    </main>
  );
}
