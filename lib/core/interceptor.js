class Interceptor {
  constructor(app, store) {
    this.app = app;
    this.store = store;
  }

  onDelegate(handler) {
    return async (req, res) => {
      const query = req.params;
      const response = await handler(query);
      res.json(response);
    };
  }

  onIntercept(handler) {
    return async (req, res) => {
      // TODO: validate query types and structure
      // Call mutator handler
      const data = req.body;
      const response = await handler(data);
      this.store.hidrate();
      res.json(response);
    };
  }

  delegate(path, query) {
    const { handler } = query;
    this.app.get(path, this.onDelegate(handler));
  }

  intercept(path, mutator) {
    const { handler, method } = mutator;
    console.log(method);
    switch (method.toLowerCase()) {
      case "post":
        this.app.post(path, this.onIntercept(handler));
        break;
      case "put":
        this.app.put(path, this.onIntercept(handler));
        break;
      case "path":
        this.app.path(path, this.onIntercept(handler));
        break;
      case "delete":
        this.app.delete(path, this.onIntercept(handler));
        break;
      default:
        break;
    }
  }
}

module.exports = Interceptor;
