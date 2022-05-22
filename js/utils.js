const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
const GRAVITY = 0.9
const X_VELOCITY = 8
const Y_VELOCITY = -20
const LIFE_POINT = 10
const DAMAGE = 1
const DEFAULT_TIME = 90

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
    (p1.attackBox.position.x <= p2.body.position.x &&
      p1.attackBox.position.x + p1.attackBox.width >= p2.body.position.x) ||
    (p1.attackBox.position.x <= p2.body.position.x + p2.body.width &&
      p1.attackBox.position.x + p1.attackBox.width >=
        p2.body.position.x + p2.body.width)
  const YValid =
    p1.attackBox.position.y + p1.attackBox.height >= p2.body.position.y
  return XValid && YValid
}

let end = false

// time
let timeoutId = null
let time = DEFAULT_TIME
const decreaseTime = () => {
  if (time < 0 || end) return
  document.getElementById('time_block').innerHTML = time
  timeoutId = setTimeout(decreaseTime, 1000)
  time--
}

// end
const checkEnd = (p1, p2) => {
  const resultBlock = document.getElementById('result_block')
  const resultText = document.getElementById('result_text')
  if (p1.lifePoint <= 0) {
    resultText.innerHTML = 'Player 2 Win'
    end = true
  } else if (p2.lifePoint <= 0) {
    resultText.innerHTML = 'Player 1 Win'
    end = true
  } else if (time < 0) {
    resultText.innerHTML = 'Time Out'
    end = true
  } else {
    end = false
  }
  if (end) {
    resultBlock.style.display = 'flex'
  }
}

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

const help = () => {
  document.getElementById('help_block').style.display = 'flex'
}

const closeHelp = () => {
  document.getElementById('help_block').style.display = 'none'
  start()
}
