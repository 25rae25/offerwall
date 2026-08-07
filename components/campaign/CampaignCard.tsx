import Link from "next/link";
import { CATEGORY_LABEL, type Campaign } from "@/types/campaign";

function dday(deadline: string) {
  const diff = Math.ceil(
    (+new Date(deadline) - Date.now()) / (1000 * 60 * 60 * 24)
  );
  return diff <= 0 ? "오늘 마감" : `D-${diff}`;
}

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
  const soldOut = campaign.remainingQuantity === 0;

  return (
    <Link
      href={`/campaigns/${campaign.id}`}
      className={`flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 ${
        soldOut ? "opacity-50" : ""
      }`}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-50 text-2xl">
        {campaign.emoji}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-500">
            {CATEGORY_LABEL[campaign.category]}
          </span>
          <span className="text-xs text-gray-400">{campaign.advertiser}</span>
        </div>
        <p className="mt-1 truncate font-medium">{campaign.title}</p>
        <p className="mt-0.5 truncate text-xs text-gray-500">
          {campaign.summary}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p className="font-bold text-orange-500">
          +{campaign.rewardPoint.toLocaleString()}P
        </p>
        <p className="mt-1 text-xs text-gray-400">
          {soldOut ? "소진" : dday(campaign.deadline)}
        </p>
      </div>
    </Link>
  );
}
