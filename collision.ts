interface Character {
  x: number;
  y: number;
  width: number;
  height: number;
  dx: number;
  dy: number;
}

interface Object {
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
  object: Object,
  deltaTime: number,
  current: boolean = false
): Collisions {
  const collisions = {
    top: false,
    bottom: false,
    left: false,
    right: false,
  };

  const objectTop = object.y;
  const objectBottom = object.y + object.height;
  const objectLeft = object.x;
  const objectRight = object.x + object.width;

  const withinPlatformWidth =
    character.x < objectRight && character.x + character.width > objectLeft;

  const withinPlatformHeight =
    character.y < objectBottom && character.y + character.height > objectTop;

  if (current && withinPlatformHeight && withinPlatformWidth) {
    collisions["top"] = true;
    return collisions;
  }

  // Collision from above
  if (
    withinPlatformWidth &&
    character.y + character.height >= objectTop &&
    character.y + character.height - character.dy * deltaTime * 1.0001 <=
      objectTop
  ) {
    collisions["top"] = true;
  }

  // Collision from below
  if (
    withinPlatformWidth &&
    character.y < objectBottom &&
    character.y - character.dy * deltaTime * 1.0001 >= objectBottom
  ) {
    collisions["bottom"] = true;
  }

  // Collision from the left/right side
  if (
    withinPlatformHeight &&
    character.x + character.width > objectLeft &&
    character.x < objectRight
  ) {
    if (
      character.x + character.width - character.dx * deltaTime * 1.0001 <=
        objectLeft ||
      object.hazard
    ) {
      // console.log("left");
      collisions["left"] = true;
    }

    if (
      character.x - character.dx * deltaTime * 1.0001 >= objectRight ||
      object.hazard
    ) {
      // console.log("right");
      collisions["right"] = true;
    }
  }

  if (
    (collisions.left || collisions.right) &&
    character.y + character.height > objectTop &&
    character.y + character.height <= objectTop + character.height * 0.1
  ) {
    // If the character is in the top section, move them to the top of the platform
    collisions["top"] = true;
  }

  return collisions;
}
