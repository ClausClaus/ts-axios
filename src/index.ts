import { AxiosRequestConfig } from './types'
import xhr from './xhr'
import { buildURL } from './helpers/url'
import { transformRequest } from './helpers/data'
import { processHeaders } from './helpers/header'

/**
 *
 * axios请求函数
 * @param {AxiosRequestConfig} config
 */
function axios(config: AxiosRequestConfig): void {
  processConfig(config)
  xhr(config)
}

/**
 *
 * processConfig函数是对config做处理的一个统筹函数，当中分布着处理config各个部分的其他函数
 * @param {AxiosRequestConfig} config
 */
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.headers = transformRequestHeader(config)
  config.data = transformRequestData(config)
}

/**
 *
 * 转换请求的Url
 * @param {AxiosRequestConfig} config
 * @returns {string}
 */
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url, params)
}

/**
 *
 * 转换发送给后端的请求参数
 * @param {AxiosRequestConfig} config
 * @returns {*}
 */
function transformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}

/**
 * 转换发送给后端的请求头数据
 * @param config
 */
function transformRequestHeader(config: AxiosRequestConfig): string {
  const { headers = {}, data } = config
  // 根据传递到后端的data来设置默认的请求头数据
  return processHeaders(headers, data)
}

export default axios
