// ===== 곰 말풍선 =====
import { COLORS, FONT_BODY, pixelBox } from "../theme.js";

/**
 * @param children 말풍선 내용 (없으면 말풍선을 그리지 않음)
 * @param left, bottom 위치(px)
 * @param onClick 있으면 탭해서 닫을 수 있음 (사전 뜻 표시용)
 */
export default function SpeechBubble({ children, left, bottom, maxWidth = 190, onClick }) {
  if (!children) return null;
  return (
    <div onClick={onClick} style={{ position: "absolute", left, bottom, zIndex: 3, animation: "slideUp .25s ease", cursor: onClick ? "pointer" : "default" }}>
      <div
        style={{
          padding: "5px 10px", fontSize: "0.82rem", fontWeight: 800, color: COLORS.text, whiteSpace: "normal", wordBreak: "keep-all",
          maxWidth, lineHeight: 1.4, fontFamily: FONT_BODY, margin: 3, ...pixelBox(COLORS.cream, COLORS.ink, 3),
        }}
      >
        {children}
      </div>
      {/* 꼬리 (계단 모양 두 줄) */}
      <div style={{ marginLeft: 14 }}>
        <div style={{ width: 9, height: 3, background: COLORS.ink }} />
        <div style={{ width: 5, height: 3, background: COLORS.ink, marginLeft: 2 }} />
      </div>
    </div>
  );
}
