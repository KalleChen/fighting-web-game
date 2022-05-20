const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
const GRAVITY = 0.9
const X_VELOCITY = 8
const Y_VELOCITY = -20
const LIFE_POINT = 10
const DAMAGE = 1

// Setup canvas
canvas.width = window.innerWidth
canvas.height = window.innerHeight
context.fillRect(0, 0, canvas.width, canvas.height)

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

const player = new Sprite({
  position: {
    x: canvas.width / 17,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: 'red',
  direction: 1,
})

const enemy = new Sprite({
  position: {
    x: (canvas.width / 17) * 15,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: 'blue',
  direction: 0,
})

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
}

const checkAttackRange = (p1, p2) => {
  const XValid =
    (p1.attackBox.position.x <= p2.position.x &&
      p1.attackBox.position.x + p1.attackBox.width >= p2.position.x) ||
    (p1.attackBox.position.x <= p2.position.x + p2.width &&
      p1.attackBox.position.x + p1.attackBox.width >= p2.position.x + p2.width)
  const YValid = p1.attackBox.position.y + p1.attackBox.height >= p2.position.y
  return XValid && YValid
}

const animate = () => {
  window.requestAnimationFrame(animate)
  context.fillStyle = 'black'
  context.fillRect(0, 0, canvas.width, canvas.height)
  gsap.to('#left_life', {
    width: `${(player.lifePoint / LIFE_POINT) * 100}%`,
  })
  gsap.to('#right_life', {
    width: `${(enemy.lifePoint / LIFE_POINT) * 100}%`,
  })
  player.update()
  enemy.update()

  // player movement
  if (keys.a.pressed && player.lastKey !== 'd') {
    player.velocity.x = -X_VELOCITY
    player.attackBox.direction = 0
  } else if (keys.d.pressed && player.lastKey !== 'a') {
    player.velocity.x = X_VELOCITY
    player.attackBox.direction = 1
  } else {
    player.velocity.x = 0
  }
  // enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey !== 'ArrowRight') {
    enemy.velocity.x = -X_VELOCITY
    enemy.attackBox.direction = 0
  } else if (keys.ArrowRight.pressed && enemy.lastKey !== 'ArrowLeft') {
    enemy.velocity.x = X_VELOCITY
    enemy.attackBox.direction = 1
  } else {
    enemy.velocity.x = 0
  }

  // sprite attack check
  if (checkAttackRange(player, enemy)) {
    player.attackable = true
  } else {
    player.attackable = false
  }
  if (checkAttackRange(enemy, player)) {
    enemy.attackable = true
  } else {
    enemy.attackable = false
  }
}

animate()

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = true
      player.lastKey = 'd'
      break
    case 'a':
      keys.a.pressed = true
      player.lastKey = 'a'
      break
    case 'w':
      if (player.jumpTimes < 2) {
        player.velocity.y = Y_VELOCITY
        player.jumpTimes++
      }
      break
    case 's':
      player.attack(enemy)
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
      enemy.lastKey = 'ArrowLeft'
      break
    case 'ArrowRight':
      keys.ArrowRight.pressed = true
      enemy.lastKey = 'ArrowRight'
      break
    case 'ArrowUp':
      if (enemy.jumpTimes < 2) {
        enemy.velocity.y = Y_VELOCITY
        enemy.jumpTimes++
      }
      break
    case 'ArrowDown':
      enemy.attack(player)
      break
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      player.lastKey = null
      break
    case 'a':
      keys.a.pressed = false
      player.lastKey = null
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      enemy.lastKey = null
      break
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      enemy.lastKey = null
      break
  }
})
