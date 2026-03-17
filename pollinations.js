// Pollinations AI Image Integration - API v0.3.0
// Base URL: https://gen.pollinations.ai
// Docs: https://enter.pollinations.ai/api/docs
const POLLINATIONS_TOKEN = 'sk_XAwK4NoIzJVceQNqn1SG22oDgJPkkMYA';
const POLLINATIONS_BASE = 'https://gen.pollinations.ai/image/';

function getPollinationsUrl(prompt, width = 360, height = 480, seed = null) {
  const encoded = encodeURIComponent(prompt);
  let url = `${POLLINATIONS_BASE}${encoded}?width=${width}&height=${height}&nologo=true&key=${POLLINATIONS_TOKEN}`;
  if (seed !== null) url += `&seed=${seed}`;
  return url;
}

const bgPrompts = [
  'sunny cartoon sky with fluffy clouds, pixel art side-scrolling game background, green hills',
  'sunset orange sky with clouds, pixel art side-scrolling background, silhouette trees',
  'night sky with stars and moon, pixel art game background, dark blue purple',
  'stormy dramatic sky, pixel art game background, lightning bolts, dark clouds',
  'underwater scene, pixel art side-scrolling background, bubbles coral fish'
];

const bgImages = [];
let bgLoaded = false;

async function preloadFlappyBackgrounds() {
  for (let i = 0; i < bgPrompts.length; i++) {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
        img.src = getPollinationsUrl(bgPrompts[i], 360, 480, i * 7);
      });
      bgImages.push(img);
      console.log(`[Pollinations] Loaded flappy background ${i + 1}/${bgPrompts.length}`);
    } catch (e) {
      console.warn('[Pollinations] Background load error', e);
    }
  }
  bgLoaded = bgImages.length > 0;
  window.pollinationsBgImages = bgImages;
  window.pollinationsBgLoaded = bgLoaded;
}

preloadFlappyBackgrounds();
