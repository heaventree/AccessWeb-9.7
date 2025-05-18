
module.exports = {
  rest: {
    defaultLimit: 25,
    maxLimit: 100,
  },
  admin: {
    auth: {
      secret: process.env.ADMIN_JWT_SECRET,
    },
  },
  url: process.env.PUBLIC_URL || 'http://localhost:1337',
  app: {
    keys: ['defaultKey1', 'defaultKey2'],
  }
};
