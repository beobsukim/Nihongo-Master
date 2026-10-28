// ===== 색상·폰트·픽셀 테두리 =====

/** 미니룸 팔레트 (D = 진한색, L = 연한색) */
export const COLORS = {
  ink: "#7a5236", // 테두리 갈색
  text: "#5a3b28",
  cream: "#fffaf0",
  paper: "#fff6e3",
  pink: "#ff9db8", pinkD: "#e8708f", pinkL: "#ffe3ec",
  mint: "#9fe6c8", mintD: "#4fb994", mintL: "#e2f8ee",
  sky: "#9bd5f2", skyD: "#4a9fd4", skyL: "#e3f3fc",
  yellow: "#ffdc6e", yellowD: "#d9a73a", yellowL: "#fff3c4",
  wood: "#ecc98f", woodD: "#b98550",
  red: "#e5566d",
};

/** 레벨 배지 색 */
export const LEVEL_COLORS = { N5: "#52c9a0", N4: "#5aa9e6", N3: "#f2b632", N2: "#f58f5a", N1: "#ef6f8f" };
export const levelColor = (level) => LEVEL_COLORS[level] || LEVEL_COLORS.N5;

/** 일본어·제목용 도트 폰트 */
export const FONT_PIXEL = "'DotGothic16','Hiragino Kaku Gothic ProN','Hiragino Sans','Noto Sans JP','Yu Gothic',sans-serif";
/** 한국어 본문 폰트 */
export const FONT_BODY = "-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Noto Sans KR','Malgun Gothic','Hiragino Sans',sans-serif";

/**
 * 픽셀 느낌의 각진 테두리 스타일.
 * border 대신 box-shadow 를 네 방향으로 겹쳐서 모서리가 계단처럼 보이게 합니다.
 * @param background 배경색
 * @param borderColor 테두리색
 * @param width 테두리 두께(px)
 * @param drop 아래쪽 그림자 두께(px), 생략하면 그림자 없음
 */
export function pixelBox(background, borderColor, width = 3, drop = 0) {
  let shadow = `${width}px 0 0 0 ${borderColor}, -${width}px 0 0 0 ${borderColor}, 0 ${width}px 0 0 ${borderColor}, 0 -${width}px 0 0 ${borderColor}`;
  if (drop) shadow += `, 0 ${width + drop}px 0 0 rgba(122,82,54,.28)`;
  return { background, boxShadow: shadow };
}
