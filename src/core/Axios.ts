import {
  AxiosRequestConfig,
  AxiosPromise,
  Method,
  AxiosResponse,
  ResolvedFn,
  RejectedFn
} from '../types'
import dispatchRequest, { transformURL } from './dispatchRequest'
import InterceptorManger from '../core/interceptor'
import mergeConfig from './mergeConfig'

interface Interceptors {
  request: InterceptorManger<AxiosRequestConfig>
  response: InterceptorManger<AxiosResponse>
}

interface PromiseChain<T> {
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectedFn
}

/**
 * Axios请求类
 * 提供语法糖简化发起请求的配置
 */
export default class Axios {
  interceptors: Interceptors
  defaults: AxiosRequestConfig

  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig
    this.interceptors = {
      request: new InterceptorManger<AxiosRequestConfig>(),
      response: new InterceptorManger<AxiosResponse>()
    }
  }

  /**
   * 调用axios实例方法最终都是指向request方法，.get() & .post()只是语法糖的封装，加深易用性
   * request方法内部使用了函数重载的概念，使其支持传入一个参数，并在运行时做判断，对config参数进行封装
   *
   * @param url
   * @param config
   */
  request(url: any, config?: any): AxiosPromise {
    if (typeof url === 'string') {
      /**
       * Example: 单独传入一个 url
       * axios('api/request/url')
       */
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      /**
       * Example: 此时的 url 是一个对象
       * axios({
       *  url:'api/request/url',
       *  method: 'post'
       * })
       */
      config = url
    }

    config = mergeConfig(this.defaults, config)
    config.method = config.method.toLowerCase()

    /**
     * 初始化Axios拦截器的Promise链
     * @resolved 请求拦截器先添加的 后 执行，执行顺序与添加顺序是相反的
     * @rejected 响应拦截器先添加的 先 执行，按照添加顺序依次执行
     */
    const chain: PromiseChain<any>[] = [{ resolved: dispatchRequest, rejected: undefined }]

    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor)
    })

    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor)
    })

    let promise = Promise.resolve(config)

    while (chain.length) {
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }

    /**
     * Other
     * Example 1:
     * axios('api/request/url',{
     *  method: 'post',
     *  data: {
     *    msg:'hello axios'
     *  }
     * })
     *
     * Example 2:
     * axios.METHOD_NAME & request ('api/request/url',{
     *  method: 'post',
     *  data: {
     *    msg:'hello axios'
     *  }
     * })
     *
     */
    return promise
  }

  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('get', url, config)
  }

  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('delete', url, config)
  }

  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('head', url, config)
  }

  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('options', url, config)
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('post', url, data, config)
  }

  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('put', url, data, config)
  }

  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('patch', url, data, config)
  }

  getUri(config?: AxiosRequestConfig): string {
    config = mergeConfig(this.defaults, config)
    return transformURL(config)
  }

  _requestMethodWithoutData(method: Method, url: string, config?: AxiosRequestConfig) {
    return this.request(Object.assign(config || {}, { method, url }))
  }

  _requestMethodWithData(method: Method, url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request(Object.assign(config || {}, { method, url, data }))
  }
}
