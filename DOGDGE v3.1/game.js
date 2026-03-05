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
const thanksBtn = document.getElementById("thanksBtn");
const hudEl = document.querySelector(".hud");
const levelSelect = document.getElementById("levelSelect");
const startBtn = document.getElementById("startBtn");
const reviveBtn = document.getElementById("continueBtn");
const pauseBtn = document.getElementById("pauseBtn");
const playerColorPicker = document.getElementById("playerColorPicker");
const playerFramePicker = document.getElementById("playerFramePicker");
const obstacleColorPicker = document.getElementById("obstacleColorPicker");
const obstacleFramePicker = document.getElementById("obstacleFramePicker");
const obstacleColorRow = document.querySelector(".obstacle-color-row");
const obstacleFrameRow = document.querySelector(".obstacle-frame-row");
const blindInfoModal = document.getElementById("blindInfoModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const leaderboardModal = document.getElementById("leaderboardModal");
const closeLeaderboardBtn = document.getElementById("closeLeaderboardBtn");
const leaderboardListEl = document.getElementById("leaderboardList");
const thanksModal = document.getElementById("thanksModal");
const closeThanksBtn = document.getElementById("closeThanksBtn");
const thanksListEl = document.getElementById("thanksList");
const levelInfoTitleEl = document.getElementById("levelInfoTitle");
const levelInfoSummaryEl = document.getElementById("levelInfoSummary");
const levelInfoListEl = document.getElementById("levelInfoList");

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

// Leaderboard Adjustment Section (Do not change anything else)
const LEADERBOARD_ENTRIES = [
  { name: "Ryo Shoji", point: 25, completionLevels: "MiniSkirt - AOA - 5/5 Revivals" },
  { name: "name", point: 0, completionLevels: "Song - Singer - N/5 Revivals" },
  { name: "name", point: 0, completionLevels: "Song - Singer - N/5 Revivals" },
  { name: "name", point: 0, completionLevels: "Song - Singer - N/5 Revivals" },
  { name: "name", point: 0, completionLevels: "Song - Singer - N/5 Revivals" },
];

// Thank you section
const THANK_YOU_NAMES = [
  "Developer: Justin SUNCHEN + CHATGPT",
  "Players",
  "Ryo Shoji",
  "Alem Memesh",
  "Jessica Liu",
  "Emmanuel Benedict",
  "Tbc...",
];

const LEVELS = {
  spaghetti: {
    key: "spaghetti",
    label: "Level 1 - MiniSkirt",
    songLabel: "MINISKIRT - AOA",
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
  invincible: false,
  time: 0,
  spawnTimer: 0,
  speedScale: 1,
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
  level3ObstacleColor: null,
  level3ObstacleFrame: null,
  player: { x: canvas.width / 2 - 16, y: canvas.height - 90, w: 32, h: 32, speed: 290 },
  hazards: [],
  keys: new Set(),
  levelInfoShown: {
    spaghetti: false,
    chu: false,
    rude: false,
  },
};

function getLevel() {
  return LEVELS[state.level];
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
  const showLevel3Controls = state.level === "rude";
  if (obstacleColorRow) obstacleColorRow.hidden = !showLevel3Controls;
  if (obstacleFrameRow) obstacleFrameRow.hidden = !showLevel3Controls;
}

function syncObstaclePickers() {
  if (obstacleColorPicker) obstacleColorPicker.value = state.level3ObstacleColor || "#ffffff";
  if (obstacleFramePicker) obstacleFramePicker.value = state.level3ObstacleFrame || "#ff69b4";
}

function renderLeaderboard() {
  if (!leaderboardListEl) return;
  leaderboardListEl.innerHTML = "";
  for (const entry of LEADERBOARD_ENTRIES.slice(0, 5)) {
    const li = document.createElement("li");
    li.textContent = `${entry.name} - ${entry.point} - ${entry.completionLevels}`;
    leaderboardListEl.appendChild(li);
  }
}

function openLeaderboardModal() {
  if (!leaderboardModal) return;
  renderLeaderboard();
  leaderboardModal.classList.remove("hidden");
}

function closeLeaderboardModal() {
  if (!leaderboardModal) return;
  leaderboardModal.classList.add("hidden");
}

function renderThanksList() {
  if (!thanksListEl) return;
  thanksListEl.innerHTML = "";
  const names = THANK_YOU_NAMES.length > 0 ? THANK_YOU_NAMES : ["Thank you for playing!"];
  for (let i = 0; i < 2; i += 1) {
    for (const name of names) {
      const li = document.createElement("li");
      li.textContent = name;
      thanksListEl.appendChild(li);
    }
  }
}

function openThanksModal() {
  if (!thanksModal) return;
  renderThanksList();
  thanksModal.classList.remove("hidden");
}

function closeThanksModal() {
  if (!thanksModal) return;
  thanksModal.classList.add("hidden");
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
      title: "Level 1 - MiniSkirt",
      summary: `Survive for ${duration}.`,
      bullets: [
        "Obstacle flow: top to bottom.",
        "BLIND events: yes (with 3-second warning).",
        "BLIND duration shrinks as speed increases.",
      ],
    };
  }
  if (levelKey === "chu") {
    return {
      title: "Level 2 - Chu",
      summary: `Survive for ${duration}.`,
      bullets: [
        "Obstacle flow: horizontal (left/right).",
        "REVERSE events: yes (with 3-second warning).",
        "REVERSE flips obstacle directions when triggered.",
      ],
    };
  }
  return {
    title: "Level 3 - RUDE!",
    summary: `Survive for ${duration}.`,
    bullets: [
      "No BLIND and no REVERSE.",
      "Direction phases switch over time, with 3-second switch warnings.",
      "No BLANK and no half-screen effects.",
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
  blindInfoModal.classList.remove("hidden");
}

function maybeShowLevelInfoModal(levelKey) {
  if (state.levelInfoShown[levelKey]) return;
  state.levelInfoShown[levelKey] = true;
  showLevelInfoModal(levelKey);
}

function todayString() {
  return new Date().toLocaleDateString("en-US", {
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

  if (state.invincible) {
    blindTopEl.textContent = "INVINCIBLE";
    blindTopEl.classList.add("show");
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
          blindTopEl.textContent = `SWITCHING IN ${Math.max(0, untilSwitch).toFixed(1)}s`;
          blindTopEl.classList.add("show");
        }
      }
    }
    return;
  }
  if (cfg.eventMode === "blind") {
    if (isBlindActive()) {
      blindTopEl.textContent = "BLIND";
      blindTopEl.classList.add("show");
      return;
    }
    const untilEvent = state.nextEventAt - state.time;
    if (untilEvent <= WARNING_SECONDS) {
      blindTopEl.textContent = `BLIND IN ${untilEvent.toFixed(1)}s`;
      blindTopEl.classList.add("show");
    }
    return;
  }

  if (isReverseFlashActive()) {
    blindTopEl.textContent = "REVERSE!";
    blindTopEl.classList.add("show");
    return;
  }
  const untilEvent = state.nextEventAt - state.time;
  if (untilEvent <= WARNING_SECONDS) {
    blindTopEl.textContent = `REVERSE IN ${untilEvent.toFixed(1)}s`;
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
  state.eventsTriggered = 0;
  state.nextEventAt = Infinity;
  state.blindActiveUntil = -1;
  state.reverseFlashUntil = -1;
  state.recordBadgeUntil = -1;
  state.recordShownThisRun = false;
  state.recordConfettiUntil = -1;
  state.recordConfetti = [];
  state.hazards.length = 0;
  state.player.x = canvas.width / 2 - state.player.w / 2;
  state.player.y = canvas.height - 90;

  if (pauseBtn) pauseBtn.textContent = "Pause";

  prepareAudio();
  startAudio();
  startBackgroundVideo();

  scheduleNextEvent(0);
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

  const fromLeft = Math.random() < 0.5;
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
  state.invulnerableUntil = state.time + 1;
  state.hazards.length = 0;

  if (pauseBtn) pauseBtn.textContent = "Pause";
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

  const moveX = (state.keys.has("ArrowRight") || state.keys.has("d") ? 1 : 0) -
    (state.keys.has("ArrowLeft") || state.keys.has("a") ? 1 : 0);
  const moveY = (state.keys.has("ArrowDown") || state.keys.has("s") ? 1 : 0) -
    (state.keys.has("ArrowUp") || state.keys.has("w") ? 1 : 0);

  const playerSpeed = state.player.speed * cfg.playerSpeedMult;
  state.player.x += moveX * playerSpeed * dt;
  state.player.y += moveY * playerSpeed * dt;

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
      if (state.invincible) continue;
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
  if (getLevel().key === "chu") {
    ctx.fillStyle = "#f7f7f7";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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
    ctx.globalAlpha = 1;

    ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cfgWin = getLevel();

    ctx.fillStyle = "#101010";
    ctx.textAlign = "center";
    ctx.font = "700 56px Courier New";
    ctx.fillText("YOU WIN", canvas.width / 2, canvas.height / 2 - 72);

    ctx.font = "700 20px Courier New";
    ctx.fillText("you've accomplished", canvas.width / 2, canvas.height / 2 - 24);

    ctx.font = "700 24px Courier New";
    ctx.fillText(cfgWin.songLabel, canvas.width / 2, canvas.height / 2 + 14);

    ctx.font = "700 18px Courier New";
    ctx.fillText(`${todayString()} - First Player to Complete`, canvas.width / 2, canvas.height / 2 + 52);

    ctx.font = "700 18px Courier New";
    ctx.fillText(`Revivals used: ${state.revivesUsed} / ${state.maxRevives}`, canvas.width / 2, canvas.height / 2 + 82);
    return;
  }

  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

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
  ctx.globalAlpha = 1;

  ctx.fillStyle = "rgba(0, 0, 0, 0.34)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cfgWin = getLevel();

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = "700 56px Courier New";
  ctx.fillText("YOU WIN", canvas.width / 2, canvas.height / 2 - 72);

  ctx.font = "700 20px Courier New";
  ctx.fillText("you've accomplished", canvas.width / 2, canvas.height / 2 - 24);

  ctx.font = "700 24px Courier New";
  ctx.fillText(cfgWin.songLabel, canvas.width / 2, canvas.height / 2 + 14);

  ctx.font = "700 18px Courier New";
  ctx.fillText(`${todayString()} - First Player to Complete`, canvas.width / 2, canvas.height / 2 + 52);

  ctx.font = "700 18px Courier New";
  ctx.fillText(`Revivals used: ${state.revivesUsed} / ${state.maxRevives}`, canvas.width / 2, canvas.height / 2 + 82);
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

  for (const h of state.hazards) {
    if (cfg.key === "rude" && state.level3ObstacleColor) {
      ctx.fillStyle = withAlpha(state.level3ObstacleColor, h.alpha);
    } else {
      ctx.fillStyle = cfg.hazardColor.replace("ALPHA", String(h.alpha));
    }
    ctx.fillRect(h.x, h.y, h.size, h.size);
    if (cfg.key === "rude") {
      const frame = state.level3ObstacleFrame ? withAlpha(state.level3ObstacleFrame, 0.95) : "rgba(255, 105, 180, 0.95)";
      ctx.strokeStyle = frame;
      ctx.lineWidth = 2;
      ctx.strokeRect(h.x, h.y, h.size, h.size);
    }
  }

  const playerFill = getPlayerFillColor();
  const playerStroke = getPlayerStrokeColor(playerFill);
  ctx.fillStyle = playerFill;
  ctx.fillRect(state.player.x, state.player.y, state.player.w, state.player.h);
  ctx.strokeStyle = playerStroke;
  ctx.lineWidth = 2;
  ctx.strokeRect(state.player.x, state.player.y, state.player.w, state.player.h);

  if (isBlindActive()) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.font = "700 58px Courier New";
    ctx.fillText("BLIND", canvas.width / 2, canvas.height / 2);
  }

  if (state.running && state.paused) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.74)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f2f2f2";
    ctx.textAlign = "center";
    ctx.font = "700 40px Courier New";
    ctx.fillText("Paused", canvas.width / 2, canvas.height / 2 - 24);
    ctx.font = "500 20px Courier New";
    ctx.fillText("Press Space to continue", canvas.width / 2, canvas.height / 2 + 16);
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
      ctx.fillStyle = cfg.key === "chu" ? "#000000" : "#f2f2f2";
      ctx.font = "700 40px Courier New";
      ctx.fillText("Dogdge, press to start", canvas.width / 2, canvas.height / 2);
    } else {
      ctx.fillStyle = "#f2f2f2";
      ctx.font = "700 40px Courier New";
      ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 24);
      ctx.font = "500 20px Courier New";
      const sub = state.awaitingRevive
        ? "Press Start to restart or C to revive"
        : "Press Start to try again";
      ctx.fillText(sub, canvas.width / 2, canvas.height / 2 + 16);
    }
  }
}

