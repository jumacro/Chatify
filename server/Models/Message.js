import Promise from 'bluebird';
import mongoose from 'mongoose';
import DateProcess from '../Helpers/DateProcess';

// const debug = require('debug')('chatify-server:index');

/**
* Message schema
* Stores the registered Message data
* @author: Mithun Das
*
*/

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const Message = new Schema({
  roomId: {
    type: ObjectId,
    required: [true, 'Room is required'],
    ref: 'Room'
  },
  userId: {
    type: ObjectId,
    required: [true, 'User is required'],
    ref: 'User'
  },
  message: {
    type: String
  },
  location: {
    type: [Number], // longitude is x-axis and latitude is y-axis
    index: '2dsphere'
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
Message.method({
});

/**
 * Statics
 */
Message.statics = {
  /**
   * Add Message
   * @params params
   * @return Promise
   */
  add(params) {
    const saveParams = params;
    const message = new this(saveParams);
    return message.save();
  },


  del(params) {
    return this.remove(params).exec();
  },

  /**
   * get statics - Get array of Message objects
   *
   * @params params - Json Object designed to query the Collection
   * @return Promise
   *
   */

  get(params, recursive = 1) {
    const queryParams = params.queryParams;
    const offset = parseInt(params.paginate.offset, 10);
    const limit = parseInt(params.paginate.limit, 10);
    const Model = this;
    const queryObject = Model.find(queryParams)
                               .lean();
    if (recursive === 1) {
      queryObject
          .populate({
            path: '_room_id'
          })
          .populate({
            path: '_user_id'
          });
    }

    queryObject
        .sort({ _id: 'desc' })
        .skip(offset)
        .limit(limit)
        .exec();


    return queryObject
            .then((messages) => {
              if (messages.length) {
                const processedMessages = messages.map(message => this.processDate(message));
                return Promise.all(processedMessages);
              }
              return Promise.resolve(messages);
            })
            .catch(err => Promise.reject(err));
  },

   /**
   * getOne statics - Get a Message object
   *
   * @params params - Json Object designed to query the Collection
   * @return Promise
   *
   */

  getOne(params, recursive = 1) {
    const Model = this;
    const queryObject = Model.findOne(params)
                               .lean();
    if (recursive === 0) {
      queryObject.exec();
    }
    if (recursive === 1) {
      queryObject.populate({
        path: '_room_id'
      })
                            .populate({
                              path: '_user_id'
                            })
                            .exec();
    }

    return queryObject
            .then((message) => {
              if (message) {
                return Model.processDate(message);
              }
              return Promise.resolve(message);
            })
            .catch(err => Promise.reject(err));
  },

  processDate(obj) {
    const returnObj = obj;
    const processedDate = new DateProcess(returnObj.created);
    returnObj.created = processedDate.date;

    return Promise.resolve(returnObj);
  },

  lastMessage(params) {
    const Model = this;

    const queryParams = {
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
export default mongoose.model('Message', Message);
