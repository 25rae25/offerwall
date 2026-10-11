import { describe, expect, it, vi } from "vitest";
import { signToken, verifyToken } from "@/lib/jwt";

describe("signToken / verifyToken", () => {
  it("발급한 토큰은 검증을 통과하고 payload를 돌려준다", () => {
    const token = signToken({ sub: "demo", name: "데모유저" });
    const payload = verifyToken(token);

    expect(payload?.sub).toBe("demo");
    expect(payload?.name).toBe("데모유저");
  });

  it("점 세 조각이 아니면 거부한다", () => {
    expect(verifyToken("")).toBeNull();
    expect(verifyToken("abc")).toBeNull();
    expect(verifyToken("header.payload")).toBeNull();
  });

  // 서명 검증이 실제로 동작하는지 확인하는 부분
  it("payload를 바꿔치기하면 서명이 안 맞아 거부한다", () => {
    const token = signToken({ sub: "demo", name: "데모유저" });
    const [header, , signature] = token.split(".");

    // 남의 계정으로 바꿔서 토큰을 위조해본다
    const forged = Buffer.from(
      JSON.stringify({
        sub: "admin",
        name: "관리자",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      })
    ).toString("base64url");

    expect(verifyToken(`${header}.${forged}.${signature}`)).toBeNull();
  });

  it("서명만 바꿔도 거부한다", () => {
    const [header, payload] = signToken({ sub: "demo", name: "데모" }).split(".");
    expect(verifyToken(`${header}.${payload}.aaaa`)).toBeNull();
  });

  it("만료 시간이 지나면 거부한다", () => {
    const token = signToken({ sub: "demo", name: "데모" });

    // 발급 2시간 뒤로 시계를 돌린다 (만료는 1시간)
    vi.useFakeTimers();
    vi.setSystemTime(Date.now() + 2 * 60 * 60 * 1000);
    expect(verifyToken(token)).toBeNull();
    vi.useRealTimers();
  });
});
