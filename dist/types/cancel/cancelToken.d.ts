import { CancelTokenSource } from '../types';
import { CancelExecutor } from '../types';
import Cancel from './cancel';
/**
 * CancelToken类是以axios实例扩展方法的方式挂载到axios上的
 */
export default class CancelToken {
    promise: Promise<Cancel>;
    reason?: Cancel;
    constructor(executor: CancelExecutor);
    throwIfRequest(): void;
    static source(): CancelTokenSource;
}
