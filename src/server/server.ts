// 导入必要的类型和模块
import type { BunFile, Serve } from 'bun';
import nodePath from 'path';

// 导入自定义类型和模块
import { HttpMethod } from '../constants'; // HttpMethod枚举定义了HTTP方法类型
import type { RequestFunction } from '../router'; // 请求处理函数的类型定义
import { BunRouter } from "../router"; // 自定义的BunRouter类，用于管理路由

// 定义服务器配置类型
export type ServerConfig = {
	port: number; // 服务器监听的端口号
};

// 定义BunServe类
export class BunServe {
	// 私有属性，用于存储Serve实例
	private app: Serve | undefined;
	// 实例化BunRouter用于路由管理
	router: BunRouter;

	// 存储服务器配置
	private config: {
		port: number;
	};

	constructor(config: {
		port: number; // 构造函数接收端口号作为配置
	}) {
		// 初始化配置、路由器实例，并设置监听端口
		this.config = config;
		this.router = new BunRouter(`http://localhost:${config.port}`); // 设置基础URL
	}

	// 启动服务器监听，并允许传入额外配置和回调函数
	async listen(config?: ServerConfig, callBack?: (config: ServerConfig) => void) {
		const _config = { ...this.config, ...config };
		// 使用Bun.serve启动服务器并配置路由处理
		this.app = Bun.serve({
			port: _config.port,
			fetch: (req, server) => this.router.fetch(req, server),
		});
		callBack?.(_config);
		return _config;
	}

	// 添加请求处理方法，支持GET、POST等HTTP方法
	request<R>(path: string, method: HttpMethod, handler: RequestFunction) {
		this.router.addRouter<R>({
			path,
			method,
			handler,
		});
	}

	// GET请求的快捷方法
	get<R>(path: string, handler: RequestFunction) {
		this.request(path, HttpMethod.GET, handler);
	}

	// POST请求的快捷方法
	post<R>(path: string, handler: RequestFunction) {
		this.request(path, HttpMethod.POST, handler);
	}

	// PATCH请求的快捷方法
	patch<R>(path: string, handler: RequestFunction) {
		this.request(path, HttpMethod.PATCH, handler);
	}

	// PUT请求的快捷方法
	put<R>(path: string, handler: RequestFunction) {
		this.request(path, HttpMethod.PUT, handler);
	}

	// DELETE请求的快捷方法
	delete<R>(path: string, handler: RequestFunction) {
		this.request(path, HttpMethod.DELETE, handler);
	}

	// 用于服务静态资源的便捷方法
	resource(path: string, resource: string) {
		// 定义一个异步处理器来返回BunFile实例
		const handler = async () => {
			const filePath = nodePath.join(process.cwd(), resource); // 构建文件路径
			const file = Bun.file(filePath); // 创建BunFile实例
			return file;
		};
		// 将处理器添加为GET请求的路由
		this.request<BunFile>(path, HttpMethod.GET, handler);
	}
}