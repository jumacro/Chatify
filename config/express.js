import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import httpStatus from 'http-status';
import passport from 'passport';
import helmet from 'helmet';
import routes from '../server/Routes/index';
import envConfig from '../env';
import apiConfig from '../config/config';
import APIError from '../server/Helpers/APIError';
import ResponseObject from '../server/Helpers/ResponseObject';

const app = express();

const debug = require('debug')('chatify-server:index');

if (envConfig.env === 'development') {
  app.use(logger('dev'));
}

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());
// initializing passport
app.use(passport.initialize());

// enable CORS - Cross Origin Resource Sharing
// app.use(cors());

app.use(cors({
  origin: true,
  methods: 'GET, POST, OPTIONS, PUT, DELETE, PATCH',
  allowedHeaders: 'Origin, Content-Type, Accept, Authorization, X-Request-With, Content-Range, Content-Disposition, Content-Description',
  credentials: true,

}));

app.use(express.static('public'));

// mount all routes on /v1.0 path
app.use(`/${apiConfig.apiVersion}`, routes);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});

// error handler, send stacktrace only during development
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (envConfig.env === 'development') {
    debug(err.stack);
  }
  res.status(err.status).json(new ResponseObject(err.status, err.message));
});

export default app;
