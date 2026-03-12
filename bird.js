// Bird Class - Physics and Rendering
class Bird {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 34;
    this.height = 26;
    this.velocity = 0;
    this.gravity = 0.5;
    this.flapStrength = -9;
    this.rotation = 0;
    this.alive = true;
    this.flapAnim = 0;
  }

  flap() {
    if (!this.alive) return;
    this.velocity = this.flapStrength;
    this.flapAnim = 1;
  }

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;
    this.rotation = Math.min(Math.PI / 2, Math.max(-0.4, this.velocity * 0.08));
    if (this.flapAnim > 0) this.flapAnim -= 0.15;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.rotation);

    // Body
    ctx.fillStyle = '#ffe033';
    ctx.beginPath();
    ctx.ellipse(0, 0, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wing
    const wingY = Math.sin(this.flapAnim * Math.PI) * 6;
    ctx.fillStyle = '#ffb700';
    ctx.beginPath();
    ctx.ellipse(-4, -wingY, 10, 6, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(8, -4, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(9, -4, 3, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = '#ff9500';
    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.lineTo(22, -2);
    ctx.lineTo(22, 4);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  getBounds() {
    return {
      x: this.x + 4,
      y: this.y + 4,
      w: this.width - 8,
      h: this.height - 8
    };
  }

  isOffScreen(canvasHeight) {
    return this.y + this.height > canvasHeight || this.y < 0;
  }
}
