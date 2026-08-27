// 가입 검증 규칙. 프론트와 API가 같은 기준을 봐야 해서 여기 한 곳에 둔다
export const USER_ID_MIN_LENGTH = 3;

export const EMAIL_REGEX = /^[\w.-]+@[\w-]+(\.[\w-]+)+$/;

// 영문/숫자/특수문자를 모두 포함한 8~16자
export const PASSWORD_REGEX =
  /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^*+=-]).{8,16}$/;

export const VALIDATION_MESSAGE = {
  userId: "아이디는 3자 이상 입력해 주세요.",
  email: "이메일 형식이 올바르지 않습니다. 다시 확인해 주세요.",
  password: "영문, 숫자, 특수문자를 조합해 8자 이상 입력해 주세요.",
  passwordConfirm: "비밀번호가 일치하지 않습니다.",
};
