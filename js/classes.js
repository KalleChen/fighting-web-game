class Sprite {
  constructor({ position, imageSrc, width, height, frameMax = 1 }) {
    this.position = position
    this.image = new Image()
    this.image.src = imageSrc
    this.width = width
    this.height = height
    this.frameMax = frameMax
    this.currentFrame = 0
    this.frameElapsed = 0
    this.framesHold = 10
  }

  draw() {
    context.drawImage(
      this.image,
      (this.image.width / this.frameMax) * this.currentFrame,
      0,
      this.image.width / this.frameMax,
      this.image.height,
      this.position.x,
      this.position.y,
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
    this.frameAnimation()
    this.draw()
  }
}

class Player extends Sprite {
  constructor({ position, imageSrc, velocity, direction, color }) {
    super({ position, imageSrc })
    this.height = canvas.height / 3.5
    this.width = canvas.width / 17
    this.velocity = velocity
    this.lastKey = null
    this.jumtTimes = 0
    this.color = color
    this.attackBox = {
      width: this.width * 2,
      height: this.height / 2,
      direction: direction,
      position: {
        x: this.position.x + (position === 1 ? this.width : -this.width * 2),
        y: this.position.y + this.height / 4,
      },
    }
    this.attackable = false
    this.attacking = false
    this.lifePoint = LIFE_POINT
  }

  draw() {
    context.fillStyle = this.color
    context.fillRect(this.position.x, this.position.y, this.width, this.height)
  }

  attack(other) {
    if (this.isAttacking) return
    this.attacking = true
    if (this.attackable) {
      other.lifePoint -= DAMAGE
    }
    setTimeout(() => {
      this.attacking = false
    }, 300)
  }

  update() {
    this.draw()
    if (this.position.x + this.width + this.velocity.x >= canvas.width)
      this.velocity.x = 0
    if (this.position.x + this.velocity.x <= 0) this.velocity.x = 0

    this.position.y += this.velocity.y
    this.position.x += this.velocity.x

    if (
      this.position.y + this.height + this.velocity.y >=
      canvas.height * 0.85
    ) {
      this.velocity.y = 0
      this.jumpTimes = 0
    } else {
      this.velocity.y += GRAVITY
    }
    this.attackBox.position.x =
      this.position.x +
      (this.attackBox.direction === 1 ? this.width : -this.attackBox.width)
    this.attackBox.position.y = this.position.y + this.height / 4
  }
}
