/// <reference types="node" />
import { URLSearchParams } from 'url';
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
export declare function isDate(val: any): val is Date;
/**
 *
 * 对象类型
 * @export
 * @param {*} val
 * @returns {val is Object}
 */
export declare function isObject(val: any): val is Object;
/**
 *
 * 判断是不是普通对象，因为formData,arrayBuffer这些类型的参数使用isObject判断都是一个对象
 * @export
 * @param {*} val
 * @returns {val is Object}
 */
export declare function isPlainObject(val: any): val is Object;
export declare function isFormData(val: any): val is FormData;
export declare function isURLSearchParams(val: any): val is URLSearchParams;
/**
 * 使用TS的交叉类型，定义两个泛型，将from中的属性拷贝到to中，并使用类型断言确定数据类型
 * @param to
 * @param from
 */
export declare function extend<T, U>(to: T, from: U): T & U;
/**
 * 对象深拷贝
 * @param objs 被拷贝的多个对象
 */
export declare function deepMerge(...objs: any[]): any;
