"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformResponse = exports.transformRequest = void 0;
var util_1 = require("./util");
/**
 *
 * 转换发送给后端的请求参数
 * @param {AxiosRequestConfig} config
 * @returns {*}
 */
function transformRequest(data) {
    if (util_1.isPlainObject(data)) {
        return JSON.stringify(data);
    }
    return data;
}
exports.transformRequest = transformRequest;
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
exports.transformResponse = transformResponse;
//# sourceMappingURL=data.js.map