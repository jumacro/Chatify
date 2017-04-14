import Promise from 'bluebird';
import mongoose from 'mongoose';

// const debug = require('debug')('easyappchat-server:index');

/**
* Unseen schema
* Stores the registered unseen data
* @author: Mithun Das
*
*/

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Unseen = new Schema({
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
Unseen.method({
});

/**
 * Statics
 */
Unseen.statics = {
  /**
   * Add unseen
   * @params params
   * @return Promise   - exec(function(err, savedObject))
   */
  add(params) {
    const saveParams = params;
    const unseen = new this(saveParams);
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

  del(params) {
    return this.remove(params).exec();
  },

   /**
   * getCount statics - Count unseen objects by passed params
   *
   * @params params - Json Object designed to query the Collection
   * @return Promise   - exec(function(err, count))
   *
   */

  getCount(params) {
    const findObj = this.find(params);
    return findObj.then(theObjArr => Promise.resolve(theObjArr.length))
                  .catch(e => Promise.reject(e));
  }

};


/**
 * @typedef Unseen
 */
export default mongoose.model('Unseen', Unseen);
