const Subscriber = require("./subscriber");

class EventBus {
  constructor(io, store) {
    this.io = io;
    this.store = store;
    this.io.on("connection", this.connection.bind(this));
  }

  subscribe(client) {
    return ({ path, query }) => {
      console.log("subscribe", path);
      const subscriber = new Subscriber(client, path, query);
      const request = this.store.requests.find(
        request => request.path === path
      );
      if (request) request.subscribe(subscriber);
      return !!request;
    };
  }

  connection(client) {
    console.log("nuevo cliente contectado");
    client.on("subscribe", this.subscribe(client));
  }
}

module.exports = EventBus;
