export function format(str, arr) {
  return str.replace(/%(\d+)/g, function(_, m) {
    return arr[--m];
  });
}

export function validatePhone(phone) {
  let regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;

  if (regex.test(phone)) {
    return true;
  } else {
    return false;
  }
}
