import { AxiosRequestConfig, AxiosPromise } from '../types';
/**
 *
 * 发起请求处理函数，对请求配置与响应结果进行处理
 * @param {AxiosRequestConfig} config
 */
export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise;
/**
 *
 * 转换请求的Url
 * @param {AxiosRequestConfig} config
 * @returns {string}
 */
export declare function transformURL(config: AxiosRequestConfig): string;
