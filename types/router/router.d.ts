/// <reference types="bun-types" />
/// <reference types="bun-types" />
import type { Server } from "bun";
import { HttpMethod } from "../constants";
import { Observable, of } from "rxjs";
import { BunRespone } from "./respone";
export type RequestFunction<T = any> = (request: Request, server: Server) => T | Promise<T>;
export type Router<T = any> = {
    method: HttpMethod;
    path: string;
    handler: RequestFunction<T>;
};
export type BeforeMiddleware = (req: Request, server: Server, next: typeof of) => Observable<Request>;
export type AfterMiddleware = (res: BunRespone, server: Server, next: typeof of) => Observable<BunRespone>;
export declare class BunRouter {
    /**
     * 存储路由的Map
     */
    private routers;
    /**
     * 基础URL路径
     */
    private baseURL;
    /**
     * 前置中间件数组
     */
    beforeMiddlewares: BeforeMiddleware[];
    /**
     * 后置中间件数组
     */
    afterMiddlewares: AfterMiddleware[];
    constructor(baseURL: string);
    /**
     * 注册一个前置中间件到路由器。
     * 前置中间件会在每个请求的处理流程开始之前执行，可以用来处理诸如验证、日志记录等通用操作。
     *
     * @param middleware - 一个函数，接收请求、服务器实例和一个用于传递控制权到下一个中间件的`next`函数，
     *                     并应返回一个Observable的请求对象。
     */
    beforeEach(middleware: BeforeMiddleware): void;
    /**
     * 注册一个后置中间件到路由器。
     * 后置中间件会在每个请求的处理流程结束之后，响应发送给客户端之前执行，适用于统一处理响应，
     * 如修改响应头、记录响应日志等。
     *
     * @param middleware - 一个函数，接收响应对象、服务器实例和一个用于传递控制权到下一个中间件的`next`函数，
     *                     并应返回一个Observable的响应对象。
     */
    afterEach(middleware: AfterMiddleware): void;
    /**
     * 添加路由
     * @param router
     */
    addRouter<T = any>(router: Router<T>): void;
    doBeforeMiddlewares(request: Request, server: Server): Promise<Request>;
    doAfterMiddlewares(respone: BunRespone, server: Server): Promise<Response>;
    handler(request: Request, server: Server): Promise<Response>;
    fetch(request: Request, server: Server): Promise<Response>;
}
