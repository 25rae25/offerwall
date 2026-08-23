"use client";

import { useEffect, useState } from "react";
import type { Campaign, Mission } from "@/types/campaign";

export default function MissionGuide({
  campaign,
  mission,
  onNext,
}: {
  campaign: Campaign;
  mission: Mission;
  onNext: () => void;
}) {
  // 참여 방법을 한 줄씩 올리려고 마운트된 뒤에 켠다
  const [shown, setShown] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- 등장 애니메이션 시작용
  useEffect(() => setShown(true), []);

  return (
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
      <h1 className="mt-4 text-xl font-extrabold" style={{ color: mission.point }}>
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
        onClick={onNext}
        className="mt-auto flex h-14 w-full items-center justify-between rounded-xl bg-white px-4 font-bold"
        style={{ color: mission.bg }}
      >
        참여방법 보기<span>→</span>
      </button>
    </>
  );
}
