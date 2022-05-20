class Sprite {
  constructor({ position, velocity, color, direction }) {
    this.position = position
    this.velocity = velocity
    this.height = canvas.height / 3.5
    this.width = canvas.width / 17
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
    context.fillStyle = 'green'
    context.fillRect(
      this.attackBox.position.x,
      this.attackBox.position.y,
      this.attackBox.width,
      this.attackBox.height
    )
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

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
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
