// 判断数据类型
var toString = Object.prototype.toString;
/**
 * val is xxx 是ts中的类型保护语法，将参数默认为某个数据类型，并拥有该类型的特性以及使用其相关方法
 */
/**
 *
 * 日期类型
 * @export
 * @param {*} val
 * @returns {val is Date}
 */
function isDate(val) {
    return toString.call(val) === '[object Date]';
}
/**
 *
 * 判断是不是普通对象，因为formData,arrayBuffer这些类型的参数使用isObject判断都是一个对象
 * @export
 * @param {*} val
 * @returns {val is Object}
 */
function isPlainObject(val) {
    return toString.call(val) === '[object Object]';
}
function isFormData(val) {
    return typeof val !== null && val instanceof window.FormData;
}
function isURLSearchParams(val) {
    return typeof val !== 'undefined' && val instanceof window.URLSearchParams;
}
/**
 * 使用TS的交叉类型，定义两个泛型，将from中的属性拷贝到to中，并使用类型断言确定数据类型
 * @param to
 * @param from
 */
function extend(to, from) {
    for (var key in from) {
        to[key] = from[key];
    }
    return to;
}
/**
 * 对象深拷贝
 * @param objs 被拷贝的多个对象
 */
function deepMerge() {
    var objs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        objs[_i] = arguments[_i];
    }
    var result = Object.create(null);
    objs.forEach(function (obj) {
        if (obj) {
            Object.keys(obj).forEach(function (key) {
                var val = obj[key];
                // val可能又是一个对象，需要递归处理
                if (isPlainObject(val)) {
                    // result[key]是否已经存在并且是一个对象，已存在并且是一个对象的话，把对象跟值一起作为被拷贝的一部分传入
                    if (isPlainObject(result[key])) {
                        result[key] = deepMerge(result[key], val);
                    }
                    else {
                        result[key] = deepMerge(val);
                    }
                }
                else {
                    result[key] = val;
                }
            });
        }
    });
    return result;
}

/**
 * 格式化header请求头参数
 * @param headers 请求头参数对象
 * @param normalizeName 要格式化的数据value名称
 */
function normalizeHeaderName(headers, normalizeName) {
    if (!headers) {
        return;
    }
    Object.keys(headers).forEach(function (name) {
        if (name !== normalizeName && name.toUpperCase() === normalizeName.toUpperCase()) {
            headers[normalizeName] = headers[name];
            delete headers[name];
        }
    });
}
/**
 * 设置默认的请求头 & 规范化请求头
 * 根据传递到后端的data来设置默认的请求头数据
 * @param headers 请求头参数对象
 * @param data 请求头数据
 */
function processHeaders(headers, data) {
    normalizeHeaderName(headers, 'Content-Type');
    if (isPlainObject(data)) {
        if (headers && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json;charset=utf-8';
        }
    }
    return headers;
}
/**
 * 格式化响应headers的数据，数据通过req.getAllResponseHeaders()方法得来
 * @param headers 以回车符与换行符分割的字符串
 * params example :
 * `
 *  date: Fri, 05 Apr 2019 12:40:49 GMT\r\n
 *  etag: W/"d-Ssxx4FRxEutDLwo2+xkkxKc4y0k"\r\n
 *  connection: keep-alive\r\n
 *  x-powered-by: Express\r\n
 *  content-length: 13\r\n
 *  content-type: application/json; charset=utf-8\r\n
 * `
 */
function parseHeaders(headers) {
    var parsed = Object.create(null);
    if (!headers) {
        return parsed;
    }
    headers.split('\r\n').forEach(function (line) {
        var _a = line.split(':'), key = _a[0], values = _a.slice(1);
        key = key.trim().toLowerCase();
        if (!key) {
            return;
        }
        var val = values.join(':').trim();
        parsed[key] = val;
    });
    return parsed;
}
/**
 * 在defaults对象中定义的默认配置是可以从 请求方法的维度 进行配置的，就是针对不同请求有各自的公共配置
 * 在不同请求方法下应该把此次请求所需要的header提取出来，其他的则删除掉
 * @param headers 请求的headers
 * @param method 请求的method
 */
