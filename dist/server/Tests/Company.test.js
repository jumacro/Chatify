'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _app = require('../../app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.config.includeStack = true;

/**
 * root level hooks
 */
after(function (done) {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  _mongoose2.default.models = {};
  _mongoose2.default.modelSchemas = {};
  _mongoose2.default.connection.close();
  done();
});

describe('## Company APIs', function () {
  var company = {
    name: 'Company A'
  };

  describe('# POST /v1.0/companies', function () {
    it('should create a new company', function (done) {
      (0, _supertest2.default)(_app2.default).post('/v1.0/companies').send(company).expect(_httpStatus2.default.OK).then(function (res) {
        (0, _chai.expect)(res.body.name).to.equal(company.name);
        company = res.body;
        done();
      }).catch(done);
    });
  });

  describe('# GET /v1.0/companies/:company_id', function () {
    it('should get company details', function (done) {
      (0, _supertest2.default)(_app2.default).get('/v1.0/companies/' + company._id).expect(_httpStatus2.default.OK).then(function (res) {
        (0, _chai.expect)(res.body.name).to.equal(company.name);
        done();
      }).catch(done);
    });

    it('should report error with message - Not found, when company does not exists', function (done) {
      (0, _supertest2.default)(_app2.default).get('/v1.0/companies/56c787ccc67fc16ccc1a5e92').expect(_httpStatus2.default.NOT_FOUND).then(function (res) {
        (0, _chai.expect)(res.body.message).to.equal('Not Found');
        done();
      }).catch(done);
    });
  });

  describe('# PUT /v1.0/companies/:company_id', function () {
    it('should update company details', function (done) {
      company.name = 'Company A1';
      // console.log(company._id);
      (0, _supertest2.default)(_app2.default).put('/v1.0/companies/' + company._id).send(company).expect(_httpStatus2.default.OK).then(function (res) {
        (0, _chai.expect)(res.body.name).to.equal('Company A1');
        done();
      }).catch(done);
    });
  });

  describe('# GET /v1.0/companies/', function () {
    it('should get all companies', function (done) {
      (0, _supertest2.default)(_app2.default).get('/v1.0/companies').expect(_httpStatus2.default.OK).then(function (res) {
        (0, _chai.expect)(res.body).to.be.an('array');
        done();
      }).catch(done);
    });
  });
});
//# sourceMappingURL=Company.test.js.map
