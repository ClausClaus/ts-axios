import { AxiosRequestConfig, AxiosPromise } from '../types';
/**
 * 基于XMLHttpRequest对象封装请求函数
 * @param {AxiosRequestConfig} config 请求配置【包括请求参数，请求url，请求方式，请求头，响应类型，请求超时时间】
 */
export default function xhr(config: AxiosRequestConfig): AxiosPromise;
