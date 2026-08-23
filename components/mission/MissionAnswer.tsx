"use client";

import type { Campaign, Mission } from "@/types/campaign";

export default function MissionAnswer({
  campaign,
  mission,
  value,
  onChange,
  onPrev,
  onSubmit,
  error,
  pending,
}: {
  campaign: Campaign;
  mission: Mission;
  value: string;
  onChange: (value: string) => void;
  onPrev: () => void;
  onSubmit: () => void;
  error: string;
  pending: boolean;
}) {
  return (
    <>
      <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-xl bg-white text-5xl">
        {campaign.emoji}
      </div>
      <h1 className="mt-4 text-xl font-extrabold" style={{ color: mission.point }}>
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={mission.answer}
          className="mt-2 h-12 w-full rounded-xl border-2 border-gray-300 bg-white text-center"
        />
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

        <div className="mt-4 flex gap-2">
          <button
            onClick={onPrev}
            className="h-14 flex-1 rounded-xl border-2 border-gray-300 text-gray-400"
          >
            이전
          </button>
          <button
            onClick={onSubmit}
            disabled={pending}
            className="h-14 flex-[2] rounded-xl font-bold text-white"
            style={{ backgroundColor: mission.bg }}
          >
            {pending ? "처리 중..." : "적립 받기"}
          </button>
        </div>
      </div>
    </>
  );
}
