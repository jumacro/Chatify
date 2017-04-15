import express from 'express';
// import validate from 'express-validation';
// import paramValidation from '../../config/param-validation';
import User from '../Controllers/User';
// import Auth from '../Helpers/Auth';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
      /** GET /v1.0/users - Get all users */
      .get(User.getAll)

      /** POST /v1.0/users - Create user */
      .post(User.create);




export default router;
