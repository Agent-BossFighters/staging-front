export const getValue = (data, key) =>
  data && data[key] !== undefined && data[key] !== null ? data[key] : "N/A";
