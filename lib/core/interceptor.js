const { validQuery } = require("./utils");

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
      const data = req.body;
      if (data === undefined) {
        res.status(500).end();
        throw new Error(
          "it is necessary that your application express use middleware express.json or body-parser."
        );
      }

      // Validate request body with shape
      const shape = this.store.request(req.originalUrl).shape;
      const error = validQuery(shape, data);
      if (!!error) return res.status(400).json({ error });

      // Call mutator handler
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
