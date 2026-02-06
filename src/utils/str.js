/**
 * Capitalze the first character of the string
 * 
 * @param {string} val 
 * @returns string
 */
const capitalizeFirstLetter = (val) => {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
};
exports.capitalizeFirstLetter = capitalizeFirstLetter;

const generateRandomString = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
exports.generateRandomString = generateRandomString;

const trimString = (str, maxLength = 100) => {
  return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
};
exports.trimString = trimString;

/**
 * Format number to `n` digits by adding 0 in front, eg.: num = 1, size = 2, result = '01'
 * @param {*} num - number to format
 * @param {*} size -  n , digit size
 * @returns 
 */
const pad = (num, size = 2) => {
  num = num.toString();
  while (num.length < size) num = '0' + num;
  return num;
};
exports.pad = pad;

const formatMyr = (value) => {
    if (typeof value !== 'number') {
        console.error("Invalid value, Please provide a numeric value")
        return '';
    }

    let formattedValue = value.toFixed(2);

    formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return `RM${formattedValue}`;
};
exports.formatMyr = formatMyr;

const formatMyrWithUnit = (value) => {
    if (typeof value !== 'number') {
        console.error("Invalid value, Please provide a numeric value")
        return '';
    }

    let formattedValue = value;

    if (value >= 1_000) {
        formattedValue = parseFloat((value / 1_000).toFixed(3)) + 'k';
    }
    if (value >= 1_000_000) {
        formattedValue = parseFloat((value / 1_000_000).toFixed(6)) + 'M';
    }

    return `RM${formattedValue.toString()}`;
};
exports.formatMyrWithUnit = formatMyrWithUnit;