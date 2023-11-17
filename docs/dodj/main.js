title = "Dodj";

description = `
Avoid the
obstacles!
`;

characters = [
  `
pppp
p  p
p  p
pppp
`,
  `
llllll
lrrrrl
lrrrrl
lrrrrl
lrrrrl
llllll
`,
  `
  y
 yyy
yyyyy
`,
  `
  y
 yy
yyy
 yy
  y
`,
  `
yyyyy
 yyy
  y
`,
  `
y
yy
yyy
yy
y
`,
];

options = { theme: "crt", viewSize: { x: 100, y: 150 }, isReplayEnabled: true };

/**
 * @typedef {{
 * pos: Vector,
 * }} Player
 */

/**
 * @type { Player }
 */
let player;

/**
 * @typedef {{
 * pos: Vector,
 * direction: number,
 * velRand: number,
 * }} Enemy
 */

/**
 * @type { Enemy [] }
 */
let enemies;
let wave;
let cooldown;
let dirInd;
let dir;
let maxE;
let speedMult;

function update() {
  if (!ticks) {
    player = { pos: vec(50, 75) };
    enemies = [];
    wave = 0;
    cooldown = 30;
    dirInd = "c";
    dir = 0;
    maxE = 1;
    speedMult = 0.5;
  }

  player.pos = input.pos.clamp(0, 100, 0, 150);
  char("a", player.pos);

  if (cooldown == Math.max(30 - wave, 6) && enemies.length <= maxE) {
    let newdir = floor(rnd(0, 3.99));
    while (newdir === dir) newdir = floor(rnd(0, 3.99));
    dir = newdir;
    switch (dir) {
      case 0:
        dirInd = "c";
        break;
      case 1:
        dirInd = "d";
        break;
      case 2:
        dirInd = "e";
        break;
      case 3:
        dirInd = "f";
        break;
      default:
        dirInd = "c";
    }
  }

  if (cooldown > 0 && enemies.length <= maxE) {
    cooldown--;
    char(dirInd, 50, 75);
  }

  if (enemies.length <= maxE && cooldown == 0) {
    for (let i = 0; i < floor(wave / 3) + 4; i++) {
      let posX = 0;
      let posY = 0;
      switch (dir) {
        case 0:
          posX = rnd(0, 100);
          posY = -20 * i;
          break;
        case 1:
          posX = -20 * i;
          posY = rnd(0, 150);
          break;
        case 2:
          posX = rnd(0, 100);
          posY = 20 * i + 150;
          break;
        case 3:
          posX = 20 * i + 150;
          posY = rnd(0, 150);
          break;
        default:
          posX = rnd(0, 100);
          posY = -20 * i;
      }
      enemies.push({
        pos: vec(posX, posY),
        direction: dir,
        velRand: rnd(-0.3, 0.3),
      });
    }

    wave++;
    maxE = floor(wave * 0.2) + 1;
    cooldown = Math.max(30 - wave, 6);
    speedMult = Math.min(1, speedMult + 0.03);
  }

  remove(enemies, (e) => {
    let rCase = false;
    let vel = (2.5 + e.velRand) * speedMult;
    switch (e.direction) {
      case 0:
        e.pos.y += vel;
        rCase = e.pos.y > 160;
        break;
      case 1:
        e.pos.x += vel;
        rCase = e.pos.x > 110;
        break;
      case 2:
        e.pos.y -= vel;
        rCase = e.pos.y < -10;
        break;
      case 3:
        e.pos.x -= vel;
        rCase = e.pos.x < -10;
        break;
      default:
        e.pos.y += vel;
    }
    const isCollidingWithPlayer = char("b", e.pos).isColliding.char.a;
    if (isCollidingWithPlayer) {
      end();
      play("explosion");
    }

    if (rCase) {
      addScore(
        4 + maxE,
        Math.max(Math.min(e.pos.x, 85), 15),
        Math.max(Math.min(e.pos.y, 150), 30)
      );
      play("coin");
    }
    return rCase;
  });
}
