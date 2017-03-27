'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* Seberian API calls
* @copyright: Copyright(c) 2017 EasyApp
* @author: Mithun Das
*
*/

var Uri = 'https://enterprise.easyapp.pt/57a86c6c4a2d9/enterprisechat/mobile_view/';
// const Uri = 'http://appdev.easyapp.pt/58bcfcca620db/enterprisechat/mobile_view/';

function postNotification(postData) {
  var requestUri = Uri + 'notification/' + postData;
  return (0, _requestPromise2.default)(requestUri);
}

exports.default = { postNotification: postNotification };
module.exports = exports['default'];
//# sourceMappingURL=SiberianApi.js.map
