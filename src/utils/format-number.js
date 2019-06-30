export const formatNumber = (number, singular, plural) => {
  if (isNaN(number)) return null;
  let string;
  let letter = "";

  if (String(number).length < 4) {
    string = String(number);
  } else {
    let trim = 3;
    letter = "k";
    if (String(number).length > 6) {
      trim = 6;
      letter = "k";
    }
    if (String(number).length > 9) {
      trim = 9;
      letter = "m";
    }
    if (String(number).length > 12) {
      trim = 12;
      letter = "b";
    }
    string = String(number).slice(0, -trim);
    let lastDigit = String(number).slice(-trim, -trim + 1);
    string += "." + lastDigit;
  }

  string += letter;

  if (singular)
    string +=
      " " + (number === 1 ? singular : plural ? plural : singular + "s");
  string += " ";
  return string;
};
