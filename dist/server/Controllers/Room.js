'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Room = require('../Models/Room');

var _Room2 = _interopRequireDefault(_Room);

var _ResponseObject = require('../Helpers/ResponseObject');

var _ResponseObject2 = _interopRequireDefault(_ResponseObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create room
 */

function create(req, res, next) {
  var insertObject = req.body;

  if (insertObject.users) {
    insertObject.users.push(req.body.creator);
  } else {
    insertObject.users = [req.body.creator];
  }
  var params = insertObject;
  _Room2.default.add(params).then(function (savedRoom) {
    return res.status(201).json(new _ResponseObject2.default(201, savedRoom));
  }).catch(function (e) {
    return next(e);
  });
}

/**
 * Update room
 */
function update(req, res, next) {
  var roomId = req.params._id;
  var updateBody = req.body;
  var queryParam = {
    _id: roomId
  };
  _Room2.default.edit(queryParam, updateBody).then(function (updatedRoom) {
    return res.status(200).json(new _ResponseObject2.default(200, updatedRoom));
  }).catch(function (e) {
    return next(e);
  });
}

/**
 * Get room list.
 * @returns {Room[]}
 */

function getAll(req, res, next) {
  // const { limit = 50, skip = 0 } = req.query;
  _Room2.default.get({}).then(function (rooms) {
    return res.status(200).json(new _ResponseObject2.default(200, rooms));
  }).catch(function (e) {
    return next(e);
  });
}

/**
 * Get room by its _id.
 * @returns {Room{}}
 */

function getById(req, res, next) {
  var queryParam = {
    _id: req.params._id
  };
  _Room2.default.getOne(queryParam, false, false).then(function (room) {
    return res.status(200).json(new _ResponseObject2.default(200, room));
  }).catch(function (e) {
    return next(e);
  });
}

function remove(req, res, next) {
  var queryParam = {
    _id: req.params._id
  };
  _Room2.default.del(queryParam).then(res.status(200).json(new _ResponseObject2.default(200, { message: 'Room Deleted' }))).catch(function (e) {
    return next(e);
  });
}

/**
 * Get room list.
 * @returns {Room[]}
 */

function getByUserId(req, res, next) {
  var userId = req.params._user_id;
  var queryParam = {
    users: userId,
    is_private: false
  };

  _Room2.default.get(queryParam).then(function (rooms) {
    return res.status(200).json(new _ResponseObject2.default(200, rooms));
  }).catch(function (e) {
    return next(e);
  });
}

function deleteUser(req, res, next) {
  _Room2.default.removeUser(req.params).then(function (rooms) {
    return res.status(200).json(new _ResponseObject2.default(200, rooms));
  }).catch(function (e) {
    return next(e);
  });
}

function getMessages(req, res, next) {
  var queryParam = {
    _id: req.params._id,
    offset: req.params.offset,
    limit: req.params.limit
  };
  _Room2.default.getMessages(queryParam).then(function (messages) {
    return res.status(200).json(new _ResponseObject2.default(200, messages));
  }).catch(function (e) {
    return next(e);
  });
}

function joinPublicRoom(req, res, next) {
  var queryParam = {
    _id: req.body._room_id,
    sender_id: req.body.sender_id,
    receiver_id: req.body.receiver_id,
    is_private: false
  };
  _Room2.default.joinRoom(queryParam).then(function (rooms) {
    return res.status(200).json(new _ResponseObject2.default(200, rooms));
  }).catch(function (e) {
    return next(e);
  });
}

function joinPrivateRoom(req, res, next) {
  var queryParam = {
    _id: req.body._room_id,
    sender_id: req.body.sender_id,
    receiver_id: req.body.receiver_id,
    is_private: true
  };
  _Room2.default.joinRoom(queryParam).then(function (rooms) {
    return res.status(200).json(new _ResponseObject2.default(200, rooms));
  }).catch(function (e) {
    return next(e);
  });
}

exports.default = {
  create: create,
  update: update,
  getAll: getAll,
  getById: getById,
  remove: remove,
  getByUserId: getByUserId,
  deleteUser: deleteUser,
  getMessages: getMessages,
  joinPublicRoom: joinPublicRoom,
  joinPrivateRoom: joinPrivateRoom
};
module.exports = exports['default'];
//# sourceMappingURL=Room.js.map
