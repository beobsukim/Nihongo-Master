# 日本語マスター (일본어 빈칸 단어 게임)

미니룸 스타일의 JLPT 일본어 단어 게임입니다. 한국어 뜻을 보고 일본어 문장의 빈칸을 가나 자판으로 채웁니다.
React + Vite 로 만들었고, Capacitor 로 감싸면 아이폰·안드로이드 앱이 됩니다.

## 실행하기

[Node.js](https://nodejs.org) (LTS 버전)를 설치한 뒤, 이 폴더에서:

```bash
npm install      # 처음 한 번만 (필요한 라이브러리 설치)
npm run dev      # 개발 서버 실행 → 터미널에 나오는 주소를 브라우저로 열기
npm run build    # 배포용 파일을 dist/ 폴더에 만들기
```

`npm run dev` 실행 중에는 파일을 고치고 저장하면 브라우저에 바로 반영됩니다.
같은 와이파이의 휴대폰에서 보려면 `npm run dev -- --host` 로 실행하고 터미널에 나오는 Network 주소로 접속하세요.

## 폴더 구조

```
index.html                 HTML 뼈대 (폰트 불러오기)
src/
├─ main.jsx                진입점: App 을 화면에 그림
├─ App.jsx                 지금 화면(시작/게임/결과)을 고름
├─ styles.css              전역 스타일, 벽지, 애니메이션
├─ theme.js                색상, 폰트, 픽셀 테두리(pixelBox)
│
├─ data/                   ── 데이터 (여기만 고쳐서 문제 추가 가능)
│  ├─ questions.js         레벨별 문제 (N5 200개, N4~N1 각 50개)
│  └─ dictionary.js        단어 사전 (탭하면 뜻 보여주기)
│
├─ game/                   ── 게임 로직 (화면과 분리)
│  ├─ constants.js         규칙 숫자: 20문제, 복습 5개, 도전 5개마다, 레벨업 25개 …
│  ├─ useGame.js           ★ 게임 상태와 동작 전부 (제출, 힌트, 정답 보기, 다음 문제, 레벨업)
│  ├─ session.js           세션 20문제 뽑기 (복습 + 현재 레벨 + 도전 후보)
│  ├─ storage.js           학습 기록 저장/불러오기 (localStorage)
│  ├─ judge.js             정답 판정
│  ├─ kana.js              히라가나↔가타카나, ゛゜小 변환, 자판 배열
│  └─ tokenize.js          문장을 사전 단어 단위로 나누기
│
├─ screens/                ── 화면 3개
│  ├─ StartScreen.jsx      시작 화면
│  ├─ GameScreen.jsx       게임 화면 (아래 부품들을 조립)
│  └─ ResultScreen.jsx     결과 화면
│
└─ components/             ── 화면 부품
   ├─ SessionProgress.jsx  상단 닫기 버튼 + 진행바 (♥ 맞힘 / ✕ 틀림 / 20)
   ├─ QuestionCard.jsx     문제 카드: 뜻, 문장, 빈칸(입력창), 정답·힌트 버튼
   ├─ GameRoom.jsx         카드와 자판 사이의 방: 곰 + 말풍선 + 가구
   ├─ KanaKeyboard.jsx     가나 자판 (あ/ア 전환, ゛ ゜ 小 ー ⌫ ↵)
   ├─ Bear.jsx             곰 인형 캐릭터 (대기 / 정답 / 오답 표정)
   ├─ SpeechBubble.jsx     말풍선
   ├─ Room.jsx             바닥, 시작·결과 화면의 큰 방 배경
   ├─ Furniture.jsx        창문, 액자, 책장, 화분, 책, 러그
   ├─ PixelArt.jsx         픽셀 그림 도구 (SVG 사각형)
   └─ Common.jsx           배지, 진행 막대, 큰 버튼 스타일
```

데이터는 `data/` 에서 `game/` 으로, `game/useGame.js` 에서 `screens/` 로, `screens/` 에서 `components/` 로 흐릅니다.
`game/` 폴더는 화면을 전혀 모르기 때문에, 디자인을 통째로 바꿔도 규칙은 그대로 유지됩니다.

## 게임 규칙 (코드 위치)

| 규칙 | 위치 |
| --- | --- |
| 한 세션 20문제, 진행바가 20이 되면 완료 | `constants.js` `SESSION_SIZE`, `useGame.js` `goToNext` |
| 어제 이전 틀린 문제 최대 5개 복습 | `session.js` `createSessionPlan`, `storage.js` `loadReviewQuestions` |
| 현재 레벨 5개 맞힐 때마다 다음 레벨 "도전!" 1문제 | `useGame.js` `handleFirstTryCorrect` |
| 도전 문제 25개 맞히면 레벨 업 | `useGame.js` `handleFirstTryCorrect` |
| 힌트·정답 보기 없이 처음 맞혀야 정답 | `useGame.js` `submit` / `toggleHint` / `showAnswer` |
| 틀린 답 제출은 기록 안 함, 빈칸만 비움 | `useGame.js` `submit` |
| 못 맞힌 문제는 "재도전"으로 반복 (재도전 중엔 도전 문제 없음) | `useGame.js` `goToNext` |
| 정답 판정: 글자가 같아야 함, 히라가나=가타카나 | `judge.js` |

## 자주 할 작업

**문제 추가하기**: `src/data/questions.js` 의 해당 레벨 배열에 한 줄 추가합니다. `id` 는 겹치지 않게 해 주세요.

```js
{"id":201,"sentence":"___を飲みます。","blank":"おちゃ","meaning":"차를 마십니다."},
```

문장에 나오는 단어의 뜻을 탭해서 보게 하려면 `src/data/dictionary.js` 에도 추가합니다.

**규칙 숫자 바꾸기**: `src/game/constants.js` 의 숫자만 고치면 됩니다.

**색 바꾸기**: `src/theme.js` 의 `COLORS` 를 고칩니다.

## 앱으로 출시하기 (Capacitor)

웹 화면을 그대로 앱에 넣는 방식입니다. 아래는 큰 흐름이고, 자세한 건 [Capacitor 공식 문서](https://capacitorjs.com/docs/getting-started)를 함께 보세요.

```bash
npm install @capacitor/core
npm install -D @capacitor/cli
npx cap init "日本語マスター" com.example.nihongo --web-dir dist   # 앱 이름, 앱 ID(본인 도메인 거꾸로)
npm install @capacitor/ios @capacitor/android

npm run build          # dist/ 생성
npx cap add ios        # 처음 한 번
npx cap add android    # 처음 한 번
npx cap sync           # 코드를 고칠 때마다: build 후 sync
npx cap open ios       # Xcode 로 열기 (Mac 필요)
npx cap open android   # Android Studio 로 열기
```

- 아이폰 앱을 만들려면 Mac 과 Xcode 가 필요하고, App Store 에 올리려면 Apple Developer Program 가입이 필요합니다.
- 안드로이드는 Android Studio 와 Google Play Console 계정이 필요합니다.

## 출시 전에 손보면 좋은 점 (개선 후보)

1. **폰트 내장**: 지금은 DotGothic16 을 인터넷(Google Fonts)에서 받아옵니다. 오프라인에서도 같은 모양이 나오게 하려면 폰트 파일(.woff2)을 `public/fonts/` 에 넣고 `styles.css` 에 `@font-face` 로 등록하세요. (DotGothic16 은 SIL Open Font License 라 앱에 포함할 수 있습니다.)
2. **날짜 기준**: `storage.js` 의 `todayKey()` 가 UTC 기준이라 한국 시간 오전 9시에 날짜가 바뀝니다. 자정 기준으로 하려면 현지 날짜로 만드세요.
3. **복습 문제 정리**: 틀린 문제 기록은 지금 지워지지 않아서, 복습 때 맞혀도 계속 복습 후보로 남고 오래된 순서대로 5개만 나옵니다. "복습에서 맞히면 목록에서 빼기" 같은 규칙을 정하면 좋습니다.
4. **기록 백업**: localStorage 는 앱을 지우면 함께 지워집니다. 기기 변경 후에도 기록을 유지하려면 로그인 + 서버 저장이 필요합니다.
5. **아이폰 노치·홈 바**: 앱에서 화면이 노치나 홈 바에 가리면 `env(safe-area-inset-top)` / `env(safe-area-inset-bottom)` 로 위아래 여백을 주세요.

## 이전 웹 버전과 달라진 점

동작과 화면은 같게 옮겼고, 아래 두 가지만 고쳤습니다.

- 정답 카운트다운(3초) 중에 ✕ 로 나가면, 시작 화면에서 다음 문제로 넘어가는 동작이 뒤늦게 실행되던 문제
- "학습 기록 초기화"를 눌러도 시작 화면 표시가 바로 바뀌지 않던 문제
