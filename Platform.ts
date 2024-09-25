export class Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  solid: boolean;
  hazard: boolean;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    solid: boolean,
    hazard: boolean
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.solid = solid;
    this.hazard = hazard;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.hazard) {
      ctx.fillStyle = "rgba(255, 25, 25, 1)";
    } else if (this.solid) {
      ctx.fillStyle = "green";
    } else {
      ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
    }
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
