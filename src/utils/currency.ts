/**
 * 숫자를 한국어 통화 형식으로 포맷팅합니다.
 * @param amount - 포맷팅할 숫자
 * @returns 포맷팅된 통화 문자열 (예: "15,900")
 */
export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('ko-KR');
};
