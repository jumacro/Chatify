const devConfig = {
  env: 'development',
  MONGOOSE_DEBUG: true,
  db: 'mongodb://localhost:27017/chatify',
  port: 3000,
  security: {
    encryptions: {
      encrypt_type: 'sha256',
      encrypt_key: '4b 8?((~FKnpD))>8kb!B |#-uXIO24G3rc:&MG+FR{x;r#Uq4k{Ef@F4E9^-qS!', //change hash key
    },
    api: {
      appId: 'chatify',
      appSecret: 'xAelTMZ!Fam59d@F9c#V1G9UEL17)Uyv',
    },
    tokenLife: 300 // in seconds i.e 5 mins
  },
  imageStore: 'http://img.test.com/',
  apiVersion: 'v0.1'
};

export default devConfig;
