---
title: 【iOS 进阶】15 | 跨平台架构：如何设计 BFF 架构系统？
date: 2026-06-04 16:11:53
tags:
- 学习笔记
- iOS
categories:
- 学习笔记
---

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/compressed_BFF-2.jpg)

# 如何设计 BFF 架构系统？

首先，请你想一想：如果没有一套灵活、可扩展的系统架构，结果会怎样？

这方面我深有感触。在我们的 App 没有良好的系统架构之前，每一个微小的改动都需要「大动干戈」。具体来说，由于强耦合性，每次改动我们都需要和各个业务部门商讨详细的技术方案；功能开发完毕后，又要协调各个部门进行功能回归测试。整个过程不仅耗费大量精力和时间，还容易在跨部门、跨团队沟通中产生摩擦。

而**一套良好的系统架构，不仅仅是一款 App 的基石，也是整套代码库的规范**。有了良好的系统架构，业务功能开发者就能有据可依，团队之间的沟通变得顺畅；各个功能团队之间也能并行开发，保证彼此快速迭代，提高效率。

<!-- more -->

因此，我们在推动工程化实践的同时，也需要不断优化系统架构。在 2017 年，我和公司同事就设计与实现了一套基于原生技术的跨平台系统架构，能让所有开发者同时在 iOS 和 Android 平台上工作。

如今这套架构经过不断改进，依然在使用。我们现在开发的 **Moments App**，所用的跨平台系统架构，正是吸取了当初的经验与教训，使用 **BFF** 和 **MVVM** 重新架构与实现的。

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/downloaded-image.jpg)

本讲主要介绍如何使用 **BFF**（Backend for Frontend，服务于前端的后端）来设计跨平台的系统架构，以提高可重用性，进而提升开发效率。MVVM 的设计与实现，将在后续章节详细介绍。

## 为什么使用 BFF？

Moments App 是一款类朋友圈的 App。随着功能不断完善，目前几乎所有 App 的数据源都由多个微服务所支持。在 Moments App 中，后台微服务包括：

- 用于用户管理与鉴权的**用户服务**
- 用于记录朋友关系的**朋友关系服务**
- 用于拉黑管理的**黑名单服务**
- 用于记录每条朋友圈信息的**信息服务**
- 用于头像管理的**头像服务**
- 用于点赞管理的**点赞服务**等

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/01-moments-microservices.jpg)

当我们需要呈现朋友圈界面时，App 需要向各个微服务发送请求，然后把返回的信息整理、合并和转换成所需的信息进行呈现。

这些网络请求的顺序和逻辑非常复杂：

- 有些请求需要**串行**处理，例如只有完成了用户服务的请求以后，才能继续其他请求；
- 有些请求却可以**并行**发送，比如在得到信息服务的返回结果以后，可以同时向头像服务和点赞服务发送请求。

接着，在得到了所有结果以后，App 需要整理和合并数据的逻辑也**非常复杂**。如果请求返回结果的顺序不一致，往往会导致程序出错。于是，为了解决这一系列问题，我们引入了 **BFF 服务**。

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/02-bff-architecture.jpg)

**BFF** 是一个服务于不同前端的后台服务，所有的前端（比如 iOS、Android 和 Web）都依赖它。BFF 是一个**整合服务**，负责把前端的请求统一分发到各个具体的微服务上，然后把返回数据整合在一起统一返回给前端。

有了 BFF 以后，App 就不再需要往多个微服务发送请求，也不再需要处理复杂的并发请求，有效降低了复杂度，避免竞态条件等非预期情况发生。

除此以外，使用 BFF 还有以下好处。

### 1. 统一依赖，便于版本演进

App 仅需依赖一个 BFF 微服务，就能有效管理 App 对微服务的依赖。当 App 版本发布以后，我们没有办法强迫用户更新设备上的 App。如果我们需要变动某个微服务的地址，原有的 App 将无法访问新的微服务地址；但有了 BFF 以后，可以通过 BFF 统一路由到新的微服务。

### 2. 统一传输协议，降低客户端成本

不同的微服务可能提供不一样的数据传输方式，例如有的提供 `REST API`，有的提供 `gRPC`，而有的提供 `GraphQL`。在没有 BFF 的情况下，App 端必须实现各个技术栈来访问各个微服务。一旦有了 BFF 以后，App 只需要支持一种传输方式，极大减轻移动端开发和维护成本。

### 3. 数据在服务端统一处理，避免双端重复

由于 BFF 统一处理所有的数据，iOS 和 Android 两端都可以得到由 BFF 清理并转换好的数据，无须在各端重复开发一样的数据处理代码。这极大减少了工作量，让我们可以把重心放在**提高用户体验**上。

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/03-bff-benefits.jpg)

### 4. 提升安全性与整体性能

App 通过公网连接到后台微服务时，所有微服务都需要对外暴露，可能面临隐私信息暴露等安全问题（例如用户通过 App 获得本不应公开的黑名单信息）。

