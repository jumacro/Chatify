import User from '../Models/User';
import ResponseObject from '../Helpers/ResponseObject';

class UserController {

  constructor() {
    this.Model = User;
  }

  create(req, res, next) {
    const params = req.body;

    this.Model.add(params)
              .then(savedUser => res.status(201).json(new ResponseObject(201, savedUser)))
              .catch(e => next(e));
  }

  getAll(req, res, next) {
    this.Model.get({})
          .then(users => res.status(200).json(new ResponseObject(200, users)))
          .catch(e => next(e));
  }
}

export default UserController;
