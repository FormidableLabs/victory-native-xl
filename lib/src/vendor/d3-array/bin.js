function _slicedToArray(arr, i) { "worklet"; return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { "worklet"; throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { "worklet"; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { "worklet"; if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { "worklet"; var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { "worklet"; if (Array.isArray(arr)) return arr; }
import { slice } from "./array.js";
import bisect from "./bisect.js";
import constant from "./constant.js";
import extent from "./extent.js";
import identity from "./identity.js";
import nice from "./nice.js";
import ticks, { tickIncrement } from "./ticks.js";
import sturges from "./threshold/sturges.js";
export default function bin() {
  "worklet";

  var value = identity,
    domain = extent,
    threshold = sturges;
  function histogram(data) {
    "worklet";

    if (!Array.isArray(data)) data = Array.from(data);
    var i,
      n = data.length,
      x,
      step,
      values = new Array(n);
    for (i = 0; i < n; ++i) {
      values[i] = value(data[i], i, data);
    }
    var xz = domain(values),
      x0 = xz[0],
      x1 = xz[1],
      tz = threshold(values, x0, x1);

    // Convert number of thresholds into uniform thresholds, and nice the
    // default domain accordingly.
    if (!Array.isArray(tz)) {
      var max = x1,
        tn = +tz;
      if (domain === extent) {
        var _nice = nice(x0, x1, tn);
        var _nice2 = _slicedToArray(_nice, 2);
        x0 = _nice2[0];
        x1 = _nice2[1];
      }
      tz = ticks(x0, x1, tn);

      // If the domain is aligned with the first tick (which it will by
      // default), then we can use quantization rather than bisection to bin
      // values, which is substantially faster.
      if (tz[0] <= x0) step = tickIncrement(x0, x1, tn);

      // If the last threshold is coincident with the domain’s upper bound, the
      // last bin will be zero-width. If the default domain is used, and this
      // last threshold is coincident with the maximum input value, we can
      // extend the niced upper bound by one tick to ensure uniform bin widths;
      // otherwise, we simply remove the last threshold. Note that we don’t
      // coerce values or the domain to numbers, and thus must be careful to
      // compare order (>=) rather than strict equality (===)!
      if (tz[tz.length - 1] >= x1) {
        if (max >= x1 && domain === extent) {
          var _step = tickIncrement(x0, x1, tn);
          if (isFinite(_step)) {
            if (_step > 0) {
              x1 = (Math.floor(x1 / _step) + 1) * _step;
            } else if (_step < 0) {
              x1 = (Math.ceil(x1 * -_step) + 1) / -_step;
            }
          }
        } else {
          tz.pop();
        }
      }
    }

    // Remove any thresholds outside the domain.
    // Be careful not to mutate an array owned by the user!
    var m = tz.length,
      a = 0,
      b = m;
    while (tz[a] <= x0) ++a;
    while (tz[b - 1] > x1) --b;
    if (a || b < m) tz = tz.slice(a, b), m = b - a;
    var bins = new Array(m + 1),
      bin;

    // Initialize bins.
    for (i = 0; i <= m; ++i) {
      bin = bins[i] = [];
      bin.x0 = i > 0 ? tz[i - 1] : x0;
      bin.x1 = i < m ? tz[i] : x1;
    }

    // Assign data to bins by value, ignoring any outside the domain.
    if (isFinite(step)) {
      if (step > 0) {
        for (i = 0; i < n; ++i) {
          if ((x = values[i]) != null && x0 <= x && x <= x1) {
            bins[Math.min(m, Math.floor((x - x0) / step))].push(data[i]);
          }
        }
      } else if (step < 0) {
        for (i = 0; i < n; ++i) {
          if ((x = values[i]) != null && x0 <= x && x <= x1) {
            var j = Math.floor((x0 - x) * step);
            bins[Math.min(m, j + (tz[j] <= x))].push(data[i]); // handle off-by-one due to rounding
          }
        }
      }
    } else {
      for (i = 0; i < n; ++i) {
        if ((x = values[i]) != null && x0 <= x && x <= x1) {
          bins[bisect(tz, x, 0, m)].push(data[i]);
        }
      }
    }
    return bins;
  }
  histogram.value = function (_) {
    return arguments.length ? (value = typeof _ === "function" ? _ : constant(_), histogram) : value;
  };
  histogram.domain = function (_) {
    return arguments.length ? (domain = typeof _ === "function" ? _ : constant([_[0], _[1]]), histogram) : domain;
  };
  histogram.thresholds = function (_) {
    return arguments.length ? (threshold = typeof _ === "function" ? _ : constant(Array.isArray(_) ? slice.call(_) : _), histogram) : threshold;
  };
  return histogram;
}