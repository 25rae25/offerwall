// returnTo는 내부 경로만 허용 (오픈 리다이렉트 방지)
// "//evil.com"은 브라우저가 외부 도메인으로 해석하므로 "/" 하나로 시작하는 것만 통과
export function resolveReturnTo(returnTo: string | null) {
  if (returnTo && returnTo.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }
  return "/mypage";
}
