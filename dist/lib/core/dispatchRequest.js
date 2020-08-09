"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformURL = void 0;
var xhr_1 = require("./xhr");
var url_1 = require("../helpers/url");
var header_1 = require("../helpers/header");
var transform_1 = require("./transform");
/**
 *
 * 发起请求处理函数，对请求配置与响应结果进行处理
 * @param {AxiosRequestConfig} config
 */
function dispatchRequest(config) {
    throwIfCancellationRequested(config);
    processConfig(config);
    return xhr_1.default(config).then(function (res) {
        return transformResponseData(res);
    }, function (e) {
        if (e && e.response) {
            e.response = transformResponseData(e.response);
        }
        return Promise.reject(e);
    });
}
exports.default = dispatchRequest;
/**
 *
 * processConfig函数是对config做处理的一个统筹函数，当中分布着处理config各个部分的其他函数
 *
 * @param {AxiosRequestConfig} config
 */
function processConfig(config) {
    config.url = transformURL(config);
    config.data = transform_1.default(config.data, config.headers, config.transformRequest);
    config.headers = header_1.flattenHeaders(config.headers, config.method);
}
/**
 *
 * 转换请求的Url
 * @param {AxiosRequestConfig} config
 * @returns {string}
 */
function transformURL(config) {
    var url = config.url, params = config.params, paramsSerializer = config.paramsSerializer, baseURL = config.baseURL;
    if (baseURL && !url_1.isAbsoluteURL(url)) {
        url = url_1.combineURL(baseURL, url);
    }
    return url_1.buildURL(url, params, paramsSerializer);
}
exports.transformURL = transformURL;
function transformResponseData(res) {
    res.data = transform_1.default(res.data, res.headers, res.config.transformResponse);
    return res;
}
function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
        config.cancelToken.throwIfRequest();
    }
}
//# sourceMappingURL=dispatchRequest.js.map