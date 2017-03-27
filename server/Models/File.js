'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _User = require('./User');

var _User2 = _interopRequireDefault(_User);

var _Room = require('./Room');

var _Room2 = _interopRequireDefault(_Room);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const debug = require('debug')('easyappchat-server:index');

/**
* File schema
* Stores the registered File data
* @copyright: Copyright(c) 2017 EasyApp
* @author: Mithun Das
*
*/

var Schema = _mongoose2.default.Schema;

var File = new Schema({
  name: {
    type: String,
    required: [true, 'File name is required']
  },
  mimeType: {
    type: String,
    default: ''
  },
  size: {
    type: Number,
    default: 0
  },
  created: {
    type: Date,
    default: Date.now
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
File.method({});

/**
 * Statics
 */
File.statics = {
  /**
   * Add file
   * @params params
   * @return result
   */
  add: function add(reqBody) {
    var file = new this(reqBody);
    return file.save();
  },
  edit: function edit(reqParams, reqBody) {
    var options = {
      upsert: true,
      new: true,
      runValidators: true
    };
    return this.findOneAndUpdate(reqParams, reqBody, options).exec();
  },


  /**
   * get statics - Get array of file objects
   *
   * @params params - Json Object designed to query the Collection
   * @return err   - Error Object
   * @return companies - Array of file objects with file data
   *
   */

  transfer: function transfer(param) {
    var queryParam = void 0;
    var updateParam = void 0;
    var promiseReturn = void 0;

    if (param.modelName === 'User') {
      queryParam = {
        _id: param.queryParam._user_id
      };
      updateParam = {
        avatar_url: param.file.url
      };
      promiseReturn = _User2.default.edit(queryParam, updateParam);
    }
    if (param.modelName === 'Room') {
      queryParam = {
        _id: param.queryParam._room_id
      };
      updateParam = {
        image: param.file.url
      };
      promiseReturn = _Room2.default.edit(queryParam, updateParam);
    }
    if (param.modelName === 'Message') {
      var userQuery = {
        _id: param.queryParam._user_id
      };
      // debug(userQuery);
      promiseReturn = _User2.default.findOne(userQuery).lean().exec().then(function (user) {
        // debug(user);
        var reqParams = {
          _user_id: {
            _id: user._id,
            chat_name: user.chat_name,
            full_name: user.full_name,
            avatar_url: user.avatar_url
          },
          chat_name: user.chat_name,
          message: param.file.url,
          type: param.file.mimeType
        };
        return Promise.resolve(reqParams);
      });
    }

    return promiseReturn;
  }
};

/**
 * @typedef File
 */
exports.default = _mongoose2.default.model('File', File);
module.exports = exports['default'];
//# sourceMappingURL=File.js.map
