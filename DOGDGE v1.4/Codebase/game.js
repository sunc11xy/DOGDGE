const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const revivesEl = document.getElementById("revives");
const blindTopEl = document.getElementById("blindTop");
const sideScoreEl = document.getElementById("sideScore");
const recordBadgeEl = document.getElementById("recordBadge");
const celebrateBtn = document.getElementById("celebrateBtn");
const hudEl = document.querySelector(".hud");
const startBtn = document.getElementById("startBtn");
const continueBtn = document.getElementById("continueBtn");
const pauseBtn = document.getElementById("pauseBtn");
const blindInfoModal = document.getElementById("blindInfoModal");
const closeModalBtn = document.getElementById("closeModalBtn");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();

const music = new Audio("Codebase/spaghetti.mp3");
music.preload = "auto";
music.loop = false;
music.volume = 0.5;

const TARGET_DURATION_SECONDS = 3 * 60 + 15;
const BASE_AREA = 520 * 680;
const BASE_SPAWN_INTERVAL = 0.5;
const BLIND_WARNING_SECONDS = 3;
const BLIND_START_DURATION = 0.7;
const BLIND_MIN_DURATION = 0.1;
const BLIND_SHRINK_PER_SECOND = 0.003;
const BLIND_TARGET_EVENTS = 7;
const BLIND_GAP_MIN = 20;
const BLIND_GAP_MAX = 42;

const state = {
  running: false,
  over: false,
  paused: false,
  won: false,
  showcaseWin: false,
  awaitingContinue: false,
  score: 0,
  best: 0,
  targetDuration: TARGET_DURATION_SECONDS,
  maxRevives: 5,
  revivesUsed: 0,
  invulnerableUntil: -1,
  time: 0,
  spawnTimer: 0,
  speedScale: 1,
  blindsTriggered: 0,
  nextBlindAt: Infinity,
  blindActiveUntil: -1,
  recordBadgeUntil: -1,
  recordShownThisRun: false,
  confetti: [],
  player: { x: canvas.width / 2 - 16, y: canvas.height - 90, w: 32, h: 32, speed: 290 },
  hazards: [],
  keys: new Set(),
};

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
  const target = Math.max(1, Math.ceil(state.targetDuration));
  const current = Math.min(target, Math.floor(state.time));
  scoreEl.textContent = `${current}s / ${target}s`;
  if (sideScoreEl) sideScoreEl.textContent = scoreEl.textContent;
}

updateBestDisplay();
updateReviveDisplay();
updateScoreDisplay();

music.addEventListener("ended", () => {
  if (state.running && !state.over && !state.won) {
    handleWin();
  }
});

function scheduleNextBlind(fromTime) {
  if (state.blindsTriggered >= BLIND_TARGET_EVENTS) {
    state.nextBlindAt = Infinity;
    return;
  }

  const remainingTime = Math.max(1, state.targetDuration - fromTime);
  const remainingEvents = Math.max(1, BLIND_TARGET_EVENTS - state.blindsTriggered);
  const baseGap = remainingTime / remainingEvents;
  const jitter = baseGap * 0.28;
  const rawGap = baseGap + (Math.random() * 2 - 1) * jitter;
  const gap = Math.max(BLIND_GAP_MIN, Math.min(BLIND_GAP_MAX, rawGap));
  state.nextBlindAt = fromTime + gap;
}

function getBlindDuration() {
  return Math.max(BLIND_MIN_DURATION, BLIND_START_DURATION - state.time * BLIND_SHRINK_PER_SECOND);
}

function isBlindActive() {
  return state.running && !state.paused && state.time < state.blindActiveUntil;
}

function updateBlindTop() {
  if (!blindTopEl) return;

  blindTopEl.classList.remove("show");

  if (!state.running || state.over || state.won || state.paused) {
    return;
  }

  if (isBlindActive()) {
    blindTopEl.textContent = "BLIND";
    blindTopEl.classList.add("show");
    return;
  }

  const untilBlind = state.nextBlindAt - state.time;
  if (untilBlind <= BLIND_WARNING_SECONDS) {
    blindTopEl.textContent = `BLIND IN ${untilBlind.toFixed(1)}s`;
    blindTopEl.classList.add("show");
  }
}

function updateRecordBadge() {
  if (!recordBadgeEl) return;
  const show = state.running && state.time < state.recordBadgeUntil;
  recordBadgeEl.classList.toggle("show", show);
}

