export function kFormatter(number: number) {
  if (number < 9999) {
    return number.toLocaleString();
  }

  const digits = number > 99999 ? 0 : 1;

  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return number >= item.value;
    });

  return item ? (number / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0';
}
