export class Character {
  constructor(characterData, settingsData) {
    this.audioJump = new Audio('/sfx/jump.mp3');
    this.settings = settingsData;
    this.images = [];
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
    this.dx = 0;
    this.dy = 0;
    this.grounded = true;
    this.facingLeft = false;
    this.jumpCounter = 0;
    this.canDoubleJump = true;
    this.jumpReleased = true;
    this.coyoteCounter = this.settings.coyoteTime; // Counter to track coyote time
    this.frameIndex = 0; // To track the current frame of the animation
    this.frameCounter = 0; // Counter to switch between frames
  }

  reset() {
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

  land(ground) {
    this.y = ground - this.height;
    this.dy = 0;
    this.grounded = true;
    this.canDoubleJump = true;
    this.coyoteCounter = this.settings.coyoteTime;
  }

  bonk(ceiling) {
    this.y = ceiling;
    this.dy = 0;
  }

  hitWall(wall, deltaTime) {
    this.x = wall;
    this.dx = 0;
    // this.dy = -this.settings.gravity * deltaTime / 16.66667;
    // this.canDoubleJump = true;
  }

  draw(ctx, offset) {
    ctx.imageSmoothingEnabled = true;
    if (this.facingLeft) {
      ctx.translate(this.x + this.width + offset, this.y);
      ctx.scale(-1, 1);
    } else {
      ctx.translate(this.x + offset, this.y);
    }
    ctx.drawImage(this.images[this.frameIndex], 0, 0, this.width, this.height);
  }

  update(keys, canvas, deltaTime) {
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
    // Start jump immediately on space press
    if (keys["Space"] && this.jumpReleased) {
      console.log(this.coyoteCounter);
      this.jumpReleased = false;
      this.jumpCounter = 0;
      this.grounded = false;
      if (this.grounded || this.coyoteCounter > 0) {
        // this.audioJump.load();
        // this.audioJump.cloneNode().play();
        this.grounded = false;
        this.coyoteCounter = 0;
        this.dy = this.settings.initialJumpStrength;
      } else if (this.canDoubleJump) {
        // this.audioJump.load();
        // this.audioJump.cloneNode().play();
        this.grounded = false;
        this.canDoubleJump = false;
        this.dy = this.settings.initialJumpStrength;
      }
    }

    // Continue jumping if the key is held down
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

    // Coyote time logic: decrement the counter if not grounded
    if (!this.grounded) {
      if (this.coyoteCounter > 0) {
        this.coyoteCounter -= deltaTime / 16.66667;
      } else {
        this.coyoteCounter = 0;
      }
    }
    // Collision with ground
    // if (this.y + this.height > canvas.height) {
    //   this.y = canvas.height - this.height;
    //   this.dy = 0;
    //   this.grounded = true;
    //   this.canDoubleJump = true;
    //   this.coyoteCounter = coyoteTime; // Reset the coyote time counter when grounded
    // }

    // Boundary conditions
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > canvas.width + 50) this.x = canvas.width + 50 - this.width;
    if (this.y < 0) this.y = 0;
    if (this.y + this.height > canvas.height) this.reset();
  }
}
