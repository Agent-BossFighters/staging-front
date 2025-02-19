export const getValue = (obj, key) => {
  if (!obj) return "-";
  return obj[key] || "-";
}; 