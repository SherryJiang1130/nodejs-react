'use strict';

const { app } = require('egg-mock/bootstrap');

describe('test/app/controller/news.test.js', () => {
  it('should GET /news', () => {
    return app.httpRequest()
      .get('/news')
    //   .expect()
      .expect(200);
  });
});
