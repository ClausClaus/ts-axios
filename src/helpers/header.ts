import { isPlainObject } from './util'

/**
 * 格式化header请求头参数
 * @param headers 请求头参数对象
 * @param normalizeName 要格式化的数据value名称
 */
function normalizeHeaderName(headers: any, normalizeName: string): void {
  if (!headers) {
    return
  }
  Object.keys(headers).forEach(name => {
    if (name !== normalizeName && name.toUpperCase() === normalizeName.toUpperCase()) {
      headers[normalizeName] = headers[name]
      delete headers[name]
    }
  })
}

/**
 * 设置默认的请求头 & 规范化请求头
 * @param headers 请求头参数对象
 * @param data 请求头数据
 */
export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')
  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}

/**
 * 格式化响应headers的数据，数据通过req.getAllResponseHeaders()方法得来
 * @param headers 以回车符与换行符分割的字符串
 * params example :
 * `
 *  date: Fri, 05 Apr 2019 12:40:49 GMT\r\n
 *  etag: W/"d-Ssxx4FRxEutDLwo2+xkkxKc4y0k"\r\n
 *  connection: keep-alive\r\n
 *  x-powered-by: Express\r\n
 *  content-length: 13\r\n
 *  content-type: application/json; charset=utf-8\r\n
 * `
 */
export function parseHeaders(headers: string): any {
  let parsed = Object.create(null)
  if (!headers) {
    return parsed
  }

  headers.split('\r\n').forEach(line => {
    let [key, val] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }
    if (val) {
      val = val.trim()
    }
    parsed[key] = val
  })
  return parsed
}
