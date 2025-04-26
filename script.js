const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const grid = document.getElementById('grid');
const scoreBoard = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const timeLeft = document.getElementById('time');
const missedDisplay = document.getElementById('missed');
const missCount = document.getElementById('miss');
const finalScore = document.getElementById('final-score');

let score = 0;
let misses = 0;
let currentMode = '';
let gameInterval;
let moleInterval = 1200; // 初始地鼠速度（ms）
let countdown;
let time = 60;

function createGrid() {
  grid.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const hole = document.createElement('div');
    hole.classList.add('hole');
    hole.dataset.index = i;
    grid.appendChild(hole);
  }
}

function startGame(mode) {
  currentMode = mode;
  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  createGrid();
  score = 0;
  misses = 0;
  moleInterval = 1200;
  scoreBoard.textContent = score;
  missCount.textContent = misses;

  if (mode === 'timed') {
    timerDisplay.classList.remove('hidden');
    missedDisplay.classList.add('hidden');
    time = 60;
    timeLeft.textContent = time;
    countdown = setInterval(() => {
      time--;
      timeLeft.textContent = time;
      if (time <= 0) {
        endGame();
      }
    }, 1000);
  } else {
    missedDisplay.classList.remove('hidden');
    timerDisplay.classList.add('hidden');
  }

  gameInterval = setInterval(showMoles, moleInterval);
}

function showMoles() {
  const holes = document.querySelectorAll('.hole');
  holes.forEach(hole => hole.innerHTML = '');

  let numberOfMoles = Math.floor(Math.random() * 2) + 2; // 同時出現2到3隻

  let molePositions = [];
  while (molePositions.length < numberOfMoles) {
    let random = Math.floor(Math.random() * 9);
    if (!molePositions.includes(random)) {
      molePositions.push(random);
    }
  }

  molePositions.forEach(pos => {
    const mole = document.createElement('div');
    mole.classList.add('mole');
    mole.addEventListener('click', hitMole);
    holes[pos].appendChild(mole);
  });

  // 速度加快（最小400ms）
  moleInterval = Math.max(400, moleInterval - 30);
  clearInterval(gameInterval);
  gameInterval = setInterval(showMoles, moleInterval);
}

function hitMole(e) {
  score++;
  scoreBoard.textContent = score;
  e.target.parentNode.innerHTML = '';
}

grid.addEventListener('click', function(e) {
  if (e.target.classList.contains('hole')) {
    misses++;
    missCount.textContent = misses;
    if (currentMode === 'endless' && misses >= 3) {
      endGame();
    }
  }
});

function endGame() {
  clearInterval(gameInterval);
  clearInterval(countdown);
  gameScreen.classList.add('hidden');
  endScreen.classList.remove('hidden');
  finalScore.textContent = score;
}

function restartGame() {
  endScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
}
