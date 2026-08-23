export default function PointSummary({
  points,
  count,
}: {
  points: number;
  count: number;
}) {
  return (
    <div className="mt-4 rounded-xl bg-orange-500 p-5 text-white">
      <p className="text-sm text-orange-100">보유 포인트</p>
      <p className="mt-1 text-3xl font-bold">{points.toLocaleString()}P</p>
      <p className="mt-2 text-xs text-orange-100">
        지금까지 {count}건 적립했어요
      </p>
    </div>
  );
}
