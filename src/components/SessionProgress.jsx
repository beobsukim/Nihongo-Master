// ===== 게임 화면 상단: 닫기 버튼 + 진행바 =====
import { COLORS, pixelBox } from "../theme.js";

/**
 * 진행바: 한 번에 맞힌 수(분홍)가 왼쪽부터 차고, 틀린 수(파랑)가 그 끝에 이어집니다.
 * 오른쪽 끝 숫자는 총 문제 수입니다.
 */
export default function SessionProgress({ correct, wrong, total, onClose }) {
  const correctRatio = total > 0 ? Math.min(correct / total, 1) : 0;
  const wrongRatio = total > 0 ? Math.max(0, Math.min(wrong / total, 1 - correctRatio)) : 0;
  const segment = (ratio, color) => ({ height: "100%", width: `${ratio * 100}%`, flexShrink: 0, background: color, transition: "width .4s steps(6,end)" });

  return (
    <div style={{ maxWidth: 480, width: "100%", margin: "0 auto", padding: "12px 16px 0", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
      {/* 닫기: 중간에 나가면 세션을 마친 것으로 치지 않음 */}
      <button
        className="pixel-button"
        onClick={onClose}
        style={{ width: 30, height: 30, border: "none", borderRadius: 0, cursor: "pointer", fontSize: "0.9rem", fontWeight: 800, color: COLORS.text, padding: 0, margin: 3, ...pixelBox(COLORS.cream, COLORS.ink, 3, 3) }}
      >
        ✕
      </button>

      <div style={{ flex: 1 }}>
        <div style={{ height: 20, margin: 3, position: "relative", overflow: "hidden", display: "flex", ...pixelBox("#fff", COLORS.ink, 3) }}>
          <div style={segment(correctRatio, COLORS.pink)} />
          <div style={segment(wrongRatio, COLORS.sky)} />
          <div style={{ position: "absolute", left: 6, top: 0, bottom: 0, display: "flex", alignItems: "center", gap: 8, fontSize: "0.7rem", fontWeight: 800, color: COLORS.text, whiteSpace: "nowrap" }}>
            <span>♥ {correct}</span>
            <span>✕ {wrong}</span>
          </div>
        </div>
      </div>

      <div style={{ fontSize: "0.8rem", fontWeight: 800, whiteSpace: "nowrap", color: COLORS.text, minWidth: 22, textAlign: "right" }}>{total}</div>
    </div>
  );
}
