// 导入AfterMiddleware类型，确保中间件函数符合预期类型
import type { AfterMiddleware } from '../router'

/**
 * cors中间件函数，用于设置CORS相关的HTTP响应头。
 * 允许来自任何源的跨域请求，并定义了允许的HTTP方法、头部和缓存时间。
 *
 * @param respone - 当前的响应对象，用于设置响应头。
 * @param server - 服务器实例，虽然在此中间件中未使用，但作为中间件签名的一部分被传递。
 * @param next - 一个函数，调用它将控制权传递给管道中的下一个中间件或最终的响应处理。
 * @returns 返回一个Observable，其中包含经过CORS处理的响应对象，以便于在中间件链中继续处理。
 */
export const cors: AfterMiddleware = (respone, server, next) => {
    // 设置允许跨域的源，'*'表示允许任意源
    respone.setHeader('Access-Control-Allow-Origin', '*');

    // 指定允许的HTTP方法
    respone.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    // 允许的请求头字段
    respone.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // 预检请求的有效期，单位为秒。这里设置为一天（86400秒）
    respone.setHeader('Access-Control-Max-Age', '86400');

    // 注意：此处重复设置了"Access-Control-Allow-Origin"，可能是误操作，实际只需设置一次即可。

    // 调用next函数，将控制权传递给链中的下一个处理器或完成响应
    return next(respone);
}