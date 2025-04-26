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
const toggleMusicBtn = document.getElementById('toggle-music');
const toggleSfxBtn = document.getElementById('toggle-sfx');

let score = 0;
let misses = 0;
let currentMode = '';
let gameInterval;
let moleInterval = 1200; // 初始地鼠速度（ms）
let countdown;
let time = 60;
let activeMoles = new Set(); // 記錄目前在場上的地鼠
let musicEnabled = true;
let sfxEnabled = true;

// 音樂檔案
const bgm = new Audio('audio/5 min Timer 5分鐘音樂計時 _ Relaxing Piano Music 靜心解壓 鋼琴輕音樂 放鬆心靈.mp3');
const hitSound = new Audio('audio/Bonk Sound Effect.mp3');

// 背景音樂設定
bgm.loop = true;  // 循環播放
bgm.volume = 0.5; // 音量0～1之間（這裡50%）

toggleMusicBtn.addEventListener('click', () => {
    musicEnabled = !musicEnabled;
    toggleMusicBtn.textContent = musicEnabled ? '背景音樂：開' : '背景音樂：關';
    
    if (musicEnabled) {
      bgm.play();
    } else {
      bgm.pause();
    }
  });
  
  toggleSfxBtn.addEventListener('click', () => {
    sfxEnabled = !sfxEnabled;
    toggleSfxBtn.textContent = sfxEnabled ? '打擊音效：開' : '打擊音效：關';
  });

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
  if (musicEnabled) {
        bgm.play();
      }      
  currentMode = mode;
  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  createGrid();
  score = 0;
  misses = 0;
  moleInterval = 1200;
  activeMoles.clear();
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

  // 出新地鼠前，先檢查前一批有沒有沒打到的
  if (currentMode === 'endless') {
    misses += activeMoles.size; // 有幾隻沒打中，加幾次 miss
    missCount.textContent = misses;
    if (misses >= 3) {
      endGame();
      return;
    }
  }

  activeMoles.clear(); // 清空記錄

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
    activeMoles.add(pos); // 記錄有地鼠的位置
  });

  // 速度加快（最小400ms）
  moleInterval = Math.max(400, moleInterval - 30);
  clearInterval(gameInterval);
  gameInterval = setInterval(showMoles, moleInterval);
}

function hitMole(e) {
    score++;
    scoreBoard.textContent = score;
  
    if (sfxEnabled) {
        const hit = new Audio('audio/Bonk Sound Effect.mp3');
        hit.volume = 0.7; // 0～1，這裡設定70%
        hit.play();
      }
      
    const parentIndex = parseInt(e.target.parentNode.dataset.index);
    activeMoles.delete(parentIndex);
  
    e.target.parentNode.innerHTML = '';
  }
  

grid.addEventListener('click', function(e) {
  if (e.target.classList.contains('hole')) {
    // 點到空洞才算誤打
    misses++;
    missCount.textContent = misses;
    if (currentMode === 'endless' && misses >= 3) {
      endGame();
    }
  }
});

function endGame() {
  bgm.pause();
  bgm.currentTime = 0;
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
