import { AxiosRequestConfig, AxiosPromise, Method, AxiosResponse } from '../types';
import InterceptorManger from '../core/interceptor';
interface Interceptors {
    request: InterceptorManger<AxiosRequestConfig>;
    response: InterceptorManger<AxiosResponse>;
}
/**
 * Axios请求类
 * 提供语法糖简化发起请求的配置
 */
export default class Axios {
    interceptors: Interceptors;
    defaults: AxiosRequestConfig;
    constructor(initConfig: AxiosRequestConfig);
    /**
     * 调用axios实例方法最终都是指向request方法，.get() & .post()只是语法糖的封装，加深易用性
     * request方法内部使用了函数重载的概念，使其支持传入一个参数，并在运行时做判断，对config参数进行封装
     *
     * @param url
     * @param config
     */
    request(url: any, config?: any): AxiosPromise;
    get(url: string, config?: AxiosRequestConfig): AxiosPromise;
    delete(url: string, config?: AxiosRequestConfig): AxiosPromise;
    head(url: string, config?: AxiosRequestConfig): AxiosPromise;
    options(url: string, config?: AxiosRequestConfig): AxiosPromise;
    post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise;
    put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise;
    patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise;
    getUri(config?: AxiosRequestConfig): string;
    _requestMethodWithoutData(method: Method, url: string, config?: AxiosRequestConfig): AxiosPromise<any>;
    _requestMethodWithData(method: Method, url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<any>;
}
export {};
