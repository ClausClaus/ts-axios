import { AxiosRequestConfig } from './types'
import xhr from './xhr'
import { buildURL } from './helpers/url'
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
}
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url, params)
}

export default axios
