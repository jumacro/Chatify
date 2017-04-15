import express from 'express';
import userRoutes from './User';
import ResponseObject from '../Helpers/ResponseObject';

const router = express.Router();

/** GET /welcome - Welcome to EasyApp Chat API */
router.get('/welcome', (req, res) =>
  res.status(200).json(new ResponseObject(200, { message: 'Welcome to EasyApp Chat API' }))
);
router.get('/unauthorized', (req, res) =>
  res.status(401).json(new ResponseObject(200, { message: 'Invalid Request' }))
);
// mount user routes at /users
router.use('/users', userRoutes);


export default router;
