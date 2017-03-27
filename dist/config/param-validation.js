'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  /** Companies Model */
  // Create company
  createCompany: {
    body: {
      name: _joi2.default.string().required()
    }
  },
  // Update company
  updateCompany: {
    body: {
      name: _joi2.default.string().required()
    },
    params: {
      _id: _joi2.default.string().hex().required()
    }
  },
  /** Users Model */
  // Create user
  createUser: {
    body: {
      _company_id: _joi2.default.string().required(),
      chat_name: _joi2.default.string().required(),
      full_name: _joi2.default.string().required(),
      avatar_url: _joi2.default.string().uri()
    }
  },
  // Update user
  updateUser: {
    body: {
      chat_name: _joi2.default.string().required(),
      full_name: _joi2.default.string().required(),
      avatar_url: _joi2.default.string().uri()
    },
    params: {
      _id: _joi2.default.string().hex().required()
    }
  },
  // POST /companies
  createRoom: {
    body: {
      _company_id: _joi2.default.string().hex().required(),
      name: _joi2.default.string().required(),
      creator: _joi2.default.string().hex().required()
    }
  }

};
module.exports = exports['default'];
//# sourceMappingURL=param-validation.js.map
