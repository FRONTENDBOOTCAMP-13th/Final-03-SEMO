/**
 * 계정 설정 페이지의 유효성 검사 유틸리티
 */

// 닉네임 유효성 검사
export const validateNickname = (value: string): string => {
  if (value.trim().length === 0) {
    return "닉네임을 입력해주세요.";
  }

  if (value.trim().length < 2) {
    return "닉네임은 최소 2글자 이상이어야 합니다.";
  }

  if (value.trim().length > 10) {
    return "닉네임은 최대 10글자까지 입력 가능합니다.";
  }

  return "";
};

// 계좌번호 유효성 검사
export const validateAccountNumber = (value: string): string => {
  if (value.length === 0) {
    return "";
  }

  // 숫자가 아닌 문자가 포함되어 있는지 확인
  if (!/^\d+$/.test(value)) {
    return "숫자만 입력해주세요.";
  }

  if (value.length < 10) {
    return "계좌번호는 최소 10자리 이상이어야 합니다.";
  }

  if (value.length > 14) {
    return "계좌번호는 최대 14자리까지 입력 가능합니다.";
  }

  return "";
};

// 은행 선택 유효성 검사
export const validateBankSelection = (bank: string): string => {
  if (bank === "은행사") {
    return "은행을 선택해주세요.";
  }
  return "";
};
