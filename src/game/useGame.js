// ===== 게임 상태와 동작을 모아 둔 React 훅 =====
// 화면 컴포넌트는 여기서 돌려주는 값과 함수만 쓰면 됩니다.
import { useState, useRef, useEffect } from "react";
import { CHALLENGES_TO_LEVEL_UP, CORRECT_PER_CHALLENGE, NEXT_QUESTION_DELAY_SEC, SHOW_ANSWER_MS, nextLevelOf } from "./constants.js";
import { createSessionPlan, shuffle } from "./session.js";
import { isCorrectAnswer } from "./judge.js";
import * as storage from "./storage.js";

/*
 * 채점 규칙 요약
 *  - 힌트·정답 보기 없이 처음 맞히면 "정답"(진행바 +1).
 *  - 힌트(?)나 정답 버튼을 누르는 순간 그 문제는 "오답"으로 기록.
 *  - 틀린 답을 제출하는 것만으로는 아무것도 기록하지 않음(다시 입력 가능).
 *  - 오답·힌트·정답 보기를 한 문제는 내일 복습 목록에 저장.
 *  - 20개를 다 풀었는데 진행바가 덜 찼으면, 못 맞힌 문제만 "재도전"으로 다시 냄.
 *    재도전 중에는 도전 문제가 나오지 않음.
 */
