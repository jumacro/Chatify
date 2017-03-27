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

var _constants = require('../../config/constants');

var _constants2 = _interopRequireDefault(_constants);

var _Message = require('./Message');

var _Message2 = _interopRequireDefault(_Message);

var _Unseen = require('./Unseen');

var _Unseen2 = _interopRequireDefault(_Unseen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const debug = require('debug')('easyappchat-server:index');

/**
* Room schema
* Stores the registered room data
* @copyright: Copyright(c) 2017 EasyApp
* @author: Mithun Das
*
*/

var Schema = _mongoose2.default.Schema;
var ObjectId = Schema.ObjectId;

var Room = new Schema({
  image: {
    type: String
  },
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  creator: {
    type: ObjectId,
    required: true,
    ref: 'User'
  },
  users: [{ type: ObjectId, ref: 'User' }],
  is_private: {
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    default: Date.now
  },
  last_ping: {
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
Room.method({});

/**
 * Statics
 */
Room.statics = {
  /**
   * Add room
   * @params params
   * @return result
   */
  add: function add(params) {
    var saveParams = params;
    var room = new this(saveParams);
    return room.save();
  },


  /**
   * Edit room
   * @params reqParams
   * @params reqBody
   * @return Promise
   */

  edit: function edit(reqParams, reqBody) {
    var options = {
      upsert: true,
      new: true,
      runValidators: true
    };

    var Model = this;
    var paramBody = reqBody;
    var newRoomUsers = false;
    if (paramBody.users) {
      newRoomUsers = paramBody.users;
      delete paramBody.users;
    }
    var update = Model.findOneAndUpdate(reqParams, paramBody, options).exec();
    return update.then(function (room) {
      // debug(newRoomUsers);
      if (newRoomUsers) {
        return Model.addUser(reqParams, newRoomUsers);
      }
      return _bluebird2.default.resolve(room);
    }).then(function (finalRoom) {
      return _bluebird2.default.resolve(finalRoom);
    }).catch(function (e) {
      return _bluebird2.default.reject(e);
    });
  },
  addUser: function addUser(reqParams, usersArr) {
    return this.findOneAndUpdate(reqParams, {
      $push: { users: { $each: usersArr } }
    }, { upsert: true, new: true }).exec();
  },
  del: function del(reqParams) {
    var dependencyParam = {
      _room_id: reqParams._id
    };
    _Message2.default.del(dependencyParam);
    _Unseen2.default.del(dependencyParam);
    return this.remove(reqParams).exec();
  },


  /**
   * get statics - Get array of room objects
   *
   * @params params - Json Object designed to query the Collection
   * @return err   - Error Object
   * @return companies - Array of room objects with room data
   *
   */

  get: function get(params) {
    var recursive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    var Model = this;
    var queryObject = Model.find(params).lean();
    if (recursive === 1) {
      queryObject.populate({
        path: 'creator'
      }).populate({
        path: 'users'
      });
    }

    queryObject.exec();

    return queryObject.then(function (rooms) {
      if (rooms.length && recursive === 1) {
        var roomsWithProcessedDate = rooms.map(function (room) {
          return Model.processDate(room);
        });
        // return Promise.all(roomsWithProcessedDate, roomsWithLastMessage);
        return _bluebird2.default.all(roomsWithProcessedDate);
      }
      return _bluebird2.default.resolve(rooms);
    }).then(function (roomsArr) {
      if (roomsArr.length && recursive === 1) {
        // to do problem in last message
        var roomsWithLastMessage = roomsArr.map(function (roomArr) {
          return Model.processLastMessage(roomArr);
        });
        // debug(Promise.all(roomsWithLastMessage));
        return _bluebird2.default.all(roomsWithLastMessage);
      }
      return _bluebird2.default.resolve(roomsArr);
    }).catch(function (err) {
      return _bluebird2.default.reject(err);
    });
  },


  /**
  * getOne statics - Get a room object
  *
  * @params params - Json Object designed to query the Collection
  * @return err   - Error Object
  * @return room - The room object
  *
  */

  getOne: function getOne(params, userId) {
    var lastMessage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var recursive = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

    var Model = this;
    var queryObject = Model.findOne(params).lean();
    if (recursive === 0) {
      queryObject.exec();
    }
    if (recursive === 1) {
      queryObject.populate({
        path: 'creator'
      }).populate({
        path: 'users'
      }).exec();
    }

    return queryObject.then(function (room) {
      if (room) {
        return Model.processDate(room);
      }
      return _bluebird2.default.resolve(room);
    }).then(function (roomWithDate) {
      if (roomWithDate) {
        if (lastMessage === 1) {
          return Model.processLastMessage(roomWithDate);
        }
        return Model.processAllMessage(roomWithDate);
      }
      return _bluebird2.default.resolve(roomWithDate);
    }).then(function (roomWithMsg) {
      if (userId) {
        return Model.processUnseenCount(roomWithMsg, userId);
      }
      return _bluebird2.default.resolve(roomWithMsg);
    }).catch(function (err) {
      return _bluebird2.default.reject(err);
    });
  },
  activitiesByUser: function activitiesByUser(param) {
    var Model = this;

    var roomQuery = {
      users: param._user_id
    };

    var queryObject = Model.find(roomQuery).lean().select('name image creator users is_private created last_ping').populate({
      path: 'creator'
    }).populate({
      path: 'users'
    }).sort({ last_ping: 'desc' }).exec();

    return queryObject.then(function (rooms) {
      if (rooms.length) {
        var roomsWithProcessedDate = rooms.map(function (room) {
          return Model.processDate(room);
        });
        return _bluebird2.default.all(roomsWithProcessedDate);
      }
      return _bluebird2.default.resolve(rooms);
    }).then(function (roomsA) {
      if (roomsA.length) {
        var roomsWithLastMessage = roomsA.map(function (roomA) {
          return Model.processLastMessage(roomA, param._user_id);
        });
        return _bluebird2.default.all(roomsWithLastMessage);
      }
      return _bluebird2.default.resolve(roomsA);
    }).then(function (roomsB) {
      if (roomsB.length) {
        var roomsWithUnseenCount = roomsB.map(function (roomB) {
          return Model.processUnseenCount(roomB, param._user_id);
        });
        return _bluebird2.default.all(roomsWithUnseenCount);
      }
      return _bluebird2.default.resolve(roomsB);
    }).then(function (roomsC) {
      if (roomsC.length) {
        var roomsWithProcessedIdentity = roomsC.map(function (roomC) {
          return Model.processRoomName(roomC, param._user_id);
        });
        return _bluebird2.default.all(roomsWithProcessedIdentity);
      }
      return _bluebird2.default.resolve(roomsC);
    }).catch(function (err) {
      return _bluebird2.default.reject(err);
    });
  },
  processDate: function processDate(obj) {
    var theObj = obj;
    var dateInst = new _DateProcess2.default(theObj.last_ping);
    var processedDate = dateInst.getDate();
    theObj.last_ping = processedDate;
    // debug(theObj);
    return _bluebird2.default.resolve(theObj);
  },
  processLastMessage: function processLastMessage(obj) {
    var room = obj;
    var queryParams = { _room_id: room._id };
    room.last_message = false;
    return _Message2.default.lastMessage(queryParams).then(function (lastMessageArr) {
      room.last_message = lastMessageArr;
      return _bluebird2.default.resolve(room);
    }).catch(function (err) {
      return _bluebird2.default.reject(err);
    });
  },
  processAllMessage: function processAllMessage(obj) {
    var msgParams = {
      queryParams: {
        _room_id: obj._id
      },
      paginate: {
        offset: 0,
        limit: _constants2.default.MAX_MSGS
      }
    };
    var room = obj;
    room.messages = false;
    return _Message2.default.get(msgParams).then(function (MessageArr) {
      room.messages = MessageArr.reverse();
      // debug(room);
      return _bluebird2.default.resolve(room);
    }).catch(function (err) {
      return _bluebird2.default.reject(err);
    });
  },
  processUnseenCount: function processUnseenCount(obj, userId) {
    var queryParams = {
      _room_id: obj._id,
      _user_id: userId
    };
    var room = obj;
    room.unseen = 0;
    return _Unseen2.default.getCount(queryParams).then(function (unseenCount) {
      room.unseen = unseenCount;
      return _bluebird2.default.resolve(room);
    }).catch(function (err) {
      return _bluebird2.default.reject(err);
    });
  },
  processRoomName: function processRoomName(obj, userId) {
    var room = obj;
    if (room.is_private) {
      var users = room.users.filter(function (user) {
        return parseInt(user._id, 16) !== parseInt(userId, 16);
      });

      if (users.length) {
        room.name = users[0].chat_name;
        room.image = users[0].avatar_url;
      }
      return _bluebird2.default.resolve(room);
    }
    return _bluebird2.default.resolve(room);
  },
  checkRoomUsers: function checkRoomUsers(userId, roomId) {
    var queryParams = {
      _id: roomId,
      users: userId
    };
    return this.count(queryParams).then(function (count) {
      if (!count) {
        return _bluebird2.default.resolve(userId);
      }
      return _bluebird2.default.reject(userId);
    });
  },
  removeUser: function removeUser(params) {
    var Model = this;

    return Model.findOneAndUpdate({ _id: params.roomId }, {
      $pull: {
        users: params.userId
      }
    }, {
      upsert: true,
      new: true
    }).exec();
  },
  getMessages: function getMessages(params) {
    var msgParam = {
      queryParams: {
        _room_id: params._id
      },
      paginate: {
        offset: params.offset,
        limit: params.limit
      }
    };

    return _Message2.default.get(msgParam);
  },
  joinRoom: function joinRoom(param) {
    var Model = this;
    if (param.is_private) {
      return Model.parsePrivateRoom(param);
    }
    return Model.parsePublicRoom(param);
  },
  parsePrivateRoom: function parsePrivateRoom(param) {
    var Model = this;
    var userArr = [param.sender_id, param.receiver_id];
    var userArrReverse = [param.receiver_id, param.sender_id];
    var andParams = {
      is_private: true
    };
    var roomExistance = Model.findOne(andParams).or([{ users: userArr }, { users: userArrReverse }]).lean().exec();
    return roomExistance.then(function (room) {
      // debug(room);
      if (!room) {
        var identity = _mongoose2.default.Types.ObjectId();
        var roomParam = {
          name: 'Private chat' + identity,
          creator: param.sender_id,
          users: userArr,
          is_private: true
        };
        return Model.add(roomParam);
      }
      return _bluebird2.default.resolve(room);
    }).then(function (resultRoom) {
      return Model.getOne({ _id: resultRoom._id }, param.sender_id, false);
    });
  },
  parsePublicRoom: function parsePublicRoom(param) {
    var Model = this;
    var getRoom = Model.getOne({ _id: param._id }, param.sender_id, false);
    return getRoom.then(function (room) {
      if (room) {
        var countUser = room.users.find(function (user) {
          return parseInt(user._id, 16) === parseInt(param.sender_id, 16);
        });
        if (!countUser) {
          room.users.push(param.sender_id);
          Model.update({ _id: param._id }, {
            $push: {
              users: param.sender_id
            }
          }, { upsert: true, new: true }).exec();
        }
      }
      return _bluebird2.default.resolve(room);
    }).then(function (resultRoom) {
      return Model.getOne({ _id: resultRoom._id }, param.sender_id, false);
    });
  }
};

/**
 * @typedef Room
 */
exports.default = _mongoose2.default.model('Room', Room);
module.exports = exports['default'];
//# sourceMappingURL=Room.js.map
