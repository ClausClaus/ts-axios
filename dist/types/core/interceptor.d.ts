import { ResolvedFn, RejectedFn } from '../types';
interface Interceptor<T> {
    resolved: ResolvedFn<T>;
    rejected?: RejectedFn;
}
/**
 * InterceptorManger拦截器管理类
 *
 * @property interceptors 维护一个拦截器对象的数组，为每一个拦截器设置一个唯一标识符，以供eject卸载拦截器使用
 *
 */
export default class InterceptorManger<T> {
    private interceptors;
    constructor();
    use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number;
    /**
     * 遍历拦截器数组进行操作
     * @param fn 接收一个函数参数
     */
    forEach(fn: (interceptor: Interceptor<T>) => void): void;
    eject(id: number): void;
}
export {};