function flattenHeaders(headers, method) {
    if (!headers) {
        return headers;
    }
    headers = deepMerge(headers.common, headers[method], headers);
    var methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common'];
    methodsToDelete.forEach(function (method) {
        delete headers[method];
    });
    return headers;
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var AxiosError = /** @class */ (function (_super) {
    __extends(AxiosError, _super);
    function AxiosError(message, config, code, request, response) {
        var _this = _super.call(this, message) || this;
        _this.config = config;
        _this.code = code;
        _this.request = request;
        _this.response = response;
        _this.isAxiosError = true;
        Object.setPrototypeOf(_this, AxiosError.prototype);
        return _this;
    }
    return AxiosError;
}(Error));
function createError(message, config, code, request, response) {
    var error = new AxiosError(message, config, code, request, response);
    return error;
}

/**
 *
 * 参数编码函数,对于特殊字符需要做一层替换处理
 * 对于字符 @、:、$、,、[、]、 是允许出现在 url 中的，不希望被 encode
 * @param {string} val
 * @returns {string}
 */
function encode(val) {
    return encodeURIComponent(val)
        .replace(/%40/g, '@')
        .replace(/%3A/gi, ':')
        .replace(/%24/g, '$')
        .replace(/%2C/gi, ',')
        .replace(/%20/g, '+')
        .replace(/%5B/gi, '[')
        .replace(/%5D/gi, ']');
}
/**
 *
 * 处理请求url参数
 * @export
 * @param {string} url
 * @param {*} [params]
 * @returns {string}
 */
function buildURL(url, params, paramsSerializer) {
    if (!params) {
        return url;
    }
    var serializeParams;
    if (paramsSerializer) {
        serializeParams = paramsSerializer(params);
    }
    else if (isURLSearchParams(params)) {
        serializeParams = params.toString();
    }
    else {
        var parts_1 = [];
        Object.keys(params).forEach(function (key) {
            var val = params[key];
            if (val === null || typeof val === 'undefined') {
                return;
            }
            var values = [];
            // 参数有可能是一个数组
            if (Array.isArray(val)) {
                values = val;
                key += '[]';
            }
            else {
                // 变成一个数组做统一处理
                values = [val];
            }
            values.forEach(function (val) {
                if (isDate(val)) {
                    val = val.toISOString();
                }
                else if (isPlainObject(val)) {
                    val = JSON.stringify(val);
                }
                parts_1.push(encode(key) + "=" + encode(val));
            });
        });
        serializeParams = parts_1.join('&');
    }
    if (serializeParams) {
        // 丢弃 url 中的哈希标记
        var markIndex = url.indexOf('#');
        if (markIndex !== -1) {
            url = url.slice(0, markIndex);
        }
        // 有可能url上已经带有参数了，判断条件就是看下是否含有问号,没有则加？，否则往现有url后面添加&
        url += (url.indexOf('?') === -1 ? '?' : '&') + serializeParams;
    }
    return url;
}
/**
 * 是否是同源请求的判断函数
 * @param requestURL url链接
 */
function isURLSameOrigin(requestURL) {
    var parsedOrigin = resolveURL(requestURL);
    return (parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host);
}
var currentOrigin = resolveURL(window.location.href);
function resolveURL(url) {
    var urlParsingNode = document.createElement('a');
    urlParsingNode.setAttribute('href', url);
    var protocol = urlParsingNode.protocol, host = urlParsingNode.host;
    return {
        protocol: protocol,
        host: host
    };
}
function isAbsoluteURL(url) {
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
}
function combineURL(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL;
}

var cookie = {
    read: function (name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return match ? decodeURIComponent(match[3]) : null;
    }
};

/**
 * 基于XMLHttpRequest对象封装请求函数
 * @param {AxiosRequestConfig} config 请求配置【包括请求参数，请求url，请求方式，请求头，响应类型，请求超时时间】
 */
function xhr(config) {
    return new Promise(function (resolve, reject) {
        var _a = config.data, data = _a === void 0 ? null : _a, url = config.url, method = config.method, _b = config.headers, headers = _b === void 0 ? {} : _b, responseType = config.responseType, timeout = config.timeout, cancelToken = config.cancelToken, withCredentials = config.withCredentials, xsrfCookieName = config.xsrfCookieName, xsrfHeaderName = config.xsrfHeaderName, onDownloadProgress = config.onDownloadProgress, onUploadProgress = config.onUploadProgress, auth = config.auth, validateStatus = config.validateStatus;
        var request = new XMLHttpRequest();
        request.open(method.toUpperCase(), url, true);
        configureRequest();
        addEvents();
        processHeaders$$1();
        processCancel();
        request.send(data);
        function configureRequest() {
            if (responseType) {
                request.responseType = responseType;
            }
            if (timeout) {
                request.timeout = timeout;
            }
            if (withCredentials) {
                request.withCredentials = withCredentials;
            }
        }
        function addEvents() {
            request.onreadystatechange = function handleLoad() {
                if (request.readyState !== 4) {
                    return;
                }
                if (request.status === 0) {
                    return;
                }
                var responseHeaders = parseHeaders(request.getAllResponseHeaders());
                var responseData = responseType && responseType !== 'text' ? request.response : request.responseText;
                var response = {
                    data: responseData,
                    status: request.status,
                    statusText: request.statusText,
                    headers: responseHeaders,
                    config: config,
                    request: request
                };
                handleResponse(response);
            };
            request.onerror = function handleError() {
                reject(createError('Network Error', config, null, request));
            };
            request.ontimeout = function handleTimeout() {
                reject(createError("Timeout of " + timeout + " ms exceeded", config, 'ECONNABORTED', request));
            };
            if (onDownloadProgress) {
                request.onprogress = onDownloadProgress;
            }
            if (onUploadProgress) {
                request.upload.onprogress = onUploadProgress;
            }
        }
        function processHeaders$$1() {
            // 设置xsrf
            if ((withCredentials || isURLSameOrigin(url)) && xsrfCookieName) {
                var xsrfValue = cookie.read(xsrfCookieName);
                if (xsrfValue && xsrfHeaderName) {
                    headers[xsrfHeaderName] = xsrfValue;
                }
            }
            if (auth) {
                headers['Authorization'] = "Basic " + btoa(auth.username + ':' + auth.password);
            }
            if (isFormData(data)) {
                delete headers['Content-Type'];
            }
            Object.keys(headers).forEach(function (name) {
                if (data === null && name.toLowerCase() === 'content-type') {
                    delete headers[name];
                }
                else {
                    request.setRequestHeader(name, headers[name]);
                }
            });
        }
        function processCancel() {
            if (cancelToken) {
                cancelToken.promise.then(function (reason) {
                    request.abort();
                    reject(reason);
                });
            }
        }
        function handleResponse(response) {
            var status = response.status;
            if (!validateStatus || validateStatus(status)) {
                resolve(response);
            }
            else {
                reject(createError("Request failed with status code " + status, config, null, response));
            }
        }
    });
}

function transform(data, headers, fns) {
    if (!fns) {
        return data;
    }
    if (!Array.isArray(fns)) {
        fns = [fns];
    }
    // 遍历转换数组，依次执行转换函数，拿到最后transform的data
    fns.forEach(function (fn) {
        data = fn(data, headers);
    });
    return data;
}

/**
 *
 * 发起请求处理函数，对请求配置与响应结果进行处理
 * @param {AxiosRequestConfig} config
 */
function dispatchRequest(config) {
    throwIfCancellationRequested(config);
    processConfig(config);
    return xhr(config).then(function (res) {
        return transformResponseData(res);
    }, function (e) {
        if (e && e.response) {
            e.response = transformResponseData(e.response);
        }
        return Promise.reject(e);
    });
}
/**
 *
 * processConfig函数是对config做处理的一个统筹函数，当中分布着处理config各个部分的其他函数
 *
 * @param {AxiosRequestConfig} config
 */
function processConfig(config) {
    config.url = transformURL(config);
    config.data = transform(config.data, config.headers, config.transformRequest);
    config.headers = flattenHeaders(config.headers, config.method);
}
/**
 *
 * 转换请求的Url
 * @param {AxiosRequestConfig} config
 * @returns {string}
 */
function transformURL(config) {
    var url = config.url, params = config.params, paramsSerializer = config.paramsSerializer, baseURL = config.baseURL;
    if (baseURL && !isAbsoluteURL(url)) {
        url = combineURL(baseURL, url);
    }
    return buildURL(url, params, paramsSerializer);
}
function transformResponseData(res) {
    res.data = transform(res.data, res.headers, res.config.transformResponse);
    return res;
}
function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
        config.cancelToken.throwIfRequest();
    }
}

