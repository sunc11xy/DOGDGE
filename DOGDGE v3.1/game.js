const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const revivesEl = document.getElementById("revives");
const blindTopEl = document.getElementById("blindTop");
const sideScoreEl = document.getElementById("sideScore");
const recordBadgeEl = document.getElementById("recordBadge");
const celebrateBtn = document.getElementById("celebrateBtn");
const leaderboardBtn = document.getElementById("leaderboardBtn");
const changelogBtn = document.getElementById("changelogBtn");
const hudEl = document.querySelector(".hud");
const levelSelect = document.getElementById("levelSelect");
const langSelect = document.getElementById("langSelect");
const startBtn = document.getElementById("startBtn");
const reviveBtn = document.getElementById("continueBtn");
const pauseBtn = document.getElementById("pauseBtn");
const playerColorPicker = document.getElementById("playerColorPicker");
const playerFramePicker = document.getElementById("playerFramePicker");
const playerShapeSelect = document.getElementById("playerShapeSelect");
const obstacleColorPicker = document.getElementById("obstacleColorPicker");
const obstacleFramePicker = document.getElementById("obstacleFramePicker");
const obstacleColorRow = document.querySelector(".obstacle-color-row");
const obstacleFrameRow = document.querySelector(".obstacle-frame-row");
const blindInfoModal = document.getElementById("blindInfoModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const leaderboardModal = document.getElementById("leaderboardModal");
const closeLeaderboardBtn = document.getElementById("closeLeaderboardBtn");
const leaderboardListEl = document.getElementById("leaderboardList");
const levelInfoTitleEl = document.getElementById("levelInfoTitle");
const levelInfoSummaryEl = document.getElementById("levelInfoSummary");
const levelInfoListEl = document.getElementById("levelInfoList");
const gameTitleEl = document.getElementById("gameTitle");
const gameSubtitleEl = document.getElementById("gameSubtitle");
const levelSelectLabelEl = document.getElementById("levelSelectLabel");
const langSelectLabelEl = document.getElementById("langSelectLabel");
const customizeTitleEl = document.getElementById("customizeTitle");
const playerColorLabelEl = document.getElementById("playerColorLabel");
const playerFrameLabelEl = document.getElementById("playerFrameLabel");
const playerShapeLabelEl = document.getElementById("playerShapeLabel");
const obstacleColorLabelEl = document.getElementById("obstacleColorLabel");
const obstacleFrameLabelEl = document.getElementById("obstacleFrameLabel");
const scoreLabelEl = document.getElementById("scoreLabel");
const bestLabelEl = document.getElementById("bestLabel");
const revivesLabelEl = document.getElementById("revivesLabel");
const scoreTextEl = document.getElementById("scoreText");
const bestTextEl = document.getElementById("bestText");
const revivesTextEl = document.getElementById("revivesText");
const leaderboardTitleEl = document.getElementById("leaderboardTitle");
const codePanelTitleEl = document.getElementById("codePanelTitle");
const codeLogEl = document.getElementById("codeLog");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();

const BASE_AREA = 520 * 680;
const BASE_SPAWN_INTERVAL = 0.5;
const WARNING_SECONDS = 3;
const DEFAULT_EVENT_TARGET_COUNT = 7;
const DEFAULT_EVENT_GAP_MIN = 20;
const DEFAULT_EVENT_GAP_MAX = 42;
// Position controls for the Level 3 start prompt.
const LEVEL3_START_PROMPT_OFFSET_X = 0;
const LEVEL3_START_PROMPT_OFFSET_Y = 155;
const OVERLAY_TYPE_MS_PER_CHAR = 42;
const MODAL_TRANSITION_MS = 220;
const CODE_LOG_MAX_LINES = 14;
const LANGUAGES = ["en", "zh"];
const I18N = {
  en: {
    gameTitle: "DOG Duh",
    subtitle: "Move with WASD or with arrows. Survive as long as possible.",
    level: "Level",
    language: "Language",
    customize: "Customize",
    playerColor: "Player Color",
    playerFrame: "Player Frame",
    playerShape: "Player Shape",
    playerShapeSquare: "Square",
    playerShapePentagon: "Pentagon",
    playerShapeCircle: "Circle",
    playerShapeTriangle: "Triangle",
    playerShapeDiamond: "Diamond",
    obstacleColor: "Obstacle Color",
    obstacleFrame: "Obstacle Frame",
    score: "Score",
    best: "Best",
    revives: "Revives",
    codePanelTitle: "Config Console",
    leaderboardBtn: "Leaderboard",
    changelogBtn: "Changelog",
    startBtn: "Start / Restart",
    reviveBtn: "Revive",
    pause: "Pause",
    resume: "Resume",
    close: "Close",
    understand: "I understand",
    celebrateAgain: "Celebrate Again",
    leaderboardTitle: "Leaderboard (Top 5)",
    level1Label: "Level 1 - MiniSkirt",
    level2Label: "Level 2 - Chu",
    level3Label: "Level 3 - RUDE!",
    level1Title: "Level 1 - MiniSkirt",
    level2Title: "Level 2 - Chu",
    level3Title: "Level 3 - RUDE!",
    surviveFor: "Survive for {duration}.",
    level1Bullet1: "Obstacle flow: top to bottom.",
    level1Bullet2: "BLIND events: yes (with 3-second warning).",
    level1Bullet3: "BLIND duration shrinks as speed increases.",
    level2Bullet1: "Obstacle flow starts left-to-right only.",
    level2Bullet2: "Random REVERSE events switch direction to right-to-left (and back).",
    level2Bullet3: "No color reverse.",
    level3Bullet1: "No BLIND and no REVERSE.",
    level3Bullet2: "Direction phases switch over time, with 3-second switch warnings.",
    level3Bullet3: "No BLANK and no half-screen effects.",
    switchingIn: "SWITCHING IN {value}s",
    blind: "BLIND",
    blindIn: "BLIND IN {value}s",
    reverseNow: "REVERSE!",
    reverseIn: "REVERSE IN {value}s",
    paused: "Paused",
    pressSpaceContinue: "Press Space to continue",
    pressToStart: "press to start",
    gameOver: "Game Over",
    gameOverWithRevive: "Press Start to restart or C to revive",
    gameOverNoRevive: "Press Start to try again",
    youWin: "YOU WIN",
    accomplished: "you've accomplished",
    firstPlayer: "{date} - First Player to Complete",
    revivesUsed: "Revivals used: {used} / {max}",
    secretComboHint: "Secret: Hold Shift + type D O G before start",
    newRecord: "NEW RECORD!",
  },
  zh: {
    gameTitle: "DOG Duh",
    subtitle: "用 WASD 或方向键移动，尽可能久地生存。",
    level: "关卡",
    language: "语言",
    customize: "自定义",
    playerColor: "玩家颜色",
    playerFrame: "玩家边框",
    playerShape: "玩家形状",
    playerShapeSquare: "正方形",
    playerShapePentagon: "五边形",
    playerShapeCircle: "圆形",
    playerShapeTriangle: "三角形",
    playerShapeDiamond: "菱形",
    obstacleColor: "障碍颜色",
    obstacleFrame: "障碍边框",
    score: "分数",
    best: "最佳",
    revives: "复活",
    codePanelTitle: "配置控制台",
    leaderboardBtn: "排行榜",
    changelogBtn: "更新日志",
    startBtn: "开始 / 重开",
    reviveBtn: "复活",
    pause: "暂停",
    resume: "继续",
    close: "关闭",
    understand: "我知道了",
    celebrateAgain: "再庆祝一次",
    leaderboardTitle: "排行榜（前 5）",
    level1Label: "第 1 关 - MiniSkirt",
    level2Label: "第 2 关 - Chu",
    level3Label: "第 3 关 - RUDE!",
    level1Title: "第 1 关 - MiniSkirt",
    level2Title: "第 2 关 - Chu",
    level3Title: "第 3 关 - RUDE!",
    surviveFor: "生存 {duration}。",
    level1Bullet1: "障碍方向：由上到下。",
    level1Bullet2: "有 BLIND（提前 3 秒预警）。",
    level1Bullet3: "随着速度提升，BLIND 时间会缩短。",
    level2Bullet1: "障碍先只从左往右。",
    level2Bullet2: "会随机触发 REVERSE，切换为右往左（再切回）。",
    level2Bullet3: "不再有颜色反转。",
    level3Bullet1: "没有 BLIND，也没有 REVERSE。",
    level3Bullet2: "方向会分阶段切换，并提前 3 秒提示。",
    level3Bullet3: "没有 BLANK，也没有半屏效果。",
    switchingIn: "{value}s 后切换",
    blind: "BLIND",
    blindIn: "{value}s 后 BLIND",
    reverseNow: "反转！",
    reverseIn: "{value}s 后反转",
    paused: "已暂停",
    pressSpaceContinue: "按空格继续",
    pressToStart: "按空格开始",
    gameOver: "游戏结束",
    gameOverWithRevive: "按开始重开，或按 C 复活",
    gameOverNoRevive: "按开始再来一次",
    youWin: "你赢了",
    accomplished: "你已完成",
    firstPlayer: "{date} - First Player to Complete",
    revivesUsed: "复活使用：{used} / {max}",
    secretComboHint: "隐藏：开始前按住 Shift 并输入 D O G",
    newRecord: "新纪录！",
  },
};

// Leaderboard Adjustment Section (Do not change anything else)
const LEADERBOARD_ENTRIES = [
  { name: "Justin SUNCHEN", point: 40, completionLevels: "MiniSkirt-AOA--4/5 Revivals" },
  { name: "Ryo Shoji", point: 25, completionLevels: "MiniSkirt-AOA--5/5 Revivals" },
  { name: "name", point: 0, completionLevels: "Song - Singer - N/5 Revivals" },
  { name: "name", point: 0, completionLevels: "Song - Singer - N/5 Revivals" },
  { name: "name", point: 0, completionLevels: "Song - Singer - N/5 Revivals" },
];

const LEVELS = {
  spaghetti: {
    key: "spaghetti",
    label: "Level 1 - MiniSkirt",
    songLabel: "MINISKIRT - AOA",
    promptLabel: "MINISKIRT",
    audioSrc: "./spaghetti.mp3",
    audioStart: 15,
    audioEnd: 3 * 60 + 15,
    spawnMode: "vertical",
    eventMode: "blind",
    blindStart: 0.7,
    blindMin: 0.1,
    blindShrinkPerSecond: 0.003,
    eventTargetCount: 7,
    eventGapMin: 20,
    eventGapMax: 42,
    playerSpeedMult: 1,
    spawnRateMult: 1,
    hazardCountMult: 1,
    maxHazardsMult: 1,
    bgColor: "#111111",
    hazardColor: "rgba(255, 255, 255, ALPHA)",
    playerColor: "#f2f2f2",
    playerStroke: "#050505",
    confettiColors: ["#ff4d4d", "#ff9f1c", "#ffe14d", "#7dff6b", "#38d9ff", "#7c6bff", "#ff6bd6", "#ffffff"],
  },
  chu: {
    key: "chu",
    label: "Level 2 - Chu",
    songLabel: "Chu - f(x) (Karina/Winter/Seulgi/Irene)",
    promptLabel: "Chu",
    audioSrc: "./Chu.mp3",
    audioStart: 26,
    audioEnd: 3 * 60 + 38,
    spawnMode: "horizontal",
    eventMode: "reverse",
    reverseFlash: 0.8,
    eventTargetCount: 10,
    eventGapMin: 14,
    eventGapMax: 28,
    playerSpeedMult: 1.2,
    spawnRateMult: 0.84,
    hazardCountMult: 0.82,
    maxHazardsMult: 0.8,
    bgColor: "#ffffff",
    hazardColor: "rgba(0, 0, 0, ALPHA)",
    playerColor: "#2a2a2a",
    playerStroke: "#9a9a9a",
    confettiColors: ["#0a0a0a", "#0047ab", "#8b0000", "#2f4f4f", "#006400", "#6a0dad", "#1f2937", "#111111"],
  },
  rude: {
    key: "rude",
    label: "Level 3 - RUDE!",
    songLabel: "RUDE! - Heart2Heart",
    promptLabel: "RUDE!",
    audioSrc: "./Rude.mp3",
    audioStart: 0,
    audioEnd: null,
    spawnMode: "scripted",
    eventMode: "none",
    phaseSchedule: [
      { until: 65, pattern: "down" },
      { until: 80, pattern: "up" },
      { until: 110, pattern: "ltr" },
      { until: 170, pattern: "rtl" },
      { until: Number.POSITIVE_INFINITY, pattern: "mix" },
    ],
    playerSpeedMult: 1.05,
    spawnRateMult: 0.88,
    hazardCountMult: 0.78,
    maxHazardsMult: 0.82,
    hazardSpeedMult: 0.9,
    bgColor: "#0a0a0a",
    hazardColor: "rgba(255, 255, 255, ALPHA)",
    playerColor: "#f2f2f2",
    playerStroke: "#050505",
    confettiColors: ["#ffd166", "#06d6a0", "#118ab2", "#ef476f", "#ffffff", "#ff9f1c", "#7c6bff", "#38d9ff"],
    backgroundVideoSrc: "./Rude.mp4",
  },
};

const state = {
  running: false,
  lang: "en",
  over: false,
  paused: false,
  won: false,
  showcaseWin: false,
  awaitingRevive: false,
  level: "spaghetti",
  score: 0,
  best: 0,
  maxRevives: 5,
  revivesUsed: 0,
  invulnerableUntil: -1,
  time: 0,
  spawnTimer: 0,
  speedScale: 1,
  level2Direction: 1,
  eventsTriggered: 0,
  nextEventAt: Infinity,
  blindActiveUntil: -1,
  reverseFlashUntil: -1,
  recordBadgeUntil: -1,
  recordShownThisRun: false,
  recordConfettiUntil: -1,
  recordConfetti: [],
  confetti: [],
  audio: null,
  audioDuration: 0,
  bgVideo: null,
  playerColor: null,
  playerFrameColor: null,
  playerShape: "square",
  dogMode: false,
  dogComboBuffer: "",
  dogComboLastAt: 0,
  level3ObstacleColor: null,
  level3ObstacleFrame: null,
  player: { x: canvas.width / 2 - 16, y: canvas.height - 90, w: 32, h: 32, speed: 290 },
  hazards: [],
  keys: new Set(),
  touchControl: {
    active: false,
    pointerId: null,
    targetX: 0,
    targetY: 0,
  },
  codeLogLines: [],
  codeLogQueue: [],
  codeTyping: false,
  leaderboardTypingRun: 0,
  startPromptTarget: "",
  startPromptDisplay: "",
  startPromptIndex: 0,
  startPromptTimer: 0,
  pauseTypedStartMs: 0,
  gameOverTypedStartMs: 0,
  winConfettiUntilMs: 0,
  hudDrag: {
    active: false,
    offsetX: 0,
    offsetY: 0,
  },
  levelInfoShown: {
    spaghetti: false,
    chu: false,
    rude: false,
  },
};

function getLevel() {
  return LEVELS[state.level];
}

function t(key, params = {}) {
  const lang = LANGUAGES.includes(state.lang) ? state.lang : "en";
  const dict = I18N[lang] || I18N.en;
  const fallback = I18N.en[key] || key;
  const template = dict[key] || fallback;
  return template.replace(/\{(\w+)\}/g, (_, name) => {
    if (Object.prototype.hasOwnProperty.call(params, name)) return String(params[name]);
    return `{${name}}`;
  });
}

function setPauseButtonLabel() {
  if (!pauseBtn) return;
  pauseBtn.textContent = state.paused ? t("resume") : t("pause");
}

function getPromptColor(levelKey) {
  if (levelKey === "chu") return "#000000";
  if (levelKey === "rude") return "#000000";
  return "#f2f2f2";
}

function getPauseGameOverColor(levelKey) {
  if (levelKey === "chu" || levelKey === "rude") return "#ffffff";
  return "#f2f2f2";
}

function updateStatsLabels() {
  if (scoreTextEl) scoreTextEl.textContent = `${t("score")}:`;
  if (bestTextEl) bestTextEl.textContent = `${t("best")}:`;
  if (revivesTextEl) revivesTextEl.textContent = `${t("revives")}:`;
}

function syncPlayerShapeSelect() {
  if (!playerShapeSelect) return;
  playerShapeSelect.value = state.playerShape || "square";
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function syntaxHighlight(line) {
  const raw = String(line || "");
  if (raw.trimStart().startsWith("//")) {
    return `<span class="tok-comment">${escapeHtml(raw)}</span>`;
  }

  let html = escapeHtml(raw);
  html = html.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, '<span class="tok-str">$1</span>');
  html = html.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="tok-num">$1</span>');
  html = html.replace(/\b(const|let|var|return|if|else|true|false|null)\b/g, '<span class="tok-key">$1</span>');
  html = html.replace(/\b([A-Za-z_$][\w$]*)\s*(?=\()/g, '<span class="tok-fn">$1</span>');
  html = html.replace(/\b([A-Za-z_$][\w$]*)\s*(?==)/g, '<span class="tok-prop">$1</span>');
  return html;
}

function renderCodeLog() {
  if (!codeLogEl) return;
  codeLogEl.innerHTML = state.codeLogLines
    .map(
      (line, idx) =>
        `<div class="code-line"><span class="code-ln">${idx + 1}</span><span class="code-code">${syntaxHighlight(line)}</span></div>`
    )
    .join("");
  codeLogEl.scrollTop = codeLogEl.scrollHeight;
}

function typeNextCodeLine() {
  if (!codeLogEl) return;
  if (state.codeTyping) return;
  if (state.codeLogQueue.length === 0) return;

  const fullLine = state.codeLogQueue.shift();
  let idx = 0;
  state.codeTyping = true;
  state.codeLogLines.push("");
  if (state.codeLogLines.length > CODE_LOG_MAX_LINES) {
    state.codeLogLines = state.codeLogLines.slice(-CODE_LOG_MAX_LINES);
  }
  renderCodeLog();

  const tick = () => {
    idx += 1;
    state.codeLogLines[state.codeLogLines.length - 1] = fullLine.slice(0, idx);
    renderCodeLog();
    if (idx < fullLine.length) {
      window.setTimeout(tick, 10);
      return;
    }
    state.codeTyping = false;
    window.setTimeout(typeNextCodeLine, 80);
  };
  window.setTimeout(tick, 10);
}

function pushCodeLog(command, detail = "") {
  const stamp = new Date().toLocaleTimeString([], { hour12: false });
  const cmd = command.trim().endsWith(";") ? command.trim() : `${command.trim()};`;
  state.codeLogQueue.push(`// ${stamp}`);
  state.codeLogQueue.push(cmd);
  if (detail) state.codeLogQueue.push(`// ${detail}`);
  typeNextCodeLine();
}

function initCodeLog() {
  if (!codeLogEl || state.codeLogLines.length > 0 || state.codeLogQueue.length > 0) return;
  pushCodeLog("dog_duh.init()", `level=${state.level}, lang=${state.lang}`);
}

function isStartPromptBlocked() {
  return Boolean(blindInfoModal && !blindInfoModal.classList.contains("hidden"));
}

function getStartPromptText() {
  const cfg = getLevel();
  const song = cfg.promptLabel || cfg.songLabel || "Song";
  if (cfg.key === "rude") return "RUDE";
  if (state.lang === "zh") return `${song}，${t("pressToStart")}`;
  return `${song}, ${t("pressToStart")}`;
}

function resetStartPromptTyping() {
  state.startPromptTarget = getStartPromptText();
  state.startPromptDisplay = "";
  state.startPromptIndex = 0;
  state.startPromptTimer = 0;
}

function updateStartPromptTyping(dt) {
  if (state.running || state.over || state.won) return;
  if (isStartPromptBlocked()) return;
  if (!state.startPromptTarget) state.startPromptTarget = getStartPromptText();

  const step = 0.042;
  state.startPromptTimer += dt;
  while (state.startPromptTimer >= step && state.startPromptIndex < state.startPromptTarget.length) {
    state.startPromptTimer -= step;
    state.startPromptIndex += 1;
    state.startPromptDisplay = state.startPromptTarget.slice(0, state.startPromptIndex);
  }
}

function getTypedLineState(text, startMs, offsetMs = 0) {
  const total = String(text || "");
  const elapsed = Math.max(0, performance.now() - startMs - offsetMs);
  const maxChars = Math.min(total.length, Math.floor(elapsed / OVERLAY_TYPE_MS_PER_CHAR));
  return {
    shown: total.slice(0, maxChars),
    done: maxChars >= total.length,
  };
}

function drawTypedCenteredLine(text, y, color, font, startMs, offsetMs = 0) {
  const target = String(text || "");
  const { shown } = getTypedLineState(target, startMs, offsetMs);
  ctx.fillStyle = color;
  ctx.font = font;
  const fullWidth = ctx.measureText(`${target} _`).width;
  const startX = canvas.width / 2 - fullWidth / 2;
  ctx.textAlign = "left";
  ctx.fillText(shown, startX, y);
  if (Math.floor(performance.now() / 420) % 2 === 0) {
    const cursorX = startX + ctx.measureText(shown).width;
    ctx.fillText(" _", cursorX, y);
  }
}

function applyLanguage() {
  if (gameTitleEl) gameTitleEl.textContent = t("gameTitle");
  if (gameSubtitleEl) gameSubtitleEl.textContent = t("subtitle");
  if (levelSelectLabelEl) levelSelectLabelEl.textContent = t("level");
  if (langSelectLabelEl) langSelectLabelEl.textContent = t("language");
  if (customizeTitleEl) customizeTitleEl.textContent = t("customize");
  if (playerColorLabelEl) playerColorLabelEl.textContent = t("playerColor");
  if (playerFrameLabelEl) playerFrameLabelEl.textContent = t("playerFrame");
  if (playerShapeLabelEl) playerShapeLabelEl.textContent = t("playerShape");
  if (obstacleColorLabelEl) obstacleColorLabelEl.textContent = t("obstacleColor");
  if (obstacleFrameLabelEl) obstacleFrameLabelEl.textContent = t("obstacleFrame");
  if (leaderboardBtn) leaderboardBtn.textContent = t("leaderboardBtn");
  if (changelogBtn) changelogBtn.textContent = t("changelogBtn");
  if (startBtn) startBtn.textContent = t("startBtn");
  if (reviveBtn) reviveBtn.textContent = t("reviveBtn");
  if (celebrateBtn) celebrateBtn.textContent = t("celebrateAgain");
  if (closeModalBtn) closeModalBtn.textContent = t("understand");
  if (closeLeaderboardBtn) closeLeaderboardBtn.textContent = t("close");
  if (leaderboardTitleEl) leaderboardTitleEl.textContent = t("leaderboardTitle");
  if (codePanelTitleEl) codePanelTitleEl.textContent = t("codePanelTitle");
  if (recordBadgeEl) recordBadgeEl.textContent = t("newRecord");

  if (levelSelect && levelSelect.options.length >= 3) {
    levelSelect.options[0].textContent = t("level1Label");
    levelSelect.options[1].textContent = t("level2Label");
    levelSelect.options[2].textContent = t("level3Label");
  }
  if (playerShapeSelect && playerShapeSelect.options.length >= 5) {
    playerShapeSelect.options[0].textContent = t("playerShapeSquare");
    playerShapeSelect.options[1].textContent = t("playerShapePentagon");
    playerShapeSelect.options[2].textContent = t("playerShapeCircle");
    playerShapeSelect.options[3].textContent = t("playerShapeTriangle");
    playerShapeSelect.options[4].textContent = t("playerShapeDiamond");
  }

  updateStatsLabels();
  setPauseButtonLabel();
  syncPlayerShapeSelect();
  if (!state.running && !state.over && !state.won) {
    state.startPromptTarget = getStartPromptText();
    if (state.startPromptDisplay.length > state.startPromptTarget.length) {
      state.startPromptDisplay = state.startPromptTarget;
      state.startPromptIndex = state.startPromptTarget.length;
    }
  }
}

function getPlayerFillColor() {
  if (state.playerColor) return state.playerColor;
  return getLevel().playerColor;
}

function getPlayerStrokeColor(fillColor) {
  if (state.playerFrameColor) return state.playerFrameColor;
  const hex = String(fillColor || "").trim();
  const match = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!match) return getLevel().playerStroke;
  const value = match[1];
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.6 ? "#111111" : "#f5f5f5";
}

function syncPlayerColorPicker() {
  if (!playerColorPicker) return;
  playerColorPicker.value = getPlayerFillColor();
  if (playerFramePicker) {
    const frame = state.playerFrameColor || getPlayerStrokeColor(getPlayerFillColor());
    playerFramePicker.value = frame;
  }
}

function withAlpha(hexColor, alpha) {
  const hex = String(hexColor || "").trim();
  const match = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!match) return `rgba(255, 255, 255, ${alpha})`;
  const value = match[1];
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function updateLevelScopedControls() {
  if (obstacleColorRow) obstacleColorRow.hidden = false;
  if (obstacleFrameRow) obstacleFrameRow.hidden = false;
}

function syncObstaclePickers() {
  const cfg = getLevel();
  if (obstacleColorPicker) {
    obstacleColorPicker.value = state.level3ObstacleColor || (cfg.key === "chu" ? "#000000" : "#ffffff");
  }
  if (obstacleFramePicker) {
    obstacleFramePicker.value = state.level3ObstacleFrame || (cfg.key === "chu" ? "#2d2d2d" : "#ff69b4");
  }
}

function setTouchTargetFromClient(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * canvas.width;
  const y = ((clientY - rect.top) / rect.height) * canvas.height;
  state.touchControl.targetX = x;
  state.touchControl.targetY = y;
}

function roundedRectPath(x, y, w, h, r) {
  const radius = Math.max(0, Math.min(r, Math.min(w, h) / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawIOSSquare(x, y, size, fillColor, strokeColor, alpha = 1, radius = 6) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = fillColor;
  ctx.fillRect(x, y, size, size);
  ctx.lineWidth = Math.max(1.2, size * 0.08);
  ctx.strokeStyle = strokeColor;
  ctx.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1);
  ctx.restore();
}

function regularPolygonPath(cx, cy, radius, sides, rotation = -Math.PI / 2) {
  ctx.beginPath();
  for (let i = 0; i < sides; i += 1) {
    const angle = rotation + (i * Math.PI * 2) / sides;
    const px = cx + Math.cos(angle) * radius;
    const py = cy + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function drawPlayerShape(x, y, size, fillColor, strokeColor, shape) {
  if (state.dogMode) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `700 ${Math.floor(size * 0.9)}px 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif`;
    ctx.fillText("🐶", x + size / 2, y + size / 2 + 1);
    ctx.restore();
    return;
  }

  if (shape === "square") {
    drawIOSSquare(x, y, size, fillColor, strokeColor, 1, 8);
    return;
  }

  const cx = x + size / 2;
  const cy = y + size / 2;
  const radius = size * 0.48;

  ctx.save();
  ctx.fillStyle = fillColor;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2;

  if (shape === "circle") {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
  } else if (shape === "triangle") {
    regularPolygonPath(cx, cy, radius, 3, -Math.PI / 2);
  } else if (shape === "diamond") {
    regularPolygonPath(cx, cy, radius, 4, 0);
  } else {
    regularPolygonPath(cx, cy, radius, 5, -Math.PI / 2);
  }

  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function openModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove("hidden");
  requestAnimationFrame(() => modalEl.classList.add("open"));
}

function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove("open");
  window.setTimeout(() => {
    if (!modalEl.classList.contains("open")) modalEl.classList.add("hidden");
  }, MODAL_TRANSITION_MS);
}

function renderLeaderboard(typed = false) {
  if (!leaderboardListEl) return;
  leaderboardListEl.innerHTML = "";
  const entries = LEADERBOARD_ENTRIES.slice(0, 5);
  if (!typed) {
    for (let i = 0; i < entries.length; i += 1) {
      const entry = entries[i];
      const li = document.createElement("li");
      li.className = `podium-item rank-${i + 1}`;
      const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🎯";
      li.innerHTML = `<div class="podium-rank">${medal} #${i + 1}</div><div class="podium-text"></div>`;
      li.querySelector(".podium-text").textContent = `${entry.name} - ${entry.point} - ${entry.completionLevels}`;
      leaderboardListEl.appendChild(li);
    }
    return;
  }

  state.leaderboardTypingRun += 1;
  const runId = state.leaderboardTypingRun;
  let idx = 0;

  const typeEntry = () => {
    if (runId !== state.leaderboardTypingRun) return;
    if (idx >= entries.length) return;
    const entry = entries[idx];
    const text = `${entry.name} - ${entry.point} - ${entry.completionLevels}`;
    const li = document.createElement("li");
    li.className = `podium-item rank-${idx + 1}`;
    const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : "🎯";
    li.innerHTML = `<div class="podium-rank">${medal} #${idx + 1}</div><div class="podium-text"></div>`;
    leaderboardListEl.appendChild(li);
    const textEl = li.querySelector(".podium-text");

    let charIndex = 0;
    const typeChar = () => {
      if (runId !== state.leaderboardTypingRun) return;
      charIndex += 1;
      textEl.textContent = text.slice(0, charIndex);
      if (charIndex < text.length) {
        window.setTimeout(typeChar, 11);
        return;
      }
      idx += 1;
      window.setTimeout(typeEntry, 90);
    };
    typeChar();
  };
  typeEntry();
}

function openLeaderboardModal() {
  if (!leaderboardModal) return;
  renderLeaderboard(true);
  openModal(leaderboardModal);
}

function closeLeaderboardModal() {
  if (!leaderboardModal) return;
  state.leaderboardTypingRun += 1;
  closeModal(leaderboardModal);
}

function getScriptedPatternAtTime(cfg, time) {
  for (const phase of cfg.phaseSchedule || []) {
    if (time < phase.until) return phase.pattern;
  }
  return "down";
}

function getTargetDuration() {
  const cfg = getLevel();
  if (Number.isFinite(cfg.audioEnd)) {
    return Math.max(1, cfg.audioEnd - cfg.audioStart);
  }
  if (state.audioDuration > 0) {
    return Math.max(1, state.audioDuration - cfg.audioStart);
  }
  return 210;
}

function formatClock(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${String(rem).padStart(2, "0")}`;
}

function getLevelDurationText(levelKey) {
  const cfg = LEVELS[levelKey];
  if (!cfg) return "-";
  if (Number.isFinite(cfg.audioEnd)) {
    return formatClock(cfg.audioEnd - cfg.audioStart);
  }
  if (levelKey === state.level && state.audioDuration > 0) {
    return formatClock(state.audioDuration - cfg.audioStart);
  }
  return "song length";
}

function getLevelInfo(levelKey) {
  const duration = getLevelDurationText(levelKey);
  if (levelKey === "spaghetti") {
    return {
      title: t("level1Title"),
      summary: t("surviveFor", { duration }),
      bullets: [
        t("level1Bullet1"),
        t("level1Bullet2"),
        t("level1Bullet3"),
      ],
    };
  }
  if (levelKey === "chu") {
    return {
      title: t("level2Title"),
      summary: t("surviveFor", { duration }),
      bullets: [
        t("level2Bullet1"),
        t("level2Bullet2"),
        t("level2Bullet3"),
      ],
    };
  }
  return {
    title: t("level3Title"),
    summary: t("surviveFor", { duration }),
    bullets: [
      t("level3Bullet1"),
      t("level3Bullet2"),
      t("level3Bullet3"),
    ],
  };
}

function showLevelInfoModal(levelKey) {
  if (!blindInfoModal || !levelInfoTitleEl || !levelInfoSummaryEl || !levelInfoListEl) return;
  closeLeaderboardModal();
  const info = getLevelInfo(levelKey);
  levelInfoTitleEl.textContent = info.title;
  levelInfoSummaryEl.textContent = info.summary;
  levelInfoListEl.innerHTML = "";
  for (const bullet of info.bullets) {
    const li = document.createElement("li");
    li.textContent = bullet;
    levelInfoListEl.appendChild(li);
  }
  openModal(blindInfoModal);
}

function maybeShowLevelInfoModal(levelKey) {
  if (state.levelInfoShown[levelKey]) return;
  state.levelInfoShown[levelKey] = true;
  showLevelInfoModal(levelKey);
}

function todayString() {
  const locale = state.lang === "zh" ? "zh-CN" : "en-US";
  return new Date().toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatSeconds(value) {
  return `${Math.max(0, Math.floor(value))}s`;
}

function updateBestDisplay() {
  bestEl.textContent = formatSeconds(state.best);
}

function updateReviveDisplay() {
  if (!revivesEl) return;
  revivesEl.textContent = String(Math.max(0, state.maxRevives - state.revivesUsed));
}

function updateScoreDisplay() {
  const target = Math.ceil(getTargetDuration());
  const current = Math.min(target, Math.floor(state.time));
  const text = `${current}s / ${target}s`;
  scoreEl.textContent = text;
  if (sideScoreEl) sideScoreEl.textContent = text;
}

function stopAudio() {
  if (!state.audio) return;
  state.audio.pause();
  state.audio.src = "";
  state.audio = null;
  state.audioDuration = 0;
}

function prepareAudio() {
  stopAudio();
  const cfg = getLevel();
  state.audioDuration = Number.isFinite(cfg.audioEnd) ? cfg.audioEnd : 0;
  state.audio = new Audio(cfg.audioSrc);
  state.audio.preload = "auto";
  state.audio.loop = false;
  state.audio.volume = 0.5;
  state.audio.addEventListener("loadedmetadata", () => {
    if (!Number.isFinite(cfg.audioEnd) && Number.isFinite(state.audio.duration)) {
      state.audioDuration = state.audio.duration;
      updateScoreDisplay();
    }
  });
  state.audio.addEventListener("ended", () => {
    if (state.running && !state.over && !state.won) {
      handleWin();
    }
  });
}

function startAudio() {
  const cfg = getLevel();
  if (!state.audio) prepareAudio();
  state.audio.currentTime = cfg.audioStart;
  state.audio.play().catch(() => {});
}

function ensureBackgroundVideo() {
  const cfg = getLevel();
  if (cfg.key !== "rude") return null;
  if (state.bgVideo) return state.bgVideo;

  const video = document.createElement("video");
  video.src = cfg.backgroundVideoSrc;
  video.preload = "auto";
  video.loop = false;
  video.muted = true;
  video.playsInline = true;
  state.bgVideo = video;
  return state.bgVideo;
}

function stopBackgroundVideo(resetTime = false) {
  if (!state.bgVideo) return;
  state.bgVideo.pause();
  if (resetTime) state.bgVideo.currentTime = 0;
}

function startBackgroundVideo() {
  const cfg = getLevel();
  if (cfg.key !== "rude") {
    stopBackgroundVideo(true);
    return;
  }
  const video = ensureBackgroundVideo();
  if (!video) return;
  video.currentTime = 0;
  video.play().catch(() => {});
}

function scheduleNextEvent(fromTime) {
  const cfg = getLevel();
  if (cfg.eventMode === "none") {
    state.nextEventAt = Number.POSITIVE_INFINITY;
    return;
  }
  const targetCount = cfg.eventTargetCount || DEFAULT_EVENT_TARGET_COUNT;
  const gapMin = cfg.eventGapMin || DEFAULT_EVENT_GAP_MIN;
  const gapMax = cfg.eventGapMax || DEFAULT_EVENT_GAP_MAX;

  if (state.eventsTriggered >= targetCount) {
    state.nextEventAt = Infinity;
    return;
  }

  const remainingTime = Math.max(1, getTargetDuration() - fromTime);
  const remainingEvents = Math.max(1, targetCount - state.eventsTriggered);
  const baseGap = remainingTime / remainingEvents;
  const jitter = baseGap * 0.28;
  const rawGap = baseGap + (Math.random() * 2 - 1) * jitter;
  const gap = Math.max(gapMin, Math.min(gapMax, rawGap));
  state.nextEventAt = fromTime + gap;
}

function getBlindDuration() {
  const cfg = getLevel();
  return Math.max(cfg.blindMin, cfg.blindStart - state.time * cfg.blindShrinkPerSecond);
}

function isBlindActive() {
  return getLevel().eventMode === "blind" && state.running && !state.paused && state.time < state.blindActiveUntil;
}

function isReverseFlashActive() {
  return getLevel().eventMode === "reverse" && state.running && !state.paused && state.time < state.reverseFlashUntil;
}

function updateTopAlert() {
  if (!blindTopEl) return;

  blindTopEl.classList.remove("show");

  if (!state.running || state.over || state.won || state.paused) {
    return;
  }

  const cfg = getLevel();
  if (cfg.eventMode === "none") {
    if (cfg.key === "rude") {
      const boundaries = (cfg.phaseSchedule || [])
        .map((phase) => phase.until)
        .filter((until) => Number.isFinite(until) && until > state.time);
      if (boundaries.length > 0) {
        const nextSwitchAt = Math.min(...boundaries);
        const untilSwitch = nextSwitchAt - state.time;
        if (untilSwitch <= WARNING_SECONDS) {
          blindTopEl.textContent = t("switchingIn", { value: Math.max(0, untilSwitch).toFixed(1) });
          blindTopEl.classList.add("show");
        }
      }
    }
    return;
  }

  if (cfg.eventMode === "blind") {
    if (isBlindActive()) {
      blindTopEl.textContent = t("blind");
      blindTopEl.classList.add("show");
      return;
    }
    const untilEvent = state.nextEventAt - state.time;
    if (untilEvent <= WARNING_SECONDS) {
      blindTopEl.textContent = t("blindIn", { value: untilEvent.toFixed(1) });
      blindTopEl.classList.add("show");
    }
    return;
  }

  if (isReverseFlashActive()) {
    blindTopEl.textContent = t("reverseNow");
    blindTopEl.classList.add("show");
    return;
  }
  const untilEvent = state.nextEventAt - state.time;
  if (untilEvent <= WARNING_SECONDS) {
    blindTopEl.textContent = t("reverseIn", { value: untilEvent.toFixed(1) });
    blindTopEl.classList.add("show");
  }
}

function updateRecordBadge() {
  if (!recordBadgeEl) return;
  const show = state.running && state.time < state.recordBadgeUntil;
  recordBadgeEl.classList.toggle("show", show);
}

function initRecordConfetti() {
  state.recordConfetti = [];
  const colors = ["#ff4d4d", "#ff9f1c", "#ffe14d", "#7dff6b", "#38d9ff", "#7c6bff", "#ff6bd6", "#ffffff"];
  for (let i = 0; i < 80; i += 1) {
    state.recordConfetti.push({
      x: canvas.width * 0.5 + (Math.random() * 320 - 160),
      y: canvas.height - 24 - Math.random() * 40,
      vx: (Math.random() * 2 - 1) * 2.3,
      vy: -2.2 - Math.random() * 2.8,
      size: 3 + Math.random() * 6,
      spin: Math.random() * Math.PI * 2,
      spinRate: 0.05 + Math.random() * 0.12,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
      fade: 0.012 + Math.random() * 0.01,
    });
  }
}

function updateHudMode() {
  if (!hudEl) return;
  const compact = state.running && !state.over && !state.won;
  hudEl.classList.toggle("compact", compact);
  if (sideScoreEl) sideScoreEl.classList.toggle("show", compact);
  if (reviveBtn) reviveBtn.hidden = !(state.over && state.awaitingRevive);
  if (celebrateBtn) celebrateBtn.hidden = !(state.won || state.showcaseWin);
}

function resetGame() {
  state.running = true;
  state.over = false;
  state.paused = false;
  state.won = false;
  state.showcaseWin = false;
  state.awaitingRevive = false;
  state.score = 0;
  state.revivesUsed = 0;
  state.invulnerableUntil = -1;
  state.time = 0;
  state.spawnTimer = 0;
  state.speedScale = 1;
  state.level2Direction = 1;
  state.eventsTriggered = 0;
  state.nextEventAt = Infinity;
  state.blindActiveUntil = -1;
  state.reverseFlashUntil = -1;
  state.recordBadgeUntil = -1;
  state.recordShownThisRun = false;
  state.recordConfettiUntil = -1;
  state.recordConfetti = [];
  state.pauseTypedStartMs = 0;
  state.gameOverTypedStartMs = 0;
  state.touchControl.active = false;
  state.touchControl.pointerId = null;
  state.hazards.length = 0;
  state.player.x = canvas.width / 2 - state.player.w / 2;
  state.player.y = canvas.height - 90;

  setPauseButtonLabel();

  prepareAudio();
  startAudio();
  startBackgroundVideo();

  scheduleNextEvent(0);
  pushCodeLog("game.start()", `song=${getLevel().songLabel}`);
  updateReviveDisplay();
  updateScoreDisplay();
  updateTopAlert();
  updateRecordBadge();
  updateHudMode();
}

function spawnHazard() {
  const cfg = getLevel();
  const size = 16 + Math.random() * 24;
  const speed = (130 + Math.random() * 170) * state.speedScale * (cfg.hazardSpeedMult || 1);
  const alpha = 0.65 + Math.random() * 0.35;
  const pushHazard = (hazard) => {
    state.hazards.push(hazard);
    return true;
  };

  if (cfg.spawnMode === "vertical") {
    const x = Math.random() * (canvas.width - size);
    pushHazard({ x, y: -size, size, vx: 0, vy: speed, alpha });
    return;
  }

  if (cfg.spawnMode === "scripted") {
    let pattern = getScriptedPatternAtTime(cfg, state.time);

    if (pattern === "mix") {
      const all = ["down", "up", "ltr", "rtl"];
      pattern = all[Math.floor(Math.random() * all.length)];
    }

    if (pattern === "down") {
      const x = Math.random() * (canvas.width - size);
      pushHazard({ x, y: -size, size, vx: 0, vy: speed, alpha });
      return;
    }

    if (pattern === "up") {
      const x = Math.random() * (canvas.width - size);
      pushHazard({ x, y: canvas.height + size, size, vx: 0, vy: -speed, alpha });
      return;
    }

    if (pattern === "ltr") {
      const y = Math.random() * (canvas.height - size);
      pushHazard({ x: -size, y, size, vx: speed, vy: 0, alpha });
      return;
    }

    const y = Math.random() * (canvas.height - size);
    pushHazard({ x: canvas.width + size, y, size, vx: -speed, vy: 0, alpha });
    return;
  }

  const fromLeft = cfg.key === "chu" ? state.level2Direction >= 0 : Math.random() < 0.5;
  const x = fromLeft ? -size : canvas.width + size;
  const y = Math.random() * (canvas.height - size);
  const vx = fromLeft ? speed : -speed;
  state.hazards.push({ x, y, size, vx, vy: 0, alpha: 0.7 + Math.random() * 0.3 });
}

function resetMusicAfterFail() {
  if (!state.audio) return;
  state.audio.pause();
  const cfg = getLevel();
  state.audio.currentTime = cfg.audioStart;
  stopBackgroundVideo(true);
}

function handleGameOver() {
  state.running = false;
  state.over = true;
  state.paused = false;
  state.won = false;
  state.showcaseWin = false;
  state.awaitingRevive = false;
  state.gameOverTypedStartMs = performance.now();
  state.touchControl.active = false;
  state.touchControl.pointerId = null;

  if (state.score > state.best) {
    state.best = state.score;
    updateBestDisplay();
  }

  resetMusicAfterFail();
  updateTopAlert();
  updateRecordBadge();
  updateHudMode();
}

function triggerCollisionGameOver() {
  state.running = false;
  state.over = true;
  state.paused = false;
  state.won = false;
  state.showcaseWin = false;
  state.awaitingRevive = state.revivesUsed < state.maxRevives;
  state.gameOverTypedStartMs = performance.now();
  state.touchControl.active = false;
  state.touchControl.pointerId = null;
  if (state.audio) state.audio.pause();
  stopBackgroundVideo();
  updateTopAlert();
  updateHudMode();
}

function reviveFromGameOver() {
  if (!state.over || !state.awaitingRevive) return;

  state.revivesUsed += 1;
  state.awaitingRevive = false;
  state.over = false;
  state.running = true;
  state.paused = false;
  state.gameOverTypedStartMs = 0;
  state.invulnerableUntil = state.time + 1;
  state.hazards.length = 0;
  pushCodeLog("player.revive()", `used=${state.revivesUsed}/${state.maxRevives}`);

  setPauseButtonLabel();
  updateReviveDisplay();
  updateHudMode();
  if (state.audio) state.audio.play().catch(() => {});
  if (getLevel().key === "rude" && state.bgVideo) {
    state.bgVideo.play().catch(() => {});
  }
}

function initConfetti() {
  const colors = getLevel().confettiColors;
  state.confetti = [];
  for (let i = 0; i < 180; i += 1) {
    state.confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: 4 + Math.random() * 8,
      vy: 1.2 + Math.random() * 3.1,
      vx: -0.6 + Math.random() * 1.2,
      spin: Math.random() * Math.PI * 2,
      spinRate: 0.02 + Math.random() * 0.12,
      color: colors[Math.floor(Math.random() * colors.length)],
      shine: 0.4 + Math.random() * 0.6,
    });
  }
}

function drawRecordConfetti() {
  if (state.time >= state.recordConfettiUntil) return;
  for (const c of state.recordConfetti) {
    c.x += c.vx;
    c.y += c.vy;
    c.vy += 0.06;
    c.spin += c.spinRate;
    c.life = Math.max(0, c.life - c.fade);
    if (c.life <= 0) continue;
    ctx.globalAlpha = c.life;
    ctx.fillStyle = c.color;
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.spin);
    ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.7);
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}

function handleWin() {
  state.running = false;
  state.over = false;
  state.paused = false;
  state.won = true;
  state.showcaseWin = false;
  state.awaitingRevive = false;
  state.score = Math.ceil(getTargetDuration());

  if (state.audio) {
    const cfg = getLevel();
    state.audio.pause();
    if (Number.isFinite(cfg.audioEnd)) state.audio.currentTime = cfg.audioEnd;
  }
  stopBackgroundVideo();

  if (state.score > state.best) {
    state.best = state.score;
    updateBestDisplay();
  }

  initConfetti();
  state.winConfettiUntilMs = performance.now() + 10000;
  updateScoreDisplay();
  updateTopAlert();
  updateRecordBadge();
  updateHudMode();
}

function enterShowcaseWin() {
  state.running = false;
  state.over = false;
  state.paused = false;
  state.won = true;
  state.showcaseWin = true;
  state.awaitingRevive = false;
  initConfetti();
  state.winConfettiUntilMs = performance.now() + 10000;
  if (state.audio) state.audio.pause();
  stopBackgroundVideo();
  updateTopAlert();
  updateHudMode();
}

function maybeTriggerLevelEvent() {
  const cfg = getLevel();
  if (cfg.eventMode === "none") return;
  if (state.time < state.nextEventAt) return;

  state.eventsTriggered += 1;
  if (cfg.eventMode === "blind") {
    state.blindActiveUntil = state.time + getBlindDuration();
  } else {
    if (cfg.key === "chu") {
      state.level2Direction *= -1;
    }
    state.reverseFlashUntil = state.time + cfg.reverseFlash;
    for (const h of state.hazards) {
      h.vx *= -1;
      h.vy *= -1;
    }
  }
  scheduleNextEvent(state.time);
}

function update(dt) {
  if (!state.running || state.paused) return;

  const cfg = getLevel();

  state.time += dt;
  state.spawnTimer += dt;
  state.speedScale = 1 + state.time * 0.025;

  if (state.time >= getTargetDuration()) {
    handleWin();
    return;
  }

  if (Number.isFinite(cfg.audioEnd) && state.audio && state.audio.currentTime >= cfg.audioEnd) {
    handleWin();
    return;
  }

  if (getLevel().key === "rude" && state.bgVideo) {
    if (state.bgVideo.paused && !state.audio?.paused) {
      state.bgVideo.play().catch(() => {});
    }
    const targetVideoTime = Math.max(0, state.time);
    if (Math.abs(state.bgVideo.currentTime - targetVideoTime) > 0.2) {
      state.bgVideo.currentTime = targetVideoTime;
    }
  }

  maybeTriggerLevelEvent();

  if (state.touchControl.active) {
    const targetX = state.touchControl.targetX - state.player.w / 2;
    const targetY = state.touchControl.targetY - state.player.h / 2;
    const follow = Math.min(1, dt * 18);
    state.player.x += (targetX - state.player.x) * follow;
    state.player.y += (targetY - state.player.y) * follow;
  } else {
    const moveX = (state.keys.has("ArrowRight") || state.keys.has("d") ? 1 : 0) -
      (state.keys.has("ArrowLeft") || state.keys.has("a") ? 1 : 0);
    const moveY = (state.keys.has("ArrowDown") || state.keys.has("s") ? 1 : 0) -
      (state.keys.has("ArrowUp") || state.keys.has("w") ? 1 : 0);

    const playerSpeed = state.player.speed * cfg.playerSpeedMult;
    state.player.x += moveX * playerSpeed * dt;
    state.player.y += moveY * playerSpeed * dt;
  }

  state.player.x = Math.max(0, Math.min(canvas.width - state.player.w, state.player.x));
  state.player.y = Math.max(0, Math.min(canvas.height - state.player.h, state.player.y));

  const areaRatio = Math.max(1, (canvas.width * canvas.height) / BASE_AREA);
  const densityScale = Math.sqrt(areaRatio);
  const phasePattern = cfg.spawnMode === "scripted" ? getScriptedPatternAtTime(cfg, state.time) : null;
  let runtimeScale = Math.min(2.6, 1 + state.time * 0.028) * cfg.spawnRateMult;
  const baseHazardsPerSpawn = Math.max(
    1,
    Math.round((densityScale >= 2.6 ? 3 : densityScale >= 1.6 ? 2 : 1) * cfg.hazardCountMult)
  );
  let hazardsPerSpawn = baseHazardsPerSpawn;
  let maxHazards = Math.max(12, Math.floor(42 * densityScale * cfg.maxHazardsMult));
  if (cfg.key === "rude" && phasePattern === "mix") {
    runtimeScale *= 0.82;
    hazardsPerSpawn = Math.max(1, baseHazardsPerSpawn - 1);
    maxHazards = Math.max(10, Math.floor(maxHazards * 0.7));
  }
  const spawnInterval = Math.max(0.06, BASE_SPAWN_INTERVAL / Math.max(0.3, densityScale * runtimeScale));

  while (state.spawnTimer >= spawnInterval) {
    state.spawnTimer -= spawnInterval;
    for (let i = 0; i < hazardsPerSpawn && state.hazards.length < maxHazards; i += 1) {
      spawnHazard();
    }
  }

  for (const hazard of state.hazards) {
    hazard.x += hazard.vx * dt;
    hazard.y += hazard.vy * dt;
  }

  if (cfg.spawnMode === "vertical") {
    state.hazards = state.hazards.filter((h) => h.y < canvas.height + h.size);
  } else if (cfg.spawnMode === "horizontal") {
    state.hazards = state.hazards.filter((h) => h.x > -h.size * 2 && h.x < canvas.width + h.size * 2);
  } else {
    state.hazards = state.hazards.filter(
      (h) =>
        h.x > -h.size * 2 &&
        h.x < canvas.width + h.size * 2 &&
        h.y > -h.size * 2 &&
        h.y < canvas.height + h.size * 2
    );
  }

  for (const h of state.hazards) {
    if (
      h.x < state.player.x + state.player.w &&
      h.x + h.size > state.player.x &&
      h.y < state.player.y + state.player.h &&
      h.y + h.size > state.player.y
    ) {
      if (state.time < state.invulnerableUntil) continue;
      if (state.revivesUsed < state.maxRevives) {
        triggerCollisionGameOver();
      } else {
        handleGameOver();
      }
      return;
    }
  }

  state.score = Math.floor(state.time);
  if (state.score > state.best) {
    state.best = state.score;
    updateBestDisplay();
    if (!state.recordShownThisRun) {
      state.recordShownThisRun = true;
      state.recordBadgeUntil = state.time + 2.8;
      state.recordConfettiUntil = state.time + 3;
      initRecordConfetti();
    }
  }

  updateScoreDisplay();
  updateTopAlert();
  updateRecordBadge();
}

function drawWinScreen() {
  const drawWinConfetti = performance.now() < state.winConfettiUntilMs;
  if (getLevel().key === "chu") {
    ctx.fillStyle = "#f7f7f7";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (drawWinConfetti) {
      for (const c of state.confetti) {
        c.x += c.vx;
        c.y += c.vy;
        c.spin += c.spinRate;

        if (c.y > canvas.height + 20) {
          c.y = -20 - Math.random() * 60;
          c.x = Math.random() * canvas.width;
        }
        if (c.x < -20) c.x = canvas.width + 20;
        if (c.x > canvas.width + 20) c.x = -20;

        const shine = 0.35 + Math.abs(Math.sin(c.spin)) * c.shine;
        ctx.globalAlpha = shine;
        ctx.fillStyle = c.color;
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.spin);
        ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.65);
        ctx.restore();
      }
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cfgWin = getLevel();

    ctx.fillStyle = "#101010";
    ctx.textAlign = "center";
    ctx.font = "700 56px 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(t("youWin"), canvas.width / 2, canvas.height / 2 - 72);

    ctx.font = "700 20px 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(t("accomplished"), canvas.width / 2, canvas.height / 2 - 24);

    ctx.font = "700 24px 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(cfgWin.songLabel, canvas.width / 2, canvas.height / 2 + 14);

    ctx.font = "700 18px 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(t("firstPlayer", { date: todayString() }), canvas.width / 2, canvas.height / 2 + 52);

    ctx.font = "700 18px 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(t("revivesUsed", { used: state.revivesUsed, max: state.maxRevives }), canvas.width / 2, canvas.height / 2 + 82);
    ctx.font = "600 14px 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(t("secretComboHint"), canvas.width / 2, canvas.height / 2 + 110);
    return;
  }

  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (drawWinConfetti) {
    for (const c of state.confetti) {
      c.x += c.vx;
      c.y += c.vy;
      c.spin += c.spinRate;

      if (c.y > canvas.height + 20) {
        c.y = -20 - Math.random() * 60;
        c.x = Math.random() * canvas.width;
      }
      if (c.x < -20) c.x = canvas.width + 20;
      if (c.x > canvas.width + 20) c.x = -20;

      const shine = 0.35 + Math.abs(Math.sin(c.spin)) * c.shine;
      ctx.globalAlpha = shine;
      ctx.fillStyle = c.color;
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.spin);
      ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.65);
      ctx.restore();
    }
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = "rgba(0, 0, 0, 0.34)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cfgWin = getLevel();

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = "700 56px 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(t("youWin"), canvas.width / 2, canvas.height / 2 - 72);

  ctx.font = "700 20px 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(t("accomplished"), canvas.width / 2, canvas.height / 2 - 24);

  ctx.font = "700 24px 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(cfgWin.songLabel, canvas.width / 2, canvas.height / 2 + 14);

  ctx.font = "700 18px 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(t("firstPlayer", { date: todayString() }), canvas.width / 2, canvas.height / 2 + 52);

  ctx.font = "700 18px 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(t("revivesUsed", { used: state.revivesUsed, max: state.maxRevives }), canvas.width / 2, canvas.height / 2 + 82);
  ctx.font = "600 14px 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(t("secretComboHint"), canvas.width / 2, canvas.height / 2 + 110);
}

function draw() {
  const cfg = getLevel();
  updateTopAlert();
  updateRecordBadge();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (cfg.key === "rude" && state.bgVideo && state.bgVideo.readyState >= 2) {
    ctx.drawImage(state.bgVideo, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = cfg.bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  drawRecordConfetti();
  const playerBaseFill = getPlayerFillColor();
  const obstacleBaseColor = state.level3ObstacleColor || (cfg.key === "chu" ? "#000000" : "#ffffff");
  const obstacleBaseFrame = state.level3ObstacleFrame || (cfg.key === "chu" ? "#2d2d2d" : "#ff69b4");

  for (const h of state.hazards) {
    const hazardFill = withAlpha(obstacleBaseColor, h.alpha);
    const hazardStroke = withAlpha(obstacleBaseFrame, 0.95);
    drawIOSSquare(h.x, h.y, h.size, hazardFill, hazardStroke, 1, Math.max(5, h.size * 0.18));
  }

  const playerFill = playerBaseFill;
  const playerStroke = state.playerFrameColor || getPlayerStrokeColor(playerFill);
  drawPlayerShape(state.player.x, state.player.y, state.player.w, playerFill, playerStroke, state.playerShape);

  if (isBlindActive()) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.font = "700 58px 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(t("blind"), canvas.width / 2, canvas.height / 2);
  }

  if (state.running && state.paused) {
    ctx.fillStyle = "rgba(8, 8, 10, 0.56)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = "center";
    drawTypedCenteredLine(
      t("paused"),
      canvas.height / 2 - 24,
      getPauseGameOverColor(cfg.key),
      "700 28px 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      state.pauseTypedStartMs,
      0
    );
    drawTypedCenteredLine(
      t("pressSpaceContinue"),
      canvas.height / 2 + 16,
      getPauseGameOverColor(cfg.key),
      "500 22px 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      state.pauseTypedStartMs,
      t("paused").length * OVERLAY_TYPE_MS_PER_CHAR + 220
    );
  }

  if (state.won) {
    drawWinScreen();
  }

  if (!state.running && !state.won) {
    ctx.textAlign = "center";
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "transparent";
    if (state.over) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.74)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    if (!state.over) {
      ctx.fillStyle = getPromptColor(cfg.key);
      ctx.font = "700 28px 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
      const baseX = canvas.width / 2 + (cfg.key === "rude" ? LEVEL3_START_PROMPT_OFFSET_X : 0);
      const baseY = canvas.height / 2 + (cfg.key === "rude" ? LEVEL3_START_PROMPT_OFFSET_Y : 0);
      if (cfg.key === "rude") {
        const word = "RUDE";
        const fullWidth = ctx.measureText(`${word}!`).width;
        const startX = baseX - fullWidth / 2;
        ctx.textAlign = "left";
        ctx.fillText(word, startX, baseY);
        if (Math.floor(performance.now() / 420) % 2 === 0) {
          const exX = startX + ctx.measureText(word).width;
          ctx.fillText("!", exX, baseY);
        }
      } else {
        const fullText = state.startPromptTarget || t("pressToStart");
        const shownText = state.startPromptDisplay || "";
        const fullWidth = ctx.measureText(fullText).width;
        const startX = baseX - fullWidth / 2;
        const y = baseY;
        ctx.textAlign = "left";
        ctx.fillText(shownText, startX, y);

        if (Math.floor(performance.now() / 420) % 2 === 0) {
          const cursorX = startX + ctx.measureText(shownText).width;
          ctx.fillText(" _", cursorX, y);
        }
      }
    } else {
      const sub = state.awaitingRevive ? t("gameOverWithRevive") : t("gameOverNoRevive");
      drawTypedCenteredLine(
        t("gameOver"),
        canvas.height / 2 - 24,
        getPauseGameOverColor(cfg.key),
        "700 28px 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        state.gameOverTypedStartMs,
        0
      );
      drawTypedCenteredLine(
        sub,
        canvas.height / 2 + 16,
        getPauseGameOverColor(cfg.key),
        "500 22px 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        state.gameOverTypedStartMs,
        t("gameOver").length * OVERLAY_TYPE_MS_PER_CHAR + 220
      );
    }
  }
}

let last = performance.now();
function loop(now) {
  const dt = Math.min(0.033, (now - last) / 1000);
  last = now;
  update(dt);
  updateStartPromptTyping(dt);
  draw();
  requestAnimationFrame(loop);
}

function returnToHome() {
  stopAudio();
  stopBackgroundVideo(true);
  state.running = false;
  state.over = false;
  state.paused = false;
  state.won = false;
  state.showcaseWin = false;
  state.awaitingRevive = false;
  state.pauseTypedStartMs = 0;
  state.gameOverTypedStartMs = 0;
  state.touchControl.active = false;
  state.touchControl.pointerId = null;
  state.time = 0;
  state.spawnTimer = 0;
  state.eventsTriggered = 0;
  state.hazards.length = 0;
  state.keys.clear();
  state.player.x = canvas.width / 2 - state.player.w / 2;
  state.player.y = canvas.height - 90;
  pushCodeLog("game.home()", "state=idle");
  setPauseButtonLabel();
  prepareAudio();
  updateScoreDisplay();
  updateTopAlert();
  updateRecordBadge();
  updateHudMode();
}

function togglePause() {
  if (!state.running || state.over || state.won) return;
  state.paused = !state.paused;
  if (state.paused) state.pauseTypedStartMs = performance.now();
  else state.pauseTypedStartMs = 0;
  if (state.paused) state.keys.clear();
  if (state.audio) {
    if (state.paused) state.audio.pause();
    else state.audio.play().catch(() => {});
  }
  if (getLevel().key === "rude" && state.bgVideo) {
    if (state.paused) state.bgVideo.pause();
    else state.bgVideo.play().catch(() => {});
  }
  setPauseButtonLabel();
  pushCodeLog(`game.${state.paused ? "pause" : "resume"}()`);
  updateTopAlert();
  updateHudMode();
}

window.addEventListener("keydown", (e) => {
  if (!state.running && !state.over && !state.won && e.shiftKey && e.key.length === 1 && /[a-z]/i.test(e.key)) {
    const now = performance.now();
    if (now - state.dogComboLastAt > 1600) state.dogComboBuffer = "";
    state.dogComboLastAt = now;
    state.dogComboBuffer = (state.dogComboBuffer + e.key.toLowerCase()).slice(-6);
    if (state.dogComboBuffer.endsWith("dog")) {
      state.dogMode = true;
      pushCodeLog("player.mode = \"dog\" 🐶", "shift + d o g");
      state.dogComboBuffer = "";
    }
  }

  if ((e.key === "Escape" || e.key === "Esc") && (state.running || state.over || state.won || state.paused)) {
    e.preventDefault();
    returnToHome();
    return;
  }

  if ((e.key === "c" || e.key === "C") && state.over && state.awaitingRevive) {
    e.preventDefault();
    reviveFromGameOver();
    return;
  }

  if ((e.key === " " || e.key === "Spacebar" || e.key === "Space") && state.paused && state.running) {
    e.preventDefault();
    togglePause();
    return;
  }

  if ((e.key === " " || e.key === "Spacebar" || e.key === "Space") && !state.running && !state.won) {
    e.preventDefault();
    resetGame();
    return;
  }

  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if (key === "p" && !e.repeat) {
    togglePause();
    return;
  }
  if (state.paused) return;
  state.keys.add(key);
});

window.addEventListener("keyup", (e) => {
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  state.keys.delete(key);
});

if (levelSelect) {
  levelSelect.addEventListener("change", () => {
    if (!LEVELS[levelSelect.value]) return;
    state.level = levelSelect.value;
    resetStartPromptTyping();
    pushCodeLog(`game.level = "${state.level}"`);
    maybeShowLevelInfoModal(state.level);
    if (state.level === "rude") ensureBackgroundVideo();
    else stopBackgroundVideo(true);
    updateLevelScopedControls();
    syncObstaclePickers();
    if (state.running || state.over || state.won) {
      stopAudio();
      stopBackgroundVideo(true);
      state.running = false;
      state.over = false;
      state.won = false;
      state.showcaseWin = false;
      state.awaitingRevive = false;
      state.hazards.length = 0;
      state.time = 0;
      updateScoreDisplay();
      updateTopAlert();
      updateHudMode();
    }
    syncPlayerColorPicker();
  });
}

if (langSelect) {
  langSelect.value = state.lang;
  langSelect.addEventListener("change", () => {
    const next = langSelect.value;
    state.lang = LANGUAGES.includes(next) ? next : "en";
    pushCodeLog(`ui.lang = "${state.lang}"`);
    document.documentElement.lang = state.lang;
    applyLanguage();
    updateTopAlert();
    if (blindInfoModal && !blindInfoModal.classList.contains("hidden")) {
      showLevelInfoModal(state.level);
    }
  });
}

if (playerColorPicker) {
  playerColorPicker.addEventListener("input", () => {
    state.playerColor = playerColorPicker.value;
  });
  playerColorPicker.addEventListener("change", () => {
    pushCodeLog(`theme.player.fill = "${playerColorPicker.value}"`, "repaint(player)");
  });
}

if (playerFramePicker) {
  playerFramePicker.addEventListener("input", () => {
    state.playerFrameColor = playerFramePicker.value;
  });
  playerFramePicker.addEventListener("change", () => {
    pushCodeLog(`theme.player.stroke = "${playerFramePicker.value}"`, "repaint(player)");
  });
}

if (playerShapeSelect) {
  playerShapeSelect.addEventListener("change", () => {
    state.playerShape = playerShapeSelect.value;
    state.dogMode = false;
    pushCodeLog(`theme.player.shape = "${state.playerShape}"`, "repaint(player)");
  });
}

if (obstacleColorPicker) {
  obstacleColorPicker.addEventListener("input", () => {
    state.level3ObstacleColor = obstacleColorPicker.value;
  });
  obstacleColorPicker.addEventListener("change", () => {
    pushCodeLog(`theme.hazard.fill = "${obstacleColorPicker.value}"`, "repaint(hazards)");
  });
}

if (obstacleFramePicker) {
  obstacleFramePicker.addEventListener("input", () => {
    state.level3ObstacleFrame = obstacleFramePicker.value;
  });
  obstacleFramePicker.addEventListener("change", () => {
    pushCodeLog(`theme.hazard.stroke = "${obstacleFramePicker.value}"`, "repaint(hazards)");
  });
}

if (leaderboardBtn) {
  leaderboardBtn.addEventListener("click", openLeaderboardModal);
}

if (closeLeaderboardBtn) {
  closeLeaderboardBtn.addEventListener("click", closeLeaderboardModal);
}

// Fallback delegation: keeps leaderboard controls working even with stale cached listeners.
document.addEventListener("click", (e) => {
  const target = e.target;
  if (!(target instanceof Element)) return;
  if (target.id === "leaderboardBtn") {
    openLeaderboardModal();
    return;
  }
  if (target.id === "closeLeaderboardBtn") {
    closeLeaderboardModal();
    return;
  }
  if (target.id === "leaderboardModal") {
    closeLeaderboardModal();
    return;
  }
});

if (startBtn) {
  startBtn.addEventListener("click", resetGame);
}

if (reviveBtn) {
  reviveBtn.addEventListener("click", reviveFromGameOver);
}

if (pauseBtn) {
  pauseBtn.addEventListener("click", togglePause);
}

if (celebrateBtn) {
  celebrateBtn.addEventListener("click", () => {
    if (!state.won && !state.showcaseWin) {
      enterShowcaseWin();
      return;
    }
    initConfetti();
    state.winConfettiUntilMs = performance.now() + 10000;
  });
}

if (closeModalBtn && blindInfoModal) {
  closeModalBtn.addEventListener("click", () => {
    closeModal(blindInfoModal);
    if (!state.running && !state.over && !state.won) {
      window.setTimeout(resetStartPromptTyping, MODAL_TRANSITION_MS);
    }
  });
}

if (hudEl && gameTitleEl) {
  gameTitleEl.style.cursor = "grab";
  gameTitleEl.addEventListener("pointerdown", (e) => {
    if (!(e.target instanceof Element)) return;
    state.hudDrag.active = true;
    state.hudDrag.offsetX = e.clientX - hudEl.offsetLeft;
    state.hudDrag.offsetY = e.clientY - hudEl.offsetTop;
    gameTitleEl.style.cursor = "grabbing";
    e.preventDefault();
  });

  window.addEventListener("pointermove", (e) => {
    if (!state.hudDrag.active) return;
    const maxX = Math.max(0, window.innerWidth - hudEl.offsetWidth - 4);
    const maxY = Math.max(0, window.innerHeight - hudEl.offsetHeight - 4);
    const nextX = Math.min(maxX, Math.max(4, e.clientX - state.hudDrag.offsetX));
    const nextY = Math.min(maxY, Math.max(4, e.clientY - state.hudDrag.offsetY));
    hudEl.style.left = `${nextX}px`;
    hudEl.style.top = `${nextY}px`;
  });

  window.addEventListener("pointerup", () => {
    if (!state.hudDrag.active) return;
    state.hudDrag.active = false;
    gameTitleEl.style.cursor = "grab";
  });
}

if (canvas) {
  canvas.addEventListener("pointerdown", (e) => {
    state.touchControl.active = true;
    state.touchControl.pointerId = e.pointerId;
    setTouchTargetFromClient(e.clientX, e.clientY);
    canvas.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  });

  canvas.addEventListener("pointermove", (e) => {
    if (!state.touchControl.active) return;
    if (state.touchControl.pointerId !== null && e.pointerId !== state.touchControl.pointerId) return;
    setTouchTargetFromClient(e.clientX, e.clientY);
    e.preventDefault();
  });

  const endTouchControl = (e) => {
    if (!state.touchControl.active) return;
    if (state.touchControl.pointerId !== null && e.pointerId !== state.touchControl.pointerId) return;
    state.touchControl.active = false;
    state.touchControl.pointerId = null;
  };

  canvas.addEventListener("pointerup", endTouchControl);
  canvas.addEventListener("pointercancel", endTouchControl);
  canvas.addEventListener("pointerleave", endTouchControl);
}

window.addEventListener("resize", resizeCanvas);

prepareAudio();
updateHudMode();
syncPlayerColorPicker();
updateLevelScopedControls();
syncObstaclePickers();
document.documentElement.lang = state.lang;
if (langSelect) langSelect.value = state.lang;
applyLanguage();
initCodeLog();
resetStartPromptTyping();
maybeShowLevelInfoModal(state.level);
draw();
requestAnimationFrame(loop);
