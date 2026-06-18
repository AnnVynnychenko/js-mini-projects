import { filterByCondition } from './modules/filter-rules.js';
import { sortByCondition } from './modules/sort-rules.js';

const filterForm = document.querySelector('.filter-form');
const jsonInput = document.querySelector('#json-input');
const jsonOutput = document.querySelector('#json-output');
const conditions = document.querySelector('#conditions');
const presetsSection = document.querySelector('.presets-section');

function validateFields(data, conditions) {
  if (!data || !conditions) {
    alert('Please fill in both fields!');
    return false;
  }
  return true;
}

async function handleClick(event) {
  if (event.target.classList.contains('preset-btn')) {
    const presetKey = event.target.dataset.preset;
    try {
      const response = await fetch(`./presets/${presetKey}.json`);

      if (!response.ok) throw new Error('File not found');
      const preset = await response.json();

      jsonInput.value = JSON.stringify({ data: preset.data }, null, 2);
      conditions.value = JSON.stringify(
        { condition: preset.condition },
        null,
        2
      );
    } catch (error) {
      console.error('Error loading preset:', error.message);
    }
  }
}

function handleSubmit(event) {
  event.preventDefault();

  const rawDataText = jsonInput.value.trim();
  const rawConditionsText = conditions.value.trim();

  if (!validateFields(rawDataText, rawConditionsText)) {
    return;
  }
  let dataObj = {};
  let conditionsObj = {};
  try {
    dataObj = JSON.parse(rawDataText);
    conditionsObj = JSON.parse(rawConditionsText);
  } catch (parseError) {
    console.error('Parsing error:', parseError.message);
    alert(
      'Invalid JSON syntax! Please check your brackets, commas, or quotes.'
    );
    return;
  }

  try {
    const dataArr = dataObj.data || dataObj;

    if (!Array.isArray(dataArr)) {
      throw new Error('Data must be an array');
    }

    const conditionsBody = conditionsObj.condition || conditionsObj;
    const conditionFilterArr = conditionsBody.include;
    const conditionSortByArr = conditionsBody.sortBy;

    const filterResult = filterByCondition(dataArr, conditionFilterArr);
    const finalResult = sortByCondition(filterResult, conditionSortByArr);
    jsonOutput.value = JSON.stringify({ result: finalResult });
  } catch (validationError) {
    console.error('Validation error:', validationError.message);
    alert(validationError.message);
  }
}

presetsSection.addEventListener('click', handleClick);
filterForm.addEventListener('submit', handleSubmit);
