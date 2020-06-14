import { ResolvedFn, RejectedFn } from '../types'

interface Interceptor<T> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}

/**
 * InterceptorManger拦截器管理类
 *
 * @property interceptors 维护一个拦截器对象的数组，为每一个拦截器设置一个唯一标识符，以供eject卸载拦截器使用
 *
 */
export default class InterceptorManger<T> {
  private interceptors: Array<Interceptor<T> | null>
  constructor() {
    this.interceptors = []
  }

  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
    this.interceptors.push({
      resolved,
      rejected
    })
    return this.interceptors.length - 1
  }

  /**
   * 遍历拦截器数组进行操作
   * @param fn 接收一个函数参数
   */
  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach(interceptor => {
      if (interceptor !== null) {
        fn(interceptor)
      }
    })
  }

  eject(id: number): void {
    // 为防止数组顺序混乱，导致获取的id变成可变的值，不直接从数组中删除对象，直接把指定下标位置设为 null 即可
    if (this.interceptors[id]) {
      this.interceptors[id] = null
    }
  }
}
