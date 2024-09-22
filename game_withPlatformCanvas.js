import { Character } from "./Character.js";
import { Platform } from "./Platform.js";
import { checkCollision } from "./collision.js";

const fs = require("fs");

// Get canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Read the JSON files synchronously and parse the data
const levelData = JSON.parse(fs.readFileSync("./level1.json", "utf-8"));
const settingsData = JSON.parse(fs.readFileSync("./settings.json", "utf-8"));

// Set the canvas dimensions
canvas.width = settingsData.canvas.width;
canvas.height = settingsData.canvas.height;

// Create the platforms canvas and context
const platformsCanvas = document.createElement("canvas");
platformsCanvas.width = canvas.width;
platformsCanvas.height = canvas.height;
const platformsCtx = platformsCanvas.getContext("2d");

// Draw the platforms on the platforms canvas
platformsCtx.fillStyle = settingsData.canvas.backgroundColor;
platformsCtx.fillRect(0, 0, platformsCanvas.width, platformsCanvas.height);

// Create the character and platforms
const character = new Character(levelData.character, settingsData.character);
const platforms = levelData.platforms.map(
  (platform) =>
    new Platform(
      platform.x,
      canvas.height - platform.y,
      platform.width,
      platform.height,
      platform.isSolid,
      platform.isHazard
    )
);

platforms.forEach((platform) => platform.draw(platformsCtx));

let keys = {};

// Event listeners for key presses
window.addEventListener("keydown", (e) => {
  keys[e.code] = true;
});

window.addEventListener("keyup", (e) => {
  if (e.code === "Space") {
    character.jumpReleased = true;
  }
  keys[e.code] = false;
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = settingsData.canvas.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(platformsCanvas, 0, 0);
  ctx.save();
  character.draw(ctx);
  ctx.restore();
}

let lastTime = 0;

function gameLoop(timestamp) {
  const deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  character.update(keys, settingsData.canvas, deltaTime);
  checkCollision(character, platforms, canvas);
  draw();

  requestAnimationFrame(gameLoop);
}

// Start the game loop after preloading images
Promise.all(
  character.images.map((img) => {
    return new Promise((resolve) => {
      img.onload = resolve;
    });
  })
).then(() => {
  gameLoop();
});
