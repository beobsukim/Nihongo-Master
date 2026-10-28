// ===== 문제 카드: 한국어 뜻 + 빈칸이 있는 일본어 문장 =====
import { COLORS, FONT_BODY, FONT_PIXEL, pixelBox } from "../theme.js";
import { DICTIONARY } from "../data/dictionary.js";
import { splitIntoWords } from "../game/tokenize.js";

/** 문장 조각을 그림. 사전 단어는 점선 밑줄 + 탭하면 뜻 표시 */
function SentencePart({ text, keyPrefix, selectedWord, onSelectWord }) {
  return splitIntoWords(text).map((piece, i) => {
    const key = `${keyPrefix}-${i}`;
    if (!piece.isWord) return <span key={key}>{piece.text}</span>;
    const entry = DICTIONARY[piece.text];
    const selected = selectedWord && selectedWord.word === piece.text && selectedWord.key === key;
    return (
      <span
        key={key}
        onClick={() => onSelectWord({ word: piece.text, yomi: entry.yomi, ko: entry.ko, key })}
        style={{
          cursor: "pointer",
          borderBottom: selected ? `3px solid ${COLORS.pinkD}` : `3px dotted ${COLORS.woodD}`,
          background: selected ? COLORS.pinkL : "transparent",
          padding: selected ? "0 2px" : 0,
        }}
      >
        {piece.text}
      </span>
    );
  });
}

/**
 * 빈칸 = 입력창.
 *  - 입력 중: 입력한 글자 + 깜빡이는 커서
 *  - 비어 있고 힌트 켬: 첫 글자 + 나머지 글자 수만큼 ○ (예: け○○)
 *  - 정답/정답 보기: 정답 표시
 */
function AnswerBlank({ question, input, status, hintOn, revealed }) {
  const hintText = question.blank[0] + "○".repeat(Math.max(question.blank.length - 1, 0));
  const shown = revealed ? question.blank : input || (hintOn ? hintText : "");
  const borderColor = revealed ? COLORS.mintD : status === "wrong" ? COLORS.red : COLORS.yellowD;
  const showingHint = !revealed && !input && hintOn;
  return (
    <span
      style={{
        display: "inline-block", margin: "0 3px", padding: "0 8px", minWidth: 70, textAlign: "center", verticalAlign: "middle",
        background: revealed ? COLORS.mintL : status === "wrong" ? "#fff0f0" : COLORS.yellowL,
        border: `3px ${revealed ? "solid" : "dashed"} ${borderColor}`,
        color: revealed ? "#2c7a5e" : input ? "#3d2616" : hintOn ? COLORS.pinkD : "transparent",
        fontWeight: 800, lineHeight: 1.5, letterSpacing: showingHint ? "2px" : 0,
      }}
    >
      {shown || "　"}
      {!revealed && <span style={{ color: COLORS.pinkD, fontWeight: 400, animation: "cursorBlink .8s steps(2,end) infinite" }}>|</span>}
    </span>
  );
}

export default function QuestionCard({ question, input, status, hintOn, revealed, shaking, selectedWord, onSelectWord, onShowAnswer, onToggleHint }) {
  if (!question) return null;
  const [before, after] = question.sentence.split("___");
  const cardBorder = status === "correct" ? COLORS.mintD : status === "wrong" ? COLORS.red : COLORS.ink;
  const answerDisabled = status === "correct";

  return (
    <div style={{ maxWidth: 480, width: "100%", margin: "0 auto", padding: "0 14px", flexShrink: 0 }}>
      <div style={{ position: "relative", padding: "12px 12px 8px", margin: 3, animation: shaking ? "shake .4s ease" : "none", ...pixelBox(COLORS.cream, cardBorder, 3, 3) }}>
        {/* 오른쪽 위: 정답 보기 · 힌트 버튼 */}
        <div style={{ position: "absolute", top: 8, right: 8, display: "flex", alignItems: "center", gap: 4 }}>
          <button
            className="pixel-button"
            onClick={onShowAnswer}
            disabled={answerDisabled}
            style={{
              height: 24, padding: "0 7px", border: "none", borderRadius: 0, fontSize: "0.7rem", fontWeight: 800, fontFamily: FONT_BODY, margin: 3,
              color: answerDisabled ? "#c9b08c" : COLORS.text, cursor: answerDisabled ? "not-allowed" : "pointer",
              ...pixelBox(answerDisabled ? "#efe0c4" : COLORS.yellow, COLORS.yellowD, 2),
            }}
          >
            정답
          </button>
          <button
            className="pixel-button"
            onClick={onToggleHint}
            style={{
              margin: 3, width: 24, height: 24, border: "none", borderRadius: 0, fontSize: "0.85rem", fontWeight: 800, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
              color: hintOn ? "#fff" : COLORS.skyD, ...pixelBox(hintOn ? COLORS.skyD : COLORS.skyL, COLORS.skyD, 2),
            }}
          >
            ?
          </button>
        </div>

        {/* 한국어 뜻 (오른쪽은 버튼 자리만큼 비움) */}
        <div style={{ fontSize: "1rem", lineHeight: 1.5, marginBottom: 8, fontWeight: 600, paddingRight: 92 }}>{question.meaning}</div>
        <div style={{ height: 0, borderTop: `3px dotted ${COLORS.wood}`, marginBottom: 8 }} />

        {/* 일본어 문장: 앞부분 + 빈칸 + 뒷부분 */}
        <div style={{ fontSize: "1.2rem", fontWeight: 400, lineHeight: 2, fontFamily: FONT_PIXEL, color: "#3d2616" }}>
          <span style={{ lineHeight: 2.2 }}>
            <SentencePart text={before} keyPrefix="pre" selectedWord={selectedWord} onSelectWord={onSelectWord} />
            <AnswerBlank question={question} input={input} status={status} hintOn={hintOn} revealed={revealed} />
            {after ? <SentencePart text={after} keyPrefix="post" selectedWord={selectedWord} onSelectWord={onSelectWord} /> : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
