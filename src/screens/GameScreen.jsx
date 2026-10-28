// ===== 게임 화면 =====
// 위에서부터: 진행바 → 배지 → 문제 카드 → 방(곰·말풍선) → 자판
import { COLORS, FONT_BODY, levelColor } from "../theme.js";
import SessionProgress from "../components/SessionProgress.jsx";
import QuestionCard from "../components/QuestionCard.jsx";
import GameRoom from "../components/GameRoom.jsx";
import KanaKeyboard from "../components/KanaKeyboard.jsx";
import { Badge } from "../components/Common.jsx";

export default function GameScreen({ game }) {
  const waitingNext = game.status === "correct";

  return (
    <div className="fullscreen" style={{ fontFamily: FONT_BODY, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", color: COLORS.text }}>
      <SessionProgress correct={game.score.correct} wrong={game.score.wrong} total={game.total} onClose={game.goHome} />

      {/* 배지: 레벨 / 복습 / 재도전 / 도전! */}
      <div style={{ maxWidth: 480, width: "100%", margin: "0 auto", padding: "8px 18px 4px", flexShrink: 0, display: "flex", alignItems: "center" }}>
        <Badge color={levelColor(game.badgeLevel)}>{game.badgeLevel}</Badge>
        {game.isReview && <Badge color={COLORS.yellowD}>복습</Badge>}
        {game.isRetry && <Badge color={COLORS.skyD}>재도전</Badge>}
        {game.isChallenge && <Badge color="#a77be0">도전!</Badge>}
      </div>

      <QuestionCard
        question={game.current}
        input={game.input}
        status={game.status}
        hintOn={game.hintOn}
        revealed={game.answerRevealed}
        shaking={game.shaking}
        selectedWord={game.selectedWord}
        onSelectWord={game.setSelectedWord}
        onShowAnswer={game.showAnswer}
        onToggleHint={game.toggleHint}
      />

      <GameRoom
        mood={game.bearMood}
        answerShown={game.status === "showAnswer"}
        countdown={waitingNext ? game.countdown : null}
        hintOn={game.hintOn}
        selectedWord={game.selectedWord}
        onCloseWord={() => game.setSelectedWord(null)}
      />

      <KanaKeyboard
        disabled={waitingNext}
        canSubmit={!!game.input.trim()}
        onType={game.typeText}
        onEditLast={game.editLast}
        onBackspace={game.backspace}
        onSubmit={game.submit}
      />
    </div>
  );
}
