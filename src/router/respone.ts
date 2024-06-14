/**
 * BunRespone类用于创建和管理HTTP响应。
 * 提供了设置状态码、头部信息和响应体的方法，并能转换为原生Response对象。
 */
export class BunRespone {
    // 响应状态码，默认为undefined
    status?: number;
    
    // 响应头信息，默认为undefined
    headers?: Record<string, string>;
    
    // 响应体内容，默认为undefined
    body?: any;

    /**
     * 构造函数，用于初始化BunRespone实例。
     * 
     * @param config - 初始化配置对象，包含可选的状态码、头部和响应体。
     */
    constructor(config: {
        status?: number,
        headers?: Record<string, string>,
        body?: any
    }) {
        // 从配置对象中设置实例的status、headers和body
        this.status = config.status;
        this.headers = config.headers;
        this.body = config.body;
    }

    /**
     * 设置响应头。
     * 
     * 如果已有头部信息，则更新指定键的值；否则，创建新的头部信息对象并设置键值对。
     * 
     * @param key - 头部字段的名称。
     * @param value - 头部字段的值。
     */
    setHeader(key: string, value: any) {
        if (this.headers) {
            // 如果headers已存在，则直接设置键值对
            this.headers[key] = value;
        } else {
            // 如果headers尚不存在，则初始化headers并设置键值对
            this.headers = {
                [key]: value
            };
        }
    }

    /**
     * 转换为原生Response对象。
     * 
     * 根据当前实例的状态码、头部和响应体创建一个新的Response对象。
     * 
     * @returns 新创建的Response对象。
     */
    transform() {
        // 使用当前实例的属性创建原生Response对象
        return new Response(this.body, {
            status: this.status,
            headers: this.headers
        });
    }
}