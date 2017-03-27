'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _env = require('../../config/env');

var _env2 = _interopRequireDefault(_env);

var _ResponseObject = require('../Helpers/ResponseObject');

var _ResponseObject2 = _interopRequireDefault(_ResponseObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function mapList(group) {
  var stickers = {
    mainPic: _env2.default.stickerBaseURL + group.mainTitlePic
  };
  var list = group.list.map(mapGroupList);
  stickers.list = list;
  return stickers;
} /**
   Sticker controller
   */

function mapGroupList(row) {
  return {
    fullPic: _env2.default.stickerBaseURL + row.fullPic,
    smallPic: _env2.default.stickerBaseURL + row.smallPic
  };
}

/** Sticker CRUD **/

function getStickers() {
  var apiData = (0, _requestPromise2.default)(_env2.default.stickerAPI);
  apiData.then(function (data) {
    if (data) {
      var obj = JSON.parse(data);
      if (obj && obj.data && obj.data.stickers) {
        var list = obj.data.stickers;
        var mappedList = list.map(mapList);
        return Promise.resolve({ stickers: mappedList });
      }
    }
    return Promise.reject(data);
  }).catch(function (err) {
    return Promise.reject(err);
  });
}

function getAll(req, res, next) {
  var fetchStickers = getStickers();
  fetchStickers.then(function (stickers) {
    return res.status(200).json(new _ResponseObject2.default(200, stickers));
  }).catch(function (e) {
    return next(e);
  });
}

exports.default = { getAll: getAll };
module.exports = exports['default'];
//# sourceMappingURL=Sticker.js.map
