// ===== 정답 판정 =====
import { toKatakana } from "./kana.js";

/**
 * 입력이 정답과 같은 글자인지 확인합니다.
 * - 앞뒤 공백은 무시합니다.
 * - 히라가나와 가타카나는 같은 글자로 봅니다. (けーき = ケーキ)
 * - 그 외(장음 생략, 로마자 등)는 허용하지 않습니다.
 */
export function isCorrectAnswer(input, answer) {
  return toKatakana(input.trim()) === toKatakana(answer.trim());
}
