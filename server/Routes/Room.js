'use strict';

Object.defineProperty(exports, "__esModule", {
      value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _Room = require('../Controllers/Room');

var _Room2 = _interopRequireDefault(_Room);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router(); // eslint-disable-line new-cap

// import validate from 'express-validation';
// import paramValidation from '../../config/param-validation';
router.route('/')
/** GET /v1.0/rooms - Get all rooms */
.get(_Room2.default.getAll)

/** POST /v1.0/rooms - Create room */
.post(_Room2.default.create);

router.route('/:_id')
/** GET /v1.0/rooms/:_id - Get a room */
.get(_Room2.default.getById)

/** PUT /v1.0/rooms/:_id - Update user */
.put(_Room2.default.update)

/** DELETE /v1.0/rooms/:_id - Delete user */
.delete(_Room2.default.remove);

router.route('/:roomId/users/:userId').delete(_Room2.default.deleteUser);

router.route('/users/:_user_id').get(_Room2.default.getByUserId);

router.route('/public/join').post(_Room2.default.joinPublicRoom);

router.route('/private/join').post(_Room2.default.joinPrivateRoom);

router.route('/:_id/messages/:offset/:limit').get(_Room2.default.getMessages);

exports.default = router;
module.exports = exports['default'];
//# sourceMappingURL=Room.js.map
