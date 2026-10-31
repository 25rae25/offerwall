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
