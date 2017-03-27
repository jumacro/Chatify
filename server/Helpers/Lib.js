"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function objectEntries(obj) {
  var _ref;

  var index = 0;

  // In ES6, you can use strings or symbols as property keys,
  // Reflect.ownKeys() retrieves both
  var propKeys = Reflect.ownKeys(obj);

  return _ref = {}, _defineProperty(_ref, Symbol.iterator, function () {
    return this;
  }), _defineProperty(_ref, "next", function next() {
    if (index < propKeys.length) {
      var key = propKeys[index];
      index += 1;
      return { value: [key, obj[key]] };
    }
    return { done: true };
  }), _ref;
}

exports.default = { objectEntries: objectEntries };
module.exports = exports["default"];
//# sourceMappingURL=Lib.js.map
