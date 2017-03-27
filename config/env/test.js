'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var testConfig = {
  env: 'test',
  db: 'mongodb://localhost:27017/chat-server-test',
  port: 3000,
  security: {
    encryptions: {
      encrypt_type: 'sha256',
      encrypt_key: '4b 8?((~FKnpD))>8kb!B |#-uXIO24G3rc:&MG+FR{x;r#Uq4k{Ef@F4E9^-qS!' },
    api: {
      appId: 'chat-server',
      appSecret: 'lDbIABCaFam58d!F5c#V1G6UEL69)Pds'
    },
    tokenLife: 3600
  },
  imageUrl: 'https://cdn.yourdomain.com/',
  stickerBaseURL: 'http://spika.chat',
  stickerAPI: 'http://spika.chat/api/v2/stickers/56e005b1695213295419f5df',
  apiVersion: 'v0.1'
};

exports.default = testConfig;
module.exports = exports['default'];
//# sourceMappingURL=test.js.map
