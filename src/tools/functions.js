export function throttle(func, wait, options) {
  let timer = null;
  return function bridge() {
    clearTimeout(timer);
    if (options.delay) {
      timer = setTimeout(() => {
        func.apply(this, arguments);
      }, options.delay);
    }
  };
}
