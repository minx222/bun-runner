/**
 * BunRespone类用于创建和管理HTTP响应。
 * 提供了设置状态码、头部信息和响应体的方法，并能转换为原生Response对象。
 */
export declare class BunRespone {
    status?: number;
    headers?: Record<string, string>;
    body?: any;
    /**
     * 构造函数，用于初始化BunRespone实例。
     *
     * @param config - 初始化配置对象，包含可选的状态码、头部和响应体。
     */
    constructor(config: {
        status?: number;
        headers?: Record<string, string>;
        body?: any;
    });
    /**
     * 设置响应头。
     *
     * 如果已有头部信息，则更新指定键的值；否则，创建新的头部信息对象并设置键值对。
     *
     * @param key - 头部字段的名称。
     * @param value - 头部字段的值。
     */
    setHeader(key: string, value: any): void;
    /**
     * 转换为原生Response对象。
     *
     * 根据当前实例的状态码、头部和响应体创建一个新的Response对象。
     *
     * @returns 新创建的Response对象。
     */
    transform(): Response;
}
