'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _env = require('./config/env');

var _env2 = _interopRequireDefault(_env);

var _express = require('./config/express');

var _express2 = _interopRequireDefault(_express);

var _IO = require('./server/Plugins/IO');

var _IO2 = _interopRequireDefault(_IO);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('easyappchat-server:index');

var port = process.env.PORT || _env2.default.port;
var env = process.env || _env2.default.env;

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
_mongoose2.default.Promise = Promise;
// connect to mongo db
_mongoose2.default.connect(_env2.default.db, { server: { socketOptions: { keepAlive: 1 } } });
_mongoose2.default.connection.on('error', function () {
  throw new Error('unable to connect to database: ' + _env2.default.db);
});

// print mongoose logs in dev env
if (_env2.default.MONGOOSE_DEBUG) {
  _mongoose2.default.set('debug', function (collectionName, method, query, doc) {
    debug(collectionName + '.' + method, _util2.default.inspect(query, false, 20), doc);
  });
}

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  // listen on port port
  var server = _express2.default.listen(port, function () {
    debug('server started on port ' + port + ' (' + env + ')');
  });
  _IO2.default.boot(server, function () {
    debug('socket server started on port ' + port + ' (' + env + ')');
  });
}

// export default app;
//# sourceMappingURL=app.js.map
