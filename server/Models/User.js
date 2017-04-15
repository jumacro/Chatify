import Promise from 'bluebird';
import mongoose from 'mongoose';

/**
 * Dependencies
 */


/**
* User schema
* Stores the registered user data
* @author: Mithun Das
*
*/

/** Initialize the debugger */

// const debug = require('debug')('chatify-server:index');


/** Set primary objects */

const Schema = mongoose.Schema;

/** User schema with validation rules */

const User = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  profile_pic: {
    type: String
  },
  online: {
    type: Boolean,
    default: false
  },
  status: {
    type: Boolean,
    default: true
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
User.method({
});

/**
 * Statics
 */
User.statics = {
  /**
   * Add user
   * @params reqParams
   * @return Promise
   */
  add(reqParams) {
    const user = new this(reqParams);
    const saved = user.save();
    return saved.then(savedUser => this.getOne({ _id: savedUser._id }))
         .catch(e => Promise.reject(e));
  },

  /**
   * Edit user
   * @params reqParams
   * @params reqBody
   * @return Promise
   */

  edit(reqParams, reqBody) {
    const Model = this;
    const options = {
      upsert: true,
      new: true,
      runValidators: true
    };
    // debug(reqBody);
    const update = Model.update(reqParams, reqBody, options).exec();
    return update.then(updateObj => Model.getOne(reqParams))
          .catch(e => Promise.reject(e));
  },

  /**
   * Get array of user objects
   *
   * @params reqParams - Json Object designed to query the Collection
   * @return Promise
   *
   */

  get(reqParams) {
    const Model = this;
    const queryObject = Model.find(reqParams)
                             .lean();
    return queryObject.exec();
  },

   /**
   * Get a user object
   *
   * @params reqParams - Json Object designed to query the Collection
   * @return Promise
   *
   */

  getOne(reqParams) {
    const Model = this;
    const queryObject = Model.findOne(reqParams)
                               .lean();
    return queryObject.exec();
  }

};


/**
 * @typedef User
 */
export default mongoose.model('User', User);
