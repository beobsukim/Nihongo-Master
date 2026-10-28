// ===== 세션(20문제) 만들기 =====
import { QUESTIONS } from "../data/questions.js";
import { SESSION_SIZE, MAX_REVIEW_PER_SESSION, CORRECT_PER_CHALLENGE, nextLevelOf } from "./constants.js";
import { loadReviewQuestions, loadDoneIds } from "./storage.js";

/** 배열을 무작위로 섞은 새 배열 */
export function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

/** 문제마다 출처 표시(_level)를 붙입니다: "review" | "N5" ... */
const tag = (list, level) => list.map((q) => ({ ...q, _level: level }));

/**
 * 새 세션 계획을 만듭니다.
 *
 * 출제 구성:
 *  - 복습 문제: 어제 이전 틀린 문제 최대 5개
 *  - 현재 레벨 문제: 나머지 (아직 안 나온 문제 우선, 다 나왔으면 전체에서)
 *  - 도전 문제 후보(challengePool): 다음 레벨 문제. 처음엔 목록에 없고,
 *    현재 레벨을 5개 맞힐 때마다 하나씩 다음 순서에 끼워 넣습니다(useGame.js).
 *
 * @returns 세션 진행 상태 객체. useGame 이 ref 로 들고 다니며 갱신합니다.
 */
export function createSessionPlan(myLevel) {
  const nextLevel = nextLevelOf(myLevel);
  const levelQuestions = QUESTIONS[myLevel] || QUESTIONS.N5;

  const review = loadReviewQuestions().slice(0, MAX_REVIEW_PER_SESSION);
  const regularCount = SESSION_SIZE - review.length;

  // 아직 안 나온 문제 우선
  const doneIds = new Set(loadDoneIds());
  let candidates = levelQuestions.filter((q) => !doneIds.has(q.id));
  if (candidates.length < regularCount) candidates = [...levelQuestions];
  const regular = shuffle(candidates).slice(0, regularCount);

  // 도전 문제 후보: 세션 안에서 낼 수 있는 최대 개수만큼 미리 뽑아 둠
  const maxChallenges = nextLevel ? Math.floor(regularCount / CORRECT_PER_CHALLENGE) : 0;
  const challengePool = maxChallenges > 0 ? tag(shuffle(QUESTIONS[nextLevel]).slice(0, maxChallenges), nextLevel) : [];

  const list = shuffle([...tag(review, "review"), ...tag(regular, myLevel)]);

  return {
    list, //               출제 순서 (도전·재도전 문제가 끼워지면 늘어남)
    total: list.length, // 진행바 목표치 (= 20)
    correctCount: 0, //    한 번에 맞힌 문제 수 (진행바)
    solvedIndexes: new Set(), // 한 번에 맞힌 문제의 list 위치
    challengePool, //      남은 도전 문제 후보
    streakForChallenge: 0, // 도전 문제를 내기 위한 "현재 레벨 정답" 카운트
    retryStart: 0, //      재도전 회차가 시작된 list 위치 (0이면 첫 회차)
    firstPassCorrect: null, // 첫 회차에서 맞힌 수 (결과 화면용, 재도전 시작 때 기록)
    reviewIds: review.map((q) => q.id),
  };
}
