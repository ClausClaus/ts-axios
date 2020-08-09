"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var header_1 = require("../helpers/header");
var error_1 = require("../helpers/error");
var url_1 = require("../helpers/url");
var cookie_1 = require("../helpers/cookie");
var util_1 = require("../helpers/util");
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
        processHeaders();
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
                var responseHeaders = header_1.parseHeaders(request.getAllResponseHeaders());
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
                reject(error_1.createError('Network Error', config, null, request));
            };
            request.ontimeout = function handleTimeout() {
                reject(error_1.createError("Timeout of " + timeout + " ms exceeded", config, 'ECONNABORTED', request));
            };
            if (onDownloadProgress) {
                request.onprogress = onDownloadProgress;
            }
            if (onUploadProgress) {
                request.upload.onprogress = onUploadProgress;
            }
        }
        function processHeaders() {
            // 设置xsrf
            if ((withCredentials || url_1.isURLSameOrigin(url)) && xsrfCookieName) {
                var xsrfValue = cookie_1.default.read(xsrfCookieName);
                if (xsrfValue && xsrfHeaderName) {
                    headers[xsrfHeaderName] = xsrfValue;
                }
            }
            if (auth) {
                headers['Authorization'] = "Basic " + btoa(auth.username + ':' + auth.password);
            }
            if (util_1.isFormData(data)) {
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
                reject(error_1.createError("Request failed with status code " + status, config, null, response));
            }
        }
    });
}
exports.default = xhr;
//# sourceMappingURL=xhr.js.map