"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenHeaders = exports.parseHeaders = exports.processHeaders = void 0;
var util_1 = require("./util");
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
    if (util_1.isPlainObject(data)) {
        if (headers && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json;charset=utf-8';
        }
    }
    return headers;
}
exports.processHeaders = processHeaders;
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
exports.parseHeaders = parseHeaders;
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
    headers = util_1.deepMerge(headers.common, headers[method], headers);
    var methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common'];
    methodsToDelete.forEach(function (method) {
        delete headers[method];
    });
    return headers;
}
exports.flattenHeaders = flattenHeaders;
//# sourceMappingURL=header.js.map