let last = performance.now();
function loop(now) {
  const dt = Math.min(0.033, (now - last) / 1000);
  last = now;
  update(dt);
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
  state.time = 0;
  state.spawnTimer = 0;
  state.eventsTriggered = 0;
  state.hazards.length = 0;
  state.keys.clear();
  state.player.x = canvas.width / 2 - state.player.w / 2;
  state.player.y = canvas.height - 90;
  if (pauseBtn) pauseBtn.textContent = "Pause";
  prepareAudio();
  updateScoreDisplay();
  updateTopAlert();
  updateRecordBadge();
  updateHudMode();
}

function togglePause() {
  if (!state.running || state.over || state.won) return;
  state.paused = !state.paused;
  if (state.paused) state.keys.clear();
  if (state.audio) {
    if (state.paused) state.audio.pause();
    else state.audio.play().catch(() => {});
  }
  if (getLevel().key === "rude" && state.bgVideo) {
    if (state.paused) state.bgVideo.pause();
    else state.bgVideo.play().catch(() => {});
  }
  if (pauseBtn) pauseBtn.textContent = state.paused ? "Resume" : "Pause";
  updateTopAlert();
  updateHudMode();
}

function jumpToRudeMix() {
  if (state.level !== "rude") {
    state.level = "rude";
    if (levelSelect) levelSelect.value = "rude";
    maybeShowLevelInfoModal("rude");
  }

  if (!state.running || state.over || state.won) {
    resetGame();
  }

  const mixStart = 170.1;
  state.time = mixStart;
  state.spawnTimer = 0;
  state.hazards.length = 0;

  if (state.audio) {
    const cfg = getLevel();
    state.audio.currentTime = cfg.audioStart + mixStart;
    if (state.audio.paused) state.audio.play().catch(() => {});
  }

  if (state.bgVideo) {
    state.bgVideo.currentTime = mixStart;
    if (state.bgVideo.paused) state.bgVideo.play().catch(() => {});
  }

  updateScoreDisplay();
  updateTopAlert();
  updateRecordBadge();
  updateHudMode();
}

