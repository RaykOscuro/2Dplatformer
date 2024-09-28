import { GameObject } from "./GameObject";

export class Spring extends GameObject {
  bounceFactor: number;

  constructor(x: number, y: number, width: number, height: number, bounceFactor: number = -1) {
    super(x, y, width, height, false, false);
    this.bounceFactor = bounceFactor;
  }
}
