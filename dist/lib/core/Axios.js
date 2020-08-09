"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dispatchRequest_1 = require("./dispatchRequest");
var interceptor_1 = require("../core/interceptor");
var mergeConfig_1 = require("./mergeConfig");
/**
 * Axios请求类
 * 提供语法糖简化发起请求的配置
 */
var Axios = /** @class */ (function () {
    function Axios(initConfig) {
        this.defaults = initConfig;
        this.interceptors = {
            request: new interceptor_1.default(),
            response: new interceptor_1.default()
        };
    }
    /**
     * 调用axios实例方法最终都是指向request方法，.get() & .post()只是语法糖的封装，加深易用性
     * request方法内部使用了函数重载的概念，使其支持传入一个参数，并在运行时做判断，对config参数进行封装
     *
     * @param url
     * @param config
     */
    Axios.prototype.request = function (url, config) {
        if (typeof url === 'string') {
            /**
             * Example: 单独传入一个 url
             * axios('api/request/url')
             */
            if (!config) {
                config = {};
            }
            config.url = url;
        }
        else {
            /**
             * Example: 此时的 url 是一个对象
             * axios({
             *  url:'api/request/url',
             *  method: 'post'
             * })
             */
            config = url;
        }
        config = mergeConfig_1.default(this.defaults, config);
        config.method = config.method.toLowerCase();
        /**
         * 初始化Axios拦截器的Promise链
         * @resolved 请求拦截器先添加的 后 执行，执行顺序与添加顺序是相反的
         * @rejected 响应拦截器先添加的 先 执行，按照添加顺序依次执行
         */
        var chain = [{ resolved: dispatchRequest_1.default, rejected: undefined }];
        this.interceptors.request.forEach(function (interceptor) {
            chain.unshift(interceptor);
        });
        this.interceptors.response.forEach(function (interceptor) {
            chain.push(interceptor);
        });
        var promise = Promise.resolve(config);
        while (chain.length) {
            var _a = chain.shift(), resolved = _a.resolved, rejected = _a.rejected;
            promise = promise.then(resolved, rejected);
        }
        /**
         * Other
         * Example 1:
         * axios('api/request/url',{
         *  method: 'post',
         *  data: {
         *    msg:'hello axios'
         *  }
         * })
         *
         * Example 2:
         * axios.METHOD_NAME & request ('api/request/url',{
         *  method: 'post',
         *  data: {
         *    msg:'hello axios'
         *  }
         * })
         *
         */
        return promise;
    };
    Axios.prototype.get = function (url, config) {
        return this._requestMethodWithoutData('get', url, config);
    };
    Axios.prototype.delete = function (url, config) {
        return this._requestMethodWithoutData('delete', url, config);
    };
    Axios.prototype.head = function (url, config) {
        return this._requestMethodWithoutData('head', url, config);
    };
    Axios.prototype.options = function (url, config) {
        return this._requestMethodWithoutData('options', url, config);
    };
    Axios.prototype.post = function (url, data, config) {
        return this._requestMethodWithData('post', url, data, config);
    };
    Axios.prototype.put = function (url, data, config) {
        return this._requestMethodWithData('put', url, data, config);
    };
    Axios.prototype.patch = function (url, data, config) {
        return this._requestMethodWithData('patch', url, data, config);
    };
    Axios.prototype.getUri = function (config) {
        config = mergeConfig_1.default(this.defaults, config);
        return dispatchRequest_1.transformURL(config);
    };
    Axios.prototype._requestMethodWithoutData = function (method, url, config) {
        return this.request(Object.assign(config || {}, { method: method, url: url }));
    };
    Axios.prototype._requestMethodWithData = function (method, url, data, config) {
        return this.request(Object.assign(config || {}, { method: method, url: url, data: data }));
    };
    return Axios;
}());
exports.default = Axios;
//# sourceMappingURL=Axios.js.map