import { beforeEach, describe, expect, it, vi } from "vitest";
import { REWARD_DELAY, useUserStore } from "@/store/userStore";
import type { Campaign } from "@/types/campaign";

const campaign = {
  id: "c1",
  title: "토스 앱 설치하고 송금 미션",
  rewardPoint: 5000,
} as Campaign;

function reset() {
  useUserStore.setState({ points: 0, participations: {}, history: [] });
}

describe("useUserStore", () => {
  beforeEach(() => {
    reset();
    vi.useFakeTimers();
  });

  it("참여하면 적립 대기 상태로 들어간다", () => {
    useUserStore.getState().join(campaign);

    const { points, participations } = useUserStore.getState();
    expect(participations["c1"].status).toBe("waiting");
    expect(points).toBe(0); // 아직 적립 전
  });

  it("대기 시간이 지나면 포인트가 적립된다", () => {
    useUserStore.getState().join(campaign);
    vi.advanceTimersByTime(REWARD_DELAY);

    const { points, participations, history } = useUserStore.getState();
    expect(participations["c1"].status).toBe("done");
    expect(points).toBe(5000);
    expect(history).toHaveLength(1);
  });

  // 포인트가 걸린 부분이라 두 번 적립되면 안 된다
  it("같은 캠페인에 두 번 참여해도 한 번만 적립된다", () => {
    useUserStore.getState().join(campaign);
    useUserStore.getState().join(campaign);
    vi.advanceTimersByTime(REWARD_DELAY);

    expect(useUserStore.getState().points).toBe(5000);
    expect(useUserStore.getState().history).toHaveLength(1);
  });

  it("completeReward를 여러 번 불러도 포인트는 한 번만 오른다", () => {
    useUserStore.getState().join(campaign);
    vi.advanceTimersByTime(REWARD_DELAY);

    useUserStore.getState().completeReward("c1");
    useUserStore.getState().completeReward("c1");

    expect(useUserStore.getState().points).toBe(5000);
    expect(useUserStore.getState().history).toHaveLength(1);
  });

  it("참여한 적 없는 캠페인은 적립 처리하지 않는다", () => {
    useUserStore.getState().completeReward("없는캠페인");

    expect(useUserStore.getState().points).toBe(0);
    expect(useUserStore.getState().history).toHaveLength(0);
  });
});
