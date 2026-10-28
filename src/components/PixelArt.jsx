// ===== 픽셀 아트 그리기 도구 =====
// 이미지 파일 없이 SVG 사각형으로 도트 그림을 그립니다.
// shapeRendering="crispEdges" 로 확대해도 흐려지지 않습니다.

/**
 * 문자열 격자로 그림 그리기.
 * rows 의 각 글자가 한 픽셀이고, "." 은 투명, 나머지 글자는 palette 의 색입니다.
 *   rows = [".bb.", "bccb"], palette = { b: "#c8905a", c: "#f6dcb4" }
 * @param scale 한 픽셀의 실제 크기(px)
 * @param extra 추가 사각형 [x, y, 너비, 높이, 색] 목록 (반짝이·팔 등)
 */
export function PixelSprite({ rows, palette, scale = 3, extra = [] }) {
  const rects = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      if (ch === ".") {
        x++;
        continue;
      }
      // 같은 색이 이어지면 사각형 하나로 합침
      let end = x;
      while (end < row.length && row[end] === ch) end++;
      rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={end - x} height={1} fill={palette[ch]} />);
      x = end;
    }
  });
  extra.forEach(([x, y, w, h, fill], i) => rects.push(<rect key={`extra${i}`} x={x} y={y} width={w} height={h} fill={fill} />));

  const width = rows[0].length;
  const height = rows.length;
  return (
    <svg width={width * scale} height={height * scale} viewBox={`0 0 ${width} ${height}`} shapeRendering="crispEdges" style={{ display: "block" }}>
      {rects}
    </svg>
  );
}

/**
 * 사각형 목록으로 그림 그리기 (가구처럼 큰 덩어리가 많은 그림용).
 * @param rects [x, y, 너비, 높이, 색] 목록
 * @param width 그림 가로 픽셀 수
 * @param height 그림 세로 픽셀 수
 */
export function PixelRects({ rects, width, height, scale }) {
  return (
    <svg width={width * scale} height={height * scale} viewBox={`0 0 ${width} ${height}`} shapeRendering="crispEdges" style={{ display: "block" }}>
      {rects.map(([x, y, w, h, fill], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={fill} />
      ))}
    </svg>
  );
}
