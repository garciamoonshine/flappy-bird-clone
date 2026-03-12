class CollisionDetector {
  constructor() {}

  // AABB collision between bird and pipe
  birdHitsPipe(bird, pipe) {
    const bx = bird.x - bird.radius;
    const by = bird.y - bird.radius;
    const bw = bird.radius * 2;
    const bh = bird.radius * 2;
    // top pipe
    if (bx < pipe.x + pipe.width &&
        bx + bw > pipe.x &&
        by < pipe.topHeight) {
      return true;
    }
    // bottom pipe
    const bottomY = pipe.topHeight + pipe.gap;
    if (bx < pipe.x + pipe.width &&
        bx + bw > pipe.x &&
        by + bh > bottomY) {
      return true;
    }
    return false;
  }

  birdHitsGround(bird, canvasHeight) {
    return bird.y + bird.radius >= canvasHeight - 60;
  }

  birdHitsCeiling(bird) {
    return bird.y - bird.radius <= 0;
  }

  birdPassedPipe(bird, pipe) {
    return bird.x > pipe.x + pipe.width && !pipe.passed;
  }
}