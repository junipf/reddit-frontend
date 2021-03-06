export const formatNumber = (number, singular = "", plural = "") => {
  if (isNaN(number)) return null;

  const num = Math.abs(number);
  const sign = Math.sign(number);

  let string = sign * num;

  for (let { limit, letter } of [
    { letter: "q", limit: 999999999999999 },
    { letter: "t", limit: 999999999999 },
    { letter: "b", limit: 999999999 },
    { letter: "m", limit: 999999 },
    { letter: "k", limit: 999 },
  ]) {
    if (num > limit) {
      string = String(
        (sign * (num / (limit + 1))).toFixed(1) + letter
      );
      break;
    }
  }

  const sing = singular !== "" ? " " + singular.trim() : "";
  const plur =
    plural !== "" ? " " + plural.trim() : sing !== "" ? sing + "s" : "";

  string += number === 1 ? sing : plur;
  return string;
};

window.formatNumber = (number, singular, plural) =>
  formatNumber(number, singular, plural);
