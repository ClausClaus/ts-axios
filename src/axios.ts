import { AxiosInstance } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'

/**
 * 实例化axios请求实例，并将Axios类的公共方法继承过来
 *
 * 因为axios接口跟axios上的request接口接收的参数是一样的，所以直接将axios原型上的request方法赋值给instance变量
 * 这里的instance首先是一个函数，可直接这样使用 instance(AxiosRequestConfig接口定义的配置) 发起请求
 * 使用extend方法将axios实例原型上的方法拷贝一份到instance上，实现axios工厂函数的创建
 */
function createInstance(): AxiosInstance {
  // 1.创建axios实例对象
  const context = new Axios()

  // 2. 直接将Axios类上的request方法赋值给一个普通变量
  const instance = Axios.prototype.request.bind(context)

  // 3. 调用extend方法将Axios实例原型上的方法拷贝给instance方法
  extend(instance, context)

  return instance as AxiosInstance
}

const axios = createInstance()

console.log('axios :>> ', axios)

export default axios
