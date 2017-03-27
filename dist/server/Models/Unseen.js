'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const debug = require('debug')('easyappchat-server:index');

/**
* Unseen schema
* Stores the registered unseen data
* @copyright: Copyright(c) 2017 EasyApp
* @author: Mithun Das
*
*/

var Schema = _mongoose2.default.Schema;
var ObjectId = Schema.ObjectId;

var Unseen = new Schema({
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
  chat_name: {
    type: String,
    required: [true, 'Chatname is required']
  },
  _message_id: {
    type: ObjectId,
    required: [true, 'Message is required'],
    ref: 'Message'
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
Unseen.method({});

/**
 * Statics
 */
Unseen.statics = {
  /**
   * Add unseen
   * @params params
   * @return Promise   - exec(function(err, savedObject))
   */
  add: function add(params) {
    var saveParams = params;
    var unseen = new this(saveParams);
    return unseen.save();
  },


  /**
   * get statics - Get array of unseen objects
   *
   * @params params - Json Object designed to query the Collection
   * @return err   - Error Object
   * @return Promise   - exec(function(err))
   *
   */

  del: function del(params) {
    return this.remove(params).exec();
  },


  /**
  * getCount statics - Count unseen objects by passed params
  *
  * @params params - Json Object designed to query the Collection
  * @return Promise   - exec(function(err, count))
  *
  */

  getCount: function getCount(params) {
    var findObj = this.find(params);
    return findObj.then(function (theObjArr) {
      return _bluebird2.default.resolve(theObjArr.length);
    }).catch(function (e) {
      return _bluebird2.default.reject(e);
    });
  }
};

/**
 * @typedef Unseen
 */
exports.default = _mongoose2.default.model('Unseen', Unseen);
module.exports = exports['default'];
//# sourceMappingURL=Unseen.js.map
