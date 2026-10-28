// ===== 메인 캐릭터: 곰 인형 =====
import { useEffect, useState } from "react";
import { PixelSprite } from "./PixelArt.jsx";

// 글자별 색: b 털, d 진한 털, c 주둥이·배, e 눈·코, r 리본, m 입
const PALETTE = { b: "#c8905a", d: "#a06a3c", c: "#f6dcb4", e: "#3b2a1e", r: "#e5566d", m: "#c2495a" };

// 기본(대기) 모습 14 x 14 픽셀
const BASE_ROWS = [
  ".bbb......bbb.",
  "bbdb......bdbb",
  "bbbbbbbbbbbbbb",
  ".bbbbbbbbbbbb.",
  ".bbebbbbbbebb.", // 4: 눈
  ".bbbbccccbbbb.",
  ".bbbbceecbbbb.", // 6: 코
  ".bbbbccccbbbb.", // 7: 입
  "..bbbbbbbbbb..",
  "...bbrrrrbb...", // 9: 리본
  ".bbbbbbbbbbbb.", // 10~13: 몸과 팔
  "bbbbbbccbbbbbb",
  "bbbbbccccbbbbb",
  ".bbb.bbbb.bbb.",
];

const FUR = "#c8905a";
const FUR_DARK = "#a06a3c";
const SPARKLE = "#ffd34d";
const SWEAT = "#7cc6f2";

// 정답 때 팔을 흔드는 두 장면 (A: 위로 V자, B: 아래 대각선)
const ARMS_UP = [[4, 11, 2, 2, FUR], [3, 10, 2, 2, FUR], [2, 9, 2, 2, FUR], [1, 8, 1, 2, FUR_DARK], [14, 11, 2, 2, FUR], [15, 10, 2, 2, FUR], [16, 9, 2, 2, FUR], [18, 8, 1, 2, FUR_DARK]];
const ARMS_DOWN = [[4, 13, 2, 2, FUR], [3, 14, 2, 2, FUR], [2, 15, 2, 2, FUR], [1, 15, 1, 2, FUR_DARK], [14, 13, 2, 2, FUR], [15, 14, 2, 2, FUR], [16, 15, 2, 2, FUR], [18, 15, 1, 2, FUR_DARK]];
// 귀와 떨어진 곳에 반짝이 (귀 옆에 붙으면 이어폰처럼 보여서 위치 조정함)
const SPARKLES = [[1, 3, 1, 3, SPARKLE], [0, 4, 3, 1, SPARKLE], [18, 1, 1, 3, SPARKLE], [17, 2, 3, 1, SPARKLE], [10, 0, 1, 1, SPARKLE]];

/**
 * @param mood "idle"(살랑) | "correct"(깡충 + 팔 흔들기) | "wrong"(땀방울 + 찡그림)
 * @param scale 픽셀 크기
 */
export default function Bear({ mood = "idle", scale = 3 }) {
  // 정답일 때 300ms마다 팔 모양을 번갈아 바꿈
  const [armFrame, setArmFrame] = useState(0);
  useEffect(() => {
    if (mood !== "correct") {
      setArmFrame(0);
      return undefined;
    }
    const timer = setInterval(() => setArmFrame((f) => 1 - f), 300);
    return () => clearInterval(timer);
  }, [mood]);

  const rows = BASE_ROWS.slice();
  let extra = [];
  if (mood === "correct") {
    rows[4] = ".bbeebbbbbeebb"; // 웃는 눈
    rows[7] = ".bbbbcmmcbbbb."; // 벌린 입
    // 몸통 옆 팔을 지우고 extra 로 흔드는 팔을 그림
    rows[10] = "..bbbbbbbbbb..";
    rows[11] = "..bbbbccbbbb..";
    rows[12] = "..bbbccccbbb..";
  } else if (mood === "wrong") {
    rows[3] = ".bbbeebbeebbb."; // 찡그린 눈썹
    rows[7] = ".bbbbcmmcbbbb.";
  }

  // 반짝이·팔이 들어갈 여백: 위로 3줄, 좌우로 3칸
  const padded = ["....................", "....................", "...................."].concat(rows.map((r) => "..." + r + "..."));

  if (mood === "correct") extra = (armFrame === 0 ? ARMS_UP : ARMS_DOWN).concat(SPARKLES);
  if (mood === "wrong") extra = [[15, 5, 1, 2, SWEAT], [15, 8, 1, 1, SWEAT]];

  const animation = mood === "idle" ? "bearBob 1.6s steps(2,end) infinite" : mood === "correct" ? "bearHop .5s steps(3,end) infinite" : "none";
  return (
    <div style={{ animation }}>
      <PixelSprite rows={padded} palette={PALETTE} scale={scale} extra={extra} />
    </div>
  );
}