function updateHudMode() {
  if (!hudEl) return;
  const compact = state.running && !state.over && !state.won;
  hudEl.classList.toggle("compact", compact);
  if (sideScoreEl) sideScoreEl.classList.toggle("show", compact);
  if (continueBtn) continueBtn.hidden = !(state.over && state.awaitingContinue);
  if (celebrateBtn) celebrateBtn.hidden = !(state.won || state.showcaseWin);
}

function resetMusicAfterFail() {
  music.pause();
  music.currentTime = 0;
}

function resetGame() {
  state.running = true;
  state.over = false;
  state.paused = false;
  state.won = false;
  state.showcaseWin = false;
  state.awaitingContinue = false;
  state.score = 0;
  state.revivesUsed = 0;
  state.invulnerableUntil = -1;
  state.time = 0;
  state.spawnTimer = 0;
  state.speedScale = 1;
  state.blindsTriggered = 0;
  state.blindActiveUntil = -1;
  state.recordBadgeUntil = -1;
  state.recordShownThisRun = false;
  state.hazards.length = 0;
  state.player.x = canvas.width / 2 - state.player.w / 2;
  state.player.y = canvas.height - 90;

  if (pauseBtn) pauseBtn.textContent = "Pause";

  music.currentTime = 0;
  music.play().catch(() => {});

  scheduleNextBlind(0);
  updateReviveDisplay();
  updateScoreDisplay();
  updateBlindTop();
  updateRecordBadge();
  updateHudMode();
}

function spawnHazard() {
  const size = 18 + Math.random() * 24;
  const x = Math.random() * (canvas.width - size);
  const speed = (130 + Math.random() * 150) * state.speedScale;
  state.hazards.push({ x, y: -size, size, speed, alpha: 0.65 + Math.random() * 0.35 });
}

function handleGameOver() {
  state.running = false;
  state.over = true;
  state.paused = false;
  state.won = false;
  state.showcaseWin = false;
  state.awaitingContinue = false;

  if (state.score > state.best) {
    state.best = state.score;
    updateBestDisplay();
  }

  resetMusicAfterFail();
  updateBlindTop();
  updateRecordBadge();
  updateHudMode();
}

function triggerCollisionGameOver() {
  state.running = false;
  state.over = true;
  state.paused = false;
  state.won = false;
  state.showcaseWin = false;
  state.awaitingContinue = state.revivesUsed < state.maxRevives;
  music.pause();
  updateBlindTop();
  updateHudMode();
}

function continueFromRevive() {
  if (!state.over || !state.awaitingContinue) return;

  state.revivesUsed += 1;
  state.awaitingContinue = false;
  state.over = false;
  state.running = true;
  state.paused = false;
  state.invulnerableUntil = state.time + 1;

  state.hazards.length = 0;

  if (pauseBtn) pauseBtn.textContent = "Pause";
  updateReviveDisplay();
  updateHudMode();
  music.play().catch(() => {});
}

function handleWin() {
  state.running = false;
  state.over = false;
  state.paused = false;
  state.won = true;
  state.showcaseWin = false;
  state.awaitingContinue = false;
  state.score = Math.ceil(state.targetDuration);
  music.pause();
  music.currentTime = state.targetDuration;

  if (state.score > state.best) {
    state.best = state.score;
    updateBestDisplay();
  }

  updateScoreDisplay();
  updateBlindTop();
  updateRecordBadge();
  initConfetti();
  updateHudMode();
}

function enterShowcaseWin() {
  state.running = false;
  state.over = false;
  state.paused = false;
  state.won = true;
  state.showcaseWin = true;
  state.awaitingContinue = false;
  initConfetti();
  music.pause();
  updateBlindTop();
  updateHudMode();
}

