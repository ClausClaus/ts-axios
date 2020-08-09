"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combineURL = exports.isAbsoluteURL = exports.isURLSameOrigin = exports.buildURL = void 0;
var util_1 = require("./util");
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
    else if (util_1.isURLSearchParams(params)) {
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
                if (util_1.isDate(val)) {
                    val = val.toISOString();
                }
                else if (util_1.isPlainObject(val)) {
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
exports.buildURL = buildURL;
/**
 * 是否是同源请求的判断函数
 * @param requestURL url链接
 */
function isURLSameOrigin(requestURL) {
    var parsedOrigin = resolveURL(requestURL);
    return (parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host);
}
exports.isURLSameOrigin = isURLSameOrigin;
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
exports.isAbsoluteURL = isAbsoluteURL;
function combineURL(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL;
}
exports.combineURL = combineURL;
//# sourceMappingURL=url.js.map