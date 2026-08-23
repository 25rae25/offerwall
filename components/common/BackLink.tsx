import Link from "next/link";

export default function BackLink({
  href = "/",
  label = "목록으로",
}: {
  href?: string;
  label?: string;
}) {
  return (
    <Link href={href} className="text-sm text-gray-400">
      ← {label}
    </Link>
  );
}
