'use strict';

/**
 * Class for managing API enpoints/paths
 */
class Route {
  /**
   * Initialize the API route
   * @param {string} method - HTTP method
   * @param {string} path - URL path
   */
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

  /**
   * Validate that an HTTP request should trigger this API endpoint
   * @param {string} requestMethod - HTTP method of a request
   * @param {object} requestPathSegments - List of segments making up a URL path from a request
   * @return {boolean} - True if this endpoint is triggered, false if not
   */
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
