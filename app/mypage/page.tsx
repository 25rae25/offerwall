"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BackLink from "@/components/common/BackLink";
import PointHistory from "@/components/mypage/PointHistory";
import PointSummary from "@/components/mypage/PointSummary";
import WaitingList from "@/components/mypage/WaitingList";
import { useAuthStore } from "@/store/authStore";
import { REWARD_DELAY, useUserStore } from "@/store/userStore";

export default function MyPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const name = useAuthStore((s) => s.name);
  const logout = useAuthStore((s) => s.logout);

  const points = useUserStore((s) => s.points);
  const participations = useUserStore((s) => s.participations);
  const history = useUserStore((s) => s.history);
  const completeReward = useUserStore((s) => s.completeReward);

  // localStorage에서 복원한 값은 서버가 그린 HTML과 다를 수 있어서
  // 마운트 후에만 실제 값을 보여준다 (hydration 불일치 방지)
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR 불일치 방지용 마운트 체크
  useEffect(() => setMounted(true), []);

  // 로그인 필수 페이지 — 비로그인이면 로그인 화면으로
  useEffect(() => {
    if (!mounted) return;
    if (!token) {
      router.replace("/login?returnTo=/mypage");
      return;
    }
    // 토큰이 위조되거나 만료됐을 수 있으니 서버에서 검증
    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (!res.ok) logout(); // 토큰이 지워지면 이 effect가 다시 돌아 로그인으로 보냄
    });
  }, [mounted, token, router, logout]);

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

  if (!mounted || !token) return null;

  const waiting = Object.values(participations).filter(
    (p) => p.status === "waiting"
  );

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-6">
      <BackLink />
      <div className="mt-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">{name}님</h1>
        <button
          onClick={logout} // 토큰이 지워지면 위 가드가 로그인 화면으로 보낸다
          className="text-sm text-gray-400"
        >
          로그아웃
        </button>
      </div>

      <PointSummary points={points} count={history.length} />

      <WaitingList items={waiting} />

      <PointHistory items={history} />
    </main>
  );
}
