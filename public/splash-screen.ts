import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(PixiPlugin, MotionPathPlugin);

const width = window.innerWidth;
const height = window.innerHeight;
const centerX = width / 2 - 75;
const centerY = height / 2 - 75;

const app = new PIXI.Application({
  width,
  height,
  antialias: true,
  autoDensity: true,
  resolution: 2,
  backgroundColor: 0x2d3748
});

app.view.style.position = 'absolute';

document.body.appendChild(app.view);

// Draw bucket
const rect1 = new PIXI.Graphics();
rect1.beginFill(0xffffff);
rect1.moveTo(centerX, centerY);
rect1.drawRect(centerX + 75 - 25, centerY + 75 - 9, 5, 16.5);
rect1.endFill();
app.stage.addChild(rect1);

const rect2 = new PIXI.Graphics();
rect2.beginFill(0xffffff);
rect2.moveTo(centerX, centerY);
rect2.drawRect(centerX + 75 + 20, centerY + 75 - 9, 5, 16.5);
rect2.endFill();
app.stage.addChild(rect2);

const rect3 = new PIXI.Graphics();
rect3.beginFill(0xffffff);
rect3.moveTo(centerX, centerY);
rect3.drawRect(centerX + 75 - 25, centerY + 75 + 7, 50, 5);
rect3.endFill();
app.stage.addChild(rect3);

const plates: PIXI.Sprite[] = [];
const totalPlates = 6;

for (let i = 0; i < totalPlates; i++) {
  const plate = PIXI.Sprite.from(PIXI.Texture.WHITE);

  // let colorMatrix = new PIXI.filters.ColorMatrixFilter();
  // plate.filters = [colorMatrix];
  // colorMatrix.tint(0xf07f24, false); // StackOverflow orange brand color

  plate.position.x = -50; // NB initially render it outside the canvas
  plate.position.y = -50; // NB initially render it outside the canvas
  plate.height = 30;
  plate.width = 5;
  plate.anchor.set(0.5);
  plates.push(plate);
  app.stage.addChild(plate);
}

// TODO Change direction from L -> R to L <- R
const bezier = new PIXI.Graphics();
const points = [
  new PIXI.Point(centerX + 150, centerY),
  new PIXI.Point(centerX + 100, centerY),
  new PIXI.Point(centerX + 75, centerY + 50),
  new PIXI.Point(centerX + 75, centerY + 75)
];

// bezier.lineStyle(2, 0xffffff, 0.2);
bezier.moveTo(points[0].x, points[0].y);
bezier.bezierCurveTo(points[1].x, points[1].y, points[2].x, points[2].y, points[3].x, points[3].y);

app.stage.addChild(bezier);

plates.forEach((plate, i) => {
  const tween = gsap.to(plate, {
    duration: 2,
    repeat: 50,
    delay: i * 0.15,
    ease: 'cubic-bezier(0,.95,.95,.05)',
    motionPath: {
      path: points,
      type: 'cubic',
      autoRotate: true,
      useRadians: true
    },
    onUpdate: () => {
      const progress = tween.progress();

      // Alpha increasing linear with the progress until 80%
      // on progress 90-100% alpha is decreasing to 0
      if (progress < 0.9) {
        plate.alpha = progress * 1.1;
      } else {
        plate.alpha = ((1 - progress) * 10) ** 2;
      }
    }
  });
});
