import { GameObject } from "./GameObject";
import { Platform } from "./Platform";

export class Enemy extends GameObject {
  speed: number;
  bounceFactor: number = -0.5;
  direction: number;
  platform: Platform;

  constructor(platform: Platform, speed: number) {
    super(platform.x, platform.y - platform.height, 50, 50, true, true);
    this.platform = platform;
    this.speed = speed;
    this.direction = 1; // 1 means right, -1 means left
  }

  move(deltaTime: number) {
    // Update the enemy's position based on speed and direction
    this.x += this.speed * this.direction * deltaTime;

    // Reverse direction if the enemy hits the edge of the platform
    if (this.x < this.platform.x) {
      this.direction = 1;
    } else if (this.x + this.width > this.platform.x + this.platform.width) {
      this.direction = -1;
    }
  }
}
