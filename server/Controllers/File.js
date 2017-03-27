'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _File = require('../Models/File');

var _File2 = _interopRequireDefault(_File);

var _ResponseObject = require('../Helpers/ResponseObject');

var _ResponseObject2 = _interopRequireDefault(_ResponseObject);

var _env = require('../../config/env');

var _env2 = _interopRequireDefault(_env);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create file
 */

// const debug = require('debug')('easyappchat-server:index');

function postUserImage(req, res, next) {
  var params = req.body;

  var fileData = {
    name: req.file.filename,
    mimeType: req.file.mimetype,
    size: req.file.size
  };
  _File2.default.add(fileData).then(function (file) {
    var myFile = file;
    myFile.url = _env2.default.imageUrl + req.file.filename;
    var transferParams = {
      modelName: 'User',
      queryParam: params,
      file: file
    };
    _File2.default.transfer(transferParams).then(function (data) {
      return res.status(200).json(new _ResponseObject2.default(200, data));
    }).catch(function (e) {
      return next(e);
    });
  }).catch(function (e) {
    return next(e);
  });
}

function postRoomImage(req, res, next) {
  var params = req.body;

  var fileData = {
    name: req.file.filename,
    mimeType: req.file.mimetype,
    size: req.file.size
  };
  _File2.default.add(fileData).then(function (file) {
    var myFile = file;
    myFile.url = _env2.default.imageUrl + req.file.filename;
    var transferParams = {
      modelName: 'Room',
      queryParam: params,
      file: file
    };
    _File2.default.transfer(transferParams).then(function (data) {
      return res.status(200).json(new _ResponseObject2.default(200, data));
    }).catch(function (e) {
      return next(e);
    });
  }).catch(function (e) {
    return next(e);
  });
}

function postMessageFile(req, res, next) {
  var params = req.body;

  var fileData = {
    name: req.file.filename,
    mimeType: req.file.mimetype,
    size: req.file.size
  };
  _File2.default.add(fileData).then(function (file) {
    var myFile = file;
    myFile.url = _env2.default.imageUrl + req.file.filename;
    var transferParams = {
      modelName: 'Message',
      queryParam: params,
      file: file
    };
    // debug(transferParams);
    return _File2.default.transfer(transferParams);
  }).then(function (data) {
    return res.status(200).json(new _ResponseObject2.default(200, data));
  }).catch(function (e) {
    return next(e);
  });
}

exports.default = { postUserImage: postUserImage, postRoomImage: postRoomImage, postMessageFile: postMessageFile };
module.exports = exports['default'];
//# sourceMappingURL=File.js.map
