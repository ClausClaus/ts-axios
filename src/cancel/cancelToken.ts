import { CancelTokenSource, Canceler } from '../types'
import { CancelExecutor } from '../types'
import Cancel from './cancel'

interface ResolvePromise {
  (reason?: Cancel): void
}

/**
 * CancelToken类是以axios实例扩展方法的方式挂载到axios上的
 */
export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise
    this.promise = new Promise<Cancel>(resolve => {
      resolvePromise = resolve
    })
    // 立即执行函数
    executor(message => {
      if (this.reason) {
        return
      }
      // reason 参数的值是Cancel函数的实例，后续就可以通过axios.isCancel(this.reason)方法判断reason是不是一个Cancel类型的错误了
      this.reason = new Cancel(message)
      resolvePromise(this.reason)
    })
  }
  throwIfRequest() {
    if (this.reason) {
      throw this.reason
    }
  }
  // CancelToken的工厂方法
  static source(): CancelTokenSource {
    let cancel!: Canceler
    const token = new CancelToken(c => {
      cancel = c
    })

    return { cancel, token }
  }
}
