const md5 = require("md5");

class Request {
  constructor(path, fields, handler) {
    this.path = path;
    this.response = fields;
    this.handler = handler;
    this._subscribers = [];
  }

  rectify() {
    this._subscribers.forEach(async subscriber => {
      const response = await this.handler(subscriber.query);
      const hash = md5(JSON.stringify(response));
      if (subscriber.hash !== hash) {
        subscriber.hash = hash;
        subscriber.emit(response);
      }
    });
  }

  subscribe(observable) {
    this._subscribers.push(observable);
  }
}

module.exports = Request;
