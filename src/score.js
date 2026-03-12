class ScoreManager {
  constructor() {
    this.current = 0;
    this.best = parseInt(localStorage.getItem('flappy-best') || '0');
  }

  reset() {
    this.current = 0;
  }

  add(points = 1) {
    this.current += points;
    if (this.current > this.best) {
      this.best = this.current;
      localStorage.setItem('flappy-best', this.best);
    }
  }

  draw(ctx, canvasWidth) {
    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.strokeText(this.current, canvasWidth / 2, 60);
    ctx.fillText(this.current, canvasWidth / 2, 60);
    ctx.restore();
  }

  drawBest(ctx, canvasWidth, canvasHeight) {
    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.strokeText(`BEST: ${this.best}`, canvasWidth / 2, canvasHeight / 2 + 30);
    ctx.fillText(`BEST: ${this.best}`, canvasWidth / 2, canvasHeight / 2 + 30);
    ctx.restore();
  }
}