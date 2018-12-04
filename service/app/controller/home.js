'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
  console.log('请求home')
    this.ctx.body = 'hi, egg';
  }
}

module.exports = HomeController;
