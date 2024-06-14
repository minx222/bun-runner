import type { Server } from "bun";
import { HttpMethod } from "../constants";
import { Observable, defer, of } from "rxjs";
import { concatMap } from "rxjs/operators";
import { BunRespone } from "./respone";

export type RequestFunction<T = any> = (
  request: Request,
  server: Server
) => T | Promise<T>;
export type Router<T = any> = {
  method: HttpMethod;
  path: string;
  handler: RequestFunction<T>;
};

export type BeforeMiddleware = (
  req: Request,
  server: Server,
  next: typeof of
) => Observable<Request>;
export type AfterMiddleware = (
  res: BunRespone,
  server: Server,
  next: typeof of
) => Observable<BunRespone>;

export class BunRouter {
  /**
   * 存储路由的Map
   */
  private routers: Map<string, Router>;
  /**
   * 基础URL路径
   */
  private baseURL: string;

  /**
   * 前置中间件数组
   */
  beforeMiddlewares: BeforeMiddleware[];

  /**
   * 后置中间件数组
   */
  afterMiddlewares: AfterMiddleware[];

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.routers = new Map();
    this.beforeMiddlewares = [];
    this.afterMiddlewares = [];
  }

  /**
   * 注册一个前置中间件到路由器。
   * 前置中间件会在每个请求的处理流程开始之前执行，可以用来处理诸如验证、日志记录等通用操作。
   *
   * @param middleware - 一个函数，接收请求、服务器实例和一个用于传递控制权到下一个中间件的`next`函数，
   *                     并应返回一个Observable的请求对象。
   */
  beforeEach(middleware: BeforeMiddleware) {
    this.beforeMiddlewares.push(middleware); // 将提供的中间件添加到beforeMiddlewares数组中
  }

  /**
   * 注册一个后置中间件到路由器。
   * 后置中间件会在每个请求的处理流程结束之后，响应发送给客户端之前执行，适用于统一处理响应，
   * 如修改响应头、记录响应日志等。
   *
   * @param middleware - 一个函数，接收响应对象、服务器实例和一个用于传递控制权到下一个中间件的`next`函数，
   *                     并应返回一个Observable的响应对象。
   */
  afterEach(middleware: AfterMiddleware) {
    this.afterMiddlewares.push(middleware); // 将提供的中间件添加到afterMiddlewares数组中
  }

  /**
   * 添加路由
   * @param router
   */
  addRouter<T = any>(router: Router<T>) {
    this.routers.set(router.method + router.path, router);
  }

  // 处理前置中间件
  doBeforeMiddlewares(request: Request, server: Server) {
    let _request = request;
    return new Promise<Request>((resolve, reject) => {
      this.beforeMiddlewares
        .reduce(
          (chain, handler) => {
            return chain.pipe(
              concatMap((request) => handler(request, server, of))
            );
          },
          defer<Observable<Request>>(() => of(request))
        )
        .subscribe({
          async complete() {
            resolve(_request);
          },
          next(value) {
            _request = value;
          },
          error(err) {
            reject(err);
          },
        });
    });
  }

  // 处理后置中间件
  doAfterMiddlewares(respone: BunRespone, server: Server) {
    let _respone = respone;
    return new Promise<Response>((resolve, reject) => {
      this.afterMiddlewares
        .reduce(
          (chain, handler) => {
            return chain.pipe(
              concatMap((respone) => handler(respone, server, of))
            );
          },
          defer<Observable<BunRespone>>(() => of(_respone))
        )
        .subscribe({
          complete() {
            resolve(_respone.transform());
          },
          next(value) {
            _respone = value;
          },
          error(err) {
            reject(err);
          },
        });
    });
  }

  async handler(request: Request, server: Server) {
    const url = request.url.replace(this.baseURL, "");
    const router = this.routers.get(request.method + url);
    let respone: BunRespone = new BunRespone({
      status: 200,
    });
    if (!router) {
      respone.status = 404;
      respone.body = "Not Found";
    } else {
      const _request = await this.doBeforeMiddlewares(request, server);

      if (router.handler.constructor.name === "AsyncFunction") {
        let res = await router.handler(_request, server);
        respone = new BunRespone({
          status: 200,
          body: res,
        });
      } else {
        // @ts-ignore
        let res = router.handler(request, server);
        if (typeof res === "object") {
          res = JSON.stringify(res);
        }
        respone = new BunRespone({
          status: 200,
          body: res,
        });
      }
    }
    return await this.doAfterMiddlewares(respone, server);
  }

  fetch(request: Request, server: Server): Promise<Response> {
    return this.handler(request, server);
  }
}
