import { AxiosRequestConfig } from './types/index'
import { AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaults from './defaults'
import mergeConfig from './core/mergeConfig'
import CancelToken from './cancel/cancelToken'
import Cancel, { isCancel } from './cancel/cancel'

/**
 * 实例化axios请求实例，并将Axios类的公共方法继承过来
 *
 * 因为axios接口跟axios上的request接口接收的参数是一样的，所以直接将axios原型上的request方法赋值给instance变量
 * 这里的instance首先是一个函数，可直接这样使用 instance(AxiosRequestConfig接口定义的配置) 发起请求
 * 使用extend方法将axios实例原型上的方法拷贝一份到instance上，实现axios工厂函数的创建
 */
function createInstance(config: AxiosRequestConfig): AxiosStatic {
  // 1.创建axios实例对象
  const context = new Axios(config)

  // 2. 直接将Axios类上的request方法赋值给一个普通变量
  const instance = Axios.prototype.request.bind(context)

  // 3. 调用extend方法将Axios实例原型上的方法拷贝给instance方法
  extend(instance, context)

  return instance as AxiosStatic
}

const axios = createInstance(defaults)

// 扩展axios实例的属性跟方法
axios.create = function create(config) {
  return createInstance(mergeConfig(defaults, config))
}

axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel

axios.all = function all(promises) {
  return Promise.all(promises)
}

axios.spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr)
  }
}

axios.Axios = Axios

export default axios
