import { isDate, isObject } from './util'

/**
 *
 * 参数编码函数,对于特殊字符需要做一层替换处理
 * 对于字符 @、:、$、,、[、]、 是允许出现在 url 中的，不希望被 encode
 * @param {string} val
 * @returns {string}
 */
function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}
/**
 *
 * 处理请求url参数
 * @export
 * @param {string} url
 * @param {*} [params]
 * @returns {string}
 */
export function buildURL(url: string, params?: any): string {
  if (!params) {
    return url
  }
  const parts: string[] = []
  Object.keys(params).forEach(key => {
    const val = params[key]
    if (val === null || typeof val === 'undefined') {
      return
    }
    let values = []
    // 参数有可能是一个数组
    if (Array.isArray(val)) {
      values = val
      key += '[]'
    } else {
      // 变成一个数组做统一处理
      values = [val]
    }
    values.forEach(val => {
      if (isDate(val)) {
        val = val.toISOString()
      } else if (isObject(val)) {
        val = JSON.stringify(val)
      }
      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })

  let serializeParams = parts.join('&')
  if (serializeParams) {
    // 丢弃 url 中的哈希标记
    const markIndex = url.indexOf('#')
    if (markIndex) {
      url = url.slice(0, markIndex)
    }
    // 有可能url上已经带有参数了，判断条件就是看下是否含有问号,没有则加？，否则往现有url后面添加&
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializeParams
  }
  return url
}
