// ===== 문장을 사전 단어 단위로 나누기 =====
import { DICTIONARY } from "../data/dictionary.js";

// 긴 단어부터 먼저 찾도록 정렬 (예: "飲みました"가 "飲み"보다 먼저)
const WORDS_LONGEST_FIRST = Object.keys(DICTIONARY).sort((a, b) => b.length - a.length);

/**
 * 문장을 조각으로 나눕니다.
 * 사전에 있는 단어는 { text, isWord: true }, 나머지 글자는 한 글자씩 { text, isWord: false }.
 * 화면에서 isWord 조각에 점선 밑줄을 긋고, 탭하면 뜻을 보여줍니다.
 */
export function splitIntoWords(sentence) {
  const pieces = [];
  let i = 0;
  while (i < sentence.length) {
    const word = WORDS_LONGEST_FIRST.find((w) => sentence.startsWith(w, i));
    if (word) {
      pieces.push({ text: word, isWord: true });
      i += word.length;
    } else {
      pieces.push({ text: sentence[i], isWord: false });
      i++;
    }
  }
  return pieces;
}
