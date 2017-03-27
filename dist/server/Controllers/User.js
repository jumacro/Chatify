'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _User = require('../Models/User');

var _User2 = _interopRequireDefault(_User);

var _ResponseObject = require('../Helpers/ResponseObject');

var _ResponseObject2 = _interopRequireDefault(_ResponseObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create user
 */

function create(req, res, next) {
  var params = req.body;

  _User2.default.add(params).then(function (savedUser) {
    return res.status(201).json(new _ResponseObject2.default(201, savedUser));
  }).catch(function (e) {
    return next(e);
  });
}

/**
 * Update user
 */
function update(req, res, next) {
  var userId = req.params._id;
  var updateBody = req.body;
  var queryParam = {
    _id: userId
  };
  _User2.default.edit(queryParam, updateBody).then(function (updatedUser) {
    return res.status(200).json(new _ResponseObject2.default(200, updatedUser));
  }).catch(function (e) {
    return next(e);
  });
}

/**
 * Get user list.
 * @returns {User[]}
 */

function getAll(req, res, next) {
  // const { limit = 50, skip = 0 } = req.query;
  _User2.default.get({}).then(function (users) {
    return res.status(200).json(new _ResponseObject2.default(200, users));
  }).catch(function (e) {
    return next(e);
  });
}

/**
 * Get user by its _id.
 * @returns {User{}}
 */

function getById(req, res, next) {
  var queryParam = {
    _id: req.params._id
  };

  _User2.default.getOne(queryParam).then(function (user) {
    return res.status(200).json(new _ResponseObject2.default(200, user));
  }).catch(function (e) {
    return next(e);
  });
}

/**
 * Get the user object by passing chat_name
 */

function getByChatName(req, res, next) {
  var queryParam = {
    chat_name: req.params.chat_name
  };

  _User2.default.getOne(queryParam).then(function (user) {
    return res.status(200).json(new _ResponseObject2.default(200, user));
  }).catch(function (e) {
    return next(e);
  });
}

function loadDashboard(req, res, next) {
  var newParam = req.params;
  var userData = _User2.default.getOne({ _id: newParam.userId });
  userData.then(function (user) {
    if (user) {
      return Promise.resolve(user);
    }
    return _User2.default.add(newParam);
  }).then(function (user) {
    var activityQueryParam = {
      _user_id: user._id
    };
    var myGroupsQueryParam = {
      users: user._id,
      is_private: false
    };
    var unSeenQueryParam = {
      chat_name: user.chat_name
    };
    var groups = _User2.default.getRooms(myGroupsQueryParam);
    var activities = _User2.default.activities(activityQueryParam);
    var unseenCount = _User2.default.userUnseenCount(unSeenQueryParam);
    return Promise.all([user, groups, activities, unseenCount]);
  }).then(function (finalResponse) {
    return res.status(200).json(new _ResponseObject2.default(200, finalResponse));
  }).catch(function (e) {
    return next(e);
  });
}

function recentActivities(req, res, next) {
  var newParam = req.params;
  var userId = newParam.userId;

  var activityQueryParam = {
    _user_id: userId
  };
  _User2.default.activities(activityQueryParam).then(function (activities) {
    var user = activities[0].users.filter(function (userObj) {
      return parseInt(userObj._id, 16) === parseInt(userId, 16);
    });
    var unSeenQueryParam = {
      chat_name: user[0].chat_name
    };
    var unseenCount = _User2.default.userUnseenCount(unSeenQueryParam);
    return Promise.all([activities, unseenCount]);
  }).then(function (finalResponse) {
    return res.status(200).json(new _ResponseObject2.default(200, finalResponse));
  }).catch(function (e) {
    return next(e);
  });
}

/** Let the user login */
function login(req, res, next) {
  var param = req.body;
  var queryParam = { chat_name: param.chat_name };
  _User2.default.getOne(queryParam).then(function (user) {
    if (user) {
      var updateParam = { _id: user.id };
      var updateBody = { is_login: true };
      _User2.default.update(updateParam, updateBody);
      var resUser = user;
      resUser.is_login = true;
      res.status(200).json(new _ResponseObject2.default(200, resUser));
    } else {
      var objJson = 'Wrong username! Please retry';
      res.status(200).json(new _ResponseObject2.default(200, objJson));
    }
  }).catch(function (e) {
    return next(e);
  });
}

function logout(req, res, next) {
  var param = req.body;
  var queryParam = { chat_name: param.chat_name };
  _User2.default.getOne(queryParam).then(function (user) {
    if (user) {
      var updateParam = { _id: user.id };
      var updateBody = { is_login: true };
      _User2.default.update(updateParam, updateBody);
      var resUser = user;
      resUser.is_login = false;
      res.status(200).json(new _ResponseObject2.default(200, resUser));
    } else {
      var objJson = 'No one to logut !!!';
      res.status(200).json(new _ResponseObject2.default(200, objJson));
    }
  }).catch(function (e) {
    return next(e);
  });
}

function getUnseenCount(req, res, next) {
  var queryParam = {
    chat_name: req.params.chatName
  };
  _User2.default.userUnseenCount(queryParam).then(function (count) {
    return res.status(200).json(new _ResponseObject2.default(200, count));
  }).catch(function (e) {
    return next(e);
  });
}

exports.default = {
  create: create,
  update: update,
  getAll: getAll,
  getById: getById,
  getByChatName: getByChatName,
  loadDashboard: loadDashboard,
  recentActivities: recentActivities,
  login: login,
  logout: logout,
  getUnseenCount: getUnseenCount
};
module.exports = exports['default'];
//# sourceMappingURL=User.js.map
