// 로딩, 에러, 빈 목록처럼 내용 대신 한 줄 안내가 나가는 자리
export default function EmptyState({
  message,
  children,
}: {
  message: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="py-16 text-center">
      <p className="text-sm text-gray-500">{message}</p>
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
