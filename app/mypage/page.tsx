"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { REWARD_DELAY, useUserStore } from "@/store/userStore";

export default function MyPage() {
  const points = useUserStore((s) => s.points);
  const participations = useUserStore((s) => s.participations);
  const history = useUserStore((s) => s.history);
  const completeReward = useUserStore((s) => s.completeReward);

  // localStorage에서 복원한 값은 서버가 그린 HTML과 다를 수 있어서
  // 마운트 후에만 실제 값을 보여준다 (hydration 불일치 방지)
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR 불일치 방지용 마운트 체크
  useEffect(() => setMounted(true), []);

  // 대기 중인 건이 있으면 남은 시간만큼 타이머를 걸어준다
  // (상세 페이지를 다시 안 들어와도 적립되도록)
  useEffect(() => {
    const timers = Object.values(participations)
      .filter((p) => p.status === "waiting")
      .map((p) => {
        const elapsed = Date.now() - new Date(p.joinedAt).getTime();
        return setTimeout(
          () => completeReward(p.campaignId),
          Math.max(REWARD_DELAY - elapsed, 0)
        );
      });
    return () => timers.forEach(clearTimeout);
  }, [participations, completeReward]);

  if (!mounted) return null;

  const waiting = Object.values(participations).filter(
    (p) => p.status === "waiting"
  );

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-6">
      <Link href="/" className="text-sm text-gray-400">
        ← 목록으로
      </Link>
      <h1 className="mt-3 text-xl font-bold">마이페이지</h1>

      <div className="mt-4 rounded-xl bg-orange-500 p-5 text-white">
        <p className="text-sm text-orange-100">보유 포인트</p>
        <p className="mt-1 text-3xl font-bold">{points.toLocaleString()}P</p>
        <p className="mt-2 text-xs text-orange-100">
          지금까지 {history.length}건 적립했어요
        </p>
      </div>

      {waiting.length > 0 && (
        <section className="mt-6">
          <h2 className="font-semibold">적립 대기 중</h2>
          <ul className="mt-2 space-y-2">
            {waiting.map((p) => (
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
      )}

      <section className="mt-6">
        <h2 className="font-semibold">포인트 내역</h2>
        {history.length === 0 ? (
          <div className="py-14 text-center">
            <p className="text-sm text-gray-400">아직 적립 내역이 없어요</p>
            <Link
              href="/"
              className="mt-3 inline-block rounded-lg bg-orange-500 px-4 py-2 text-sm text-white"
            >
              캠페인 보러가기
            </Link>
          </div>
        ) : (
          <ul className="mt-2 divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
            {history.map((h) => (
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
    </main>
  );
}
