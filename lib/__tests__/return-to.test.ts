import { describe, expect, it } from "vitest";
import { resolveReturnTo } from "@/lib/return-to";

describe("resolveReturnTo", () => {
  it("내부 경로는 그대로 돌려준다", () => {
    expect(resolveReturnTo("/campaigns/c1")).toBe("/campaigns/c1");
    expect(resolveReturnTo("/campaigns/c1/mission")).toBe("/campaigns/c1/mission");
  });

  it("값이 없으면 마이페이지로 보낸다", () => {
    expect(resolveReturnTo(null)).toBe("/mypage");
    expect(resolveReturnTo("")).toBe("/mypage");
  });

  // 여기가 이 함수를 만든 이유다. 로그인 후 외부 사이트로 튕기면 피싱에 쓰인다
  it("외부 주소는 막는다", () => {
    expect(resolveReturnTo("https://evil.com")).toBe("/mypage");
    expect(resolveReturnTo("http://evil.com")).toBe("/mypage");
  });

  it("//로 시작하는 주소도 막는다", () => {
    // 브라우저는 //evil.com 을 https://evil.com 으로 해석한다
    expect(resolveReturnTo("//evil.com")).toBe("/mypage");
    expect(resolveReturnTo("//evil.com/login")).toBe("/mypage");
  });
});
