// Pipes - Enhanced Phase 2
const PIPE_WIDTH = 52;
const PIPE_GAP_BASE = 140;
const PIPE_SPEED_BASE = 2.5;
const PIPE_INTERVAL = 1600;

let pipes = [];
let pipeTimer = 0;
let pipeGap = PIPE_GAP_BASE;
let pipeSpeed = PIPE_SPEED_BASE;
let score = 0;
let highScore = parseInt(localStorage.getItem('flappyHS')) || 0;
let isRunning = false;
let dailyChallengeMode = false;
let dailyScore = 0;

function getDailyChallengeSeed() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function resetPipes() {
  pipes = []; pipeTimer = 0;
  pipeGap = PIPE_GAP_BASE;
  pipeSpeed = PIPE_SPEED_BASE;
  score = 0;
}

function spawnPipe() {
  const minY = 60, maxY = canvas.height - pipeGap - 60;
  const topH = Math.floor(Math.random() * (maxY - minY) + minY);
  pipes.push({ x: canvas.width, topH, scored: false });
}

function updatePipes(dt) {
  pipeTimer += dt;
  if (pipeTimer >= PIPE_INTERVAL) { spawnPipe(); pipeTimer = 0; }
  pipes.forEach(p => { p.x -= pipeSpeed; });
  pipes = pipes.filter(p => p.x + PIPE_WIDTH > -10);
  // Score
  const b = getBirdBounds();
  pipes.forEach(p => {
    if (!p.scored && p.x + PIPE_WIDTH < bird.x) {
      p.scored = true; score++;
      if (score > highScore) { highScore = score; localStorage.setItem('flappyHS', highScore); }
      // Increase difficulty
      if (score % 5 === 0) {
        pipeSpeed = Math.min(6, pipeSpeed + 0.2);
        pipeGap = Math.max(95, pipeGap - 4);
      }
    }
    // Collision
    const inX = b.x < p.x + PIPE_WIDTH && b.x + b.w > p.x;
    if (inX && (b.y < p.topH || b.y + b.h > p.topH + pipeGap)) {
      endFlappyGame();
    }
  });
  if (bird.y + BIRD_SIZE > canvas.height - 40 || bird.y - BIRD_SIZE < 0) endFlappyGame();
}

function drawPipes(ctx) {
  pipes.forEach(p => {
    // Top pipe
    const grad1 = ctx.createLinearGradient(p.x, 0, p.x + PIPE_WIDTH, 0);
    grad1.addColorStop(0, '#3a9d23'); grad1.addColorStop(0.5, '#4ec93b'); grad1.addColorStop(1, '#2d7a1b');
    ctx.fillStyle = grad1;
    ctx.fillRect(p.x, 0, PIPE_WIDTH, p.topH);
    // Cap
    ctx.fillRect(p.x - 4, p.topH - 20, PIPE_WIDTH + 8, 20);
    // Bottom pipe
    const bY = p.topH + pipeGap;
    ctx.fillStyle = grad1;
    ctx.fillRect(p.x, bY, PIPE_WIDTH, canvas.height - bY);
    ctx.fillRect(p.x - 4, bY, PIPE_WIDTH + 8, 20);
  });
}

function getMedal(s) {
  if (s >= 40) return '🪥 Platinum';
  if (s >= 25) return '🥇 Gold';
  if (s >= 15) return '🥈 Silver';
  if (s >= 5)  return '🥉 Bronze';
  return '🟤 Tin';
}

function endFlappyGame() {
  bird.alive = false; isRunning = false;
  const medal = getMedal(score);
  document.getElementById('final-score').textContent = score;
  document.getElementById('best-score').textContent = highScore;
  document.getElementById('medal').textContent = medal;
  document.getElementById('bg-name').textContent = BACKGROUNDS[activeBg].name;
  document.getElementById('game-over-screen').classList.remove('hidden');
}
