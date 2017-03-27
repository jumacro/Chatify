'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ResponseObject = function ResponseObject(statusCode, data) {
  _classCallCheck(this, ResponseObject);

  this.Error = false;
  this.Success = false;

  if (Array.isArray(data)) {
    this.data = data;
  } else {
    this.data = [data];
  }

  if (statusCode === 200 || statusCode === 201) {
    this.Success = {
      code: statusCode,
      type: _httpStatus2.default[statusCode],
      data: this.data
    };
  } else {
    this.Error = {
      code: statusCode,
      type: _httpStatus2.default[statusCode],
      message: this.data
    };
  }

  this.responseObject = {
    error: this.Error,
    success: this.Success
  };

  return this.responseObject;
};

exports.default = ResponseObject;
module.exports = exports['default'];
//# sourceMappingURL=ResponseObject.js.map
