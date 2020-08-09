"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepMerge = exports.extend = exports.isURLSearchParams = exports.isFormData = exports.isPlainObject = exports.isObject = exports.isDate = void 0;
// 判断数据类型
var toString = Object.prototype.toString;
/**
 * val is xxx 是ts中的类型保护语法，将参数默认为某个数据类型，并拥有该类型的特性以及使用其相关方法
 */
/**
 *
 * 日期类型
 * @export
 * @param {*} val
 * @returns {val is Date}
 */
function isDate(val) {
    return toString.call(val) === '[object Date]';
}
exports.isDate = isDate;
/**
 *
 * 对象类型
 * @export
 * @param {*} val
 * @returns {val is Object}
 */
function isObject(val) {
    return val !== null && typeof val === 'object';
}
exports.isObject = isObject;
/**
 *
 * 判断是不是普通对象，因为formData,arrayBuffer这些类型的参数使用isObject判断都是一个对象
 * @export
 * @param {*} val
 * @returns {val is Object}
 */
function isPlainObject(val) {
    return toString.call(val) === '[object Object]';
}
exports.isPlainObject = isPlainObject;
function isFormData(val) {
    return typeof val !== null && val instanceof window.FormData;
}
exports.isFormData = isFormData;
function isURLSearchParams(val) {
    return typeof val !== 'undefined' && val instanceof window.URLSearchParams;
}
exports.isURLSearchParams = isURLSearchParams;
/**
 * 使用TS的交叉类型，定义两个泛型，将from中的属性拷贝到to中，并使用类型断言确定数据类型
 * @param to
 * @param from
 */
function extend(to, from) {
    for (var key in from) {
        ;
        to[key] = from[key];
    }
    return to;
}
exports.extend = extend;
/**
 * 对象深拷贝
 * @param objs 被拷贝的多个对象
 */
function deepMerge() {
    var objs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        objs[_i] = arguments[_i];
    }
    var result = Object.create(null);
    objs.forEach(function (obj) {
        if (obj) {
            Object.keys(obj).forEach(function (key) {
                var val = obj[key];
                // val可能又是一个对象，需要递归处理
                if (isPlainObject(val)) {
                    // result[key]是否已经存在并且是一个对象，已存在并且是一个对象的话，把对象跟值一起作为被拷贝的一部分传入
                    if (isPlainObject(result[key])) {
                        result[key] = deepMerge(result[key], val);
                    }
                    else {
                        result[key] = deepMerge(val);
                    }
                }
                else {
                    result[key] = val;
                }
            });
        }
    });
    return result;
}
exports.deepMerge = deepMerge;
//# sourceMappingURL=util.js.map