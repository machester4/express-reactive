class Store {
  constructor() {
    this.requests = [];
  }

  request(path) {
    return this.requests.find(req => req.path === path);
  }

  hydrate(path) {
    const requests = this.requests.filter(req => req.path !== path);
    requests.forEach(req => req.rectify());
  }

  append(request) {
    this.requests.push(request);
  }
}

module.exports = Store;
