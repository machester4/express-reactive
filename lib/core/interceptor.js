const { validIntegrity, isEmty } = require("./utils");

class Interceptor {
  constructor(app, store) {
    this._app = app;
    this._store = store;
  }

  onDelegate(handler) {
    return async (req, res) => {
      const query = isEmty(req.params) ? req.body : req.params;
      console.log(query);

      // Validate request data consistency with shape
      const shape = this._store.request(req.originalUrl).shape;
      const error = validIntegrity(shape, query);
      if (!!error) return res.status(400).json({ error });

      // Call query handler
      const response = await handler(query);
      res.json(response);
    };
  }

  onIntercept(handler) {
    return async (req, res) => {
      const data = isEmty(req.body);
      if (data) {
        res.status(500).end();
        throw new Error(
          "it is necessary that your application express use middleware express.json or body-parser."
        );
      }

      // Validate request data consistency with shape
      const shape = this._store.request(req.originalUrl).shape;
      const error = validIntegrity(shape, data);
      if (!!error) return res.status(400).json({ error });

      // Call mutator handler
      const response = await handler(data);
      this._store.hydrate();
      res.json(response);
    };
  }

  delegate(path, query) {
    const { handler } = query;
    this._app.get(path, this.onDelegate(handler));
  }

  intercept(path, mutator) {
    const { handler, method } = mutator;
    console.log(method);
    switch (method.toLowerCase()) {
      case "post":
        this._app.post(path, this.onIntercept(handler));
        break;
      case "put":
        this._app.put(path, this.onIntercept(handler));
        break;
      case "path":
        this._app.path(path, this.onIntercept(handler));
        break;
      case "delete":
        this._app.delete(path, this.onIntercept(handler));
        break;
      default:
        throw new Error(`Invalid method ${method}`);
        break;
    }
  }
}

module.exports = Interceptor;
