import Promise from 'bluebird';
import mongoose from 'mongoose';

/**
 * Dependencies
 */


/**
* Media schema
* Stores the user media
* @author: Mithun Das
*
*/

/** Initialize the debugger */

// const debug = require('debug')('chatify-server:index');


/** Set primary objects */

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/** User schema with validation rules */

const Media = new Schema({
  userId: {
    type: ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: [true, 'File name is required']
  },
  mimeType: {
    type: String,
    default: ''
  },
  size: {
    type: Number,
    default: 0
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
Media.method({
});

/**
 * Statics
 */
Media.statics = {
  /**
   * Add user
   * @params reqParams
   * @return Promise
   */
  add(reqParams) {
    const media = new this(reqParams);
    return media.save();
  },

};


/**
 * @typedef User
 */
export default mongoose.model('Media', Media);
