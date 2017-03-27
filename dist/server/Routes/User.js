'use strict';

Object.defineProperty(exports, "__esModule", {
      value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _User = require('../Controllers/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router(); // eslint-disable-line new-cap

// import validate from 'express-validation';
// import paramValidation from '../../config/param-validation';
router.route('/')
/** GET /v1.0/users - Get all users */
.get(_User2.default.getAll)

/** POST /v1.0/users - Create user */
.post(_User2.default.create);

router.route('/:_id')

/** GET /v1.0/users/:userId - Get a user by id */
.get(_User2.default.getById)

/** PUT /v1.0/users/:userId - Update a user */
.put(_User2.default.update);

/** DELETE /v1.0/users/:userId - Delete a user */
// .delete(User.remove); //TODO

router.route('/login')
/** GET /v1.0/users/login - Login user */
.post(_User2.default.login);

router.route('/logout')
/** GET /v1.0/users/logout - logout user */
.post(_User2.default.logout);

router.route('/data/:chat_name')
/** GET /v1.0/users/data/:chat_name - Get a user by chatname */
.get(_User2.default.getByChatName);

router.route('/:userId/dashboard')
/** POST /v1.0/users/dashboard - Get the recent activities of a user */
.post(_User2.default.loadDashboard);

router.route('/:userId/activities')
/** POST /v1.0/users/activities - Get the recent activities of a user */
.get(_User2.default.recentActivities);

exports.default = router;
module.exports = exports['default'];
//# sourceMappingURL=User.js.map
