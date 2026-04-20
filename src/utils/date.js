export const getLocalDateStr = (date = new Date()) => {
  const d = new Date(date);
  const tzoffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzoffset).toISOString().split('T')[0];
};
