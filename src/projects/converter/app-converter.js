import units from './units-data.json';

const converterForm = document.querySelector('.converter-form');
const result = document.querySelector('#result');

function isValidNumber(value) {
  if (Number.isNaN(value) || value < 0) {
    alert('Please enter a valid positive number');
    return false;
  }
  return true;
}

function calculateConversion(convertedData, fromUnit, toUnit) {
  const fromRate = units[fromUnit];
  const toRate = units[toUnit];
  return (convertedData * fromRate) / toRate;
}

converterForm.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const fromUnit = formData.get('fromUnit');
  const toUnit = formData.get('toUnit');
  const convertedData = Number.parseFloat(formData.get('convertedData'));

  if (!isValidNumber(convertedData)) {
    return;
  }
  const finalResult = calculateConversion(convertedData, fromUnit, toUnit);

  result.textContent = `${finalResult.toFixed(2)} ${toUnit}`;
});
