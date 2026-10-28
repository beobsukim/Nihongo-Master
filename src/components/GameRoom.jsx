// ===== 게임 화면 가운데의 작은 방 (곰 + 말풍선 + 가구) =====
import { COLORS, FONT_BODY, FONT_PIXEL } from "../theme.js";
import Bear from "./Bear.jsx";
import SpeechBubble from "./SpeechBubble.jsx";
import { Floor } from "./Room.jsx";
import { Window, PictureFrame, Bookcase, Plant, BookStack, Rug } from "./Furniture.jsx";

/** 상황에 맞는 곰의 대사 */
function bearLine({ selectedWord, answerShown, mood, countdown, hintOn }) {
  if (selectedWord) {
    return (
      <>
        <div style={{ fontFamily: FONT_PIXEL, fontSize: "1.05rem", color: "#3d2616" }}>
          {selectedWord.word}
          <span style={{ fontSize: "0.78rem", color: COLORS.skyD, fontFamily: FONT_BODY, fontWeight: 800, marginLeft: 6 }}>[{selectedWord.yomi}]</span>
        </div>
        <div style={{ fontSize: "0.86rem", fontWeight: 700, marginTop: 1 }}>{selectedWord.ko}</div>
        <div style={{ fontSize: "0.62rem", color: COLORS.woodD, marginTop: 2 }}>터치하면 닫혀요</div>
      </>
    );
  }
  if (answerShown) return "이거야! 이걸 직접 입력해봐";
  if (mood === "correct") return countdown != null ? `정답! ${countdown}초 뒤 다음 문제로 넘어가요` : "정답!";
  if (mood === "wrong") return "앗, 다시 입력하거나 정답을 확인해봐";
  if (hintOn) return "힌트야! 첫 글자랑 글자 수를 알려줄게";
  return "";
}

const At = ({ style, children }) => <div style={{ position: "absolute", ...style }}>{children}</div>;

export default function GameRoom({ mood, answerShown, countdown, hintOn, selectedWord, onCloseWord }) {
  const line = bearLine({ selectedWord, answerShown, mood, countdown, hintOn });
  return (
    // flex: 1 → 문제 카드와 자판 사이의 남는 공간을 모두 차지
    <div style={{ flex: 1, minHeight: 112, position: "relative", overflow: "hidden" }}>
      <Floor height="56%" />
      <div style={{ position: "absolute", inset: 0, maxWidth: 480, margin: "0 auto" }}>
        <At style={{ left: 14, top: 6 }}><Window scale={2} /></At>
        <At style={{ left: 66, top: 12 }}><PictureFrame scale={2} /></At>
        <At style={{ right: 10, bottom: "48%" }}><Bookcase scale={3} /></At>
        <At style={{ left: 100, bottom: "46%" }}><Plant scale={3} /></At>
        <At style={{ left: 4, bottom: 0 }}><Rug scale={4} /></At>
        <At style={{ left: 22, bottom: 6 }}><Bear mood={mood} scale={4} /></At>
        <SpeechBubble left={112} bottom={22} maxWidth={200} onClick={selectedWord ? onCloseWord : undefined}>
          {line}
        </SpeechBubble>
        <At style={{ right: 14, bottom: 6 }}><BookStack scale={3} /></At>
      </div>
    </div>
  );
}
