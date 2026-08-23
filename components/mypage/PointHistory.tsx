import Link from "next/link";
import EmptyState from "@/components/common/EmptyState";
import type { PointHistory as History } from "@/store/userStore";

export default function PointHistory({ items }: { items: History[] }) {
  return (
    <section className="mt-6">
      <h2 className="font-semibold">포인트 내역</h2>

      {items.length === 0 ? (
        <EmptyState message="아직 적립 내역이 없어요">
          <Link
            href="/"
            className="inline-block rounded-lg bg-orange-500 px-4 py-2 text-sm text-white"
          >
            캠페인 보러가기
          </Link>
        </EmptyState>
      ) : (
        <ul className="mt-2 divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
          {items.map((h) => (
            <li
              key={h.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <div>
                <p className="text-sm">{h.title}</p>
                <p className="mt-0.5 text-xs text-gray-400">
                  {new Date(h.createdAt).toLocaleString("ko-KR")}
                </p>
              </div>
              <span className="text-sm font-bold text-orange-500">
                +{h.point.toLocaleString()}P
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
