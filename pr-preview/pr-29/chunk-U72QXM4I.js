import {
  HTTPService,
  WebSocketService
} from "./chunk-ZLGT6G56.js";
import {
  FBase,
  FUniver
} from "./chunk-JRQIBFK2.js";
import {
  Inject,
  Injector
} from "./chunk-M6CFAGRR.js";
import {
  __decorateClass,
  __decorateParam,
  __publicField
} from "./chunk-HECJ2TYE.js";

// ../packages/network/src/facade/f-network.ts
var FNetwork = class extends FBase {
  constructor(_injector, _httpService) {
    super();
    __publicField(this, "_injector", _injector);
    __publicField(this, "_httpService", _httpService);
  }
  /**
   * Send a GET request to the server.
   * @param {string} url - The requested URL.
   * @param {IRequestParams} [params] - Query parameters.
   * @returns {Promise<HTTPResponse>} Network response.
   */
  get(url, params) {
    return this._httpService.get(url, params);
    ;
  }
  /**
   * Send a POST request to the server.
   * @param {string} url - The requested URL.
   * @param {IPostRequestParams} [params] - Query parameters.
   * @returns {Promise<HTTPResponse>} Network response.
   */
  post(url, params) {
    return this._httpService.post(url, params);
    ;
  }
  /**
   * Send a PUT request to the server.
   * @param {string} url - The requested URL
   * @param {IPostRequestParams} [params] - Query parameters
   * @returns {Promise<HTTPResponse>} Network response
   */
  put(url, params) {
    return this._httpService.put(url, params);
    ;
  }
  /**
   * Send DELETE request to the server.
   * @param {string} url - The requested URL
   * @param {IRequestParams} [params] - Query parameters
   * @returns {Promise<HTTPResponse>} Network response
   */
  delete(url, params) {
    return this._httpService.delete(url, params);
    ;
  }
  /**
   * Send PATCH request to the server.
   * @param {string} url - The requested URL
   * @param {IPostRequestParams} [params] - Query parameters
   * @returns {Promise<HTTPResponse>} Network response
   */
  patch(url, params) {
    return this._httpService.patch(url, params);
  }
  /**
   * Request for a stream of server-sent events. Instead of a single response, the server sends a stream of responses,
   * Univer wraps the stream in an [`Observable`](https://rxjs.dev/guide/observable) which you can call `subscribe` on.
   * @param {HTTPRequestMethod} method - HTTP request method
   * @param {string} url - The requested URL
   * @param {IPostRequestParams} [params] - params Query parameters
   * @returns {Observable<HTTPEvent>} An observable that emits the network response.
   */
  getSSE(method, url, params) {
    return this._httpService.getSSE(method, url, params);
  }
};
FNetwork = __decorateClass([
  __decorateParam(0, Inject(Injector)),
  __decorateParam(1, Inject(HTTPService))
], FNetwork);

// ../packages/network/src/facade/f-univer.ts
var FUniverNetworkMixin = class extends FUniver {
  getNetwork() {
    return this._injector.createInstance(FNetwork);
  }
  createSocket(url) {
    const wsService = this._injector.createInstance(WebSocketService);
    const ws = wsService.createSocket(url);
    if (!ws) {
      throw new Error("[WebSocketService]: failed to create socket!");
    }
    return ws;
  }
};
FUniver.extend(FUniverNetworkMixin);
