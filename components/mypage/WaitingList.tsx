import type { Participation } from "@/store/userStore";

export default function WaitingList({ items }: { items: Participation[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mt-6">
      <h2 className="font-semibold">적립 대기 중</h2>
      <ul className="mt-2 space-y-2">
        {items.map((p) => (
          <li
            key={p.campaignId}
            className="flex items-center justify-between rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3"
          >
            <span className="text-sm">{p.title}</span>
            <span className="shrink-0 text-xs font-medium text-yellow-600">
              확인 중
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
