// ===== 미니룸 배경 (바닥 + 가구) =====
import { COLORS } from "../theme.js";
import { Window, PictureFrame, Bookcase, Plant, BookStack, Rug } from "./Furniture.jsx";

// 나무 바닥 타일 (48x24 SVG)
const FLOOR_TILE =
  'url("data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="24" shape-rendering="crispEdges"><rect width="48" height="24" fill="#ecc98f"/><rect y="0" width="48" height="1" fill="#f6dfb2"/><rect y="11" width="48" height="1" fill="#d4a96c"/><rect y="12" width="48" height="1" fill="#f6dfb2"/><rect y="23" width="48" height="1" fill="#d4a96c"/><rect x="16" y="0" width="1" height="11" fill="#d4a96c"/><rect x="40" y="12" width="1" height="11" fill="#d4a96c"/><rect x="6" y="5" width="4" height="1" fill="#e3bd80"/><rect x="26" y="17" width="5" height="1" fill="#e3bd80"/></svg>'
  ) +
  '")';

/** 바닥 (위쪽에 걸레받이 포함). height 로 방 안에서 바닥이 차지하는 높이를 정합니다. */
export function Floor({ height }) {
  return (
    <div
      style={{
        position: "absolute", left: 0, right: 0, bottom: 0, height,
        backgroundColor: COLORS.wood, backgroundImage: FLOOR_TILE, backgroundSize: "96px 48px", imageRendering: "pixelated",
      }}
    >
      {/* 걸레받이 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: -10, height: 10, background: "#f6e7cc", boxShadow: `0 -3px 0 0 ${COLORS.woodD}, 0 3px 0 0 ${COLORS.woodD}` }} />
    </div>
  );
}

/** 절대 위치 도우미 */
const At = ({ style, children }) => <div style={{ position: "absolute", ...style }}>{children}</div>;

/** 시작·결과 화면의 큰 방 배경 (화면 전체에 고정) */
export function RoomBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <At style={{ top: 18, left: 12 }}><Window scale={4} /></At>
      <At style={{ top: 30, right: 16 }}><PictureFrame scale={4} /></At>
      <Floor height="28%" />
      <At style={{ bottom: "21%", right: 10 }}><Bookcase scale={4} /></At>
      <At style={{ bottom: "9%", left: 8 }}><Plant scale={4} /></At>
      <At style={{ bottom: "3%", left: "26%" }}><Rug scale={5} /></At>
      <At style={{ bottom: "5%", right: "26%" }}><BookStack scale={5} /></At>
    </div>
  );
}
