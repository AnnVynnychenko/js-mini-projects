export const excludeOrByKeys = (data, condition) => {
  if (!condition || condition.length === 0) return data;
  return data.filter(item => {
    const excludeData = condition.some(rule => {
      const ruleKey = Object.keys(rule);
      return ruleKey.every(key => item[key] === rule[key]);
    });
    return !excludeData;
  });
};
