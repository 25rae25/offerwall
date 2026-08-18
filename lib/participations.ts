// DB 대신 쓰는 인메모리 참여 저장소 — "누가 어떤 캠페인에 참여했나"를 서버가 기억한다.
// 서버가 재시작되면 초기화된다 (목업 백엔드의 의도된 한계)
const participations = new Map<string, Set<string>>();

export function hasParticipated(userId: string, campaignId: string) {
  return participations.get(userId)?.has(campaignId) ?? false;
}

export function addParticipation(userId: string, campaignId: string) {
  let joined = participations.get(userId);
  if (!joined) {
    joined = new Set();
    participations.set(userId, joined);
  }
  joined.add(campaignId);
}
