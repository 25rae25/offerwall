import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Campaign } from "@/types/campaign";

export type ParticipationStatus = "waiting" | "done";

export interface Participation {
  campaignId: string;
  title: string;
  rewardPoint: number;
  status: ParticipationStatus;
  joinedAt: string;
}

export interface PointHistory {
  id: string;
  title: string;
  point: number;
  createdAt: string;
}

// 광고주 확인(포스트백)까지 걸리는 시간을 타이머로 흉내냄
export const REWARD_DELAY = 5000;

interface UserState {
  points: number;
  participations: Record<string, Participation>;
  history: PointHistory[];
  join: (campaign: Campaign) => void;
  completeReward: (campaignId: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      points: 0,
      participations: {},
      history: [],

      join: (campaign) => {
        if (get().participations[campaign.id]) return; // 중복 참여 방지

        set((state) => ({
          participations: {
            ...state.participations,
            [campaign.id]: {
              campaignId: campaign.id,
              title: campaign.title,
              rewardPoint: campaign.rewardPoint,
              status: "waiting",
              joinedAt: new Date().toISOString(),
            },
          },
        }));

        setTimeout(() => get().completeReward(campaign.id), REWARD_DELAY);
      },

      completeReward: (campaignId) => {
        const target = get().participations[campaignId];
        if (!target || target.status === "done") return; // 이미 적립된 건 무시

        set((state) => ({
          points: state.points + target.rewardPoint,
          participations: {
            ...state.participations,
            [campaignId]: { ...target, status: "done" },
          },
          history: [
            {
              id: crypto.randomUUID(),
              title: target.title,
              point: target.rewardPoint,
              createdAt: new Date().toISOString(),
            },
            ...state.history,
          ],
        }));
      },
    }),
    { name: "offerwall-user" }
  )
);
