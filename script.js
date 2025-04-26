const gameBoard = document.getElementById('gameBoard');
const scoreBoard = document.getElementById('score');
let score = 0;

// 建立九個洞
for (let i = 0; i < 9; i++) {
  const hole = document.createElement('div');
  hole.classList.add('hole');

  const mole = document.createElement('div');
  mole.classList.add('mole');

  hole.appendChild(mole);
  gameBoard.appendChild(hole);

  // 點擊或觸控地鼠加分
  function hitMole() {
    if (mole.style.display === 'block') {
      score++;
      scoreBoard.textContent = score;
      mole.style.display = 'none';
    }
  }

  hole.addEventListener('click', hitMole);
  hole.addEventListener('touchstart', hitMole);
}

// 隨機地鼠出現
function randomMole() {
  const holes = document.querySelectorAll('.hole .mole');
  holes.forEach(mole => mole.style.display = 'none');

  const randomIndex = Math.floor(Math.random() * holes.length);
  holes[randomIndex].style.display = 'block';
}

setInterval(randomMole, 1000); // 每秒出一隻地鼠
