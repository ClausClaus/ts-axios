import { URLSearchParams } from 'url'

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
/**
 *
 * 判断是不是普通对象，因为formData,arrayBuffer这些类型的参数使用isObject判断都是一个对象
 * @export
 * @param {*} val
 * @returns {val is Object}
 */
export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

export function isFormData(val: any): val is FormData {
  return typeof val !== null && val instanceof window.FormData
}

export function isURLSearchParams(val: any): val is URLSearchParams {
  return typeof val !== 'undefined' && val instanceof window.URLSearchParams
}

/**
 * 使用TS的交叉类型，定义两个泛型，将from中的属性拷贝到to中，并使用类型断言确定数据类型
 * @param to
 * @param from
 */
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }

  return to as T & U
}

/**
 * 对象深拷贝
 * @param objs 被拷贝的多个对象
 */
export function deepMerge(...objs: any[]): any {
  const result = Object.create(null)

  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        // val可能又是一个对象，需要递归处理
        if (isPlainObject(val)) {
          // result[key]是否已经存在并且是一个对象，已存在并且是一个对象的话，把对象跟值一起作为被拷贝的一部分传入
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge(val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })

  return result
}
