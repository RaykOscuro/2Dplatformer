export class GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  solid: boolean;
  hazard: boolean;
  background: boolean;
  objectImage: HTMLImageElement | null = null;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    solid: boolean,
    hazard: boolean,
    background: boolean = false,
    objectImage: HTMLImageElement | null = null
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.solid = solid;
    this.hazard = hazard;
    this.background = background;
    this.objectImage = objectImage;
  }

  // Common draw method
  draw(ctx: CanvasRenderingContext2D, offset: number = 0): void {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.save();

    if (this.hazard) {
      // Draw the spike image if it's fully loaded
      if (this.objectImage) {
        for (let i = 0; i < this.width; i += 50) {
          ctx.drawImage(
            this.objectImage!,
            this.x - 5 + i + offset,
            this.y - 5,
            60,
            this.height + 10
          );
        }
      } else {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x + offset, this.y, this.width, this.height);
      }
    } else if (this.solid) {
      ctx.fillStyle = "green";
      ctx.fillRect(this.x + offset, this.y, this.width, this.height);
    } else {
      ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
      ctx.fillRect(this.x + offset, this.y, this.width, this.height);
    }

    ctx.restore();
  }
}
