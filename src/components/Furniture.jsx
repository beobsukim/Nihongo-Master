// ===== 방 소품 (창문, 액자, 책장, 화분, 책, 러그) =====
// 모두 [x, y, 너비, 높이, 색] 사각형 목록으로 그립니다.
import { PixelRects } from "./PixelArt.jsx";

export function Window({ scale }) {
  return (
    <PixelRects
      width={20}
      height={18}
      scale={scale}
      rects={[
        [0, 0, 20, 18, "#8a6a4f"], [1, 1, 18, 16, "#fffaf0"], // 틀
        [2, 2, 7, 6, "#9ad8f5"], [11, 2, 7, 6, "#9ad8f5"], [2, 9, 7, 6, "#b9e6f8"], [11, 9, 7, 6, "#b9e6f8"], // 유리
        [3, 3, 3, 1, "#ffffff"], [12, 4, 4, 1, "#ffffff"], [4, 11, 3, 1, "#ffffff"], [13, 12, 3, 1, "#ffffff"], // 반사광
        [9, 1, 2, 16, "#fffaf0"], // 가운데 살
        [0, 16, 20, 2, "#b98550"], // 창턱
        [0, 0, 3, 10, "#ff9db8"], [17, 0, 3, 10, "#ff9db8"], [0, 0, 1, 10, "#e8708f"], [19, 0, 1, 10, "#e8708f"], // 커튼
      ]}
    />
  );
}

export function PictureFrame({ scale }) {
  return (
    <PixelRects
      width={12}
      height={9}
      scale={scale}
      rects={[[0, 0, 12, 9, "#b98550"], [1, 1, 10, 7, "#fff3c4"], [3, 2, 3, 3, "#ffdc6e"], [6, 4, 3, 3, "#ff9db8"], [4, 5, 1, 1, "#7fd6a6"]]}
    />
  );
}

export function Bookcase({ scale }) {
  const WOOD = "#b9824f";
  const SHELF = "#d9a86b";
  const BOOK_COLORS = ["#e5566d", "#5fb6e4", "#ffd34d", "#7fd6a6", "#ff9db8", "#b58be0"];
  const rects = [
    [0, 0, 14, 18, WOOD], // 겉판
    [1, 1, 12, 16, "#8c5d36"], // 안쪽
    [1, 6, 12, 1, SHELF], // 선반 3개
    [1, 12, 12, 1, SHELF],
    [1, 16, 12, 1, SHELF],
  ];
  // 칸마다 책 5권, 높이를 번갈아 달리해서 자연스럽게
  const shelfBottoms = [6, 12, 17];
  shelfBottoms.forEach((bottom, shelf) => {
    for (let i = 0, x = 2; i < 5 && x < 12; i++, x += 2) {
      const h = 4 - ((i + shelf) % 2);
      rects.push([x, bottom - h, 2, h, BOOK_COLORS[(i + shelf * 2) % BOOK_COLORS.length]]);
    }
  });
  return <PixelRects width={14} height={18} scale={scale} rects={rects} />;
}

export function Plant({ scale }) {
  return (
    <PixelRects
      width={8}
      height={13}
      scale={scale}
      rects={[
        [3, 0, 2, 2, "#4fb36e"], [1, 2, 3, 2, "#4fb36e"], [4, 2, 3, 2, "#6fcf8a"], [2, 4, 4, 2, "#4fb36e"], [3, 6, 2, 2, "#3a9a58"], // 잎
        [1, 8, 6, 1, "#ff9db8"], [2, 9, 4, 4, "#f58f5a"], [2, 9, 4, 1, "#ffb98a"], // 화분
      ]}
    />
  );
}

export function BookStack({ scale }) {
  return (
    <PixelRects
      width={10}
      height={6}
      scale={scale}
      rects={[[0, 4, 10, 2, "#5fb6e4"], [1, 2, 8, 2, "#ff9db8"], [0, 0, 7, 2, "#ffd34d"], [0, 4, 10, 1, "#8ccdf0"], [1, 2, 8, 1, "#ffc0d2"], [0, 0, 7, 1, "#ffe58a"]]}
    />
  );
}

export function Rug({ scale }) {
  // 타원 모양: 줄마다 [시작 x, 길이]
  const outer = [[6, 18], [3, 24], [1, 28], [0, 30], [0, 30], [1, 28], [3, 24], [6, 18]];
  const inner = [[8, 14], [6, 18], [5, 20], [5, 20], [6, 18], [8, 14]];
  const rects = [
    ...outer.map(([x, w], y) => [x, y, w, 1, "#ff9db8"]),
    ...inner.map(([x, w], y) => [x + 1, y + 1, w, 1, "#ffc7d8"]),
  ];
  return <PixelRects width={30} height={8} scale={scale} rects={rects} />;
}
