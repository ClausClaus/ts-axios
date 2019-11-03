// 判断数据类型
const toString = Object.prototype.toString

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
export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

/**
 *
 * 对象类型
 * @export
 * @param {*} val
 * @returns {val is Object}
 */
export function isObject(val: any): val is Object {
  return val !== null && typeof val === 'object'
}
