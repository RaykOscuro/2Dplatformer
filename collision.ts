interface Character {
    x: number;
    y: number;
    width: number;
    height: number;
    dx: number;
    dy: number;
    reset: () => void;
    land: (ground: number) => void;
    bonk: (ceiling: number) => void;
    hitWall: (wall: number, deltaTime: number) => void;
  }
  
  interface Platform {
    x: number;
    y: number;
    width: number;
    height: number;
    solid: boolean;
    hazard: boolean;
  }
  
  export function checkCollision(character: Character, platforms: Platform[], deltaTime: number): boolean {
    let died = false;
    let shouldLand = -1;
    let bonkSpot = -1;
    let horizontalSpot = -1;
  
    platforms.every((platform) => {
      const platformTop = platform.y;
      const platformBottom = platform.y + platform.height;
      const platformLeft = platform.x;
      const platformRight = platform.x + platform.width;
  
      const withinPlatformWidth =
        character.x <= platformRight &&
        character.x + character.width >= platformLeft;
  
      const withinPlatformHeight =
        character.y < platformBottom &&
        character.y + character.height > platformTop;
  
      // Collision from above
      if (
        withinPlatformWidth &&
        character.y + character.height >= platformTop &&
        character.y + character.height - (character.dy * deltaTime * 1.0001) / 16.66667 <= platformTop
      ) {
        if (platform.hazard) {
          died = true;
        } else {
          shouldLand = platformTop;
        }
      }
  
      // Collision from below
      if (
        withinPlatformWidth &&
        character.y < platformBottom &&
        character.y - (character.dy * deltaTime * 1.0001) / 16.66667 >= platformBottom
      ) {
        if (platform.hazard) {
          died = true;
        } else if (platform.solid) {
          bonkSpot = platformBottom;
        }
      }
  
      // Collision from the left/right side
      if (
        withinPlatformHeight &&
        ((character.x + character.width > platformLeft &&
          character.x + character.width - (character.dx * deltaTime * 1.0001) / 16.66667 <= platformLeft) ||
          (character.x < platformRight &&
            character.x - (character.dx * deltaTime * 1.0001) / 16.66667 >= platformRight))
      ) {
        if (platform.hazard) {
          died = true;
        } else if (platform.solid) {
          if (
            character.y + character.height > platformTop &&
            character.y + character.height <= platformTop + character.height * 0.25
          ) {
            // If the character is in the top quarter, move them to the top of the platform
            shouldLand = platformTop;
          } else {
            // Otherwise, block horizontal movement
            horizontalSpot =
              character.dx > 0 ? platformLeft - character.width : platformRight;
          }
        }
      }
      return true;
    });
  
    if (died) {
      console.log("died");
      character.reset();
      return false;
    }
  
    if (shouldLand !== -1) {
      character.land(shouldLand);
    }
  
    if (bonkSpot !== -1) {
      console.log("bonked");
      character.bonk(bonkSpot);
    }
  
    if (horizontalSpot !== -1) {
      console.log("hit wall");
      character.hitWall(horizontalSpot, deltaTime);
    }
  
    return true;
  }
  