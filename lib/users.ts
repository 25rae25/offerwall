// DB 대신 쓰는 인메모리 유저 저장소.
// 서버가 재시작되면 가입한 계정은 사라진다 (데모 계정은 코드에 있어 항상 유지)
interface User {
  userId: string;
  email: string;
  password: string;
  name: string;
}

const users = new Map<string, User>([
  [
    "demo",
    { userId: "demo", email: "demo@offerwall.dev", password: "1234", name: "데모유저" },
  ],
]);

export function findUser(userId: string) {
  return users.get(userId);
}

export function userExists(userId: string) {
  return users.has(userId);
}

export function createUser(userId: string, email: string, password: string) {
  // 별도 닉네임 없이 아이디를 표시 이름으로 쓴다
  const user = { userId, email, password, name: userId };
  users.set(userId, user);
  return user;
}
