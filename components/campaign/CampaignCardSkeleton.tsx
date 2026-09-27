// 목록을 불러오는 동안 카드 자리를 잡아둔다 (CampaignCard와 같은 높이/여백)
export default function CampaignCardSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
      <div className="h-12 w-12 shrink-0 rounded-full bg-gray-100" />

      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-3 w-24 rounded bg-gray-100" />
        <div className="h-4 w-40 rounded bg-gray-100" />
        <div className="h-3 w-32 rounded bg-gray-100" />
      </div>

      <div className="shrink-0 space-y-2">
        <div className="h-4 w-16 rounded bg-gray-100" />
        <div className="ml-auto h-3 w-8 rounded bg-gray-100" />
      </div>
    </div>
  );
}
