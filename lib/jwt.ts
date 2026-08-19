import crypto from "crypto";

// 환경변수 우선, 없으면 데모용 기본값 (로컬에서 별도 설정 없이 돌아가도록)
const SECRET = process.env.JWT_SECRET ?? "offerwall-demo-secret";
const EXPIRES_IN = 60 * 60; // 1시간(초)

interface TokenPayload {
  sub: string;
  name: string;
  iat: number;
  exp: number;
}

function base64url(str: string) {
  return Buffer.from(str).toString("base64url");
}

function sign(data: string) {
  return crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
}

export function signToken(user: { sub: string; name: string }) {
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000); // exp는 초 단위
  const payload = base64url(
    JSON.stringify({ ...user, iat: now, exp: now + EXPIRES_IN })
  );
  return `${header}.${payload}.${sign(`${header}.${payload}`)}`;
}

export function verifyToken(token: string): TokenPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;
  if (sign(`${header}.${payload}`) !== signature) return null;

  try {
    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString()
    ) as TokenPayload;
    if (decoded.exp < Math.floor(Date.now() / 1000)) return null;
    return decoded;
  } catch {
    return null;
  }
}
