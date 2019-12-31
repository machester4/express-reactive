const md5 = require("md5");

class Observer {
  constructor(client, path, query) {
    this.client = client;
    this.path = path;
    this.query = query;
    this.hash = md5(JSON.stringify(this.query));
  }

  emit(result) {
    // send new query result
    // Notify to client using event bus
    console.log("emit", result);
    this.client.emit(this.path, result);
  }
}

module.exports = Observer;
