import Link from "next/link";
import type { Campaign, Mission } from "@/types/campaign";

export default function MissionDone({
  campaign,
  mission,
}: {
  campaign: Campaign;
  mission: Mission;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center pb-16">
      <div
        className="flex h-20 w-20 items-center justify-center rounded-full text-4xl font-bold"
        style={{ backgroundColor: mission.point, color: mission.bg }}
      >
        ✓
      </div>
      <p className="mt-6 text-xl font-extrabold">미션 완료!</p>
      <p className="mt-2 text-4xl font-extrabold" style={{ color: mission.point }}>
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
  );
}
