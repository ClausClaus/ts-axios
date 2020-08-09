/**
 *
 * 处理请求url参数
 * @export
 * @param {string} url
 * @param {*} [params]
 * @returns {string}
 */
export declare function buildURL(url: string, params?: any, paramsSerializer?: (params: any) => string): string;
/**
 * 是否是同源请求的判断函数
 * @param requestURL url链接
 */
export declare function isURLSameOrigin(requestURL: string): boolean;
export declare function isAbsoluteURL(url: string): boolean;
export declare function combineURL(baseURL: string, relativeURL?: string): string;
