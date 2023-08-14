import { ticks } from "../d3-array";
import { format, formatSpecifier } from "../d3-format";
import nice from "./nice.js";
import { copy, transformer } from "./continuous.js";
import { initRange } from "./init.js";
function transformLog(x) {
  "worklet";

  return Math.log(x);
}
function transformExp(x) {
  "worklet";

  return Math.exp(x);
}
function transformLogn(x) {
  "worklet";

  return -Math.log(-x);
}
function transformExpn(x) {
  "worklet";

  return -Math.exp(-x);
}
function pow10(x) {
  "worklet";

  return isFinite(x) ? +("1e" + x) : x < 0 ? 0 : x;
}
function powp(base) {
  "worklet";

  return base === 10 ? pow10 : base === Math.E ? Math.exp : function (x) {
    "worklet";

    return Math.pow(base, x);
  };
}
function logp(base) {
  "worklet";

  return base === Math.E ? Math.log : base === 10 && Math.log10 || base === 2 && Math.log2 || (base = Math.log(base), function (x) {
    "worklet";

    return Math.log(x) / base;
  });
}
function reflect(f) {
  "worklet";

  return function (x, k) {
    "worklet";

    return -f(-x, k);
  };
}
export function loggish(transform) {
  "worklet";

  var scale = transform(transformLog, transformExp);
  var domain = scale.domain;
  var base = 10;
  var logs;
  var pows;
  function rescale() {
    "worklet";

    logs = logp(base), pows = powp(base);
    if (domain()[0] < 0) {
      logs = reflect(logs), pows = reflect(pows);
      transform(transformLogn, transformExpn);
    } else {
      transform(transformLog, transformExp);
    }
    return scale;
  }
  scale.base = function (_) {
    return arguments.length ? (base = +_, rescale()) : base;
  };
  scale.domain = function (_) {
    return arguments.length ? (domain(_), rescale()) : domain();
  };
  scale.ticks = function (count) {
    "worklet";

    var d = domain();
    var u = d[0];
    var v = d[d.length - 1];
    var r = v < u;
    if (r) {
      var _ref = [v, u];
      u = _ref[0];
      v = _ref[1];
    }
    var i = logs(u);
    var j = logs(v);
    var k;
    var t;
    var n = count == null ? 10 : +count;
    var z = [];
    if (!(base % 1) && j - i < n) {
      i = Math.floor(i), j = Math.ceil(j);
      if (u > 0) for (; i <= j; ++i) {
        for (k = 1; k < base; ++k) {
          t = i < 0 ? k / pows(-i) : k * pows(i);
          if (t < u) continue;
          if (t > v) break;
          z.push(t);
        }
      } else for (; i <= j; ++i) {
        for (k = base - 1; k >= 1; --k) {
          t = i > 0 ? k / pows(-i) : k * pows(i);
          if (t < u) continue;
          if (t > v) break;
          z.push(t);
        }
      }
      if (z.length * 2 < n) z = ticks(u, v, n);
    } else {
      z = ticks(i, j, Math.min(j - i, n)).map(pows);
    }
    return r ? z.reverse() : z;
  };
  scale.tickFormat = function (count, specifier) {
    "worklet";

    if (count == null) count = 10;
    if (specifier == null) specifier = base === 10 ? "s" : ",";
    if (typeof specifier !== "function") {
      if (!(base % 1) && (specifier = formatSpecifier(specifier)).precision == null) specifier.trim = true;
      specifier = format(specifier);
    }
    if (count === Infinity) return specifier;
    var k = Math.max(1, base * count / scale.ticks().length); // TODO fast estimate?
    return function (d) {
      "worklet";

      var i = d / pows(Math.round(logs(d)));
      if (i * base < base - 0.5) i *= base;
      return i <= k ? specifier(d) : "";
    };
  };
  scale.nice = function () {
    "worklet";

    return domain(nice(domain(), {
      floor: function floor(x) {
        "worklet";

        return pows(Math.floor(logs(x)));
      },
      ceil: function ceil(x) {
        "worklet";

        return pows(Math.ceil(logs(x)));
      }
    }));
  };
  return scale;
}
export default function log() {
  "worklet";

  var scale = loggish(transformer()).domain([1, 10]);
  scale.copy = function () {
    "worklet";

    return copy(scale, log()).base(scale.base());
  };
  initRange.apply(scale, arguments);
  return scale;
}