import { GameObject } from "./GameObject";

export class Conveyor extends GameObject {
  direction: number;
  speed: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    direction: number = 1, // 1 means right, -1 means left
    speed: number = 0
  ) {
    super(x, y, width, height, false, false);
    this.direction = direction;
    this.speed = speed;
  }
}
