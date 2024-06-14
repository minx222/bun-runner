import type { AfterMiddleware } from '../router';
/**
 * cors中间件函数，用于设置CORS相关的HTTP响应头。
 * 允许来自任何源的跨域请求，并定义了允许的HTTP方法、头部和缓存时间。
 *
 * @param respone - 当前的响应对象，用于设置响应头。
 * @param server - 服务器实例，虽然在此中间件中未使用，但作为中间件签名的一部分被传递。
 * @param next - 一个函数，调用它将控制权传递给管道中的下一个中间件或最终的响应处理。
 * @returns 返回一个Observable，其中包含经过CORS处理的响应对象，以便于在中间件链中继续处理。
 */
export declare const cors: AfterMiddleware;
