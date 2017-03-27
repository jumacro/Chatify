'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _User = require('./User');

var _User2 = _interopRequireDefault(_User);

var _Room = require('./Room');

var _Room2 = _interopRequireDefault(_Room);

var _File = require('./File');

var _File2 = _interopRequireDefault(_File);

var _Sticker = require('./Sticker');

var _Sticker2 = _interopRequireDefault(_Sticker);

var _ResponseObject = require('../Helpers/ResponseObject');

var _ResponseObject2 = _interopRequireDefault(_ResponseObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

/** GET /welcome - Welcome to EasyApp Chat API */
router.get('/welcome', function (req, res) {
  return res.status(200).json(new _ResponseObject2.default(200, { message: 'Welcome to EasyApp Chat API' }));
});

// mount user routes at /users
router.use('/users', _User2.default);

// mount room routes at /rooms
router.use('/rooms', _Room2.default);

// mount room routes at /files
router.use('/files', _File2.default);

// mount room routes at /stickers
router.use('/stickers', _Sticker2.default);

exports.default = router;
module.exports = exports['default'];
//# sourceMappingURL=Index.js.map