/**
 * InterceptorManger拦截器管理类
 *
 * @property interceptors 维护一个拦截器对象的数组，为每一个拦截器设置一个唯一标识符，以供eject卸载拦截器使用
 *
 */
var InterceptorManger = /** @class */ (function () {
    function InterceptorManger() {
        this.interceptors = [];
    }
    InterceptorManger.prototype.use = function (resolved, rejected) {
        this.interceptors.push({
            resolved: resolved,
            rejected: rejected
        });
        return this.interceptors.length - 1;
    };
    /**
     * 遍历拦截器数组进行操作
     * @param fn 接收一个函数参数
     */
    InterceptorManger.prototype.forEach = function (fn) {
        this.interceptors.forEach(function (interceptor) {
            if (interceptor !== null) {
                fn(interceptor);
            }
        });
    };
    InterceptorManger.prototype.eject = function (id) {
        // 为防止数组顺序混乱，导致获取的id变成可变的值，不直接从数组中删除对象，直接把指定下标位置设为 null 即可
        if (this.interceptors[id]) {
            this.interceptors[id] = null;
        }
    };
    return InterceptorManger;
}());

/**
 * 默认合并策略，优先取val2的值
 * @param val1 config1[key]
 * @param val2 config2[key]
 */
function defaultStrat(val1, val2) {
    return val2 !== undefined ? val2 : val1;
}
/**
 * 只取val2的值
 * @param val1 config1[key]
 * @param val2 config2[key2]
 */
