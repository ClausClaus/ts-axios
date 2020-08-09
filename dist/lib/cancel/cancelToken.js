"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cancel_1 = require("./cancel");
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
            _this.reason = new cancel_1.default(message);
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
exports.default = CancelToken;
//# sourceMappingURL=cancelToken.js.map