引入 BFF 以后，可以为微服务配置安全规则（如 AWS Security Group），仅允许 BFF 访问。例如黑名单管理服务可以设置：除 BFF 以外，不允许任何其他外部系统（包括 App）直接访问，从而有效保证隐私信息与公网的隔离。

与此同时，BFF 还可以同步访问多个不同的数据源，统一管理数据缓存，有效提升整套系统的性能。

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/04-bff-security-performance.jpg)


## BFF 的技术选型——GraphQL

既然 BFF 那么好用，应该怎样实现一个 BFF 服务呢？经过多个项目的实践总结，**GraphQL** 是目前实现 BFF 架构的较优方案之一。

和 REST API、gRPC 以及 SOAP 相比，GraphQL 架构有以下几大优点：

- GraphQL 允许客户端按自身需要通过 **Query** 请求不同数据集，而不像 REST API 和 gRPC 那样每次返回全部数据，能有效减轻网络负载。
- GraphQL 能减轻为各客户端开发单独 Endpoint 的工作量。例如开发 **App Clip** 时，App Clip 可以在 Query 中以指定子数据集的方式使用和主 App 相同的 Query，而无须重新开发新 Endpoint。
- GraphQL 服务能根据客户端的 Query 按需请求数据源，避免无必要的数据请求，减轻服务端负载。

### App Clip 场景示例

假设要开发一个显示「某大 V」朋友圈的 App Clip：用户使用 App Clip 时不需要鉴权，不必查看黑名单，就可以直接看到该大 V 的朋友圈信息。访问 GraphQL 的流程会简化（如下图所示）。

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/05-graphql-app-clip.jpg)

和主 App 请求相比，App Clip 不需要显示点赞信息，返回的结果可以精简。而且由于不需要鉴权，也不需要查询朋友关系、黑名单和点赞等信息，BFF 也无须向这些微服务发起请求，从而有效减轻 BFF 服务的负载。

另外，和 REST API 相比，GraphQL 的数据交换都由 **Schema** 统一管理，能有效减少由于数据类型和可空类型不匹配所导致的问题。GraphQL 还能减轻版本管理的工作量，因为 GraphQL 能支持返回不同数据集，从而无须像 REST API 那样为每个新功能不断更新 Endpoint 的版本号。

## 如何使用 GraphQL 实现 BFF

确定了 GraphQL 之后，需要选择服务框架。为方便演示，课程选择了 **Apollo Server**。

Apollo Server 是基于 Node.js 的 GraphQL 服务器，目前非常流行。使用它可以很方便地结合 Express 等 Web 服务，还可以部署到 AWS Lambda、Azure Functions 等 Serverless 服务上。在 REA Group 的生产环境中，Apollo Server 已稳定支撑 App 多年运行。

### 第一步：定义 Schema

使用 GraphQL，先要为前后端传递的数据定义 Schema。下面是 `Moment` 类型的部分 Schema 定义示例：

```graphql
enum MomentType {
  URL
  PHOTOS
}

type Moment {
  id: ID!
  userDetails: UserDetails!
  type: MomentType!
  title: String          # nullable
  photos: [String!]!   # 数组非空，元素非空，但可为空数组
}

type UserDetails {
  id: ID!
  name: String!
  avatar: String!
  backgroundImage: String!
}
```

**类型说明要点：**

- `GraphQL` 支持枚举类型，如 `MomentType`，在传输过程中通过字符串传给前端。
- `Moment` 在 Swift 中可对应 `struct`，在 Kotlin 中可对应 `data class`。
- 属性后的 `!` 表示非空。注意数组中的 `!` 含义：
  - `photos: [String!]!`：数组本身非空，且不能存放 `null` 元素；
  - `photos: [String!]`：数组本身可为 `null`，但元素不能为 `null`；
  - `photos: [String]!`：数组本身非空，但可存放 `null` 元素。

### 第二步：定义 Query 与 Mutation

```graphql
type Query {
  getMomentsDetailsByUserID(userID: ID!): MomentsDetails!
}

type Mutation {
  updateMomentLike(momentID: ID!, userID: ID!, isLiked: Boolean!): MomentsDetails!
}
```

- `Query` 一般用于查询；
- `Mutation` 是会更新状态的 Query，更新后仍可返回数据。上例中 `updateMomentLike` 接受 `momentID`、`userID`、`isLiked`，更新后返回 `MomentsDetails`。

### 第三步：实现 Resolver

```javascript
const resolvers = {
  Query: {
    getMomentsDetailsByUserID: (_, { userID }) => momentsDetails,
  },
  Mutation: {
    updateMomentLike: (_, { momentID, userID, isLiked }) => {
      for (const i in momentsDetails.moments) {
        if (momentsDetails.moments[i].id === momentID) {
          if (momentsDetails.moments[i].isLiked === isLiked) break;
          momentsDetails.moments[i].isLiked = isLiked;
          if (isLiked) {
            const likedUserDetails = getUserDetailsByID(userID);
            momentsDetails.moments[i].likes.push(likedUserDetails);
          } else {
            momentsDetails.moments[i].likes =
              momentsDetails.moments[i].likes.filter((item) => item.id !== userID);
          }
          break;
        }
      }
      return momentsDetails;
    },
  },
};
```

