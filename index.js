const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/background.png',
  width: canvas.width,
  height: canvas.height,
})

const shop = new Sprite({
  position: {
    x: (canvas.width * 3) / 5,
    y: canvas.height / 6,
  },
  imageSrc: './img/shop.png',
  width: canvas.width * 1.8,
  height: canvas.height / 1.5,
  frameMax: 6,
})

let initAnimationID
let animationId
const initAnimate = () => {
  initAnimationID = window.requestAnimationFrame(initAnimate)
  background.update()
  shop.update()
}
initAnimate()

const start = () => {
  end = false
  window.cancelAnimationFrame(initAnimationID)
  if (animationId) {
    window.cancelAnimationFrame(animationId)
  }
  const startBlock = document.getElementById('start_block')
  startBlock.style.display = 'none'
  const resultBlock = document.getElementById('result_block')
  resultBlock.style.display = 'none'
  if (timeoutId) clearTimeout(timeoutId)
  time = DEFAULT_TIME
  decreaseTime()
  const player = new Player({
    position: {
      x: canvas.width / 10,
      y: -canvas.height / 2,
    },
    velocity: {
      x: 0,
      y: 0,
    },
    imageSrc: './img/samuraiMack/Idle.png',
    width: canvas.width * 4,
    height: canvas.height,
    frameMax: 8,
    direction: 1,
    offset: {
      x: canvas.width * 0.22,
      y: canvas.height * 0.22,
      ax: canvas.width * 0.44,
    },
    sprites: {
      idle: {
        imageSrc: './img/samuraiMack/Idle.png',
        frameMax: 8,
        width: canvas.width * 4,
      },
      run: {
        imageSrc: './img/samuraiMack/Run.png',
        frameMax: 8,
        width: canvas.width * 4,
      },
      jump: {
        imageSrc: './img/samuraiMack/Jump.png',
        frameMax: 2,
        width: canvas.width,
      },
      fall: {
        imageSrc: './img/samuraiMack/Fall.png',
        frameMax: 2,
        width: canvas.width,
      },
      attack1: {
        imageSrc: './img/samuraiMack/Attack1.png',
        frameMax: 6,
        width: canvas.width * 3,
      },
      takeHit: {
        imageSrc: './img/samuraiMack/Take-Hit.png',
        frameMax: 4,
        width: canvas.width * 2,
      },
      death: {
        imageSrc: './img/samuraiMack/Death.png',
        frameMax: 6,
        width: canvas.width * 3,
      },
    },
  })

  const enemy = new Player({
    position: {
      x: (canvas.width * 8) / 10,
      y: -canvas.height / 2,
    },
    velocity: {
      x: 0,
      y: 0,
    },
    imageSrc: './img/kenji/Idle.png',
    width: canvas.width * 2.5,
    height: canvas.height,
    frameMax: 4,
    direction: 0,
    offset: {
      x: canvas.width * 0.28,
      y: canvas.height * 0.2,
      ax: canvas.width * 0.55,
    },
    sprites: {
      idle: {
        imageSrc: './img/kenji/Idle.png',
        frameMax: 4,
        width: canvas.width * 2.5,
      },
      run: {
        imageSrc: './img/kenji/Run.png',
        frameMax: 8,
        width: canvas.width * 5,
      },
      jump: {
        imageSrc: './img/kenji/Jump.png',
        frameMax: 2,
        width: canvas.width * 1.25,
      },
      fall: {
        imageSrc: './img/kenji/Fall.png',
        frameMax: 2,
        width: canvas.width * 1.25,
      },
      attack1: {
        imageSrc: './img/kenji/Attack1.png',
        frameMax: 4,
        width: canvas.width * 2.5,
      },
      takeHit: {
        imageSrc: './img/kenji/Take-Hit.png',
        frameMax: 3,
        width: canvas.width * 1.875,
      },
      death: {
        imageSrc: './img/kenji/Death.png',
        frameMax: 7,
        width: canvas.width * 4.375,
      },
    },
  })

  const animate = async () => {
    animationId = window.requestAnimationFrame(animate)
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)
    gsap.to('#left_life', {
      width: `${(player.lifePoint / LIFE_POINT) * 100}%`,
    })
    gsap.to('#right_life', {
      width: `${(enemy.lifePoint / LIFE_POINT) * 100}%`,
    })
    background.update()
    shop.update()
    player.update()
    enemy.update()

    // player movement
    if (keys.a.pressed && player.lastKey !== 'd') {
      if (player.velocity.x !== -X_VELOCITY) player.currentFrame = 0
      player.velocity.x = -X_VELOCITY
      player.direction = 0
    } else if (keys.d.pressed && player.lastKey !== 'a') {
      if (player.velocity.x !== X_VELOCITY) player.currentFrame = 0
      player.velocity.x = X_VELOCITY
      player.direction = 1
    } else {
      if (player.velocity.x !== 0) player.currentFrame = 0
      player.velocity.x = 0
    }
    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey !== 'ArrowRight') {
      if (enemy.velocity.x !== -X_VELOCITY) enemy.currentFrame = 0
      enemy.velocity.x = -X_VELOCITY
      enemy.direction = 0
    } else if (keys.ArrowRight.pressed && enemy.lastKey !== 'ArrowLeft') {
      if (enemy.velocity.x !== X_VELOCITY) enemy.currentFrame = 0
      enemy.velocity.x = X_VELOCITY
      enemy.direction = 1
    } else {
      if (enemy.velocity.x !== 0) enemy.currentFrame = 0
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
    checkEnd(player, enemy)
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
          if (player.velocity.y !== Y_VELOCITY) player.currentFrame = 0
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
          if (enemy.velocity.y !== Y_VELOCITY) enemy.currentFrame = 0
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
}
