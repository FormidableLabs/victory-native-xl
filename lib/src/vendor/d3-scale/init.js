export function initRange(domain, range) {
  "worklet";

  switch (arguments.length) {
    case 0:
      break;
    case 1:
      this.range(domain);
      break;
    default:
      this.range(range).domain(domain);
      break;
  }
  return this;
}
export function initInterpolator(domain, interpolator) {
  "worklet";

  switch (arguments.length) {
    case 0:
      break;
    case 1:
      {
        if (typeof domain === "function") this.interpolator(domain);else this.range(domain);
        break;
      }
    default:
      {
        this.domain(domain);
        if (typeof interpolator === "function") this.interpolator(interpolator);else this.range(interpolator);
        break;
      }
  }
  return this;
}