function initConfetti() {
  const colors = [
    "#ff4d4d",
    "#ff9f1c",
    "#ffe14d",
    "#7dff6b",
    "#38d9ff",
    "#7c6bff",
    "#ff6bd6",
    "#ffffff",
  ];
  const pieces = 180;
  state.confetti = [];
  for (let i = 0; i < pieces; i += 1) {
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

function update(dt) {
  if (!state.running || state.paused) return;

  state.time += dt;
  state.spawnTimer += dt;
  state.speedScale = 1 + state.time * 0.025;

  if (state.time >= state.targetDuration) {
    handleWin();
    return;
  }

  if (state.time >= state.nextBlindAt) {
    state.blindsTriggered += 1;
    state.blindActiveUntil = state.time + getBlindDuration();
    scheduleNextBlind(state.time);
  }

  const moveX = (state.keys.has("ArrowRight") || state.keys.has("d") ? 1 : 0) -
    (state.keys.has("ArrowLeft") || state.keys.has("a") ? 1 : 0);
  const moveY = (state.keys.has("ArrowDown") || state.keys.has("s") ? 1 : 0) -
    (state.keys.has("ArrowUp") || state.keys.has("w") ? 1 : 0);

  state.player.x += moveX * state.player.speed * dt;
  state.player.y += moveY * state.player.speed * dt;

  state.player.x = Math.max(0, Math.min(canvas.width - state.player.w, state.player.x));
  state.player.y = Math.max(0, Math.min(canvas.height - state.player.h, state.player.y));

  const areaRatio = Math.max(1, (canvas.width * canvas.height) / BASE_AREA);
  const densityScale = Math.sqrt(areaRatio);
  const runtimeScale = Math.min(2.6, 1 + state.time * 0.028);
  const spawnInterval = Math.max(0.055, BASE_SPAWN_INTERVAL / (densityScale * runtimeScale));
  const hazardsPerSpawn = densityScale >= 2.6 ? 3 : densityScale >= 1.6 ? 2 : 1;
  const maxHazards = Math.floor(42 * densityScale);

  while (state.spawnTimer >= spawnInterval) {
    state.spawnTimer -= spawnInterval;
    for (let i = 0; i < hazardsPerSpawn && state.hazards.length < maxHazards; i += 1) {
      spawnHazard();
    }
  }

  for (const hazard of state.hazards) {
    hazard.y += hazard.speed * dt;
  }

  state.hazards = state.hazards.filter((h) => h.y < canvas.height + h.size);

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
    }
  }
  updateScoreDisplay();
  updateBlindTop();
  updateRecordBadge();
}

function drawWinScreen() {
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

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = "700 56px Courier New";
  ctx.fillText("YOU WIN", canvas.width / 2, canvas.height / 2 - 72);

  ctx.font = "700 20px Courier New";
  ctx.fillText("you've accomplished", canvas.width / 2, canvas.height / 2 - 24);

  ctx.font = "700 24px Courier New";
  ctx.fillText("MINISKIRT - AOA", canvas.width / 2, canvas.height / 2 + 14);

  ctx.font = "700 18px Courier New";
  ctx.fillText(`${todayString()} - First Player to Complete`, canvas.width / 2, canvas.height / 2 + 52);

  ctx.font = "700 18px Courier New";
  ctx.fillText(`Revivals used: ${state.revivesUsed} / ${state.maxRevives}`, canvas.width / 2, canvas.height / 2 + 82);
}

function draw() {
  updateBlindTop();
  updateRecordBadge();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#111111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const h of state.hazards) {
    ctx.fillStyle = `rgba(255, 255, 255, ${h.alpha})`;
    ctx.fillRect(h.x, h.y, h.size, h.size);
  }

  ctx.fillStyle = "#f2f2f2";
  ctx.fillRect(state.player.x, state.player.y, state.player.w, state.player.h);
  ctx.strokeStyle = "#050505";
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
    ctx.fillStyle = "rgba(0, 0, 0, 0.74)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f2f2f2";
    ctx.textAlign = "center";
    ctx.font = "700 40px Courier New";
    ctx.fillText(state.over ? "Game Over" : "dogdge", canvas.width / 2, canvas.height / 2 - 24);
    ctx.font = "500 20px Courier New";
    const sub = state.over
      ? state.awaitingContinue
        ? "Press Start to restart or C to revive"
        : "Press Start to try again"
      : "Press Start to begin";
    ctx.fillText(sub, canvas.width / 2, canvas.height / 2 + 16);
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

function togglePause() {
  if (!state.running || state.over || state.won) return;
  state.paused = !state.paused;
  if (state.paused) state.keys.clear();
  if (state.paused) {
    music.pause();
  } else {
    music.play().catch(() => {});
  }
  if (pauseBtn) pauseBtn.textContent = state.paused ? "Resume" : "Pause";
  updateBlindTop();
  updateHudMode();
}

window.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.shiftKey && (e.key === "h" || e.key === "H")) {
    e.preventDefault();
    enterShowcaseWin();
    return;
  }

  if ((e.key === "c" || e.key === "C") && state.over && state.awaitingContinue) {
    e.preventDefault();
    continueFromRevive();
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

if (startBtn) {
  startBtn.addEventListener("click", resetGame);
}

if (continueBtn) {
  continueBtn.addEventListener("click", continueFromRevive);
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

updateHudMode();
draw();
requestAnimationFrame(loop);
