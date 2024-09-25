import { Character } from "./Character";
import { Enemy } from "./Enemy";
import { Platform } from "./Platform";
import { checkCollision } from "./collision";

// Importing Node's 'fs' module (only works if the environment supports Node.js APIs)
import fs from "fs";

// Get canvas and context
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
if (!canvas) {
  throw new Error("Canvas element with ID 'gameCanvas' not found.");
}
const ctx = canvas.getContext("2d");
if (!ctx) {
  throw new Error("Unable to get 2D context for the canvas.");
}

// Read the JSON files synchronously and parse the data
const levelData = JSON.parse(fs.readFileSync("./level1.json", "utf-8")) as any;
const settingsData = JSON.parse(
  fs.readFileSync("./settings.json", "utf-8")
) as any;

const offsetThreshold = settingsData.canvas.offsetThreshold;

// Set the canvas dimensions
canvas.width = settingsData.canvas.width;
canvas.height = settingsData.canvas.height;

// Create the platforms canvas and context
const platformsCanvas = document.createElement("canvas") as HTMLCanvasElement;
platformsCanvas.width = levelData.settings.width;
platformsCanvas.height = canvas.height;
const platformsCtx = platformsCanvas.getContext("2d");
if (!platformsCtx) {
  throw new Error("Unable to get 2D context for the platforms canvas.");
}

// Draw the platforms on the platforms canvas
platformsCtx.fillStyle = settingsData.canvas.backgroundColor;
platformsCtx.fillRect(0, 0, platformsCanvas.width, platformsCanvas.height);

// Create the character and platforms
const character = new Character(levelData.character, settingsData.character);
const platforms = levelData.platforms.map(
  (platformData: any) =>
    new Platform(
      platformData.x,
      canvas.height - platformData.y,
      platformData.width,
      platformData.height,
      platformData.isSolid,
      platformData.isHazard
    )
);

platforms.forEach((platform: Platform) => platform.draw(platformsCtx));

let keys: { [key: string]: boolean } = {};

// Event listeners for key presses
window.addEventListener("keydown", (e: KeyboardEvent) => {
  keys[e.code] = true;
});

window.addEventListener("keyup", (e: KeyboardEvent) => {
  if (e.code === "Space") {
    character.jumpReleased = true;
  }
  keys[e.code] = false;
});

let offset = 0;
const enemies: Enemy[] = [];
enemies.push(new Enemy(platforms[2], 2));
enemies.push(new Enemy(platforms[3], 2));

function draw() {
  if (
    character.x > canvas.width - offsetThreshold - offset &&
    character.dx > 0
  ) {
    offset = Math.max(
      canvas.width - platformsCanvas.width,
      canvas.width - character.x - offsetThreshold
    );
  } else if (character.x < offsetThreshold - offset && character.dx < 0) {
    offset = Math.min(0, offsetThreshold - character.x);
  }
  if (!ctx) {
    throw new Error("Unable to get 2D context for the canvas.");
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = settingsData.canvas.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(platformsCanvas, offset, 0);
  ctx.save();
  // console.log(character.x, character.y, offset);
  character.draw(ctx, offset);
  for (const enemy of enemies) {
    enemy.draw(ctx, offset);
  }
  ctx.restore();
}

let lastTime = 0;

function gameLoop(timestamp: number) {
  const deltaTime = timestamp && lastTime !== 0 ? timestamp - lastTime : 0;
  if (!lastTime) {
    console.log(lastTime);
    console.log(deltaTime);
  }
  lastTime = timestamp ? timestamp : 0;
  character.update(keys, platformsCanvas, deltaTime);
  for (const [index, enemy] of enemies.entries()) {
    enemy.move(deltaTime);
    const enemyCollisions = checkCollision(character, enemy, deltaTime);
    if (enemyCollisions.top) {
      character.dy *= -0.5;
      enemies.splice(index, 1);
    } else if (
      enemyCollisions.bottom ||
      enemyCollisions.left ||
      enemyCollisions.right
    ) {
      console.log("Died");
      character.reset();
      offset = 0;
      break;
    }
  }
  for (const platform of platforms) {
    const collisions = checkCollision(character, platform, deltaTime);
    if (
      platform.hazard &&
      (collisions.top ||
        collisions.bottom ||
        collisions.left ||
        collisions.right)
    ) {
      // console.log(
      //   "Died",
      //   collisions,
      //   platform.x,
      //   platform.y,
      //   character.x,
      //   character.y
      // );
      character.reset();
      offset = 0;
      break;
    } else if (collisions.top) {
      character.land(platform.y);
    } else if (platform.solid && collisions.bottom) {
      character.bonk(platform.y + platform.height);
    } else if (platform.solid && collisions.left) {
      character.hitWall(platform.x - character.width);
    } else if (platform.solid && collisions.right) {
      character.hitWall(platform.x + platform.width);
    }
  }
  draw();

  requestAnimationFrame(gameLoop);
}

// Start the game loop after preloading images
Promise.all(
  character.images.map((img: HTMLImageElement) => {
    return new Promise<void>((resolve) => {
      img.onload = () => resolve();
    });
  })
).then(() => {
  gameLoop(0);
});