在示例中，`getMomentsDetailsByUserID` 直接返回 `momentsDetails`；`updateMomentLike` 更新点赞状态。Moments App 的 BFF 示例中维护了内存数据库；真实生产环境可访问 MySQL、MongoDB，或通过其他微服务桥接数据库访问。

> **注意**：并非每个 BFF 都必须通过 Apollo Server 和 Node.js 实现。可根据团队技能选择技术栈，例如 Kotlin 也是不错的选择——Android 开发者熟悉 Kotlin，且 Kotlin 可完美兼容 JVM，可利用 JVM 生态构建稳定的 BFF 方案。

## 总结

本讲介绍了如何使用 **BFF** 设计跨平台系统架构，以及如何使用 **GraphQL** 实现 BFF。虽然 GraphQL 有众多优点，但并非十全十美——世界上并没有完美的技术。使用 GraphQL 时需要注意：

1. **Schema 需要前后端共同协商**，特别要注意 `nullable` 类型的处理；若前端定义有误，很容易引起 App 崩溃。
2. **GraphQL 通常使用 HTTP POST**，部分 CDN 对 POST 缓存支持不好。若将请求改为 GET，整个 Query 会变成 JSON-encoded 字符串放在 Query String 中发送，此时要特别注意 Query String 长度不要超过 CDN 限制（例如 Akamai 支持最长 URL 约 8892 字节），否则请求会失败。

# 学习笔记与扩展

## BFF 模式的起源与定位

BFF（Backends For Frontends）由 Sam Newman 在 2015 年提出，核心思想是：**为每一种前端体验提供专属的后端适配层**，而不是让所有客户端共用一套「通用 API」。

在架构中的位置通常为：

```
客户端（iOS / Android / Web）
    ↓
API 网关（鉴权、限流、路由）
    ↓
BFF 层（聚合、裁剪、编排）
    ↓
微服务集群（用户、订单、内容……）
```

BFF 解决的不是「后端业务逻辑」，而是**前端与微服务之间的阻抗不匹配**：字段过多、协议不一、调用链过长、多端差异大。

## BFF 与 API 网关的区别

| 维度 | API 网关 | BFF |
|------|----------|-----|
| 主要职责 | 流量入口、鉴权、限流、路由 | 面向 UI 的数据聚合与适配 |
| 是否了解业务 | 通常较薄，偏基础设施 | 较厚，与产品展示强相关 |
| 维护团队 | 平台 / 运维 / 后端 | 常见为前端团队或贴近前端的业务后端 |
| 典型能力 | TLS、WAF、熔断 | VO 组装、字段脱敏、并行拉取 |

实践中两者常**协同**：网关做横切能力，BFF 做终端定制。

## 何时适合 / 不适合引入 BFF

**适合：**

- 移动端需要聚合 3 个以上微服务才能渲染一屏；
- iOS / Android / Web 对同一业务的数据结构差异大；
- 需要隐藏内部服务拓扑，统一安全边界；
- 希望把「列表 + 详情 + 用户信息」合并为一次网络往返。

**不适合 / 需谨慎：**

- 团队很小、后端已提供高质量 BFF 式聚合 API；
- BFF 层无人维护，逐渐变成「分布式单体」；
- 简单 CRUD，引入 BFF 只会增加延迟与运维成本。

## GraphQL 之外的 BFF 实现方式

课程以 GraphQL + Apollo Server 为例，业界常见还有：

- **REST BFF（Node.js / Kotlin / Go）**：用 `Promise.all` / `async` 并行请求多个 REST 微服务，组装 JSON 返回；
- **gRPC BFF**：内网高性能，适合 BFF 与微服务之间；
- **Serverless BFF**：按业务模块拆分为云函数，冷启动与可观测性需额外设计。

技术选型原则：**谁维护 BFF，就优先用该团队最熟的语言与框架**，而不是盲目跟风 Node.js。

## BFF 常见反模式（技术债预警）

- **BFF 膨胀**：把所有业务逻辑都塞进 BFF，微服务退化为 DAO；
- **多端共用一个 BFF 却不做隔离**：Web 改字段导致 App 崩溃；
- **缺乏缓存策略**：BFF 每次都穿透到所有下游，放大故障面；
- **无契约测试**：Schema / OpenAPI 变更未通知客户端。

建议：对 BFF 的「妥协逻辑」建立技术债清单，定期重构；按终端或业务线拆分 BFF（如 `mobile-bff`、`web-bff`）。

## 延伸阅读

- Sam Newman — *Pattern: Backends For Frontends*
- Microsoft Azure Architecture Center — [Backends for Frontends](https://learn.microsoft.com/zh-cn/azure/architecture/patterns/backends-for-frontends)
- Apollo GraphQL 官方文档 — Schema、Resolver、DataLoader（解决 N+1 查询）
- 课程代码仓库（工程化示例）：[lagoueduCol/iOS-linyongjian](https://github.com/lagoueduCol/iOS-linyongjian)

