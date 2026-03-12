const STATE = { IDLE: 'idle', PLAYING: 'playing', DEAD: 'dead', GAMEOVER: 'gameover' };

class FlappyGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.W = canvas.width;
    this.H = canvas.height;
    this.state = STATE.IDLE;
    this.bg = new Background(this.W, this.H);
    this.bird = new Bird(this.W * 0.25, this.H * 0.45);
    this.pipes = [];
    this.score = new ScoreManager();
    this.collision = new CollisionDetector();
    this.pipeInterval = 90;
    this.pipeTimer = 0;
    this.animId = null;
    this.lastTime = 0;
    this.bindInput();
  }

  bindInput() {
    document.addEventListener('keydown', e => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        this.handleTap();
      }
    });
    this.canvas.addEventListener('click', () => this.handleTap());
    this.canvas.addEventListener('touchstart', e => {
      e.preventDefault();
      this.handleTap();
    }, { passive: false });
  }

  handleTap() {
    if (this.state === STATE.IDLE || this.state === STATE.GAMEOVER) {
      this.start();
    } else if (this.state === STATE.PLAYING) {
      this.bird.flap();
    }
  }

  start() {
    this.state = STATE.PLAYING;
    this.pipes = [];
    this.pipeTimer = 0;
    this.score.reset();
    this.bird = new Bird(this.W * 0.25, this.H * 0.45);
    if (this.animId) cancelAnimationFrame(this.animId);
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  loop(time) {
    const dt = Math.min((time - this.lastTime) / 16.67, 3);
    this.lastTime = time;
    this.update(dt);
    this.draw();
    this.animId = requestAnimationFrame(t => this.loop(t));
  }

  update(dt) {
    if (this.state !== STATE.PLAYING) return;
    this.bg.update();
    this.bird.update(dt);
    this.pipeTimer++;
    if (this.pipeTimer >= this.pipeInterval) {
      this.pipes.push(new Pipe(this.W, this.H));
      this.pipeTimer = 0;
    }
    this.pipes.forEach(p => p.update(dt));
    this.pipes = this.pipes.filter(p => !p.offScreen());

    // scoring
    this.pipes.forEach(p => {
      if (this.collision.birdPassedPipe(this.bird, p)) {
        p.passed = true;
        this.score.add(1);
      }
    });

    // collision
    const dead = this.pipes.some(p => this.collision.birdHitsPipe(this.bird, p)) ||
      this.collision.birdHitsGround(this.bird, this.H) ||
      this.collision.birdHitsCeiling(this.bird);
    if (dead) this.state = STATE.DEAD;
  }

  draw() {
    this.bg.draw(this.ctx);
    this.pipes.forEach(p => p.draw(this.ctx));
    this.bird.draw(this.ctx);
    this.score.draw(this.ctx, this.W);
    if (this.state === STATE.IDLE) this.drawIdleScreen();
    if (this.state === STATE.DEAD || this.state === STATE.GAMEOVER) this.drawGameOver();
  }

  drawIdleScreen() {
    this.ctx.fillStyle = 'rgba(0,0,0,0.35)';
    this.ctx.fillRect(0, 0, this.W, this.H);
    this.ctx.fillStyle = '#fff';
    this.ctx.font = 'bold 28px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('FLAPPY BIRD', this.W / 2, this.H / 2 - 20);
    this.ctx.font = '18px Arial';
    this.ctx.fillText('Tap or press Space to start', this.W / 2, this.H / 2 + 15);
  }

  drawGameOver() {
    this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
    this.ctx.fillRect(0, 0, this.W, this.H);
    this.ctx.fillStyle = '#e74c3c';
    this.ctx.font = 'bold 32px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', this.W / 2, this.H / 2 - 20);
    this.score.drawBest(this.ctx, this.W, this.H);
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '16px Arial';
    this.ctx.fillText('Tap to play again', this.W / 2, this.H / 2 + 60);
    this.state = STATE.GAMEOVER;
  }
}