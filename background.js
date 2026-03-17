// AI-powered procedural backgrounds for Flappy Bird
const bgNames = [
  'Sunny Day', 'Golden Sunset', 'Starry Night', 'Stormy Sky', 'Underwater'
];
let currentBgIndex = 0;

function getDailyBgIndex() {
  const day = Math.floor(Date.now() / 86400000);
  return day % bgNames.length;
}

function drawBackground(ctx, canvas) {
  const imgs = window.pollinationsBgImages;
  if (imgs && imgs.length > 0) {
    const idx = currentBgIndex % imgs.length;
    if (imgs[idx] && imgs[idx].complete) {
      ctx.drawImage(imgs[idx], 0, 0, canvas.width, canvas.height);
      return;
    }
  }
  // Fallback gradient
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#87CEEB');
  grad.addColorStop(1, '#98FB98');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function rotateBg() {
  const imgs = window.pollinationsBgImages;
  if (imgs && imgs.length > 0) {
    currentBgIndex = (currentBgIndex + 1) % imgs.length;
  }
}

function getDailyChallengeSeed() {
  currentBgIndex = getDailyBgIndex();
  return Math.floor(Date.now() / 86400000);
}

window.getDailyChallengeSeed = getDailyChallengeSeed;
