import { filterByCondition } from './modules/filter-rules';
import { sortByCondition } from './modules/sort-rules';
import dataFilter from './presets/data-filter.json' with { type: 'json' };
import conditionsFilterSort from './presets/conditions-filter-sort.json' with { type: 'json' };

const filterForm = document.querySelector('.filter-form');
const jsonInput = document.querySelector('#json-input');
const jsonOutput = document.querySelector('#json-output');
const conditions = document.querySelector('#conditions');

function validateFields(data, conditions) {
  if (!data || !conditions) {
    alert('Please fill in both fields!');
    return false;
  }
  return true;
}

jsonInput.textContent = `${dataFilter}`;

conditions.textContent = `${conditionsFilterSort}`;

function handleSubmit(event) {
  event.preventDefault();

  const rawDataText = jsonInput.value.trim();
  const rawConditionsText = conditions.value.trim();

  if (!validateFields(rawDataText, rawConditionsText)) {
    return;
  }

  try {
    const dataObj = JSON.parse(rawDataText);
    const conditionsObj = JSON.parse(rawConditionsText);

    const dataArr = dataObj.data;
    const conditionsBody = conditionsObj.condition || {};
    const conditionFilterArr = conditionsBody.include;
    const conditionSortByArr = conditionsBody.sortBy;

    const filterResult = filterByCondition(dataArr, conditionFilterArr);
    const finalResult = sortByCondition(filterResult, conditionSortByArr);
    console.log(finalResult);
  } catch (error) {
    alert(
      'Invalid JSON format! Please check your syntax (brackets, commas, quotes).'
    );
    console.error('Parsing error:', error.message);
  }
}

filterForm.addEventListener('submit', handleSubmit);
