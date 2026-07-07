import { wins } from './data-wins.js';
console.log(wins);
const container = document.querySelector('.js-content');
container.addEventListener('click', onClick);

let markup = '';
let player = 'X';

for (let i = 1; i < 10; i += 1) {
  markup += `<div class="item js-item" data-id = ${i}></div>`;
}

container.innerHTML = markup;

function onClick(evt) {
  const { target } = evt;
  if (!target.classList.contains('js-item') || target.textContent) return;
  target.textContent = player;
  player = player === 'X' ? 'O' : 'X';
  if (player) {
    console.log(Number(evt.target.dataset.id));
  }
}
