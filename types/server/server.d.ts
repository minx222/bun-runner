import { HttpMethod } from '../constants';
import type { RequestFunction } from '../router';
import { BunRouter } from "../router";
export type ServerConfig = {
    port: number;
};
export declare class BunServe {
    private app;
    router: BunRouter;
    private config;
    constructor(config: {
        port: number;
    });
    listen(config?: ServerConfig, callBack?: (config: ServerConfig) => void): Promise<{
        port: number;
    }>;
    request<R>(path: string, method: HttpMethod, handler: RequestFunction): void;
    get<R>(path: string, handler: RequestFunction): void;
    post<R>(path: string, handler: RequestFunction): void;
    patch<R>(path: string, handler: RequestFunction): void;
    put<R>(path: string, handler: RequestFunction): void;
    delete<R>(path: string, handler: RequestFunction): void;
    resource(path: string, resource: string): void;
}
