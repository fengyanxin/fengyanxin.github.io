---
title: 【Tips】HTTP 响应状态码
date: 2025-02-18 16:40:34
tags:
- Tips
categories:
- Tips
---

# HTTP 响应状态码

**HTTP** 响应状态码用来表明特定 [HTTP](https://developer.mozilla.org/zh-CN/docs/Web/HTTP) 请求是否成功完成。 响应被归为以下五大类：

1. **信息响应** (100–199)
2. **成功响应** (200–299)
3. **重定向消息** (300–399)
4. **客户端错误响应** (400–499)
5. **服务端错误响应** (500–599)

<!-- more -->

以下状态码由 [section 10 of RFC 2616](https://datatracker.ietf.org/doc/html/rfc2616#section-10) 定义。你可以在 [RFC 7231](https://datatracker.ietf.org/doc/html/rfc7231#section-6) 中找到更新后的规范。

> **备注**： 如果你收到的响应不在此范围中，则它为非标准响应，可能是服务器软件的自定义响应。
> 

## 信息响应

### [100 Continue](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/100)

这个临时响应表明，迄今为止的所有内容都是可行的，客户端应该继续请求，如果已经完成，则忽略它。

### [101 Switching Protocols](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/101)

该代码是响应客户端的 [Upgrade](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Upgrade) 请求头发送的，指明服务器即将切换的协议。

### [102 Processing](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/102) [(WebDAV)](https://developer.mozilla.org/zh-CN/docs/Glossary/WebDAV)

此代码表示服务器已收到并正在处理该请求，但当前没有响应可用。

### [103 Early Hints](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/103)

此状态代码主要用于与 [Link](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Link) 链接头一起使用，以允许用户代理在服务器准备响应阶段时开始预加载 [preloading](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Attributes/rel/preload) 资源。

## 成功响应

### [200 OK](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/200)

请求成功。成功的含义取决于 HTTP 方法：

* `GET`: 资源已被提取并在消息正文中传输。
* `HEAD`: 实体标头位于消息正文中。
* `PUT` or `POST`: 描述动作结果的资源在消息体中传输。
* `TRACE`: 消息正文包含服务器收到的请求消息。

### [201 Created](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/201)

该请求已成功，并因此创建了一个新的资源。这通常是在 POST 请求，或是某些 PUT 请求之后返回的响应。

### [202 Accepted](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/202)

请求已经接收到，但还未响应，没有结果。意味着不会有一个异步的响应去表明当前请求的结果，预期另外的进程和服务去处理请求，或者批处理。

### [203 Non-Authoritative Information](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/203)

服务器已成功处理了请求，但返回的实体头部元信息不是在原始服务器上有效的确定集合，而是来自本地或者第三方的拷贝。当前的信息可能是原始版本的子集或者超集。例如，包含资源的元数据可能导致原始服务器知道元信息的超集。使用此状态码不是必须的，而且只有在响应不使用此状态码便会返回200 OK的情况下才是合适的。

### [204 No Content](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/204)

对于该请求没有的内容可发送，但头部字段可能有用。用户代理可能会用此时请求头部信息来更新原来资源的头部缓存字段。

### [205 Reset Content](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/205)

告诉用户代理重置发送此请求的文档。

### [206 Partial Content](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/206)

当从客户端发送 [Range](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Range) 范围标头以只请求资源的一部分时，将使用此响应代码。

### [207 Multi-Status](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/207) [(WebDAV)](https://developer.mozilla.org/zh-CN/docs/Glossary/WebDAV)

对于多个状态代码都可能合适的情况，传输有关多个资源的信息。

### [208 Already Reported](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/226)  [(WebDAV)](https://developer.mozilla.org/zh-CN/docs/Glossary/WebDAV)

在 DAV 里面使用 `<dav:propstat>` 响应元素以避免重复枚举多个绑定的内部成员到同一个集合。

### [226 IM Used](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/226) [(HTTP Delta encoding)](https://datatracker.ietf.org/doc/html/rfc3229)

服务器已经完成了对资源的 GET 请求，并且响应是对当前实例应用的一个或多个实例操作结果的表示。

## 重定向消息

### [300 Multiple Choice](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/300)

请求拥有多个可能的响应。用户代理或者用户应当从中选择一个。（没有标准化的方法来选择其中一个响应，但是建议使用指向可能性的 HTML 链接，以便用户可以选择。）

### [301 Moved Permanently](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/301)

请求资源的 URL 已永久更改。在响应中给出了新的 URL。

### [302 Found](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/302)

此响应代码表示所请求资源的 URI 已 暂时 更改。未来可能会对 URI 进行进一步的改变。因此，客户机应该在将来的请求中使用这个相同的 URI。

### [303 See Other](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/303)

服务器发送此响应，以指示客户端通过一个 GET 请求在另一个 URI 中获取所请求的资源。

### [304 Not Modified](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/304)

这是用于缓存的目的。它告诉客户端响应还没有被修改，因此客户端可以继续使用相同的缓存版本的响应。

### ~~305 Use Proxy~~

在 HTTP 规范中定义，以指示请求的响应必须被代理访问。由于对代理的带内配置的安全考虑，它已被弃用。

### ~~306 unused~~

此响应代码不再使用；它只是保留。它曾在 HTTP/1.1 规范的早期版本中使用过。

### [307 Temporary Redirect](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/307)

服务器发送此响应，以指示客户端使用在前一个请求中使用的相同方法在另一个 URI 上获取所请求的资源。这与 302 Found HTTP 响应代码具有相同的语义，但用户代理 不能 更改所使用的 HTTP 方法：如果在第一个请求中使用了 POST，则在第二个请求中必须使用 POST

### [308 Permanent Redirect](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/308)

这意味着资源现在永久位于由 Location: HTTP Response 标头指定的另一个 URI。这与 301 Moved Permanently HTTP 响应代码具有相同的语义，但用户代理不能更改所使用的 HTTP 方法：如果在第一个请求中使用 POST，则必须在第二个请求中使用 POST。

## 客户端错误响应

### [400 Bad Request](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/400)

由于被认为是客户端错误（例如，错误的请求语法、无效的请求消息帧或欺骗性的请求路由），服务器无法或不会处理请求。

### [401 Unauthorized](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/401)

虽然 HTTP 标准指定了"unauthorized"，但从语义上来说，这个响应意味着"unauthenticated"。也就是说，客户端必须对自身进行身份验证才能获得请求的响应。

### [402 Payment Required](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/402)

此响应代码保留供将来使用。创建此代码的最初目的是将其用于数字支付系统，但是此状态代码很少使用，并且不存在标准约定。

### [403 Forbidden](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/403)

客户端没有访问内容的权限；也就是说，它是未经授权的，因此服务器拒绝提供请求的资源。与 401 Unauthorized 不同，服务器知道客户端的身份。

### [404 Not Found](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/404)

服务器找不到请求的资源。在浏览器中，这意味着无法识别 URL。在 API 中，这也可能意味着端点有效，但资源本身不存在。服务器也可以发送此响应，而不是 403 Forbidden，以向未经授权的客户端隐藏资源的存在。这个响应代码可能是最广为人知的，因为它经常出现在网络上。

### [405 Method Not Allowed](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/405)

服务器知道请求方法，但目标资源不支持该方法。例如，API 可能不允许调用 DELETE 来删除资源。

### [406 Not Acceptable](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/406)

当 web 服务器在执行 [服务端驱动型内容协商机制](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Content_negotiation#服务端驱动型内容协商机制) 后，没有发现任何符合用户代理给定标准的内容时，就会发送此响应。

### [407 Proxy Authentication Required](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/407)

类似于 401 Unauthorized 但是认证需要由代理完成。

### [408 Request Timeout](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/408)

此响应由一些服务器在空闲连接上发送，即使客户端之前没有任何请求。这意味着服务器想关闭这个未使用的连接。由于一些浏览器，如 Chrome、Firefox 27+ 或 IE9，使用 HTTP 预连接机制来加速冲浪，所以这种响应被使用得更多。还要注意的是，有些服务器只是关闭了连接而没有发送此消息。

### [409 Conflict](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/409)

当请求与服务器的当前状态冲突时，将发送此响应。

### [410 Gone](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/410)

当请求的内容已从服务器中永久删除且没有转发地址时，将发送此响应。客户端需要删除缓存和指向资源的链接。HTTP 规范打算将此状态代码用于“有限时间的促销服务”。API 不应被迫指出已使用此状态代码删除的资源。

### [411 Length Required](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/411)

服务端拒绝该请求因为 Content-Length 头部字段未定义但是服务端需要它。

### [412 Precondition Failed](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/412)

客户端在其头文件中指出了服务器不满足的先决条件。

### [413 Payload Too Large](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/413)

请求实体大于服务器定义的限制。服务器可能会关闭连接，或在标头字段后返回重试 Retry-After。

### [414 URI Too Long](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/414)

客户端请求的 URI 比服务器愿意接收的长度长。

### [415 Unsupported Media Type](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/415)

服务器不支持请求数据的媒体格式，因此服务器拒绝请求。

### [416 Range Not Satisfiable](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/416)

无法满足请求中 Range 标头字段指定的范围。该范围可能超出了目标 URI 数据的大小。

### [417 Expectation Failed](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/417)

此响应代码表示服务器无法满足 Expect 请求标头字段所指示的期望。

### [418 I'm a teapot](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/418)

服务端拒绝用茶壶煮咖啡。笑话，典故来源 [茶壶冲泡咖啡]()

### [421 Misdirected Request](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/421)

请求被定向到无法生成响应的服务器。这可以由未配置为针对请求 URI 中包含的方案和权限组合生成响应的服务器发送。

### [422 Unprocessable Entity](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/422) (WebDAV)

请求格式正确，但由于语义错误而无法遵循。

### [423 Locked](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/423) (WebDAV)

正在访问的资源已锁定。

### [424 Failed Dependency](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/424) (WebDAV)

由于前一个请求失败，请求失败。

### [425 Too Early](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/425) 

表示服务器不愿意冒险处理可能被重播的请求。

### [426 Upgrade Required](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/426)

服务器拒绝使用当前协议执行请求，但在客户端升级到其他协议后可能愿意这样做。 服务端发送带有 Upgrade 字段的 426 响应 来表明它所需的协议（们）。

### [428 Precondition Required](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/428)

源服务器要求请求是有条件的。此响应旨在防止'丢失更新'问题，即当第三方修改服务器上的状态时，客户端 GET 获取资源的状态，对其进行修改并将其 PUT 放回服务器，从而导致冲突。

### [429 Too Many Requests](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/429)

用户在给定的时间内发送了太多请求（"限制请求速率"）

### [431 Request Header Fields Too Large](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/431)

服务器不愿意处理请求，因为其头字段太大。在减小请求头字段的大小后，可以重新提交请求。

### [451 Unavailable For Legal Reasons](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/451)

用户代理请求了无法合法提供的资源，例如政府审查的网页。

## 服务端错误响应

### [500 Internal Server Error](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/500)

服务器遇到了不知道如何处理的情况。

### [501 Not Implemented](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/501)

服务器不支持请求方法，因此无法处理。服务器需要支持的唯二方法（因此不能返回此代码）是 GET and HEAD.

### [502 Bad Gateway](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/502)

此错误响应表明服务器作为网关需要得到一个处理这个请求的响应，但是得到一个错误的响应。

### [503 Service Unavailable](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/503)

服务器没有准备好处理请求。常见原因是服务器因维护或重载而停机。请注意，与此响应一起，应发送解释问题的用户友好页面。这个响应应该用于临时条件和如果可能的话，HTTP 标头 Retry-After 字段应该包含恢复服务之前的估计时间。网站管理员还必须注意与此响应一起发送的与缓存相关的标头，因为这些临时条件响应通常不应被缓存。

### [504 Gateway Timeout](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/504)

当服务器充当网关且无法及时获得响应时，会给出此错误响应。

### [505 HTTP Version Not Supported](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/505)

服务器不支持请求中使用的 HTTP 版本。

### [506 Variant Also Negotiates](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/506)

服务器存在内部配置错误：所选的变体资源被配置为参与透明内容协商本身，因此不是协商过程中的适当终点。

### [507 Insufficient Storage](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/507) (WebDAV)

无法在资源上执行该方法，因为服务器无法存储成功完成请求所需的表示。

### [508 Loop Detected](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/508) (WebDAV)
服务器在处理请求时检测到无限循环。

### [510 Not Extended](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/510)

服务器需要对请求进行进一步扩展才能完成请求。

### [511 Network Authentication Required](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/511)

指示客户端需要进行身份验证才能获得网络访问权限。

## 浏览器兼容性

[Report problems with this compatibility data on GitHub](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status#305_use_proxy)

# 参考资料

* [MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)
* [维基百科上的 HTTP 状态码](https://zh.wikipedia.org/wiki/HTTP状态码)
* [IANA official registry of HTTP status codes](https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml)