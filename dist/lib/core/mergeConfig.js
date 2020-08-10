"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../helpers/util");
/**
 * 默认合并策略，优先取val2的值
 * @param val1 config1[key]
 * @param val2 config2[key]
 */
function defaultStrat(val1, val2) {
    return val2 !== undefined ? val2 : val1;
}
/**
 * 只取val2的值
 * @param val1 config1[key]
 * @param val2 config2[key2]
 */
function fromVal2strat(val1, val2) {
    // tslint:disable-next-line:strict-type-predicates
    if (typeof val2 !== undefined) {
        return val2;
    }
}
// 策略函数的map对象
var strats = Object.create(null);
/**
 * 这三个配置应该是跟请求息息相关的，它是用户自定义去传的，而不能在默认配置里定义
 * 值是应该在默认配置中定义，比如直接通过 axios.defaults. [url || params || data]
 * 但是实际上没有任何意义，因为它不是一个请求的默认值
 * 对于这类请求配置，只取 配置2 中的
 * 所以 stratKeysFromVal2 中定义的配置名称应该指向 fromVal2strat 策略函数
 *
 * 另外一种像 headers 对象，需要做一层deepMerge，而不是conf2 替换 conf1
 */
var stratKeysFromVal2 = ['url', 'params', 'data'];
stratKeysFromVal2.forEach(function (key) {
    strats[key] = fromVal2strat;
});
/**
 * 深度拷贝
 */
var startKeysDeepMerge = ['headers', 'auth'];
startKeysDeepMerge.forEach(function (key) {
    strats[key] = deepMergeStrat;
});
function deepMergeStrat(val1, val2) {
    if (util_1.isPlainObject(val2)) {
        return util_1.deepMerge(val1, val2);
        // tslint:disable-next-line:strict-type-predicates
    }
    else if (typeof val2 !== 'undefined') {
        return val2;
    }
    else if (util_1.isPlainObject(val1)) {
        return util_1.deepMerge(val1);
    }
    else {
        return val1;
    }
}
function mergeConfig(config1, config2) {
    if (!config2) {
        config2 = {};
    }
    var config = Object.create(null);
    for (var key in config2) {
        mergeField(key);
    }
    for (var key in config1) {
        if (!config2[key]) {
            mergeField(key);
        }
    }
    function mergeField(key) {
        // 通过key找到对应的合并策略函数，JS 策略模式的一个应用
        var strat = strats[key] || defaultStrat;
        // 调用策略函数拿到返回结果，并赋值给config对象
        config[key] = strat(config1[key], config2[key]);
    }
    return config;
}
exports.default = mergeConfig;
//# sourceMappingURL=mergeConfig.js.map