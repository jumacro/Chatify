import passport from 'passport';
import passportJwt from 'passport-jwt';
import apiConfig from '../../config/config';
import User from '../Models/User';

class Auth {

  constructor() {
    this.tokenKey = apiConfig.security.api.appSecret;
    this.extractJwt = passportJwt.ExtractJwt;
    this.jwtOptions = {
      jwtFromRequest: this.extractJwt.fromAuthHeader(),
      secretOrKey: this.tokenKey
    };
    this.JwtStrategy = passportJwt.Strategy;
    this.AuthStrategy = new this.JwtStrategy(this.jwtOptions, (jwtPayload, next) => {
      this.queryParam = {
        _id: jwtPayload.userId
      };
      User.getOne(this.queryParam)
          .then(res => next(null, res))
          .catch(err => next(err, false));
    });
    passport.use(this.AuthStrategy);
    // return Auth
    return passport.authenticate('jwt', { session: false });
  }

}

export default Auth;
