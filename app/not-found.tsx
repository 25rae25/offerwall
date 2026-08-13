import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-xl px-4 py-6">
      <div className="py-24 text-center">
        <p className="text-5xl font-bold text-gray-300">404</p>
        <p className="mt-3 text-sm text-gray-500">페이지를 찾을 수 없어요</p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm text-white"
        >
          목록으로
        </Link>
      </div>
    </main>
  );
}
