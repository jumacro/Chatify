'use strict';

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _Room = require('../Models/Room');

var _Room2 = _interopRequireDefault(_Room);

var _Message = require('../Models/Message');

var _Message2 = _interopRequireDefault(_Message);

var _Unseen = require('../Models/Unseen');

var _Unseen2 = _interopRequireDefault(_Unseen);

var _User = require('../Models/User');

var _User2 = _interopRequireDefault(_User);

var _SiberianApi = require('./SiberianApi');

var _SiberianApi2 = _interopRequireDefault(_SiberianApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import redis from 'socket.io-redis';
var io = void 0;

// import Config from '../../config/env';


var debug = require('debug')('easyappchat-server:index');

// pushNotifier helper

var pushNotifier = function pushNotifier(receiverId, chatName, message) {
  _User2.default.getOne({ _id: receiverId }).then(function (user) {
    if (user) {
      // debug(user);
      if (user.app_id) {
        var queryString = 'app_id/' + user.app_id + '/rc/' + user.chat_name + '/sc/' + chatName + '/text/' + message + '/value_id/' + user.value_id;
        // debug(queryString);
        debug(_SiberianApi2.default.postNotification(queryString));
      }
    }
  });
};

var postUnseen = function postUnseen(saveObj) {
  var unseen = new _Unseen2.default(saveObj);
  unseen.save();
};

var chatProcess = function chatProcess(server) {
  io = _socket2.default.listen(server);
  /** io.adapter(redis({
    host: '127.0.0.1',
    port: 6379
  }));*/

  var socketData = {};

  var chat = io;

  // const chat = io.of('/chat'); // use it for the chat stream
  // const contacts = io.of('/contacts'); // use it for recent activity stream

  chat.use(function (socket, next) {
    var query = socket.request._query;
    socketData[socket.id] = {
      company_id: query.company_id,
      room_id: query.room_id,
      chat_name: query.chat_name,
      is_login: query.is_login
    };
    next();
  });

  chat.on('connection', function (socket) {
    var socketConnect = socket;
    var roomId = socketData[socketConnect.id].room_id;
    var chatName = socketData[socketConnect.id].chat_name;
    var isLogin = socketData[socketConnect.id].is_login;
    // const socketConnectId = socketConnect.id;
    socketConnect.room = socketData[socketConnect.id].room_id;
    socketConnect.chat_name = chatName;
    socketConnect.is_login = isLogin;
    socketConnect.room_id = roomId;
    socketConnect.join(socketConnect.room);
    // remove all unseen messages
    var loginEmit = {
      chat_name: socketConnect.chat_name,
      is_login: true
    };
    socketConnect.broadcast.to(socketConnect.room_id).emit('loginStatus', loginEmit);
    var unseenParam = {
      _room_id: socketConnect.room_id,
      chat_name: socketConnect.chat_name
    };
    var unseen = _Unseen2.default.remove(unseenParam).exec();
    unseen.then(function () {
      // console.log('delete fired');
      var emitObj = {
        chat_name: socketConnect.chat_name,
        text: 'seen'
      };
      socketConnect.broadcast.to(socketConnect.room_id).emit('chatState', emitObj);
    });
    // all unseen messages removed above
    // mark user as login
    var userQueryParams = {
      chat_name: socketConnect.chat_name
    };
    var userUpdateBody = {
      is_login: true,
      is_socket: true
    };
    _User2.default.edit(userQueryParams, userUpdateBody);
    // logged in user is login now
    // Listen to "sendchat"
    socketConnect.on('sendchat', function (reqParams) {
      // created the db id
      var msgId = _mongoose2.default.Types.ObjectId();
      // created the emit Object
      var msgObjEmit = {
        _id: msgId,
        _user_id: reqParams._user_id,
        message: reqParams.message,
        created: new Date(),
        post_date: new Date(),
        type: reqParams.type ? reqParams.type : 'text'
      };
      // create the save Object
      var msgObjSave = {
        _id: msgId,
        _room_id: socketConnect.room_id,
        _user_id: reqParams._user_id,
        message: reqParams.message,
        type: reqParams.type ? reqParams.type : 'text',
        created: new Date()
      };
      socketConnect.user_id = reqParams._user_id;
      // emit message to all members of the room only
      chat.sockets.in(socketConnect.room).emit(socketConnect.room_id, msgObjEmit);
      socketConnect.emit('chatState', 'delivered');
      _Message2.default.add(msgObjSave);
      _Room2.default.update({ _id: socketConnect.room_id }, { last_ping: new Date() }, { upsert: true }).exec();
      // debug(reqParams.receivers)
      // enter all receiver id as unseen for the room and message
      if (reqParams.receivers) {
        // todo async function
        var receivers = reqParams.receivers;

        for (var i = 0; i <= receivers.length - 1; i += 1) {
          if (!receivers[i].is_login) {
            pushNotifier(receivers[i]._id, socketConnect.chat_name, reqParams.message);
          }
          if (!receivers[i].is_socket) {
            var saveObj = {
              _room_id: socketConnect.room_id,
              _user_id: receivers[i]._id,
              chat_name: receivers[i].chat_name,
              _message_id: msgId
            };
            postUnseen(saveObj);
          }
        }
      }
    });

    socketConnect.on('seen', function (paramObj) {
      // update message status to read
      var usQueryParam = {
        _message_id: paramObj.message_id,
        chat_name: socketConnect.chat_name
      };
      _Unseen2.default.remove(usQueryParam).exec();
      var emitObj = {
        chat_name: socketConnect.chat_name,
        text: 'seen'
      };
      chat.sockets.in(socketConnect.room).emit('chatState', emitObj);
    });

    socketConnect.on('typing', function () {
      var emitObj = {
        chat_name: socketConnect.chat_name,
        text: 'is typing'
      };
      socketConnect.broadcast.to(socketConnect.room_id).emit('chatState', emitObj);
    });

    socketConnect.on('disconnect', function () {
      var loginEmitObj = {
        chat_name: socketConnect.chat_name,
        is_login: isLogin,
        is_socket: false
      };
      var queryParams = {
        chat_name: socketConnect.chat_name
      };
      var updateBody = {
        is_socket: false
      };
      socketConnect.broadcast.to(socketConnect.room_id).emit('loginStatus', loginEmitObj);
      _User2.default.edit(queryParams, updateBody);
    });
  });
};

exports.boot = chatProcess;
//# sourceMappingURL=IO.js.map
