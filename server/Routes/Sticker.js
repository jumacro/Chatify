'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _Sticker = require('../Controllers/Sticker');

var _Sticker2 = _interopRequireDefault(_Sticker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router(); // eslint-disable-line new-cap

// import validate from 'express-validation';
// import paramValidation from '../../config/param-validation';
router.route('/')
/** GET /v1.0/stickers - Get list of stickets */
.get(_Sticker2.default.getAll);

exports.default = router;
module.exports = exports['default'];
//# sourceMappingURL=Sticker.js.map
