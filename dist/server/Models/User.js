'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _Room = require('./Room');

var _Room2 = _interopRequireDefault(_Room);

var _Unseen = require('./Unseen');

var _Unseen2 = _interopRequireDefault(_Unseen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* User schema
* Stores the registered user data
* @copyright: Copyright(c) 2017 EasyApp
* @author: Mithun Das
*
*/

/** Initialize the debugger */

// const debug = require('debug')('easyappchat-server:index');


/** Set primary objects */

/**
 * Dependencies
 */

var Schema = _mongoose2.default.Schema;
// const ObjectId = Schema.ObjectId;

/** User schema with validation rules */

var User = new Schema({
  full_name: {
    type: String,
    required: [true, 'Name is required']
  },
  chat_name: {
    type: String,
    required: [true, 'Username/Chatname is required'],
    unique: [true, 'Username/Chatname already taken']
  },
  avatar_url: {
    type: String,
    default: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-128.png'
  },
  is_login: {
    type: Boolean,
    default: true
  },
  is_socket: {
    type: Boolean,
    default: false
  },
  app_id: {
    type: Number,
    default: false
  },
  value_id: {
    type: Number,
    default: false
  },
  created: {
    type: Date,
    default: Date.now
  }
});

/**
 * - pre-save hooks
 * - custom validations
 * - virtuals
 * - indexes
 */

/**
 * Methods
 */
User.method({});

/**
 * Statics
 */
User.statics = {
  /**
   * Add user
   * @params reqParams
   * @return Promise
   */
  add: function add(reqParams) {
    var _this = this;

    var user = new this(reqParams);
    var saved = user.save();
    return saved.then(function (savedUser) {
      return _this.getOne({ _id: savedUser._id });
    }).catch(function (e) {
      return _bluebird2.default.reject(e);
    });
  },


  /**
   * Edit user
   * @params reqParams
   * @params reqBody
   * @return Promise
   */

  edit: function edit(reqParams, reqBody) {
    var Model = this;
    var options = {
      upsert: true,
      new: true,
      runValidators: true
    };
    // debug(reqBody);
    var update = Model.update(reqParams, reqBody, options).exec();
    return update.then(function (updateObj) {
      return Model.getOne(reqParams);
    }).catch(function (e) {
      return _bluebird2.default.reject(e);
    });
  },


  /**
   * Get array of user objects
   *
   * @params reqParams - Json Object designed to query the Collection
   * @return Promise
   *
   */

  get: function get(reqParams) {
    var Model = this;
    var queryObject = Model.find(reqParams).lean();
    return queryObject.exec();
  },


  /**
  * Get a user object
  *
  * @params reqParams - Json Object designed to query the Collection
  * @return Promise
  *
  */

  getOne: function getOne(reqParams) {
    var Model = this;
    var queryObject = Model.findOne(reqParams).lean();
    return queryObject.exec();
  },
  getOneAndUpdate: function getOneAndUpdate(reqParams, updateParam) {
    var Model = this;
    var queryObject = Model.findOne(reqParams).lean().exec();
    return queryObject.then(function (user) {
      if (user) {
        return Model.edit({ _id: user._id }, updateParam);
      }
      return Model.add(updateParam);
    }).catch(function (e) {
      return _bluebird2.default.reject(e);
    });
  },


  /**
   * Get the array of room objects (both public and private) for a given user.
   * Order them by their activity.
   * Show the unseen messages by the user
   * Show the last message object of the room
   *
   * @params reqParams - Json Object designed to query the Room object
   * @return
   */

  activities: function activities(reqParams) {
    return _Room2.default.activitiesByUser(reqParams).then(function (rooms) {
      return (
        // debug(rooms);
        _bluebird2.default.resolve(rooms)
      );
    }).catch(function (e) {
      return (
        // debug(e);
        _bluebird2.default.reject(e)
      );
    });
  },
  getRooms: function getRooms(groupsQueryParam) {
    return _Room2.default.get(groupsQueryParam).then(function (rooms) {
      return _bluebird2.default.resolve(rooms);
    }).catch(function (e) {
      return _bluebird2.default.reject(e);
    });
  },
  userUnseenCount: function userUnseenCount(param) {
    return _Unseen2.default.getCount(param);
  }
};

/**
 * @typedef User
 */
exports.default = _mongoose2.default.model('User', User);
module.exports = exports['default'];
//# sourceMappingURL=User.js.map