function fromVal2strat(val1, val2) {
    if (typeof val2 !== undefined) {
        return val2;
    }
}
// 策略函数的map对象
var strats = Object.create(null);
/**
 * 这三个配置应该是跟请求息息相关的，它是用户自定义去传的，而不能在默认配置里定义
 * 值是应该在默认配置中定义，比如直接通过 axios.defaults. [url || params || data]
 * 但是实际上没有任何意义，因为它不是一个请求的默认值
 * 对于这类请求配置，只取 配置2 中的
 * 所以 stratKeysFromVal2 中定义的配置名称应该指向 fromVal2strat 策略函数
 *
 * 另外一种像 headers 对象，需要做一层deepMerge，而不是conf2 替换 conf1
 */
var stratKeysFromVal2 = ['url', 'params', 'data'];
stratKeysFromVal2.forEach(function (key) {
    strats[key] = fromVal2strat;
});
/**
 * 深度拷贝
 */
var startKeysDeepMerge = ['headers', 'auth'];
startKeysDeepMerge.forEach(function (key) {
    strats[key] = deepMergeStrat;
});
function deepMergeStrat(val1, val2) {
    if (isPlainObject(val2)) {
        return deepMerge(val1, val2);
    }
    else if (typeof val2 !== 'undefined') {
        return val2;
    }
    else if (isPlainObject(val1)) {
        return deepMerge(val1);
    }
    else {
        return val1;
    }
}
function mergeConfig(config1, config2) {
    if (!config2) {
        config2 = {};
    }
    var config = Object.create(null);
    for (var key in config2) {
        mergeField(key);
    }
    for (var key in config1) {
        if (!config2[key]) {
            mergeField(key);
        }
    }
    function mergeField(key) {
        // 通过key找到对应的合并策略函数，JS 策略模式的一个应用
        var strat = strats[key] || defaultStrat;
        // 调用策略函数拿到返回结果，并赋值给config对象
        config[key] = strat(config1[key], config2[key]);
    }
    return config;
}

/**
 * Axios请求类
 * 提供语法糖简化发起请求的配置
 */
