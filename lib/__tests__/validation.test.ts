import { describe, expect, it } from "vitest";
import { EMAIL_REGEX, PASSWORD_REGEX, USER_ID_MIN_LENGTH } from "@/lib/validation";

describe("EMAIL_REGEX", () => {
  it.each(["a@b.com", "user.name@example.co.kr", "user-1@sub.domain.net"])(
    "통과: %s",
    (email) => expect(EMAIL_REGEX.test(email)).toBe(true)
  );

  it.each(["notmail", "a@b", "@b.com", "a b@c.com", ""])(
    "거부: %s",
    (email) => expect(EMAIL_REGEX.test(email)).toBe(false)
  );
});

describe("PASSWORD_REGEX", () => {
  it.each(["abcd1234!", "Pass12#word", "a1!bcdefg"])(
    "영문+숫자+특수문자 8~16자는 통과: %s",
    (pw) => expect(PASSWORD_REGEX.test(pw)).toBe(true)
  );

  it("8자 미만은 거부한다", () => {
    expect(PASSWORD_REGEX.test("ab1!")).toBe(false);
  });

  it("16자를 넘으면 거부한다", () => {
    expect(PASSWORD_REGEX.test("abcdefghij12345!!")).toBe(false);
  });

  it.each([
    ["숫자 없음", "abcdefg!"],
    ["특수문자 없음", "abcdefg1"],
    ["영문 없음", "12345678!"],
  ])("%s이면 거부한다", (_, pw) => {
    expect(PASSWORD_REGEX.test(pw)).toBe(false);
  });
});

describe("USER_ID_MIN_LENGTH", () => {
  it("아이디 최소 길이는 3자다", () => {
    expect(USER_ID_MIN_LENGTH).toBe(3);
  });
});
