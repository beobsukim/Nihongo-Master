// ===== 앱 최상위: 지금 화면(start/game/result)에 맞는 화면을 보여줍니다 =====
import { useGame } from "./game/useGame.js";
import StartScreen from "./screens/StartScreen.jsx";
import GameScreen from "./screens/GameScreen.jsx";
import ResultScreen from "./screens/ResultScreen.jsx";

export default function App() {
  const game = useGame();

  if (game.screen === "start") {
    return <StartScreen myLevel={game.myLevel} promotion={game.promotion} onStart={game.startSession} onReset={game.resetProgress} />;
  }

  if (game.screen === "result") {
    return (
      <ResultScreen
        total={game.total}
        firstPassCorrect={game.firstPassCorrect}
        wrongList={game.wrongList}
        reviewCount={game.reviewCount}
        leveledUpTo={game.leveledUpTo}
        myLevel={game.myLevel}
        promotion={game.promotion}
        onNext={game.startSession}
        onHome={game.goHome}
      />
    );
  }

  return <GameScreen game={game} />;
}
