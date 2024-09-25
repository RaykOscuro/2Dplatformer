interface CharacterData {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SettingsData {
  characterFrames: number;
  frameImageName: string;
  frameImageType: string;
  moveSpeed: number;
  gravity: number;
  initialJumpStrength: number;
  maxJumpTime: number;
  maxFallSpeed: number;
  frameSpeed: number;
  coyoteTime: number;
}

interface Keys {
  [key: string]: boolean;
}

export class Character {
  audioJump: HTMLAudioElement;
  settings: SettingsData;
  images: HTMLImageElement[] = [];
  xBase: number;
  yBase: number;
  x: number;
  y: number;
  hitbox: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  width: number;
  height: number;
  dx: number = 0;
  dy: number = 0;
  grounded: boolean = true;
  facingLeft: boolean = false;
  jumpCounter: number = 0;
  canDoubleJump: boolean = true;
  jumpReleased: boolean = true;
  coyoteCounter: number;
  frameIndex: number = 0;
  frameCounter: number = 0;

  constructor(characterData: CharacterData, settingsData: SettingsData) {
    this.audioJump = new Audio("/sfx/jump.mp3");
    this.settings = settingsData;
    for (let i = 1; i <= this.settings.characterFrames; i++) {
      const img = new Image();
      img.src = `images/${settingsData.frameImageName}${i}.${settingsData.frameImageType}`;
      this.images.push(img);
    }
    this.xBase = characterData.x;
    this.yBase = characterData.y;
    this.x = characterData.x;
    this.y = characterData.y;
    this.hitbox = {
      left: characterData.x,
      right: characterData.x + characterData.width,
      top: characterData.y,
      bottom: characterData.y + characterData.height,
    };
    this.width = characterData.width;
    this.height = characterData.height;
    this.coyoteCounter = this.settings.coyoteTime;
  }

  reset(): void {
    this.x = this.xBase;
    this.y = this.yBase;
    this.dx = 0;
    this.dy = 0;
    this.grounded = true;
    this.facingLeft = false;
    this.jumpCounter = 0;
    this.canDoubleJump = true;
    this.coyoteCounter = this.settings.coyoteTime;
    this.frameIndex = 0;
    this.frameCounter = 0;
  }

  land(ground: number): void {
    this.y = ground - this.height;
    this.dy = 0;
    this.grounded = true;
    this.canDoubleJump = true;
    this.coyoteCounter = this.settings.coyoteTime;
  }

  bonk(ceiling: number): void {
    this.y = ceiling;
    this.dy = 0;
  }

  hitWall(wall: number, deltaTime: number): void {
    this.x = wall;
    this.dx = 0;
  }

  draw(ctx: CanvasRenderingContext2D, offset: number): void {
    ctx.imageSmoothingEnabled = true;
    ctx.save();
    if (this.facingLeft) {
      ctx.translate(this.x + this.width + offset, this.y);
      ctx.scale(-1, 1);
    } else {
      ctx.translate(this.x + offset, this.y);
    }
    ctx.drawImage(this.images[this.frameIndex], 0, 0, this.width, this.height);
    ctx.restore();
  }

  update(keys: Keys, canvas: HTMLCanvasElement, deltaTime: number): void {
    if (this.dy > this.settings.gravity / 2) {
      this.grounded = false;
    }

    // Horizontal movement
    if (keys["ArrowLeft"]) {
      this.dx = -this.settings.moveSpeed;
      this.facingLeft = true;
      this.frameCounter += deltaTime / 16.66667;
    } else if (keys["ArrowRight"]) {
      this.dx = this.settings.moveSpeed;
      this.facingLeft = false;
      this.frameCounter += deltaTime / 16.66667;
    } else {
      this.dx = 0;
      this.frameIndex = 0;
      this.frameCounter = 0;
    }

    if (this.frameCounter >= this.settings.frameSpeed) {
      this.frameIndex = (this.frameIndex + 1) % this.images.length; // Loop through frames
      this.frameCounter = 0; // Reset counter
    }

    // Jump logic
    if (keys["Space"] && this.jumpReleased) {
      this.jumpReleased = false;
      this.jumpCounter = 0;
      if (this.grounded || this.coyoteCounter > 0) {
        this.dy = this.settings.initialJumpStrength;
        this.coyoteCounter = 0;
        this.grounded = false;
      } else if (this.canDoubleJump) {
        this.dy = this.settings.initialJumpStrength;
        this.canDoubleJump = false;
      }
    }

    // Continue jump
    if (
      keys["Space"] &&
      !this.grounded &&
      this.jumpCounter < this.settings.maxJumpTime
    ) {
      this.dy += (this.settings.gravity * 0.1 * deltaTime) / 16.66667;
      this.jumpCounter += deltaTime / 16.66667;
    } else {
      // Apply gravity
      this.dy += (this.settings.gravity * deltaTime) / 16.66667;
    }

    // Limit fall speed
    if (this.dy > this.settings.maxFallSpeed) {
      this.dy = this.settings.maxFallSpeed;
    }

    // Update position
    this.x += (this.dx * deltaTime) / 16.66667;
    this.y += (this.dy * deltaTime) / 16.66667;

    // Coyote time logic
    if (!this.grounded) {
      if (this.coyoteCounter > 0) {
        this.coyoteCounter -= deltaTime / 16.66667;
      } else {
        this.coyoteCounter = 0;
      }
    }

    // Boundary conditions
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
    if (this.y < 0) this.y = 0;
    if (this.y + this.height > canvas.height) this.reset();
  }
}
