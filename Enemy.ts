import { GameObject } from "./GameObject";
import { Platform } from "./Platform";

export class Enemy extends GameObject {
  speed: number;
  bounceFactor: number = -0.5;
  direction: number;
  platform: Platform;

  constructor(
    platform: Platform,
    speed: number,
    objectImage: HTMLImageElement | null = null
  ) {
    super(
      platform.x,
      platform.y - platform.height,
      40,
      50,
      true,
      true,
      false,
      objectImage
    );
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

  draw(ctx: CanvasRenderingContext2D, offset: number = 0): void {
    ctx.save(); // Save the current canvas state
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    // Check the direction and flip the image if the enemy is moving left
    if (this.direction === -1) {
      // Flip the image by scaling horizontally by -1
      ctx.scale(-1, 1);

      // Adjust the position because the flip changes the direction
      // This adjustment repositions the image back to the correct location
      ctx.drawImage(
        this.objectImage!,
        -(this.x + this.width + 10 + offset), // Position after flipping
        this.y + 5,
        this.width + 20,
        this.height + 5
      );
    } else {
      // Normal drawing for right direction
      ctx.drawImage(
        this.objectImage!,
        this.x - 10 + offset,
        this.y + 5,
        this.width + 20,
        this.height + 10
      );
    }

    ctx.restore(); // Restore the canvas state
  }
}