var Axios = /** @class */ (function () {
    function Axios(initConfig) {
        this.defaults = initConfig;
        this.interceptors = {
            request: new InterceptorManger(),
            response: new InterceptorManger()
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
        config = mergeConfig(this.defaults, config);
        config.method = config.method.toLowerCase();
        /**
         * 初始化Axios拦截器的Promise链
         * @resolved 请求拦截器先添加的 后 执行，执行顺序与添加顺序是相反的
         * @rejected 响应拦截器先添加的 先 执行，按照添加顺序依次执行
         */
        var chain = [{ resolved: dispatchRequest, rejected: undefined }];
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
        config = mergeConfig(this.defaults, config);
        return transformURL(config);
    };
    Axios.prototype._requestMethodWithoutData = function (method, url, config) {
        return this.request(Object.assign(config || {}, { method: method, url: url }));
    };
    Axios.prototype._requestMethodWithData = function (method, url, data, config) {
        return this.request(Object.assign(config || {}, { method: method, url: url, data: data }));
    };
    return Axios;
}());

/**
 *
 * 转换发送给后端的请求参数
 * @param {AxiosRequestConfig} config
 * @returns {*}
 */
function transformRequest(data) {
    if (isPlainObject(data)) {
        return JSON.stringify(data);
    }
    return data;
}
function transformResponse(data) {
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data);
        }
        catch (error) {
            // do nothing
        }
    }
    return data;
}

/**
 * Axios 默认配置
 */
var defaults = {
    method: 'get',
    timeout: 0,
    headers: {
        common: {
            Accept: 'application/json,text/plain, */*'
        }
    },
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    transformRequest: [
        function (data, headers) {
            processHeaders(headers, data);
            return transformRequest(data);
        }
    ],
    transformResponse: [
        function (data) {
            return transformResponse(data);
        }
    ],
    validateStatus: function (status) {
        return status >= 200 && status < 300;
    }
};
var methodNoData = ['delete', 'get', 'head', 'options'];
methodNoData.forEach(function (method) {
    defaults.headers[method] = {};
});
var methodWithData = ['post', 'put', 'patch'];
methodWithData.forEach(function (method) {
    defaults.headers[method] = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };
});

/**
 * Cancel类是以axios实例扩展方法的方式挂载到axios上的
 */
var Cancel = /** @class */ (function () {
    function Cancel(message) {
        this.message = message;
    }
    return Cancel;
}());
function isCancel(value) {
    return value instanceof Cancel;
}

/**
 * CancelToken类是以axios实例扩展方法的方式挂载到axios上的
 */
var CancelToken = /** @class */ (function () {
    function CancelToken(executor) {
        var _this = this;
        var resolvePromise;
        this.promise = new Promise(function (resolve) {
            resolvePromise = resolve;
        });
        // 立即执行函数
        executor(function (message) {
            if (_this.reason) {
                return;
            }
            // reason 参数的值是Cancel函数的实例，后续就可以通过axios.isCancel(this.reason)方法判断reason是不是一个Cancel类型的错误了
            _this.reason = new Cancel(message);
            resolvePromise(_this.reason);
        });
    }
    CancelToken.prototype.throwIfRequest = function () {
        if (this.reason) {
            throw this.reason;
        }
    };
    // CancelToken的工厂方法
    CancelToken.source = function () {
        var cancel;
        var token = new CancelToken(function (c) {
            cancel = c;
        });
        return { cancel: cancel, token: token };
    };
    return CancelToken;
}());

/**
 * 实例化axios请求实例，并将Axios类的公共方法继承过来
 *
 * 因为axios接口跟axios上的request接口接收的参数是一样的，所以直接将axios原型上的request方法赋值给instance变量
 * 这里的instance首先是一个函数，可直接这样使用 instance(AxiosRequestConfig接口定义的配置) 发起请求
 * 使用extend方法将axios实例原型上的方法拷贝一份到instance上，实现axios工厂函数的创建
 */
function createInstance(config) {
    // 1.创建axios实例对象
    var context = new Axios(config);
    // 2. 直接将Axios类上的request方法赋值给一个普通变量
    var instance = Axios.prototype.request.bind(context);
    // 3. 调用extend方法将Axios实例原型上的方法拷贝给instance方法
    extend(instance, context);
    return instance;
}
var axios = createInstance(defaults);
// 扩展axios实例的属性跟方法
axios.create = function create(config) {
    return createInstance(mergeConfig(defaults, config));
};
axios.CancelToken = CancelToken;
axios.Cancel = Cancel;
axios.isCancel = isCancel;
axios.all = function all(promises) {
    return Promise.all(promises);
};
axios.spread = function spread(callback) {
    return function wrap(arr) {
        return callback.apply(null, arr);
    };
};
axios.Axios = Axios;

export default axios;
//# sourceMappingURL=axios.es5.js.map
