'use strict';
const Service = require('egg').Service;
let list = []
class LogsService extends Service {
  async list() {
    return list;
  }
  async modify(param) {
    list.forEach((ele, i) => {
      if (ele.id === param.id) {
        list[i] = param
      }
    })
  }
  async save(data) {
    list.push(data)
    return list
  }
  async remove(id) {
    var index = -1
    list.forEach((ele, i) => {
      if (ele.id === id) {
        index = i
      }
    })
    list.splice(index, 1)

  }

}

module.exports = LogsService;