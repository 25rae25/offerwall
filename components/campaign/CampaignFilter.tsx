"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  CATEGORY_LABEL,
  SORT_LABEL,
  type CampaignCategory,
  type CampaignSort,
} from "@/types/campaign";

const categories = Object.keys(CATEGORY_LABEL) as CampaignCategory[];
const sorts = Object.keys(SORT_LABEL) as CampaignSort[];

export default function CampaignFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get("category");
  const sort = searchParams.get("sort") ?? "latest";

  // 필터 상태는 URL 쿼리로 관리 -> 새로고침해도 유지됨
  const setParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    const query = params.toString();
    router.replace(query ? `/?${query}` : "/", { scroll: false });
  };

  const chipStyle = (active: boolean) =>
    `shrink-0 rounded-full px-3 py-1.5 text-sm ${
      active
        ? "bg-gray-900 text-white"
        : "border border-gray-200 bg-white text-gray-600"
    }`;

  return (
    <div className="mt-5 space-y-3">
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          className={chipStyle(category === null)}
          onClick={() => setParam("category", null)}
        >
          전체
        </button>
        {categories.map((c) => (
          <button
            key={c}
            className={chipStyle(category === c)}
            onClick={() => setParam("category", c)}
          >
            {CATEGORY_LABEL[c]}
          </button>
        ))}
      </div>

      <select
        value={sort}
        onChange={(e) =>
          setParam("sort", e.target.value === "latest" ? null : e.target.value)
        }
        className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm"
      >
        {sorts.map((s) => (
          <option key={s} value={s}>
            {SORT_LABEL[s]}
          </option>
        ))}
      </select>
    </div>
  );
}
