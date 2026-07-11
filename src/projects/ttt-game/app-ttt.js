import { wins } from './data-wins.js';

const container = document.querySelector('.js-content');
const tableScore = document.querySelector('.js-score');
const winner = document.querySelector('.js-winner');
const resetScoreBtn = document.querySelector('.js-reset-score');

container.addEventListener('click', onClick);
resetScoreBtn.addEventListener('click', resetHandler);
let player = 'X';
let historyX = [];
let historyO = [];
let scorePlayerX = 0;
let scorePlayerO = 0;

function createMarkupGameField() {
  let markup = '';
  for (let i = 1; i < 10; i += 1) {
    markup += `<div class="item js-item" data-id = ${i}></div>`;
  }
  container.innerHTML = markup;
}

createMarkupGameField();

function updateScore(scorePlayerX, scorePlayerO) {
  const markupTableScore = ` <tr>
              <td class='player-data'>Player X</td>
              <td class=' player-data score'>${scorePlayerX}</td>
            </tr>
            <tr>
              <td class='player-data'>Player O</td>
              <td class='player-data score'>${scorePlayerO}</td>
            </tr>`;

  tableScore.innerHTML = markupTableScore;
}

updateScore(scorePlayerX, scorePlayerO);

function onClick(evt) {
  const { target } = evt;
  if (!target.classList.contains('js-item') || target.textContent) return;

  let result = false;
  const id = Number(target.dataset.id);

  if (player === 'X') {
    historyX.push(id);
    result = isWinner(historyX);
  } else {
    historyO.push(id);
    result = isWinner(historyO);
  }

  target.textContent = player;

  const isEndGame = historyX.length + historyO.length === 9;

  if (result) {
    winner.textContent = `Winner ${player} 😎🎉🎊`;
    if (player === 'X') {
      scorePlayerX += 1;
      updateScore(scorePlayerX, scorePlayerO);
    } else {
      scorePlayerO += 1;
      updateScore(scorePlayerX, scorePlayerO);
    }
    setTimeout(() => {
      resetGame();
    }, 500);
    return;
  } else if (isEndGame) {
    winner.textContent = `Friendship prevailed 😉`;
    setTimeout(() => {
      resetGame();
    }, 500);
    return;
  }

  player = player === 'X' ? 'O' : 'X';
}

function resetHandler() {
  scorePlayerX = 0;
  scorePlayerO = 0;
  updateScore(scorePlayerX, scorePlayerO);
}

function isWinner(arr) {
  return wins.some(item => item.every(id => arr.includes(id)));
}

function resetGame() {
  createMarkupGameField();
  historyX = [];
  historyO = [];
}
