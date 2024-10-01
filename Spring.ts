import { GameObject } from "./GameObject";

export class Spring extends GameObject {
  bounceFactor: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    bounceFactor: number = -1,
    objectImage: HTMLImageElement | null = null
  ) {
    super(x, y, width, height, false, false, false, objectImage);
    this.bounceFactor = bounceFactor;
  }

  draw(ctx: CanvasRenderingContext2D, offset: number = 0): void {
    ctx.save(); // Save the current canvas state
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      this.objectImage!,
      this.x + offset,
      this.y,
      this.width,
      this.height
    );

    ctx.restore(); // Restore the canvas state
  }
}
