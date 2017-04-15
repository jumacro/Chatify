import socketio from 'socket.io';
// import redis from 'socket.io-redis';
import mongoose from 'mongoose';

// import Config from '../../config/env';
import Room from '../Models/Room';
import Message from '../Models/Message';
import Unseen from '../Models/Unseen';
import User from '../Models/User';


let io;

const debug = require('debug')('chatify-server:index');

// pushNotifier helper

const postUnseen = (saveObj) => {
  const unseen = new Unseen(saveObj);
  unseen.save();
};


const chatProcess = (server) => {
  io = socketio.listen(server);
  /** io.adapter(redis({
    host: '127.0.0.1',
    port: 6379
  }));*/

  const socketData = {};

  // const chat = io;
  const chat = io.of('/chat');

  // const chat = io.of('/chat'); // use it for the chat stream
  // const contacts = io.of('/contacts'); // use it for recent activity stream

  chat.use((socket, next) => {
    const query = socket.request._query;
    socketData[socket.id] = {
      roomId: query.roomId,
      userName: query.userName,
      online: query.online
    };
    next();
  });

  chat.on('connection', (socket) => {
    const socketConnect = socket;
    const roomId = socketData[socketConnect.id].roomId;
    const userName = socketData[socketConnect.id].userName;
    const online = socketData[socketConnect.id].online;
    // const socketConnectId = socketConnect.id;
    socketConnect.room = socketData[socketConnect.id].roomId;
    socketConnect.userName = userName;
    socketConnect.online = online;
    socketConnect.roomId = roomId;
    socketConnect.join(socketConnect.room);
    // remove all unseen messages
    const loginEmit = {
      userName: socketConnect.userName,
      online: true
    };
    socketConnect.broadcast.to(socketConnect.roomId).emit('loginStatus', loginEmit);
    const unseenParam = {
      _roomId: socketConnect.roomId,
      userName: socketConnect.userName
    };
    const unseen = Unseen.remove(unseenParam).exec();
    unseen.then(() => {
      // console.log('delete fired');
      const emitObj = {
        userName: socketConnect.userName,
        text: 'seen'
      };
      socketConnect.broadcast.to(socketConnect.roomId).emit('chatState', emitObj);
    });
    // all unseen messages removed above
    // mark user as login
    const userQueryParams = {
      userName: socketConnect.userName
    };
    const userUpdateBody = {
      online: true
    };
    User.edit(userQueryParams, userUpdateBody);
    // logged in user is login now
    // Listen to "sendchat"
    socketConnect.on('sendchat', (reqParams) => {
      // created the db id
      const msgId = mongoose.Types.ObjectId();
      // created the emit Object
      const msgObjEmit = {
        _id: msgId,
        _user_id: reqParams._user_id,
        message: reqParams.message,
        created: new Date(),
        post_date: new Date(),
        type: (reqParams.type) ? reqParams.type : 'text'
      };
      // create the save Object
      const msgObjSave = {
        _id: msgId,
        _roomId: socketConnect.roomId,
        _user_id: reqParams._user_id,
        message: reqParams.message,
        type: (reqParams.type) ? reqParams.type : 'text',
        created: new Date()
      };
      if (reqParams.location) {
        msgObjEmit.location = [reqParams.location.longitude, reqParams.location.latitude];
        msgObjSave.location = [reqParams.location.longitude, reqParams.location.latitude];
      }
      // debug(msgObjSave);
      socketConnect.user_id = reqParams._user_id;
      // emit message to all members of the room only
      chat.sockets.in(socketConnect.room).emit(
        socketConnect.roomId,
        msgObjEmit
      );
      socketConnect.emit('chatState', 'delivered');
      Message.add(msgObjSave);
      Room.update(
        { _id: socketConnect.roomId },
        { last_ping: new Date() },
        { upsert: true }
      ).exec();
      // debug(reqParams.receivers)
      // enter all receiver id as unseen for the room and message
      if (reqParams.receivers) {
        // todo async function
        const receivers = reqParams.receivers;

        for (let i = 0; i <= (receivers.length - 1); i += 1) {
          User.getOne({ _id: receivers[i]._id })
              .then((receiverUser) => {
                if (receiverUser.online === false) {
                  const saveObj = {
                    _roomId: socketConnect.roomId,
                    _user_id: receiverUser._id,
                    userName: receiverUser.userName,
                    _message_id: msgId
                  };
                  postUnseen(saveObj);
                } else {
                  const seenEmit = {
                    status: 'seen',
                    user: receiverUser.userName
                  };
                  socketConnect.emit('chatState', seenEmit);
                }
              })
              .catch();
        }
      }
    });

    socketConnect.on('seen', (paramObj) => {
      // update message status to read
      const usQueryParam = {
        _message_id: paramObj.message_id,
        userName: socketConnect.userName
      };
      Unseen.remove(usQueryParam).exec();
      const emitObj = {
        userName: socketConnect.userName,
        text: 'seen'
      };
      chat.sockets.in(socketConnect.room).emit('chatState', emitObj);
    });

    socketConnect.on('typing', () => {
      const emitObj = {
        userName: socketConnect.userName,
        text: 'is typing'
      };
      socketConnect.broadcast.to(socketConnect.roomId).emit('chatState', emitObj);
    });

    socketConnect.on('disconnect', () => {
      const loginEmitObj = {
        userName: socketConnect.userName,
        online: false
      };
      const queryParams = {
        userName: socketConnect.userName
      };
      const updateBody = {
        online: false
      };
      socketConnect.broadcast.to(socketConnect.roomId).emit('loginStatus', loginEmitObj);
      User.edit(queryParams, updateBody);
    });
  });
};

exports.boot = chatProcess;
