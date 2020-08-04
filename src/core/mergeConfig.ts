import { AxiosRequestConfig } from '../types'
import { isPlainObject, deepMerge } from '../helpers/util'

/**
 * 默认合并策略，优先取val2的值
 * @param val1 config1[key]
 * @param val2 config2[key]
 */
function defaultStrat(val1: any, val2: any): any {
  return val2 !== undefined ? val2 : val1
}

/**
 * 只取val2的值
 * @param val1 config1[key]
 * @param val2 config2[key2]
 */
function fromVal2strat(val1: any, val2: any): any {
  if (typeof val2 !== undefined) {
    return val2
  }
}

// 策略函数的map对象
const strats = Object.create(null)

/**
 * 这三个配置应该是跟请求息息相关的，它是用户自定义去传的，而不能在默认配置里定义
 * 值是应该在默认配置中定义，比如直接通过 axios.defaults. [url || params || data]
 * 但是实际上没有任何意义，因为它不是一个请求的默认值
 * 对于这类请求配置，只取 配置2 中的
 * 所以 stratKeysFromVal2 中定义的配置名称应该指向 fromVal2strat 策略函数
 *
 * 另外一种像 headers 对象，需要做一层deepMerge，而不是conf2 替换 conf1
 */
const stratKeysFromVal2 = ['url', 'params', 'data']
stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2strat
})

/**
 * 深度拷贝
 */
const startKeysDeepMerge = ['headers', 'auth']
startKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})

function deepMergeStrat(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else {
    return val1
  }
}

export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  if (!config2) {
    config2 = {} as AxiosRequestConfig
  }
  const config = Object.create(null)

  for (const key in config2) {
    mergeField(key)
  }

  for (const key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }

  function mergeField(key: string): void {
    // 通过key找到对应的合并策略函数，JS 策略模式的一个应用
    const strat = strats[key] || defaultStrat
    // 调用策略函数拿到返回结果，并赋值给config对象
    config[key] = strat(config1[key], config2![key])
  }
  return config
}
