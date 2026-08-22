"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ApiError } from "@/lib/api";
import { useCampaign, useParticipateCampaign } from "@/lib/queries";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";

type Step = "guide" | "answer" | "done";

// 공백이나 대소문자까지 맞추라고 하면 불편하니까 지우고 비교한다
function normalize(value: string) {
  return value.replace(/\s/g, "").toUpperCase();
}

export default function MissionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: campaign, isLoading } = useCampaign(id);
  const participate = useParticipateCampaign(id);

  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);
  const join = useUserStore((s) => s.join);

  const [step, setStep] = useState<Step>("guide");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");

  // 참여 방법을 한 줄씩 올리려고 마운트된 뒤에 켠다
  const [shown, setShown] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- 등장 애니메이션 시작용
  useEffect(() => setShown(true), []);

  if (isLoading) {
    return (
      <p className="py-20 text-center text-sm text-gray-400">불러오는 중...</p>
    );
  }

  const mission = campaign?.mission;
  if (!campaign || !mission) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-gray-500">미션이 없는 캠페인이에요</p>
        <Link
          href={`/campaigns/${id}`}
          className="mt-3 inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm text-white"
        >
          캠페인으로
        </Link>
      </div>
    );
  }

  const loginPath = `/login?returnTo=${encodeURIComponent(
    `/campaigns/${id}/mission`
  )}`;

  const submit = () => {
    if (!token) {
      router.push(loginPath);
      return;
    }
    if (normalize(answer) !== normalize(mission.answer)) {
      setError("정답이 아니에요. 입력창에 흐리게 적힌 값을 그대로 넣어보세요.");
      return;
    }

    setError("");
    participate.mutate(token, {
      onSuccess: () => {
        join(campaign);
        setStep("done");
      },
      onError: (err) => {
        if (err instanceof ApiError && err.status === 401) {
          logout();
          router.push(loginPath);
          return;
        }
        setError(err.message);
      },
    });
  };

  return (
    <div
      className="flex min-h-screen w-full flex-col px-6 pt-14 pb-6 text-center text-white"
      style={{ backgroundColor: mission.bg }}
    >
      {step === "guide" && (
        <>
          <div className="relative">
            <p className="absolute -top-5 left-1/2 -translate-x-1/2 text-4xl font-bold tracking-widest opacity-15">
              MISSION
            </p>
            <span className="relative mx-auto block w-28 rounded-full border border-white bg-black py-1.5 font-bold">
              선착순
            </span>
          </div>

          <div className="mx-auto mt-8 flex h-28 w-28 items-center justify-center rounded-xl bg-white text-5xl">
            {campaign.emoji}
          </div>

          <p
            className="mt-4 rounded-xl bg-white py-4 text-lg font-bold"
            style={{ color: mission.bg }}
          >
            📍 {campaign.advertiser}
          </p>
          <p className="mt-3 text-2xl font-bold">
            +{campaign.rewardPoint.toLocaleString()}P
          </p>
          <h1
            className="mt-4 text-xl font-extrabold"
            style={{ color: mission.point }}
          >
            {campaign.title}
          </h1>

          <ol className="mt-7 space-y-5 text-left">
            {campaign.steps.map((text, i) => (
              <li
                key={text}
                className={`flex items-center gap-2 text-sm transition duration-500 ${
                  shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                  {i + 1}
                </span>
                {text}
              </li>
            ))}
          </ol>

          <button
            onClick={() => setStep("answer")}
            className="mt-auto flex h-14 w-full items-center justify-between rounded-xl bg-white px-4 font-bold"
            style={{ color: mission.bg }}
          >
            참여방법 보기<span>→</span>
          </button>
        </>
      )}

      {step === "answer" && (
        <>
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-xl bg-white text-5xl">
            {campaign.emoji}
          </div>
          <h1
            className="mt-4 text-xl font-extrabold"
            style={{ color: mission.point }}
          >
            {mission.head}
          </h1>
          <p className="mt-4 rounded-xl bg-black/20 p-4 text-sm leading-relaxed whitespace-pre-line">
            {mission.guide}
          </p>
          <a
            href={mission.landingUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex h-14 items-center justify-center rounded-xl font-bold"
            style={{ backgroundColor: mission.point, color: mission.bg }}
          >
            {campaign.advertiser} 페이지 열기 ↗
          </a>

          <div className="-mx-6 -mb-6 mt-auto rounded-t-3xl bg-gray-100 p-6 text-left text-gray-700">
            <h2 className="font-semibold">{mission.label}</h2>
            <input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={mission.answer}
              className="mt-2 h-12 w-full rounded-xl border-2 border-gray-300 bg-white text-center"
            />
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setStep("guide")}
                className="h-14 flex-1 rounded-xl border-2 border-gray-300 text-gray-400"
              >
                이전
              </button>
              <button
                onClick={submit}
                disabled={participate.isPending}
                className="h-14 flex-[2] rounded-xl font-bold text-white"
                style={{ backgroundColor: mission.bg }}
              >
                {participate.isPending ? "처리 중..." : "적립 받기"}
              </button>
            </div>
          </div>
        </>
      )}

      {step === "done" && (
        <div className="flex flex-1 flex-col items-center justify-center pb-16">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full text-4xl font-bold"
            style={{ backgroundColor: mission.point, color: mission.bg }}
          >
            ✓
          </div>
          <p className="mt-6 text-xl font-extrabold">미션 완료!</p>
          <p
            className="mt-2 text-4xl font-extrabold"
            style={{ color: mission.point }}
          >
            +{campaign.rewardPoint.toLocaleString()}P
          </p>
          <p className="mt-4 text-sm opacity-75">
            광고주 확인 후 적립됩니다.
            <br />
            잠시 뒤 마이페이지에 반영돼요.
          </p>
          <Link
            href="/mypage"
            className="mt-8 rounded-xl bg-white px-6 py-3 font-bold"
            style={{ color: mission.bg }}
          >
            마이페이지에서 확인
          </Link>
        </div>
      )}
    </div>
  );
}
