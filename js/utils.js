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

// movement
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

let end = false

// time
let time = 90
const decreaseTime = () => {
  if (time < 0 || end) return
  document.getElementById('time_block').innerHTML = time
  setTimeout(decreaseTime, 1000)
  time--
}
decreaseTime()

// end
const checkEnd = (p1, p2) => {
  const resultBlock = document.getElementById('result_block')
  if (p1.lifePoint <= 0) {
    resultBlock.innerHTML = 'Player 2 Win'
    end = true
  } else if (p2.lifePoint <= 0) {
    resultBlock.innerHTML = 'Player 1 Win'
    end = true
  } else if (time <= 0) {
    resultBlock.innerHTML = 'Time Out'
    end = true
  } else {
    end = false
  }
}
