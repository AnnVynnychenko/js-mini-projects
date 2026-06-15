const filterForm = document.querySelector('.filter-form');
const jsonInput = document.querySelector('#json-input');
const jsonOutput = document.querySelector('#json-output');

console.log(jsonInput.value);

function handleSubmit(event) {
  event.preventDefault();
  console.log(jsonInput.value);
}

filterForm.addEventListener('submit', handleSubmit);
