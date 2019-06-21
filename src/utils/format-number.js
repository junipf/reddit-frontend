export const FormatNumber = (number, label, plural) => {
  let simplifiedString;
  let letter = "";
  if (String(number).length < 4) {
    simplifiedString = String(number);
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
    simplifiedString = String(number).slice(0, -trim);
    let lastDigit = String(number).slice(-trim, -trim + 1);
    simplifiedString += "." + lastDigit;
  }
  simplifiedString += letter;

  simplifiedString += label
    ? number === 1
      ? label
      : plural
      ? plural
      : "s"
    : "";
  return simplifiedString;
};
