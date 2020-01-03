const Subscriber = require("./subscriber");
const { validIntegrity } = require("./utils");

class EventBus {
  constructor(io, store) {
    this.io = io;
    this.store = store;
    this.io.on("connection", this.connection.bind(this));
  }

  subscribe(client) {
    // TODO: callback represent socket.io emit callback
    return ({ path, query }, callback) => {
      console.log("subscribe", path);
      let error = false;
      const request = this.store.requests.find(
        request => request.path === path
      );
      if (request) {
        // Validate query shape with request shape
        const shape = request.shape;
        const error = validIntegrity(shape, query);
        console.log(error);
        if (error) return callback(error);
        const subscriber = new Subscriber(client, path, query);
        request.subscribe(subscriber);
      }
      callback(error);
    };
  }

  connection(client) {
    console.log("nuevo cliente contectado");
    client.on("subscribe", this.subscribe(client));
  }
}

module.exports = EventBus;
