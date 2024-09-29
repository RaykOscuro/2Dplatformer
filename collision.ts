import { CharacterData } from "./Character";

interface Character extends CharacterData {
  dx: number;
  dy: number;
  settings: any;
}

interface gameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  solid: boolean;
  hazard: boolean;
}

interface Collisions {
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
}

export function checkCollision(
  character: Character,
  gameObject: gameObject,
  deltaTime: number,
  current: boolean = false
): Collisions {
  const collisions = {
    top: false,
    bottom: false,
    left: false,
    right: false,
  };

  const objectTop = gameObject.y;
  const objectBottom = gameObject.y + gameObject.height;
  const objectLeft = gameObject.x;
  const objectRight = gameObject.x + gameObject.width;

  const withinObjectWidth =
    character.x < objectRight && character.x + character.width > objectLeft;

  const withinObjectHeight =
    character.y < objectBottom && character.y + character.height > objectTop;

  if (current && withinObjectHeight && withinObjectWidth) {
    collisions["top"] = true;
    return collisions;
  }

  // Collision from above
  if (
    withinObjectWidth &&
    character.y + character.height >= objectTop &&
    character.y + character.height - character.dy * deltaTime * 1.0001 <=
      objectTop
  ) {
    collisions["top"] = true;
  }

  // Collision from below
  if (
    withinObjectWidth &&
    character.y < objectBottom &&
    character.y - character.dy * deltaTime * 1.0001 >= objectBottom
  ) {
    collisions["bottom"] = true;
  }

  // Collision from the left/right side
  if (
    withinObjectHeight &&
    character.x + character.width > objectLeft &&
    character.x < objectRight
  ) {
    if (
      character.x + character.width - character.dx * deltaTime * 1.0001 <=
        objectLeft ||
      gameObject.hazard
    ) {
      // console.log("left");
      collisions["left"] = true;
    }

    if (
      character.x - character.dx * deltaTime * 1.0001 >= objectRight ||
      gameObject.hazard
    ) {
      // console.log("right");
      collisions["right"] = true;
    }
  }

  if (
    
    (collisions.left || collisions.right) &&
    character.y + character.height > objectTop &&
    character.y + character.height <= objectTop + character.settings.ledgeClimb
  ) {
    // If the character is in the top section, move them to the top of the platform
    collisions["top"] = true;
  }

  return collisions;
}
