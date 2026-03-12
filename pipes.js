// Pipe Class - Obstacles
class Pipe {
  constructor(x, canvasHeight) {
    this.x = x;
    this.width = 52;
    this.speed = 2.5;
    this.gap = 160;
    this.canvasHeight = canvasHeight;
    this.gapY = 120 + Math.random() * (canvasHeight - 280);
    this.passed = false;
    this.color = '#2ecc71';
    this.darkColor = '#27ae60';
  }

  update() {
    this.x -= this.speed;
  }

  draw(ctx) {
    const topH = this.gapY;
    const botY = this.gapY + this.gap;
    const botH = this.canvasHeight - botY;

    // Top pipe
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, 0, this.width, topH - 20);
    // Top cap
    ctx.fillStyle = this.darkColor;
    ctx.fillRect(this.x - 4, topH - 20, this.width + 8, 20);
    // Sheen
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fillRect(this.x + 6, 0, 8, topH - 20);

    // Bottom pipe
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, botY + 20, this.width, botH);
    // Bottom cap
    ctx.fillStyle = this.darkColor;
    ctx.fillRect(this.x - 4, botY, this.width + 8, 20);
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fillRect(this.x + 6, botY + 20, 8, botH);
  }

  collidesWith(bird) {
    const b = bird.getBounds();
    const topRect = { x: this.x - 4, y: 0, w: this.width + 8, h: this.gapY };
    const botRect = { x: this.x - 4, y: this.gapY + this.gap, w: this.width + 8, h: this.canvasHeight };
    const overlaps = (r1, r2) =>
      b.x < r2.x + r2.w && b.x + b.w > r2.x &&
      b.y < r2.y + r2.h && b.y + b.h > r2.y;
    return overlaps(b, topRect) || overlaps(b, botRect);
  }

  isOffScreen() { return this.x + this.width < 0; }
}

class PipeManager {
  constructor(canvasWidth, canvasHeight) {
    this.pipes = [];
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.spawnInterval = 90;
    this.tick = 0;
  }

  reset() { this.pipes = []; this.tick = 0; }

  update() {
    this.tick++;
    if (this.tick % this.spawnInterval === 0) {
      this.pipes.push(new Pipe(this.canvasWidth + 10, this.canvasHeight));
    }
    this.pipes.forEach(p => p.update());
    this.pipes = this.pipes.filter(p => !p.isOffScreen());
  }

  draw(ctx) { this.pipes.forEach(p => p.draw(ctx)); }

  checkCollision(bird) { return this.pipes.some(p => p.collidesWith(bird)); }

  checkScore(birdX) {
    let scored = 0;
    this.pipes.forEach(p => {
      if (!p.passed && birdX > p.x + p.width) { p.passed = true; scored++; }
    });
    return scored;
  }
}
