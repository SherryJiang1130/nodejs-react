'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('list()', () => {
  it('should get array', async () => {
    const ctx = app.mockContext();
    const newsList = await ctx.service.news.list(1);
    assert(newsList);
    assert(Object.prototype.toString.call(newsList) === '[object Array]');
  });
});
