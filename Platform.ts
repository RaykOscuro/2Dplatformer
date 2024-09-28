import { GameObject } from "./GameObject";

export class Platform extends GameObject {
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    solid: boolean,
    hazard: boolean
  ) {
    super(x, y, width, height, solid, hazard);
  }

}