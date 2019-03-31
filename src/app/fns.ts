export function isNumber (number: any) {
  if (isNaN(number)) {
    return false;
  }

  return !isNaN(parseFloat(number));
}

export function isFloat (number: any) {
  if (!isNumber(number)) {
    return false;
  }

  return `${number}`.includes('.');
}

export function isInteger (number: any) {
  if (!isNumber(number)) {
    return false;
  }

  return !isFloat(number);
}

export function isString (str: any) {
  return typeof str === 'string';
}
