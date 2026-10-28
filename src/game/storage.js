// ===== 학습 기록 저장 (localStorage) =====
// 기기(브라우저/앱) 안에만 저장됩니다. 앱을 지우면 기록도 사라집니다.
// 키 이름은 이전 웹 버전과 같게 유지했습니다.

const KEY_WRONG = "jpgame_wrong"; // { "YYYY-MM-DD": [문제, ...] } 날짜별 틀린 문제
const KEY_DONE = "jpgame_done"; // [문제 id, ...] 이미 출제된 현재 레벨 문제
const KEY_LEVEL = "jpgame_mylevel"; // "N5" 등 내 레벨
const KEY_PROMO = "jpgame_nextprog"; // 도전 문제 맞힌 수 (레벨 업 진행도)

function load(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null; // 저장소를 못 쓰는 환경(사생활 보호 모드 등)
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 저장 실패는 무시 (게임은 계속 진행)
  }
}

/**
 * 오늘 날짜 키 "YYYY-MM-DD".
 * 참고: toISOString() 은 UTC 기준이라 한국 시간으로는 오전 9시에 날짜가 바뀝니다.
 * 한국 날짜 기준으로 바꾸려면 README의 "개선 후보"를 참고하세요.
 */
function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

// ----- 틀린 문제 (복습) -----

/** 틀린 문제를 오늘 날짜에 기록합니다. 같은 날 같은 문제는 한 번만 저장. */
export function saveWrongQuestion(question) {
  const all = load(KEY_WRONG) || {};
  const today = todayKey();
  if (!all[today]) all[today] = [];
  if (!all[today].find((q) => q.id === question.id)) all[today].push(question);
  save(KEY_WRONG, all);
}

/** 어제 이전에 틀린 문제 목록 (중복 제거). 오늘 틀린 건 내일부터 복습됩니다. */
export function loadReviewQuestions() {
  const all = load(KEY_WRONG) || {};
  const today = todayKey();
  const seen = new Set();
  const result = [];
  for (const [date, list] of Object.entries(all)) {
    if (date < today) {
      list.forEach((q) => {
        if (!seen.has(q.id)) {
          seen.add(q.id);
          result.push(q);
        }
      });
    }
  }
  return result;
}

// ----- 출제 기록 -----

/** 이미 출제된 문제 id 목록 */
export function loadDoneIds() {
  return load(KEY_DONE) || [];
}

/** 출제된 문제 id를 기록에 추가 */
export function addDoneIds(ids) {
  save(KEY_DONE, [...new Set([...loadDoneIds(), ...ids])]);
}

// ----- 레벨 -----

export function loadMyLevel() {
  return load(KEY_LEVEL) || "N5";
}

export function saveMyLevel(level) {
  save(KEY_LEVEL, level);
}

/** 레벨 업 진행도 = 도전 문제 맞힌 수 */
export function loadPromotionProgress() {
  return load(KEY_PROMO) || 0;
}

export function savePromotionProgress(count) {
  save(KEY_PROMO, count);
}

// ----- 초기화 -----

/** 모든 학습 기록을 지우고 N5부터 다시 시작 */
export function resetAllProgress() {
  save(KEY_WRONG, {});
  save(KEY_DONE, []);
  save(KEY_LEVEL, "N5");
  save(KEY_PROMO, 0);
}
