import { Platform } from "./Platform";

export class Enemy {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  direction: number;
  platform: Platform; // The platform the enemy moves on
  hazard: boolean;
  solid: boolean;

  constructor(platform: Platform, speed: number) {
    this.width = 50;
    this.height = 50;
    this.x = platform.x;
    this.y = platform.y - platform.height;
    this.platform = platform;
    this.speed = speed;
    this.direction = 1; // 1 means right, -1 means left
    this.hazard = true;
    this.solid = true;
  }

  move(deltaTime: number) {
    // Update the enemy's position based on speed and direction
    this.x += (this.speed * this.direction * deltaTime) / 16.66667;

    // Reverse direction if the enemy hits the edge of the platform
    if (this.x < this.platform.x) {
      this.direction = 1;
    } else if (this.x + this.width > this.platform.x + this.platform.width) {
      this.direction = -1;
    }
  }

  draw(ctx: CanvasRenderingContext2D, offset: number) {
    ctx.imageSmoothingEnabled = true;
    ctx.save();
    ctx.fillStyle = "red";
    ctx.fillRect(this.x + offset, this.y, this.width, this.height);
    ctx.restore();
  }
}
