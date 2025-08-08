const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const GRAVITY = 0.8;
const JUMP_VELOCITY = -12;

const assets = {};
const loadImage = (name, src) => {
  const img = new Image();
  img.src = src;
  assets[name] = img;
};

loadImage("bee", "assets/bee.png");
loadImage("redwolf", "assets/redwolf.png");
loadImage("weilong", "assets/weilong.png");
loadImage("block", "assets/block.png");
loadImage("bg", "assets/background.png");

const player = {
  x: 100,
  y: 400,
  vx: 0,
  vy: 0,
  width: 40,
  height: 48,
  onGround: false,
};

const keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

const blocks = [
  { x: 0, y: 480, width: 960, height: 50 },
  { x: 300, y: 400, width: 50, height: 50 },
  { x: 500, y: 350, width: 50, height: 50 },
];

const redwolves = [{ x: 700, y: 448, width: 32, height: 32 }];
const weilongs = [{ x: 400, y: 448, width: 32, height: 32, dir: 1 }];

function update() {
  player.vy += GRAVITY;
  player.x += player.vx;
  player.y += player.vy;

  player.vx = 0;
  if (keys["ArrowLeft"]) player.vx = -5;
  if (keys["ArrowRight"]) player.vx = 5;
  if (keys[" "] || keys["ArrowUp"]) {
    if (player.onGround) {
      player.vy = JUMP_VELOCITY;
      player.onGround = false;
    }
  }

  player.onGround = false;
  for (const b of blocks) {
    if (player.x < b.x + b.width && player.x + player.width > b.x &&
        player.y < b.y + b.height && player.y + player.height > b.y) {
      if (player.vy > 0) {
        player.y = b.y - player.height;
        player.vy = 0;
        player.onGround = true;
      }
    }
  }

  for (const w of weilongs) {
    w.x += w.dir * 1.5;
    if (w.x < 300 || w.x > 500) w.dir *= -1;
  }

  for (const r of redwolves) {
    if (collides(player, r)) reset();
  }
  for (const w of weilongs) {
    if (collides(player, w)) reset();
  }
}

function collides(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x &&
         a.y < b.y + b.height && a.y + a.height > b.y;
}

function reset() {
  player.x = 100;
  player.y = 400;
  player.vy = 0;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(assets.bg, 0, 0, canvas.width, canvas.height);

  for (const b of blocks) {
    ctx.drawImage(assets.block, b.x, b.y, b.width, b.height);
  }

  for (const r of redwolves) {
    ctx.drawImage(assets.redwolf, r.x, r.y, r.width, r.height);
  }

  for (const w of weilongs) {
    ctx.drawImage(assets.weilong, w.x, w.y, w.width, w.height);
  }

  ctx.drawImage(assets.bee, player.x, player.y, player.width, player.height);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
