import mongoose from 'mongoose';
import util from 'util';
import envConfig from './env';
import app from './config/express';

import SocketIOServer from './server/SocketIO/IO';

const debug = require('debug')('chatify-server:index');

const port = process.env.PORT || envConfig.port;
const env = process.env || envConfig.env;

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;
// connect to mongo db
mongoose.connect(envConfig.db, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${envConfig.db}`);
});

// print mongoose logs in dev env
if (envConfig.MONGOOSE_DEBUG) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  // listen on port port
  const server = app.listen(port, () => {
    debug(`server started on port ${port} (${env})`);
  });
  SocketIOServer.boot(server, () => {
    debug(`socket server started on port ${port} (${env})`);
  });
}

// export default app;
