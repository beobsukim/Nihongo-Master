// ===== 여러 화면에서 쓰는 작은 부품 =====
import { COLORS, FONT_BODY, pixelBox } from "../theme.js";

/** 레벨·복습·재도전·도전 배지 */
export function Badge({ color, children }) {
  return (
    <span
      style={{
        color: "#fff", fontSize: "0.74rem", fontWeight: 800, padding: "3px 10px", marginRight: 6, fontFamily: FONT_BODY,
        textShadow: "1px 1px 0 rgba(0,0,0,.25)", ...pixelBox(color, COLORS.ink, 2),
      }}
    >
      {children}
    </span>
  );
}

/** 레벨 업 진행 막대 (시작·결과 화면). ratio: 0~1 */
export function MeterBar({ ratio, height = 14 }) {
  return (
    <div style={{ height, margin: 3, position: "relative", overflow: "hidden", ...pixelBox("#fff", COLORS.ink, 3) }}>
      <div
        style={{
          height: "100%", width: `${ratio * 100}%`, transition: "width .4s steps(6,end)",
          background: `repeating-linear-gradient(90deg,${COLORS.pink} 0 6px,${COLORS.pinkD} 6px 8px)`,
        }}
      />
    </div>
  );
}

/** 큰 픽셀 버튼 스타일 */
export function bigButtonStyle(background, extra = {}) {
  return {
    width: "calc(100% - 6px)", padding: "14px", margin: "0 3px", fontSize: "1.02rem", fontWeight: 800, color: "#fff",
    border: "none", borderRadius: 0, cursor: "pointer", fontFamily: FONT_BODY, letterSpacing: "0.5px",
    textShadow: "1px 1px 0 rgba(0,0,0,.25)", ...pixelBox(background, COLORS.ink, 3, 3), ...extra,
  };
}

/** 시작·결과 화면 공통 레이아웃 스타일 */
export const pageStyle = {
  position: "relative", zIndex: 1, overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center",
  justifyContent: "center", fontFamily: FONT_BODY, padding: "22px 20px 26px", color: COLORS.text,
};
export const cardStyle = { padding: "22px 20px", maxWidth: 360, width: "calc(100% - 12px)", textAlign: "center", margin: "6px", ...pixelBox(COLORS.cream, COLORS.ink, 4, 4) };
export const panelStyle = (background, border) => ({ padding: "10px 12px", margin: "12px 3px 0", textAlign: "left", ...pixelBox(background, border, 3) });
