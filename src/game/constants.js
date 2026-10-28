// ===== 게임 규칙 숫자 모음 =====
// 규칙을 바꾸고 싶으면 여기 숫자만 고치면 됩니다.

/** 레벨 순서 (쉬운 것 → 어려운 것) */
export const LEVELS = ["N5", "N4", "N3", "N2", "N1"];

/** 한 세션의 문제 수 (진행바가 이만큼 차면 세션 완료) */
export const SESSION_SIZE = 20;

/** 한 세션에 섞어 넣는 어제 이전 틀린 문제(복습) 최대 개수 */
export const MAX_REVIEW_PER_SESSION = 5;

/** 현재 레벨 문제를 이만큼 한 번에 맞히면 다음 레벨 "도전!" 문제를 1개 냅니다 */
export const CORRECT_PER_CHALLENGE = 5;

/** 도전 문제를 이만큼 맞히면 레벨 업 */
export const CHALLENGES_TO_LEVEL_UP = 25;

/** 정답 후 다음 문제로 넘어가기까지 초 */
export const NEXT_QUESTION_DELAY_SEC = 3;

/** "정답" 버튼으로 정답을 보여주는 시간(ms). 이후 빈칸이 다시 비워집니다 */
export const SHOW_ANSWER_MS = 2000;

/** 다음 레벨 이름. 마지막 레벨(N1)이면 null */
export function nextLevelOf(level) {
  const i = LEVELS.indexOf(level);
  return i >= 0 && i < LEVELS.length - 1 ? LEVELS[i + 1] : null;
}
