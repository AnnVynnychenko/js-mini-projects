export const filterByCondition = (data, condition) => {
  if (!condition || condition.length === 0) {
    return data;
  }
  const ruleObj = condition[0];
  const filterKey = Object.keys(ruleObj)[0];
  const filterValue = ruleObj[filterKey];
  return data.filter(val => val[filterKey] === filterValue);
};