window.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.shiftKey && (e.key === "v" || e.key === "V")) {
    e.preventDefault();
    state.invincible = !state.invincible;
    updateTopAlert();
    return;
  }

  if (e.ctrlKey && e.shiftKey && (e.key === "m" || e.key === "M")) {
    e.preventDefault();
    jumpToRudeMix();
    return;
  }

  if ((e.key === "Escape" || e.key === "Esc") && (state.running || state.over || state.won || state.paused)) {
    e.preventDefault();
    returnToHome();
    return;
  }

  if (e.ctrlKey && e.shiftKey && (e.key === "h" || e.key === "H")) {
    e.preventDefault();
    enterShowcaseWin();
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

if (playerColorPicker) {
  playerColorPicker.addEventListener("input", () => {
    state.playerColor = playerColorPicker.value;
  });
}

if (playerFramePicker) {
  playerFramePicker.addEventListener("input", () => {
    state.playerFrameColor = playerFramePicker.value;
  });
}

if (obstacleColorPicker) {
  obstacleColorPicker.addEventListener("input", () => {
    state.level3ObstacleColor = obstacleColorPicker.value;
  });
}

if (obstacleFramePicker) {
  obstacleFramePicker.addEventListener("input", () => {
    state.level3ObstacleFrame = obstacleFramePicker.value;
  });
}

if (leaderboardBtn) {
  leaderboardBtn.addEventListener("click", openLeaderboardModal);
}

if (closeLeaderboardBtn) {
  closeLeaderboardBtn.addEventListener("click", closeLeaderboardModal);
}

if (thanksBtn) {
  thanksBtn.addEventListener("click", openThanksModal);
}

if (closeThanksBtn) {
  closeThanksBtn.addEventListener("click", closeThanksModal);
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
  if (target.id === "thanksBtn") {
    openThanksModal();
    return;
  }
  if (target.id === "closeThanksBtn") {
    closeThanksModal();
    return;
  }
  if (target.id === "leaderboardModal") {
    closeLeaderboardModal();
    return;
  }
  if (target.id === "thanksModal") {
    closeThanksModal();
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
  });
}

if (closeModalBtn && blindInfoModal) {
  closeModalBtn.addEventListener("click", () => {
    blindInfoModal.classList.add("hidden");
  });
}

window.addEventListener("resize", resizeCanvas);

prepareAudio();
updateHudMode();
syncPlayerColorPicker();
updateLevelScopedControls();
syncObstaclePickers();
maybeShowLevelInfoModal(state.level);
draw();
requestAnimationFrame(loop);
