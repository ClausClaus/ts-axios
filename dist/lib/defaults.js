"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var header_1 = require("./helpers/header");
var data_1 = require("./helpers/data");
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
            header_1.processHeaders(headers, data);
            return data_1.transformRequest(data);
        }
    ],
    transformResponse: [
        function (data) {
            return data_1.transformResponse(data);
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
exports.default = defaults;
//# sourceMappingURL=defaults.js.map