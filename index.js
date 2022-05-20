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

const animate = () => {
  const animationId = window.requestAnimationFrame(animate)
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
  checkEnd(player, enemy)
  if (end) {
    window.cancelAnimationFrame(animationId)
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
