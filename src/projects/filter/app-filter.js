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

let isInputChanged = true;

function validateFields(data, conditions) {
  if (!data || !conditions) {
    alert('Please fill in both fields!');
    return false;
  }
  return true;
}

async function handleClickPresets(event) {
  if (!event.target.classList.contains('preset-btn')) {
    return;
  }
  const presetKey = event.target.dataset.preset;
  try {
    const url = new URL(`./presets/${presetKey}.json`, import.meta.url);

    const response = await fetch(url);

    if (!response.ok) throw new Error('File not found');

    const preset = await response.json();

    if (presetKey === 'user-data') {
      const rawData = preset.data || preset;
      jsonInput.value = JSON.stringify(rawData, null, 2);
      isInputChanged = true;
    } else {
      const rawConditions = preset.condition || preset;
      conditions.value = JSON.stringify(rawConditions, null, 2);
    }
  } catch (error) {
    console.error('Error loading preset:', error.message);
    alert(`Could not load preset file: ${presetKey}.json`);
  }
}

function handleSubmit(event) {
  event.preventDefault();

  let rawDataText = '';

  if (jsonOutput.value.trim() === '' || isInputChanged) {
    rawDataText = jsonInput.value.trim();
  } else {
    rawDataText = jsonOutput.value.trim();
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
    isInputChanged = false;
  } catch (validationError) {
    console.error('Validation error:', validationError.message);
    alert(validationError.message);
  }
}

function resetAll() {
  jsonInput.value = '';
  jsonOutput.value = '';
  conditions.value = '';
  isInputChanged = true;
}

presetsSection.addEventListener('click', handleClickPresets);
jsonInput.addEventListener('input', () => (isInputChanged = true));
filterForm.addEventListener('submit', handleSubmit);
resetBtn.addEventListener('click', resetAll);
