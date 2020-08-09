/**
 * Cancel类是以axios实例扩展方法的方式挂载到axios上的
 */
export default class Cancel {
    message?: string;
    constructor(message?: string);
}
export declare function isCancel(value: any): boolean;
