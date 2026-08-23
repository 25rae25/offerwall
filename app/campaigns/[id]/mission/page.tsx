"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BackLink from "@/components/common/BackLink";
import EmptyState from "@/components/common/EmptyState";
import MissionAnswer from "@/components/mission/MissionAnswer";
import MissionDone from "@/components/mission/MissionDone";
import MissionGuide from "@/components/mission/MissionGuide";
import { ApiError } from "@/lib/api";
import { useCampaign, useParticipateCampaign } from "@/lib/queries";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";

type Step = "guide" | "answer" | "done";

// 공백이나 대소문자까지 맞추라고 하면 불편하니까 지우고 비교한다
function normalize(value: string) {
  return value.replace(/\s/g, "").toUpperCase();
}

export default function MissionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: campaign, isLoading } = useCampaign(id);
  const participate = useParticipateCampaign(id);

  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);
  const join = useUserStore((s) => s.join);

  const [step, setStep] = useState<Step>("guide");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");

  if (isLoading) {
    return <EmptyState message="불러오는 중..." />;
  }

  const mission = campaign?.mission;
  if (!campaign || !mission) {
    return (
      <EmptyState message="미션이 없는 캠페인이에요">
        <BackLink href={`/campaigns/${id}`} label="캠페인으로" />
      </EmptyState>
    );
  }

  const loginPath = `/login?returnTo=${encodeURIComponent(
    `/campaigns/${id}/mission`
  )}`;

  const submit = () => {
    if (!token) {
      router.push(loginPath);
      return;
    }
    if (normalize(answer) !== normalize(mission.answer)) {
      setError("정답이 아니에요. 입력창에 흐리게 적힌 값을 그대로 넣어보세요.");
      return;
    }

    setError("");
    participate.mutate(token, {
      onSuccess: () => {
        join(campaign);
        setStep("done");
      },
      onError: (err) => {
        if (err instanceof ApiError && err.status === 401) {
          logout();
          router.push(loginPath);
          return;
        }
        setError(err.message);
      },
    });
  };

  return (
    // 배경색은 화면 전체, 내용은 모바일 폭으로 가운데 정렬
    <div
      className="min-h-screen w-full text-center text-white"
      style={{ backgroundColor: mission.bg }}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 pt-14 pb-6">
        {step === "guide" && (
          <MissionGuide
            campaign={campaign}
            mission={mission}
            onNext={() => setStep("answer")}
          />
        )}

        {step === "answer" && (
          <MissionAnswer
            campaign={campaign}
            mission={mission}
            value={answer}
            onChange={setAnswer}
            onPrev={() => setStep("guide")}
            onSubmit={submit}
            error={error}
            pending={participate.isPending}
          />
        )}

        {step === "done" && (
          <MissionDone campaign={campaign} mission={mission} />
        )}
      </div>
    </div>
  );
}
