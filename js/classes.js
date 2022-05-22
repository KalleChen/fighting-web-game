class Sprite {
  constructor({
    position,
    imageSrc,
    width,
    height,
    frameMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position
    this.image = new Image()
    this.image.src = imageSrc
    this.width = width
    this.height = height
    this.frameMax = frameMax
    this.currentFrame = 0
    this.frameElapsed = 0
    this.framesHold = 5
    this.offset = offset
  }

  draw() {
    context.drawImage(
      this.image,
      (this.image.width / this.frameMax) * this.currentFrame,
      0,
      this.image.width / this.frameMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y + this.offset.y,
      this.width / this.frameMax,
      this.height
    )
  }

  frameAnimation() {
    this.frameElapsed++
    if (this.frameElapsed % this.framesHold === 0) {
      this.currentFrame++
      if (this.currentFrame >= this.frameMax) {
        this.currentFrame = 0
      }
    }
  }

  update() {
    this.draw()
    this.frameAnimation()
  }
}

class Player extends Sprite {
  constructor({
    position,
    imageSrc,
    velocity,
    direction,
    width,
    height,
    frameMax,
    offset,
    sprites,
  }) {
    super({ position, imageSrc, width, height, frameMax, offset })
    this.velocity = velocity
    this.sprites = {}
    Object.keys(sprites).map((key) => {
      const image = new Image()
      image.src = sprites[key].imageSrc
      const reverseImage = new Image()
      reverseImage.src = sprites[key].imageSrc.replace('.png', '-reverse.png')
      this.sprites[key] = {
        ...sprites[key],
        image: image,
        reverseImage: reverseImage,
      }
    })
    this.lastKey = null
    this.jumtTimes = 0
    this.offset = offset
    this.direction = direction
    this.attackBox = {
      width: canvas.width / 5,
      height: this.height / 7,
      position: {
        x:
          this.position.x +
          (direction === 1 ? -this.width * 2 : -this.width * 2),
        y: this.position.y + this.offset.y * 10 + this.height / 4,
      },
    }
    this.body = {
      width: canvas.width / 19,
      height: this.height / 4,
      position: {
        x: this.position.x,
        y: this.position.y,
      },
    }
    this.attackable = false
    this.attacking = false
    this.lifePoint = LIFE_POINT
    this.other = null
    this.hit = false
    this.takeHit = false
  }

  attack(other) {
    if (this.attacking || this.isDead || other.isDead) return
    this.hit = false
    this.currentFrame = 0
    this.attacking = true
    this.other = other
    this.isDead = false
  }

  update() {
    if (this.lifePoint <= 0 && !this.isDead) {
      this.isDead = true
      this.currentFrame = 0
      this.image = this.sprites.death.image
      this.frameMax = this.sprites.death.frameMax
      this.width = this.sprites.death.width
    }
    if (this.isDead) {
      if (this.currentFrame === this.frameMax - 1) {
        this.currentFrame -= 1
      }
      this.position.y += this.velocity.y
      if (this.position.y + this.height + this.velocity.y >= canvas.height) {
        this.velocity.y = 0
        this.jumpTimes = 0
      } else {
        this.velocity.y += GRAVITY
      }
      this.draw()
      this.frameAnimation()
      return
    }
    if (this.attacking && this.currentFrame === this.frameMax - 1) {
      this.attacking = false
    }
    if (this.takeHit && this.currentFrame === this.frameMax - 1) {
      this.takeHit = false
    }
    if (
      this.attacking &&
      this.attackable &&
      Math.abs(this.currentFrame - this.frameMax / 2) <= 1 &&
      this.other &&
      !this.hit
    ) {
      this.other.lifePoint -= DAMAGE
      if (this.other.direction === this.direction)
        this.other.lifePoint -= DAMAGE
      this.hit = true
      this.other.takeHit = true
      this.other.currentFrame = 0
    }

    if (this.velocity.x === 0 && this.velocity.y === 0) {
      this.image = this.sprites.idle
      this.frameMax = this.sprites.idle.frameMax
      this.width = this.sprites.idle.width
    }
    if (this.velocity.x !== 0 && this.velocity.y === 0) {
      this.image = this.sprites.run
      this.frameMax = this.sprites.run.frameMax
      this.width = this.sprites.run.width
    }
    if (this.velocity.y > 0) {
      this.image = this.sprites.jump
      this.frameMax = this.sprites.jump.frameMax
      this.width = this.sprites.jump.width
    }
    if (this.velocity.y < 0) {
      this.image = this.sprites.fall
      this.frameMax = this.sprites.fall.frameMax
      this.width = this.sprites.fall.width
    }
    if (this.attacking) {
      this.image = this.sprites.attack1
      this.frameMax = this.sprites.attack1.frameMax
      this.width = this.sprites.attack1.width
    }
    if (this.takeHit) {
      this.image = this.sprites.takeHit
      this.frameMax = this.sprites.takeHit.frameMax
      this.width = this.sprites.takeHit.width
    }
    if (this.direction === 1) {
      this.image = this.image.image
    } else {
      this.image = this.image.reverseImage
    }

    this.draw()
    this.frameAnimation()
    if (
      this.position.x +
        this.velocity.x -
        this.offset.x * 2 +
        this.width / this.frameMax >=
      canvas.width
    )
      this.velocity.x = 0
    if (this.position.x + this.velocity.x <= 0) this.velocity.x = 0

    this.position.y += this.velocity.y
    this.position.x += this.velocity.x

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0
      this.jumpTimes = 0
    } else {
      this.velocity.y += GRAVITY
    }
    this.attackBox.position.x =
      this.position.x +
      (this.direction === 1
        ? this.width / this.frameMax - this.offset.ax
        : -this.attackBox.width)
    this.attackBox.position.y =
      this.position.y + this.offset.y + this.height / 2.5
    this.body.position.x = this.position.x
    this.body.position.y = this.position.y + this.offset.y + this.height / 2.5
  }
}
