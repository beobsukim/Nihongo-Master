// ===== 시작 화면 =====
import { COLORS, FONT_PIXEL, levelColor, pixelBox } from "../theme.js";
import { CHALLENGES_TO_LEVEL_UP, CORRECT_PER_CHALLENGE, MAX_REVIEW_PER_SESSION, nextLevelOf } from "../game/constants.js";
import { loadReviewQuestions, loadDoneIds } from "../game/storage.js";
import Bear from "../components/Bear.jsx";
import { RoomBackground } from "../components/Room.jsx";
import { MeterBar, bigButtonStyle, pageStyle, cardStyle, panelStyle } from "../components/Common.jsx";

export default function StartScreen({ myLevel, promotion, onStart, onReset }) {
  const reviewCount = loadReviewQuestions().length;
  const hasHistory = loadDoneIds().length > 0;
  const nextLevel = nextLevelOf(myLevel);

  return (
    <div className="fullscreen" style={{ position: "relative" }}>
      <RoomBackground />
      <div className="fullscreen" style={pageStyle}>
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
            <Bear mood="idle" scale={6} />
          </div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 400, color: COLORS.pinkD, margin: "4px 0 2px", fontFamily: FONT_PIXEL, textShadow: `2px 2px 0 ${COLORS.pinkL}` }}>日本語マスター</h1>
          <p style={{ color: COLORS.woodD, fontSize: "0.8rem", margin: "0 0 14px", fontWeight: 700 }}>NHK スタイル JLPT N5〜N1</p>

          {/* 내 레벨 */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 12px", margin: "3px 3px 14px", fontSize: "0.8rem", fontWeight: 700, ...pixelBox("#fff", COLORS.wood, 3) }}>
            <span style={{ color: COLORS.woodD }}>내 레벨</span>
            <span style={{ background: levelColor(myLevel), color: "#fff", fontSize: "0.85rem", fontWeight: 800, padding: "1px 10px" }}>{myLevel}</span>
          </div>

          {/* 복습 알림 */}
          {reviewCount > 0 && (
            <div style={panelStyle(COLORS.yellowL, COLORS.yellowD)}>
              <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>복습 알림! </span>
              <span style={{ fontSize: "0.8rem" }}>어제 틀린 문제 {reviewCount}개 포함</span>
            </div>
          )}

          {/* 레벨 업 진행도 (N1이면 표시 안 함) */}
          {nextLevel && (
            <div style={panelStyle(COLORS.skyL, COLORS.skyD)}>
              <div style={{ fontSize: "0.76rem", fontWeight: 700, marginBottom: 6 }}>
                {nextLevel} 승급까지 {promotion}/{CHALLENGES_TO_LEVEL_UP}
              </div>
              <MeterBar ratio={promotion / CHALLENGES_TO_LEVEL_UP} />
            </div>
          )}

          {/* 학습 방법 */}
          <div style={panelStyle(COLORS.mintL, COLORS.mintD)}>
            <div style={{ fontSize: "0.78rem", fontWeight: 800, marginBottom: 4 }}>학습 방법</div>
            <div style={{ fontSize: "0.78rem", lineHeight: 1.8, wordBreak: "keep-all" }}>
              • 현재 레벨 문제 {CORRECT_PER_CHALLENGE}개를 맞히면 다음 레벨 문제 1문제 출제
              <br />• 다음 레벨 문제 {CHALLENGES_TO_LEVEL_UP}개를 맞히면 레벨 업!
            </div>
          </div>

          <div style={{ height: 14 }} />
          <button className="pixel-button" onClick={onStart} style={bigButtonStyle(COLORS.pinkD)}>
            {reviewCount > 0 ? `시작 (복습 ${Math.min(reviewCount, MAX_REVIEW_PER_SESSION)}개 포함)` : "오늘 세션 시작"}
          </button>

          {hasHistory && (
            <button onClick={onReset} style={{ marginTop: 14, background: "transparent", border: "none", color: COLORS.woodD, fontSize: "0.72rem", cursor: "pointer", textDecoration: "underline" }}>
              학습 기록 초기화
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
