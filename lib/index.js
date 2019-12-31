const Store = require("./core/store");
const Interceptor = require("./core/interceptor");
const EventBus = require("./core/bus");
const Request = require("./core/request");

class LibSv {
  constructor(app, io) {
    this.app = app;
    this._socket = io;
    this._store = new Store();
    this._interceptor = new Interceptor(app, this._store);
    this._eventBus = new EventBus(this._socket, this._store);
  }

  append(path, query, mutator) {
    const { handler, ...fields } = query;
    const request = new Request(path, fields, handler);
    this._store.append(request);
    this._interceptor.intercept(path, mutator);
    this._interceptor.delegate(path, query);
  }
}

module.exports = LibSv;
