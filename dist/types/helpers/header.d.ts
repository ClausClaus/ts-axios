import { Method } from '../types';
/**
 * 设置默认的请求头 & 规范化请求头
 * 根据传递到后端的data来设置默认的请求头数据
 * @param headers 请求头参数对象
 * @param data 请求头数据
 */
export declare function processHeaders(headers: any, data: any): any;
/**
 * 格式化响应headers的数据，数据通过req.getAllResponseHeaders()方法得来
 * @param headers 以回车符与换行符分割的字符串
 * params example :
 * `
 *  date: Fri, 05 Apr 2019 12:40:49 GMT\r\n
 *  etag: W/"d-Ssxx4FRxEutDLwo2+xkkxKc4y0k"\r\n
 *  connection: keep-alive\r\n
 *  x-powered-by: Express\r\n
 *  content-length: 13\r\n
 *  content-type: application/json; charset=utf-8\r\n
 * `
 */
export declare function parseHeaders(headers: string): any;
/**
 * 在defaults对象中定义的默认配置是可以从 请求方法的维度 进行配置的，就是针对不同请求有各自的公共配置
 * 在不同请求方法下应该把此次请求所需要的header提取出来，其他的则删除掉
 * @param headers 请求的headers
 * @param method 请求的method
 */
export declare function flattenHeaders(headers: any, method: Method): any;
