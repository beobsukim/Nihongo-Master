// ===== 결과 화면 =====
import { COLORS, FONT_PIXEL, pixelBox } from "../theme.js";
import { CHALLENGES_TO_LEVEL_UP, nextLevelOf } from "../game/constants.js";
import Bear from "../components/Bear.jsx";
import { RoomBackground } from "../components/Room.jsx";
import { MeterBar, bigButtonStyle, pageStyle, cardStyle } from "../components/Common.jsx";

/**
 * @param total 세션 문제 수 (20)
 * @param firstPassCorrect 첫 회차(재도전 전)에 한 번에 맞힌 수
 */
export default function ResultScreen({ total, firstPassCorrect, wrongList, reviewCount, leveledUpTo, myLevel, promotion, onNext, onHome }) {
  const percent = total > 0 ? Math.round((firstPassCorrect / total) * 100) : 0;
  const title = percent >= 90 ? "완벽!" : percent >= 70 ? "훌륭해!" : percent >= 50 ? "분발!" : "계속 연습!";
  const bearMood = percent >= 70 ? "correct" : percent >= 50 ? "idle" : "wrong";
  const nextLevel = nextLevelOf(myLevel);
  const smallButton = { flex: 1, width: "auto", fontSize: "0.9rem", padding: 12 };

  return (
    <div className="fullscreen" style={{ position: "relative" }}>
      <RoomBackground />
      <div className="fullscreen" style={pageStyle}>
        <div style={{ ...cardStyle, padding: "20px 18px" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Bear mood={bearMood} scale={5} />
          </div>
          <div style={{ fontSize: "1.6rem", margin: "8px 0 0", fontFamily: FONT_PIXEL, color: COLORS.pinkD }}>{title}</div>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 800, margin: "2px 0 2px" }}>세션 완료!</h2>
          <p style={{ color: COLORS.woodD, fontSize: "0.76rem", margin: "0 0 14px" }}>틀린 문제는 내일 자동 복습됩니다</p>

          {/* 점수 */}
          <div style={{ padding: 14, margin: "6px 3px 12px", ...pixelBox(COLORS.mintL, COLORS.mintD, 3) }}>
            <div style={{ fontSize: "2.8rem", fontWeight: 400, color: COLORS.mintD, lineHeight: 1, fontFamily: FONT_PIXEL }}>{percent}%</div>
            <div style={{ fontSize: "0.8rem", marginTop: 4 }}>
              {total}문제 중 {firstPassCorrect}개를 한 번에 맞혔어요
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 8, fontSize: "0.85rem", fontWeight: 800 }}>
              <span style={{ color: COLORS.mintD }}>♥ {firstPassCorrect}</span>
              <span style={{ color: COLORS.red }}>✕ {total - firstPassCorrect}</span>
            </div>
          </div>

          {/* 레벨 업 축하 또는 진행도 */}
          {leveledUpTo && (
            <div style={{ padding: 12, margin: "6px 3px 12px", animation: "slideUp .4s ease", ...pixelBox(COLORS.yellow, COLORS.yellowD, 3) }}>
              <div style={{ fontSize: "1.3rem", fontFamily: FONT_PIXEL }}>레벨 업!</div>
              <div style={{ fontSize: "0.88rem", fontWeight: 800 }}>내 레벨이 {leveledUpTo}(으)로 올라갔어요!</div>
            </div>
          )}
          {!leveledUpTo && nextLevel && (
            <div style={{ padding: "10px 12px", margin: "6px 3px 12px", textAlign: "left", ...pixelBox(COLORS.skyL, COLORS.skyD, 3) }}>
              <div style={{ fontSize: "0.76rem", fontWeight: 700, marginBottom: 6 }}>
                {nextLevel} 승급까지 {promotion}/{CHALLENGES_TO_LEVEL_UP}
              </div>
              <MeterBar ratio={promotion / CHALLENGES_TO_LEVEL_UP} />
            </div>
          )}

          {reviewCount > 0 && <div style={{ padding: "8px 12px", margin: "6px 3px 12px", fontSize: "0.78rem", ...pixelBox(COLORS.yellowL, COLORS.yellowD, 3) }}>오늘 복습 {reviewCount}개 포함 완료!</div>}

          {/* 이번 세션에서 틀린 문제 */}
          {wrongList.length > 0 && (
            <div style={{ padding: 12, margin: "6px 3px 14px", textAlign: "left", maxHeight: 180, overflowY: "auto", ...pixelBox("#fff0f0", "#f0a0a8", 3) }}>
              <div style={{ fontSize: "0.76rem", color: COLORS.red, fontWeight: 800, marginBottom: 6 }}>틀린 문제 ({wrongList.length}개) — 내일 복습</div>
              {wrongList.map((q) => (
                <div key={q.id} style={{ fontSize: "0.73rem", borderBottom: "2px dotted #f0c0c4", paddingBottom: 5, marginBottom: 5, lineHeight: 1.6 }}>
                  <span style={{ color: COLORS.red, fontWeight: 800 }}>答: {q.blank}</span>
                  <br />
                  {q.sentence.replace("___", `【${q.blank}】`)}
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 8 }}>
            <button className="pixel-button" onClick={onNext} style={bigButtonStyle(COLORS.pinkD, smallButton)}>
              다음 세션
            </button>
            <button className="pixel-button" onClick={onHome} style={bigButtonStyle(COLORS.cream, { ...smallButton, color: COLORS.text, textShadow: "none" })}>
              홈으로
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
