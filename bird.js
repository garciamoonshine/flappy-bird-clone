// Bird - Enhanced Phase 2
const GRAVITY = 0.5;
const JUMP_FORCE = -9;
const BIRD_SIZE = 20;

const BACKGROUNDS = [
  { sky: ['#1a1a2e','#16213e'], ground: '#0f3460', cloud: 'rgba(255,255,255,0.15)', name: 'Night City' },
  { sky: ['#ff6b6b','#ffd93d'], ground: '#6bcb77', cloud: 'rgba(255,255,255,0.4)', name: 'Sunset' },
  { sky: ['#0f3460','#533483'], ground: '#2d6a4f', cloud: 'rgba(180,180,255,0.2)', name: 'Twilight' },
  { sky: ['#2d6a4f','#52b788'], ground: '#74c69d', cloud: 'rgba(255,255,255,0.3)', name: 'Forest' }
];

let bird = { x: 80, y: 200, vy: 0, alive: true };
let activeBg = 0;
let clouds = Array.from({length:5}, (_,i) => ({ x: i*160, y: 40+Math.random()*80, w: 60+Math.random()*40, speed: 0.3+Math.random()*0.3 }));

function resetBird() {
  bird.x = 80; bird.y = 200; bird.vy = 0; bird.alive = true;
  activeBg = Math.floor(Math.random() * BACKGROUNDS.length);
}

function updateBird() {
  if (!bird.alive) return;
  bird.vy += GRAVITY;
  bird.y += bird.vy;
  clouds.forEach(c => { c.x -= c.speed; if (c.x + c.w < 0) c.x = 480 + Math.random()*100; });
}

function flapBird() {
  if (bird.alive) bird.vy = JUMP_FORCE;
}

function drawBackground(ctx, canvas) {
  const bg = BACKGROUNDS[activeBg];
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, bg.sky[0]);
  grad.addColorStop(1, bg.sky[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Clouds
  ctx.fillStyle = bg.cloud;
  clouds.forEach(c => {
    ctx.beginPath();
    ctx.ellipse(c.x, c.y, c.w/2, 15, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(c.x - 20, c.y + 5, c.w/3, 12, 0, 0, Math.PI*2);
    ctx.fill();
  });
  // Ground
  ctx.fillStyle = bg.ground;
  ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
}

function drawBird(ctx) {
  // Body
  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.ellipse(bird.x, bird.y, BIRD_SIZE, BIRD_SIZE * 0.75, bird.vy * 0.05, 0, Math.PI*2);
  ctx.fill();
  // Wing
  ctx.fillStyle = '#ff8c00';
  ctx.beginPath();
  ctx.ellipse(bird.x - 5, bird.y + 4, 10, 6, -0.3, 0, Math.PI*2);
  ctx.fill();
  // Eye
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(bird.x + 8, bird.y - 4, 5, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(bird.x + 9, bird.y - 4, 2.5, 0, Math.PI*2);
  ctx.fill();
  // Beak
  ctx.fillStyle = '#ff4500';
  ctx.beginPath();
  ctx.moveTo(bird.x + 16, bird.y - 1);
  ctx.lineTo(bird.x + 24, bird.y + 2);
  ctx.lineTo(bird.x + 16, bird.y + 5);
  ctx.fill();
}

function getBirdBounds() {
  return { x: bird.x - BIRD_SIZE + 4, y: bird.y - BIRD_SIZE * 0.75 + 4, w: BIRD_SIZE*2 - 8, h: BIRD_SIZE*1.5 - 8 };
}
