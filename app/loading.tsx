import EmptyState from "@/components/common/EmptyState";

// 라우트가 준비되는 동안 Next가 이 화면을 대신 보여준다 (자동 Suspense 경계)
export default function Loading() {
  return <EmptyState message="불러오는 중..." />;
}
