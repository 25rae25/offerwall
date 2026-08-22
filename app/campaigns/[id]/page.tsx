"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ApiError } from "@/lib/api";
import { useCampaign, useParticipateCampaign } from "@/lib/queries";
import { useAuthStore } from "@/store/authStore";
import { REWARD_DELAY, useUserStore } from "@/store/userStore";
import { CATEGORY_LABEL } from "@/types/campaign";

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: campaign, isLoading, isError } = useCampaign(id);
  const participate = useParticipateCampaign(id);
  const [participateError, setParticipateError] = useState("");

  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);
  const join = useUserStore((s) => s.join);
  const completeReward = useUserStore((s) => s.completeReward);
  const participation = useUserStore((s) => s.participations[id]);

  // 새로고침하면 join에서 걸어둔 타이머가 사라지므로
  // 대기 중인 건은 남은 시간만큼 다시 타이머를 걸어준다
  useEffect(() => {
    if (participation?.status !== "waiting") return;
    const elapsed = Date.now() - new Date(participation.joinedAt).getTime();
    const remain = Math.max(REWARD_DELAY - elapsed, 0);
    const timer = setTimeout(() => completeReward(id), remain);
    return () => clearTimeout(timer);
  }, [participation, id, completeReward]);

  if (isLoading) {
    return (
      <p className="py-20 text-center text-sm text-gray-400">불러오는 중...</p>
    );
  }

  if (isError || !campaign) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-gray-500">캠페인을 찾을 수 없어요</p>
        <Link
          href="/"
          className="mt-3 inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm text-white"
        >
          목록으로
        </Link>
      </div>
    );
  }

  const soldOut = campaign.remainingQuantity === 0;
  const status = participation?.status;

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-6">
      <Link href="/" className="text-sm text-gray-400">
        ← 목록으로
      </Link>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-3xl">
          {campaign.emoji}
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-gray-500">
              {CATEGORY_LABEL[campaign.category]}
            </span>
            {campaign.advertiser}
          </div>
          <h1 className="mt-1 text-lg font-bold">{campaign.title}</h1>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-xl bg-orange-50 px-4 py-3">
        <span className="text-sm text-gray-600">적립 포인트</span>
        <span className="text-xl font-bold text-orange-500">
          +{campaign.rewardPoint.toLocaleString()}P
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl bg-gray-100 px-3 py-2.5">
          <p className="text-xs text-gray-400">남은 수량</p>
          <p className="mt-0.5 font-medium">
            {soldOut ? "소진" : `${campaign.remainingQuantity.toLocaleString()}개`}
          </p>
        </div>
        <div className="rounded-xl bg-gray-100 px-3 py-2.5">
          <p className="text-xs text-gray-400">마감일</p>
          <p className="mt-0.5 font-medium">
            {new Date(campaign.deadline).toLocaleDateString("ko-KR")}
          </p>
        </div>
      </div>

      <section className="mt-6">
        <h2 className="font-semibold">캠페인 안내</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          {campaign.description}
        </p>
      </section>

      <section className="mt-6">
        <h2 className="font-semibold">참여 방법</h2>
        <ol className="mt-2 space-y-1.5 text-sm text-gray-600">
          {campaign.steps.map((step, i) => (
            <li key={i}>
              {i + 1}. {step}
            </li>
          ))}
        </ol>
      </section>

      {status === "waiting" && (
        <div className="mt-6 rounded-xl bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
          미션 완료를 확인하고 있어요. 확인되면 자동으로 적립됩니다.
        </div>
      )}

      {participateError && (
        <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-500">
          {participateError}
        </p>
      )}

      <button
        onClick={() => {
          // 참여는 로그인한 유저만 — 로그인 후 이 캠페인으로 돌아오도록 returnTo를 들려 보낸다
          if (!token) {
            router.push(
              `/login?returnTo=${encodeURIComponent(`/campaigns/${id}`)}`
            );
            return;
          }

          // 미션이 있는 캠페인은 미션 화면에서 적립까지 처리한다
          if (campaign.mission) {
            router.push(`/campaigns/${id}/mission`);
            return;
          }

          setParticipateError("");
          participate.mutate(token, {
            // 서버가 참여를 확정한 뒤에만 적립 대기 흐름을 시작한다
            onSuccess: () => join(campaign),
            onError: (err) => {
              // 토큰 만료/위조면 다시 로그인부터
              if (err instanceof ApiError && err.status === 401) {
                logout();
                router.push(
                  `/login?returnTo=${encodeURIComponent(`/campaigns/${id}`)}`
                );
                return;
              }
              setParticipateError(err.message);
            },
          });
        }}
        disabled={soldOut || !!status || participate.isPending}
        className={`mt-6 w-full rounded-xl py-3.5 font-semibold ${
          soldOut
            ? "bg-gray-200 text-gray-400"
            : status === "done"
              ? "bg-gray-100 text-gray-400"
              : status === "waiting"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-orange-500 text-white"
        }`}
      >
        {soldOut
          ? "소진된 캠페인이에요"
          : status === "done"
            ? "적립 완료"
            : status === "waiting"
              ? "적립 대기 중..."
              : participate.isPending
                ? "참여 처리 중..."
                : campaign.mission
                  ? "미션 시작하기"
                  : `참여하고 ${campaign.rewardPoint.toLocaleString()}P 받기`}
      </button>
    </main>
  );
}
