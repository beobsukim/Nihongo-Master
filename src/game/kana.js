// ===== 가나(히라가나·가타카나) 처리 =====

/** 히라가나 → 가타카나 (유니코드에서 정확히 96칸 차이) */
export function toKatakana(text) {
  return text.replace(/[ぁ-ゖ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) + 96));
}

/** 가타카나 → 히라가나 */
export function toHiragana(text) {
  return text.replace(/[ァ-ヶ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 96));
}

const isKatakana = (ch) => /[ァ-ヶ]/.test(ch);

/**
 * 자판 배열: 10개 열(あ행 ~ わ행) × 5개 줄(あ·い·う·え·お 단).
 * 빈 문자열("")은 빈 자리입니다. ん은 わ열 가운데에 둡니다.
 */
export const KEYBOARD_COLUMNS = [
  ["あ", "い", "う", "え", "お"],
  ["か", "き", "く", "け", "こ"],
  ["さ", "し", "す", "せ", "そ"],
  ["た", "ち", "つ", "て", "と"],
  ["な", "に", "ぬ", "ね", "の"],
  ["は", "ひ", "ふ", "へ", "ほ"],
  ["ま", "み", "む", "め", "も"],
  ["や", "", "ゆ", "", "よ"],
  ["ら", "り", "る", "れ", "ろ"],
  ["わ", "", "ん", "", "を"],
];

// 탁음(゛), 반탁음(゜), 작은 글자(小) 변환표
const DAKUTEN = { か: "が", き: "ぎ", く: "ぐ", け: "げ", こ: "ご", さ: "ざ", し: "じ", す: "ず", せ: "ぜ", そ: "ぞ", た: "だ", ち: "ぢ", つ: "づ", て: "で", と: "ど", は: "ば", ひ: "び", ふ: "ぶ", へ: "べ", ほ: "ぼ" };
const HANDAKUTEN = { は: "ぱ", ひ: "ぴ", ふ: "ぷ", へ: "ぺ", ほ: "ぽ", ば: "ぱ", び: "ぴ", ぶ: "ぷ", べ: "ぺ", ぼ: "ぽ" };
const SMALL = { あ: "ぁ", い: "ぃ", う: "ぅ", え: "ぇ", お: "ぉ", つ: "っ", や: "ゃ", ゆ: "ゅ", よ: "ょ", わ: "ゎ" };

/** 변환표를 거꾸로 (が → か) */
function invert(map) {
  const result = {};
  Object.keys(map).forEach((k) => {
    if (!result[map[k]]) result[map[k]] = k;
  });
  return result;
}
const DAKUTEN_REVERSE = invert(DAKUTEN);
const HANDAKUTEN_REVERSE = { ぱ: "は", ぴ: "ひ", ぷ: "ふ", ぺ: "へ", ぽ: "ほ" };
const SMALL_REVERSE = invert(SMALL);

/**
 * 마지막 글자에 ゛ / ゜ / 小 를 적용합니다. 한 번 더 누르면 원래대로 돌아갑니다.
 *   か + ゛ → が,  が + ゛ → か,  ぱ + ゛ → ば
 *   は + ゜ → ぱ,  ば + ゜ → ぱ,  ぱ + ゜ → は
 *   つ + 小 → っ,  っ + 小 → つ
 * 가타카나도 같은 규칙으로 동작합니다.
 * @param {string} text 지금까지 입력한 글자
 * @param {"dakuten"|"handakuten"|"small"} kind
 */
export function applyModifier(text, kind) {
  if (!text) return text;
  const last = text.slice(-1);
  const head = text.slice(0, -1);

  // 가타카나는 히라가나로 바꿔서 처리한 뒤 다시 가타카나로
  if (isKatakana(last)) {
    const converted = applyModifier(head + toHiragana(last), kind);
    return head + toKatakana(converted.slice(-1));
  }

  let next = last;
  if (kind === "dakuten") {
    next = DAKUTEN[last] || DAKUTEN_REVERSE[last] || (HANDAKUTEN_REVERSE[last] ? DAKUTEN[HANDAKUTEN_REVERSE[last]] : last);
  } else if (kind === "handakuten") {
    next = HANDAKUTEN[last] || HANDAKUTEN_REVERSE[last] || last;
  } else if (kind === "small") {
    next = SMALL[last] || SMALL_REVERSE[last] || last;
  }
  return head + next;
}
