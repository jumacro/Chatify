'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _File = require('../Controllers/File');

var _File2 = _interopRequireDefault(_File);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var storage = _multer2.default.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function filename(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
// import validate from 'express-validation';
// import paramValidation from '../../config/param-validation';

var upload = (0, _multer2.default)({ storage: storage });

var router = _express2.default.Router();

router.post('/rooms/upload', upload.single('file'), _File2.default.postRoomImage);
router.post('/users/upload', upload.single('file'), _File2.default.postUserImage);
router.post('/messages/upload', upload.single('file'), _File2.default.postMessageFile);

exports.default = router;
module.exports = exports['default'];
//# sourceMappingURL=File.js.map
