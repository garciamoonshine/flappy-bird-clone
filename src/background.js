class Background {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.groundHeight = 60;
    this.skyColor = '#70c5ce';
    this.groundColor = '#ded895';
    this.clouds = this.generateClouds(6);
    this.groundOffset = 0;
    this.cloudSpeed = 0.3;
    this.groundSpeed = 2;
  }

  generateClouds(count) {
    return Array.from({ length: count }, (_, i) => ({
      x: (this.width / count) * i + Math.random() * 80,
      y: 30 + Math.random() * 100,
      w: 60 + Math.random() * 60,
      h: 25 + Math.random() * 20,
      speed: 0.2 + Math.random() * 0.3
    }));
  }

  update() {
    this.groundOffset = (this.groundOffset + this.groundSpeed) % 24;
    this.clouds.forEach(c => {
      c.x -= c.speed;
      if (c.x + c.w < 0) c.x = this.width + c.w;
    });
  }

  draw(ctx) {
    // sky
    ctx.fillStyle = this.skyColor;
    ctx.fillRect(0, 0, this.width, this.height);

    // clouds
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    this.clouds.forEach(c => {
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, c.w / 2, c.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(c.x + c.w * 0.25, c.y - c.h * 0.3, c.w * 0.35, c.h * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // ground
    const gy = this.height - this.groundHeight;
    ctx.fillStyle = '#ded895';
    ctx.fillRect(0, gy, this.width, this.groundHeight);
    ctx.fillStyle = '#5d9c59';
    ctx.fillRect(0, gy, this.width, 16);
    // ground stripes
    ctx.fillStyle = '#c8c45a';
    for (let x = -this.groundOffset; x < this.width; x += 24) {
      ctx.fillRect(x, gy + 4, 12, 8);
    }
  }
}