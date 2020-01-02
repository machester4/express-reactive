const md5 = require("md5");

class Request {
  constructor(path, shape, handler) {
    this.path = path;
    this.shape = shape;
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

  subscribe(subscriber) {
    this._subscribers.push(subscriber);
  }
}

module.exports = Request;
