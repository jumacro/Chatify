import Promise from 'bluebird';
import mongoose from 'mongoose';
import constants from '../../config/constants';

import Message from './Message';
import Unseen from './Unseen';

// const debug = require('debug')('chatify-server:index');

/**
* Room schema
* Stores the registered room data
* @author: Mithun Das
*
*/

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Room = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  image: {
    type: String
  },
  creator: {
    type: ObjectId,
    required: true,
    ref: 'User'
  },
  users: [
    { type: ObjectId, ref: 'User' }
  ],
  is_private: {
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    default: Date.now
  },
  lastMessage: {
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
Room.method({
});

/**
 * Statics
 */
Room.statics = {
  /**
   * Add room
   * @params params
   * @return result
   */
  add(params) {
    const saveParams = params;
    const room = new this(saveParams);
    return room.save();
  },

  addUser(reqParams, usersArr) {
    return this.findOneAndUpdate(reqParams, {
      $push: { users: { $each: usersArr } }
    }, { upsert: true, new: true }).exec();
  },

  del(reqParams) {
    const dependencyParam = {
      _room_id: reqParams._id
    };
    Message.del(dependencyParam);
    Unseen.del(dependencyParam);
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

  get(params, recursive = 1) {
    const Model = this;
    const queryObject = Model.find(params)
                               .lean();
    if (recursive === 1) {
      queryObject
          .populate({
            path: 'creator'
          })
          .populate({
            path: 'users'
          });
    }

    return queryObject.exec();
  },

   /**
   * getOne statics - Get a room object
   *
   * @params params - Json Object designed to query the Collection
   * @return err   - Error Object
   * @return room - The room object
   *
   */

  getOne(params, userId, lastMessage = 1, recursive = 1) {
    const Model = this;
    const queryObject = Model.findOne(params)
                               .lean();
    if (recursive === 0) {
      queryObject.exec();
    }
    if (recursive === 1) {
      queryObject.populate({
        path: '_company_id'
      })
                .populate({
                  path: 'creator'
                })
                .populate({
                  path: 'users'
                })
                .exec();
    }

    return queryObject;
  },

  removeUser(params) {
    const Model = this;

    return Model.findOneAndUpdate({ _id: params.roomId }, {
      $pull: {
        users: params.userId
      }
    }, {
      upsert: true,
      new: true
    }).exec();
  },

  getMessages(params) {
    const msgParams = {
      queryParams: {
        _room_id: params._id
      },
      paginate: {
        offset: params.offset,
        limit: constants.MAX_LIMIT_MSG_GET
      }
    };

    return Message.get(msgParams)
             .then((MessageArr) => {
               // the returns 0 - MAX_LIMIT_MSG_GET in DESC order
               // so to display we want to get it as in reversed
               // so last message comes at the end of the list
               const messages = MessageArr.reverse();
               // debug(room);
               return Promise.resolve(messages);
             })
             .catch(err => Promise.reject(err));
  },

  joinRoom(param) {
    const Model = this;
    if (param.is_private) {
      return Model.parsePrivateRoom(param);
    }
    return Model.parsePublicRoom(param);
  },

  parsePrivateRoom(param) {
    const Model = this;
    const userArr = [param.sender_id, param.receiver_id];
    const userArrReverse = [param.receiver_id, param.sender_id];
    const andParams = {
      is_private: true
    };
    const roomExistance = Model.findOne(andParams)
                                .or([
                                  { users: userArr },
                                  { users: userArrReverse }
                                ])
                                .lean()
                                .exec();
    return roomExistance.then((room) => {
      // debug(room);
      if (!room) {
        const identity = mongoose.Types.ObjectId();
        const roomParam = {
          _company_id: param._company_id,
          name: `Private chat${identity}`,
          creator: param.sender_id,
          users: userArr,
          is_private: true
        };
        return Model.add(roomParam);
      }
      return Promise.resolve(room);
    })
    .then(resultRoom => Model.getOne({ _id: resultRoom._id }, param.sender_id, false));
  },

  parsePublicRoom(param) {
    const Model = this;
    const getRoom = Model.getOne({ _id: param._id }, param.sender_id, false);
    return getRoom.then((room) => {
      if (room) {
        const countUser = room.users.find(user =>
          parseInt(user._id, 16) === parseInt(param.sender_id, 16)
        );
        if (!countUser) {
          room.users.push(param.sender_id);
          Model.update({ _id: param._id }, {
            $push: {
              users: param.sender_id
            }
          }, { upsert: true, new: true }).exec();
        }
      }
      return Promise.resolve(room);
    })
    .then(resultRoom => Model.getOne({ _id: resultRoom._id }, param.sender_id, false));
  }
};

/**
 * @typedef Room
 */
export default mongoose.model('Room', Room);
