'use strict';

const Controller = require('egg').Controller;

class LogsController extends Controller {
  async index() {
    const {
      ctx
    } = this;
    const list = await ctx.service.logs.list();
    ctx.body = {
      'status': '获取',
      success: true,
      'list': list
    };
  }
  async create() {
    const {
      ctx
    } = this;
    const obj = ctx.request.body
    obj.id = new Date().getTime()
    const list = await ctx.service.logs.save(obj);
    ctx.body = {
      'status': '新增',
      'list': list,
      success: true,
    };
  }
  async update() {
    const {
      ctx
    } = this;
    const obj = ctx.request.body
    await ctx.service.logs.modify(obj);

    ctx.body = {
      'status': '修改',
      success: true,
    };
  }
  async destroy() {
    const {
      ctx
    } = this;
    const id = ctx.params.id
    await ctx.service.logs.remove(id);
    if (id) {
      ctx.body = {
        'status': '删除',
        success: true,
      };
    } else {
      ctx.body = {
        'status': '删除失败',
        success: false,
      };
    }

  }
}

module.exports = LogsController;