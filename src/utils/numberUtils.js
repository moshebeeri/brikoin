Number.prototype.format = function(n, x) {
  let re = "\\d(?=(\\d{" + (x || 3) + "})+" + (n > 0 ? "\\." : "$") + ")";
  return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, "g"), "$&,");
};

class NumberUtils {
  formatNumber(number, decNum) {
    if (number) {
      return parseFloat(number).format(decNum);
    }
    return number;
  }
}

const numberUtils = new NumberUtils();

export default numberUtils;
