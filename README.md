# fast-bunserver
fast-bunserver 是一个bun server开发框架，模仿了类似express的设计模式。能从express无感切换到bun，增加node性能

## bun server
bun server是一个高性能的nodejs服务端框架，基于bun。http底层采用了非阻塞io，对于同一接口能做到并行处理，给nodejs多线程带来可能

## 使用示例
```ts
import { BunServe } from 'bunr-runner'

const app = new BunServe({
	port: 4000
})

app.get("/user", (req) => {
	return "Hello World!"
})

app.post("/app", (req) => {
	return "app"
})

app.resource("/home", "./index.html")


app.listen()
```
