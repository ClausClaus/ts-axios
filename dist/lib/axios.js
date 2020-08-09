"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Axios_1 = require("./core/Axios");
var util_1 = require("./helpers/util");
var defaults_1 = require("./defaults");
var mergeConfig_1 = require("./core/mergeConfig");
var cancelToken_1 = require("./cancel/cancelToken");
var cancel_1 = require("./cancel/cancel");
/**
 * 实例化axios请求实例，并将Axios类的公共方法继承过来
 *
 * 因为axios接口跟axios上的request接口接收的参数是一样的，所以直接将axios原型上的request方法赋值给instance变量
 * 这里的instance首先是一个函数，可直接这样使用 instance(AxiosRequestConfig接口定义的配置) 发起请求
 * 使用extend方法将axios实例原型上的方法拷贝一份到instance上，实现axios工厂函数的创建
 */
function createInstance(config) {
    // 1.创建axios实例对象
    var context = new Axios_1.default(config);
    // 2. 直接将Axios类上的request方法赋值给一个普通变量
    var instance = Axios_1.default.prototype.request.bind(context);
    // 3. 调用extend方法将Axios实例原型上的方法拷贝给instance方法
    util_1.extend(instance, context);
    return instance;
}
var axios = createInstance(defaults_1.default);
// 扩展axios实例的属性跟方法
axios.create = function create(config) {
    return createInstance(mergeConfig_1.default(defaults_1.default, config));
};
axios.CancelToken = cancelToken_1.default;
axios.Cancel = cancel_1.default;
axios.isCancel = cancel_1.isCancel;
axios.all = function all(promises) {
    return Promise.all(promises);
};
axios.spread = function spread(callback) {
    return function wrap(arr) {
        return callback.apply(null, arr);
    };
};
axios.Axios = Axios_1.default;
exports.default = axios;
//# sourceMappingURL=axios.js.map