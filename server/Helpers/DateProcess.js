'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DateProcess = function () {
  function DateProcess(date) {
    _classCallCheck(this, DateProcess);

    this.date = date;
  }

  _createClass(DateProcess, [{
    key: 'getDate',
    value: function getDate() {
      var dateNow = (0, _moment2.default)(new Date());
      var dateComp = (0, _moment2.default)(this.date);
      if (dateNow.diff(dateComp, 'days') < 1) {
        this.date = DateProcess._getRelativeDate(dateComp);
      } else {
        this.date = DateProcess._getFormatedDate(dateComp, 'DD/MM/YY');
      }
      return this.date;
    }
  }], [{
    key: '_getRelativeDate',
    value: function _getRelativeDate(momentObj) {
      return momentObj.fromNow();
    }
  }, {
    key: '_getFormatedDate',
    value: function _getFormatedDate(momentObj, format) {
      return momentObj.format(format);
    }
  }]);

  return DateProcess;
}();

exports.default = DateProcess;
module.exports = exports['default'];
//# sourceMappingURL=DateProcess.js.map
