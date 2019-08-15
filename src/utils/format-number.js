export const formatNumber = (number, singular, plural) => {
  if (isNaN(number)) return null;

  function kFormatter(num) {
    return Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
      : Math.sign(num) * Math.abs(num);
  }
  let string = String(kFormatter(number));
  string += number === 1 ? singular || "" : plural || "";
  return string;
};
