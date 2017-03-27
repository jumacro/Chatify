'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _DateProcess = require('../Helpers/DateProcess');

var _DateProcess2 = _interopRequireDefault(_DateProcess);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const debug = require('debug')('easyappchat-server:index');

/**
* Message schema
* Stores the registered Message data
* @copyright: Copyright(c) 2017 EasyApp
* @author: Mithun Das
*
*/

var Schema = _mongoose2.default.Schema;
var ObjectId = Schema.ObjectId;

var Message = new Schema({
  _room_id: {
    type: ObjectId,
    required: [true, 'Room is required'],
    ref: 'Room'
  },
  _user_id: {
    type: ObjectId,
    required: [true, 'User is required'],
    ref: 'User'
  },
  message: {
    type: String
  },
  type: {
    type: String,
    default: 'text'
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
Message.method({});

/**
 * Statics
 */
Message.statics = {
  /**
   * Add Message
   * @params params
   * @return Promise
   */
  add: function add(params) {
    var saveParams = params;
    var message = new this(saveParams);
    return message.save();
  },
  del: function del(params) {
    return this.remove(params).exec();
  },


  /**
   * get statics - Get array of Message objects
   *
   * @params params - Json Object designed to query the Collection
   * @return Promise
   *
   */

  get: function get(params) {
    var _this = this;

    var recursive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    var queryParams = params.queryParams;
    var offset = parseInt(params.paginate.offset, 10);
    var limit = parseInt(params.paginate.limit, 10);
    var Model = this;
    var queryObject = Model.find(queryParams).lean().select('_user_id message type created');
    if (recursive === 1) {
      queryObject.populate({
        path: '_room_id'
      }).populate({
        path: '_user_id'
      });
    }

    queryObject.sort({ _id: 'desc' }).skip(offset).limit(limit).exec();

    return queryObject.then(function (messages) {
      if (messages.length) {
        var processedMessages = messages.map(function (message) {
          return _this.processDate(message);
        });
        return _bluebird2.default.all(processedMessages);
      }
      return _bluebird2.default.resolve(messages);
    }).catch(function (err) {
      return _bluebird2.default.reject(err);
    });
  },


  /**
  * getOne statics - Get a Message object
  *
  * @params params - Json Object designed to query the Collection
  * @return Promise
  *
  */

  getOne: function getOne(params) {
    var recursive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    var Model = this;
    var queryObject = Model.findOne(params).lean().select('_user_id message type created');
    if (recursive === 0) {
      queryObject.exec();
    }
    if (recursive === 1) {
      queryObject.populate({
        path: '_room_id'
      }).populate({
        path: '_user_id'
      }).exec();
    }

    return queryObject.then(function (message) {
      if (message) {
        return Model.processDate(message);
      }
      return _bluebird2.default.resolve(message);
    }).catch(function (err) {
      return _bluebird2.default.reject(err);
    });
  },
  processDate: function processDate(obj) {
    var returnObj = obj;
    var processedDate = new _DateProcess2.default(returnObj.created);
    returnObj.created = processedDate.date;

    return _bluebird2.default.resolve(returnObj);
  },
  lastMessage: function lastMessage(params) {
    var Model = this;

    var queryParams = {
      queryParams: params,
      paginate: {
        offset: 0,
        limit: 1
      }
    };
    return Model.get(queryParams);
  }
};

/**
 * @typedef Message
 */
exports.default = _mongoose2.default.model('Message', Message);
module.exports = exports['default'];
//# sourceMappingURL=Message.js.map
