// ===== 화면 아래 가나 자판 =====
import { useState } from "react";
import { COLORS, FONT_PIXEL } from "../theme.js";
import { KEYBOARD_COLUMNS, applyModifier, toKatakana } from "../game/kana.js";

/** 자판 키 스타일 */
function keyStyle({ disabled = false, wide = false, enter = false, background } = {}) {
  const ink = COLORS.ink;
  return {
    flex: wide ? "1.5" : "1", minWidth: 0, height: 32, border: "none", borderRadius: 0, margin: "0 2px", padding: 0,
    color: disabled ? "#c9b08c" : COLORS.text, fontSize: "1.05rem", fontWeight: 700, fontFamily: FONT_PIXEL,
    cursor: disabled ? "not-allowed" : "pointer",
    background: disabled ? "#efe0c4" : enter ? COLORS.pink : background || COLORS.cream,
    boxShadow: `2px 0 0 0 ${ink}, -2px 0 0 0 ${ink}, 0 -2px 0 0 ${ink}, 0 2px 0 0 ${ink}, 0 4px 0 0 ${COLORS.woodD}`,
  };
}

const MODIFIER_KEYS = [
  { label: "゛", kind: "dakuten" },
  { label: "゜", kind: "handakuten" },
  { label: "小", kind: "small" },
];

/**
 * @param disabled 정답을 맞혀 다음 문제를 기다리는 중
 * @param canSubmit 빈칸에 글자가 있을 때만 ↵ 활성화
 * @param onType(text) 글자 추가
 * @param onEditLast(fn) 마지막 글자 바꾸기 (゛゜小)
 */
export default function KanaKeyboard({ disabled, canSubmit, onType, onEditLast, onBackspace, onSubmit }) {
  // 히라가나 ↔ 가타카나 전환 상태 (문제가 바뀌어도 유지)
  const [katakana, setKatakana] = useState(false);
  const label = (ch) => (katakana ? toKatakana(ch) : ch);

  return (
    <div style={{ flexShrink: 0, background: COLORS.woodD, borderTop: `4px solid ${COLORS.ink}`, padding: "10px 4px 14px", boxShadow: "0 -3px 0 0 #d9a86b inset" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "0 4px" }}>
          {/* 5줄 (あ·い·う·え·お 단) × 10열 (あ~わ 행) */}
          {[0, 1, 2, 3, 4].map((row) => (
            <div key={row} style={{ display: "flex" }}>
              {KEYBOARD_COLUMNS.map((column, col) =>
                column[row] ? (
                  <button key={col} className="pixel-button" disabled={disabled} style={keyStyle({ disabled })} onClick={() => onType(label(column[row]))}>
                    {label(column[row])}
                  </button>
                ) : (
                  <div key={col} style={{ flex: 1, margin: "0 2px" }} /> // 빈 자리
                )
              )}
            </div>
          ))}

          {/* 기능 줄: 가나 전환 · ゛ · ゜ · 小 · ー · ⌫ · ↵ */}
          <div style={{ display: "flex" }}>
            <button className="pixel-button" style={keyStyle({ background: katakana ? "#ffe9a8" : COLORS.skyL })} onClick={() => setKatakana((k) => !k)}>
              {katakana ? "あ" : "ア"}
            </button>
            {MODIFIER_KEYS.map((m) => (
              <button key={m.kind} className="pixel-button" disabled={disabled} style={keyStyle({ disabled, background: COLORS.skyL })} onClick={() => onEditLast((text) => applyModifier(text, m.kind))}>
                {m.label}
              </button>
            ))}
            <button className="pixel-button" disabled={disabled} style={keyStyle({ disabled })} onClick={() => onType("ー")}>
              ー
            </button>
            <button className="pixel-button" disabled={disabled} style={keyStyle({ disabled, wide: true })} onClick={onBackspace}>
              ⌫
            </button>
            <button className="pixel-button" disabled={!canSubmit || disabled} style={keyStyle({ disabled: !canSubmit || disabled, wide: true, enter: true })} onClick={onSubmit}>
              ↵
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
