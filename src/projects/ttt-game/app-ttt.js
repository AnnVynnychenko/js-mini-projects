import { wins } from './data-wins.js';

const container = document.querySelector('.js-content');
const winner = document.querySelector('.js-winner');

container.addEventListener('click', onClick);

let player = 'X';
let historyX = [];
let historyO = [];

function createMarkup() {
  let markup = '';
  for (let i = 1; i < 10; i += 1) {
    markup += `<div class="item js-item" data-id = ${i}></div>`;
  }
  container.innerHTML = markup;
}

createMarkup();

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

function isWinner(arr) {
  return wins.some(item => item.every(id => arr.includes(id)));
}

function resetGame() {
  createMarkup();
  historyX = [];
  historyO = [];
  player = 'X';
}
