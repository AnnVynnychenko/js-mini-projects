import { filterByCondition } from './modules/filter-rules.js';
import { sortByCondition } from './modules/sort-rules.js';
import { excludeOrByKeys } from './modules/exclude-or-rules.js';
import { excludeAnd } from './modules/exclude-and-rules.js';

const filterForm = document.querySelector('.filter-form');
const jsonInput = document.querySelector('#json-input');
const jsonOutput = document.querySelector('#json-output');
const conditions = document.querySelector('#conditions');
const presetsSection = document.querySelector('.presets-section');
const resetBtn = document.querySelector('#reset-btn');

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
      const response = await fetch(`presets/${presetKey}.json`);

      if (!response.ok) throw new Error('File not found');

      const preset = await response.json();

      if (presetKey === 'user-data') {
        const rawData = preset.data || preset;
        jsonInput.value = JSON.stringify(rawData, null, 2);
      } else {
        const rawConditions = preset.condition || preset;
        conditions.value = JSON.stringify(rawConditions, null, 2);
      }
    } catch (error) {
      console.error('Error loading preset:', error.message);
      alert(`Could not load preset file: ${presetKey}.json`);
    }
  }
}

function handleSubmit(event) {
  event.preventDefault();

  let rawDataText = '';

  if (jsonOutput.value.trim() !== '') {
    rawDataText = jsonOutput.value.trim();
  } else {
    rawDataText = jsonInput.value.trim();
  }
  const rawConditionsText = conditions.value.trim();

  let userData = {};
  let conditionsObj = {};

  if (!validateFields(rawDataText, rawConditionsText)) {
    return;
  }

  try {
    userData = JSON.parse(rawDataText);
    conditionsObj = JSON.parse(rawConditionsText);
  } catch (parseError) {
    console.error('Parsing error:', parseError.message);
    alert(
      'Invalid JSON syntax! Please check your brackets, commas, or quotes.'
    );
    return;
  }

  try {
    const conditionsBody = conditionsObj;

    let currentResult = [...userData];

    if (!Array.isArray(currentResult)) {
      throw new Error('Data must be an array');
    }

    if (conditionsBody.include) {
      const conditionFilter = conditionsBody.include;
      currentResult = filterByCondition(currentResult, conditionFilter);
    }

    if (conditionsBody.excludeOR) {
      const conditionExcludeOr = conditionsBody.excludeOR;
      currentResult = excludeOrByKeys(currentResult, conditionExcludeOr);
    }

    if (conditionsBody.excludeAND) {
      const conditionExcludeAnd = conditionsBody.excludeAND;
      currentResult = excludeAnd(currentResult, conditionExcludeAnd);
    }

    if (conditionsBody.sortBy) {
      const conditionSortBy = conditionsBody.sortBy;
      currentResult = sortByCondition(currentResult, conditionSortBy);
    }

    jsonOutput.value = JSON.stringify(currentResult, null, 2);
  } catch (validationError) {
    console.error('Validation error:', validationError.message);
    alert(validationError.message);
  }
}

function resetAll() {
  jsonInput.value = '';
  jsonOutput.value = '';
  conditions.value = '';
}

presetsSection.addEventListener('click', handleClick);
filterForm.addEventListener('submit', handleSubmit);
resetBtn.addEventListener('click', resetAll);
