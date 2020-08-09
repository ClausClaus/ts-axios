"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = transform;
//# sourceMappingURL=transform.js.map