export function useGame() {
  // ----- 화면 -----
  const [screen, setScreen] = useState("start"); // "start" | "game" | "result"

  // ----- 문제 진행 -----
  const [questions, setQuestions] = useState([]); // 출제 목록 (plan.list 의 복사본)
  const [index, setIndex] = useState(0); //          지금 문제 위치
  const [input, setInput] = useState(""); //         빈칸에 입력 중인 글자
  // null(풀이 중) | "correct" | "wrong"(틀린 답 제출) | "showAnswer"(정답 보기 중)
  const [status, setStatus] = useState(null);
  const [score, setScore] = useState({ correct: 0, wrong: 0 }); // 진행바 숫자
  const [isScored, setIsScored] = useState(false); // 이 문제가 이미 정답/오답으로 기록됐는지
  const [hintOn, setHintOn] = useState(false);
  const [wrongList, setWrongList] = useState([]); // 이번 세션에서 틀린 문제 (결과 화면용)
  const [countdown, setCountdown] = useState(null); // 정답 후 다음 문제까지 남은 초
  const [shaking, setShaking] = useState(false); //   오답 시 카드 흔들림
  const [selectedWord, setSelectedWord] = useState(null); // 탭한 사전 단어 {word, yomi, ko, key}

  // ----- 곰 표정 -----
  const [bearMood, setBearMood] = useState("idle"); // "idle" | "correct" | "wrong"

  // ----- 레벨 -----
  const [myLevel, setMyLevel] = useState(storage.loadMyLevel());
  const [promotion, setPromotion] = useState(storage.loadPromotionProgress()); // 도전 문제 맞힌 수
  const [leveledUpTo, setLeveledUpTo] = useState(null); // 이번 세션에 오른 레벨 (결과 화면용)

  // 시작 화면 새로고침용 (기록 초기화 후 다시 그리기)
  const [, setRefreshKey] = useState(0);

  // 세션 계획(출제 목록, 진행 카운트 등). 렌더링과 무관하게 즉시 갱신해야 해서 ref 사용.
  const planRef = useRef(null);
  const countdownTimer = useRef(null);
  const showAnswerTimer = useRef(null);

  const clearTimers = () => {
    clearInterval(countdownTimer.current);
    clearTimeout(showAnswerTimer.current);
  };
  useEffect(() => clearTimers, []); // 화면이 사라질 때 타이머 정리

  /** 다음 문제를 위해 문제별 상태를 초기화 */
  const resetQuestionState = () => {
    setStatus(null);
    setInput("");
    setHintOn(false);
    setBearMood("idle");
    setCountdown(null);
    setIsScored(false);
    setSelectedWord(null);
  };

  /** 틀린 문제 목록에 추가 + 내일 복습용으로 저장 (중복 제외) */
  const recordWrong = (question) => {
    setWrongList((list) => {
      if (list.find((q) => q.id === question.id)) return list;
      storage.saveWrongQuestion(question);
      return [...list, question];
    });
  };

  // ===== 세션 시작 =====
  const startSession = () => {
    clearTimers();
    const level = storage.loadMyLevel();
    setMyLevel(level);
    setPromotion(storage.loadPromotionProgress());
    setLeveledUpTo(null);

    const plan = createSessionPlan(level);
    planRef.current = plan;
    setQuestions(plan.list.slice());
    setIndex(0);
    setScore({ correct: 0, wrong: 0 });
    setWrongList([]);
    resetQuestionState();
    setScreen("game");
  };

  // ===== 다음 문제로 =====
  const goToNext = (fromIndex) => {
    clearTimers();
    const plan = planRef.current;
    const nextIndex = fromIndex + 1;
    let hasMore = plan.correctCount < plan.total && nextIndex < plan.list.length;

    // 목록을 다 돌았는데 진행바가 덜 찼으면 → 이번 회차에서 못 맞힌 문제를 재도전으로 추가
    if (!hasMore && plan.correctCount < plan.total) {
      const missed = plan.list.slice(plan.retryStart).filter((_, i) => !plan.solvedIndexes.has(plan.retryStart + i));
      if (missed.length) {
        if (plan.firstPassCorrect == null) plan.firstPassCorrect = plan.correctCount;
        plan.retryStart = plan.list.length;
        plan.list = plan.list.concat(shuffle(missed));
        setQuestions(plan.list.slice());
        hasMore = true;
      }
    }

    if (!hasMore) {
      // 세션 완료: 이번에 낸 현재 레벨 문제를 "출제됨"으로 기록
      const level = storage.loadMyLevel();
      storage.addDoneIds(plan.list.filter((q) => q._level === level).map((q) => q.id));
      setScreen("result");
    } else {
      setIndex(nextIndex);
      resetQuestionState();
    }
  };

  /** 정답을 맞혔을 때 도전 문제/레벨 업 처리 */
  const handleFirstTryCorrect = (question, at) => {
    const plan = planRef.current;
    plan.solvedIndexes.add(at);
    plan.correctCount++;
    setScore((s) => ({ ...s, correct: s.correct + 1 }));

    const nextLevel = nextLevelOf(storage.loadMyLevel());
    if (nextLevel && question._level === nextLevel) {
      // 도전 문제를 맞힘 → 레벨 업 진행도 +1
      const progress = storage.loadPromotionProgress() + 1;
      if (progress >= CHALLENGES_TO_LEVEL_UP) {
        storage.saveMyLevel(nextLevel);
        storage.savePromotionProgress(0);
        setMyLevel(nextLevel);
        setPromotion(0);
        setLeveledUpTo(nextLevel);
      } else {
        storage.savePromotionProgress(progress);
        setPromotion(progress);
      }
      return;
    }

    // 현재 레벨(또는 복습) 문제를 맞힘 → 5개마다 다음 순서에 도전 문제 1개 끼워 넣기
    plan.streakForChallenge++;
    const isFirstPass = plan.retryStart === 0;
    if (isFirstPass && plan.streakForChallenge >= CORRECT_PER_CHALLENGE && plan.challengePool.length && at + 1 < plan.list.length) {
      plan.streakForChallenge = 0;
      const challenge = plan.challengePool.shift();
      plan.list.splice(at + 1, 0, challenge);
      plan.list.pop(); // 총 20문제를 유지하려고 맨 끝 문제 하나를 뺌
      setQuestions(plan.list.slice());
    }
  };

  // ===== 답 제출 (↵) =====
  const submit = () => {
    if (!input.trim() || status === "correct") return;
    const question = questions[index];

    if (isCorrectAnswer(input, question.blank)) {
      setStatus("correct");
      setBearMood("correct");
      if (!isScored) {
        setIsScored(true);
        handleFirstTryCorrect(question, index);
      }
      // 3초 카운트다운 후 다음 문제
      const at = index;
      let left = NEXT_QUESTION_DELAY_SEC;
      setCountdown(left);
      countdownTimer.current = setInterval(() => {
        left--;
        setCountdown(left);
        if (left <= 0) {
          clearInterval(countdownTimer.current);
          setCountdown(null);
          goToNext(at);
        }
      }, 1000);
    } else {
      // 틀린 답: 기록은 하지 않고, 빈칸을 비우고 카드를 흔듦
      setStatus("wrong");
      setBearMood("wrong");
      setInput("");
      recordWrong(question);
      setShaking(true);
      setTimeout(() => setShaking(false), 450);
    }
  };

  // ===== 정답 보기 =====
  const showAnswer = () => {
    if (status === "correct") return;
    const question = questions[index];
    recordWrong(question);
    if (!isScored) {
      setIsScored(true);
      setScore((s) => ({ ...s, wrong: s.wrong + 1 }));
    }
    setStatus("showAnswer");
    setBearMood("wrong");
    setInput(question.blank);
    // 2초 뒤 빈칸을 비워서 직접 입력하게 함
    clearTimeout(showAnswerTimer.current);
    showAnswerTimer.current = setTimeout(() => {
      setStatus(null);
      setBearMood("idle");
      setInput("");
    }, SHOW_ANSWER_MS);
  };

  // ===== 힌트 (?) =====
  const toggleHint = () => {
    if (!hintOn) {
      if (!isScored) {
        // 힌트를 처음 켜는 순간 오답으로 기록
        setIsScored(true);
        setScore((s) => ({ ...s, wrong: s.wrong + 1 }));
        recordWrong(questions[index]);
      }
      setInput(""); // 빈칸을 비워야 힌트가 보임
    }
    setHintOn((on) => !on);
  };

  // ===== 자판 입력 =====
  const canType = status !== "correct" && status !== "showAnswer";
  const typeText = (text) => canType && setInput((v) => v + text);
  const editLast = (fn) => canType && setInput((v) => fn(v));
  const backspace = () => setInput((v) => v.slice(0, -1));

  // ===== 홈으로 / 초기화 =====
  const goHome = () => {
    clearTimers(); // 정답 카운트다운 중에 나가도 다음 문제로 넘어가지 않게
    setScreen("start");
  };
  const resetProgress = () => {
    storage.resetAllProgress();
    setMyLevel("N5");
    setPromotion(0);
    setRefreshKey((k) => k + 1);
  };

  // ===== 화면에서 쓸 파생 값 =====
  const plan = planRef.current;
  const current = questions[index] || null;
  const currentTag = current && current._level; // "review" | "N5" ...
  const badgeLevel = !currentTag || currentTag === "review" ? myLevel : currentTag;

  return {
    screen,
    // 시작 화면
    myLevel,
    promotion,
    startSession,
    resetProgress,
    // 게임 화면
    current,
    input,
    status,
    score,
    total: plan ? plan.total : 0,
    hintOn,
    countdown,
    shaking,
    bearMood,
    selectedWord,
    setSelectedWord,
    badgeLevel,
    isReview: !!current && !!plan && plan.reviewIds.includes(current.id),
    isChallenge: !!currentTag && currentTag !== "review" && currentTag !== myLevel,
    isRetry: !!plan && plan.retryStart > 0 && index >= plan.retryStart,
    answerRevealed: status === "correct" || status === "showAnswer",
    submit,
    showAnswer,
    toggleHint,
    typeText,
    editLast,
    backspace,
    goHome,
    // 결과 화면
    firstPassCorrect: plan ? (plan.firstPassCorrect != null ? plan.firstPassCorrect : plan.correctCount) : 0,
    wrongList,
    reviewCount: plan ? plan.reviewIds.length : 0,
    leveledUpTo,
  };
}
