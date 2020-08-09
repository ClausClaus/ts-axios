"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = InterceptorManger;
//# sourceMappingURL=interceptor.js.map