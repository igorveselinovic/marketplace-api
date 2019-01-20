'user strict';

class Route {
  constructor(method, path) {
    this.method = method;
    this.path = path;

    if (path.startsWith('/')) {
      path = path.slice(1);
    }

    if (path.endsWith('/')) {
      path = path.slice(0, -1);
    }

    this.pathSegments = path.split('/');
  }

  validateRequest(requestMethod, requestPathSegments) {
    if (requestMethod !== this.method || this.pathSegments.length !== requestPathSegments.length) {
      return false;
    }

    for (let i = 0; i < this.pathSegments.length; i++) {
      if ((this.pathSegments[i] !== '*' && this.pathSegments[i] !== requestPathSegments[i])
          || requestPathSegments[i].length === 0) {
        return false;
      }
    }

    return true;
  }
}

module.exports = Route;
