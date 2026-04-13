---
title: 【AI】Vibe Coding 简介
date: 2026-04-13 11:24:18
tags:
- AI
- Vibe Coding
categories:
- AI
---

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/image-20260413113105515.png)

## 一、Vibe Coding 的诞生？ 

2025 年 2 月，前 OpenAI 研究员、特斯拉 AI 总监 Andrej Karpathy 在 X（原 Twitter）上发了一条帖子，原文如下：

>"There's a new kind of coding I call 'vibe coding', where you fully give in to the vibes, embrace exponentials, and forget that the code even exists."
>

<!-- more -->

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/image-20260413113752145.png)

翻译过来大致是：完全顺着感觉走，把代码生成的工作全部交给 AI，自己只负责描述意图和验证结果，甚至可以忘掉代码本身的存在。

这条帖子迅速引发广泛讨论。

在此之前，AI 辅助编程已经存在多年，GitHub Copilot 早在 2021 年就已上线，但 Karpathy 的这句话把一种实践行为提炼成了方法论，给了它一个名字，也引发了整个行业对"程序员角色将如何演变"的重新审视。

值得注意的是，Karpathy 本人在 2025 年末又进一步提出了"agentic engineering"（代理工程）的概念，将 Vibe Coding 定位为一个阶段性节点，而非终点。

这说明这一领域仍在快速演进中。

## 二、Vibe Coding 到底是什么？

### 1、核心概念

Vibe Coding 的核心是：用自然语言描述意图，由 LLM 生成可执行代码，开发者负责验证和迭代，而非手工编写每一行代码。

IBM 对这一概念的界定是："vibe coding is a fresh take in coding where users express their intention using plain speech and the AI transforms that thinking into executable code."（用户用自然语言表达意图，AI 将其转化为可执行代码。）

这并不是"低代码"或"无代码"平台的延伸——那些平台依赖预设的模块和可视化界面，而 Vibe Coding 使用的是通用型大语言模型，理论上可以生成任意语言、任意逻辑的代码。

Vibe Coding 的本质是 "完全沉浸于" AI 助手的 "氛围" 中，将详细的实现过程外包给 AI。

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/image-20260413114824236.png)

### 2、典型工作流程

一个标准的 Vibe Coding 工作循环通常如下：

1. 明确需求：用自然语言写出你想要的功能，越具体越好。例如"写一个 ROS2 节点，订阅 /scan 话题，当检测到前方 0.5m 内有障碍物时发布停止指令到 /cmd_vel"。
2. 生成代码：将需求提交给 Cursor、Claude Code、GitHub Copilot 等工具，获得初版代码。
3. 验证运行：在目标环境中运行，检查功能是否符合预期。
4. 迭代精化：将运行错误、边界情况、性能问题反馈给 AI，循环修正。
5. 人工审查：在进入关键流程前，由有经验的工程师对生成代码进行安全性和逻辑性复核。

### 3、Vibe Coding 与传统编码的比较


| 维度 | 传统编码 | Vibe Coding |
|---|---|---|
| 开发速度 | 较慢 - 手动编码、调试和优化需要更多时间 | 更快 - AI 辅助生成加速编码和迭代 |
| 可访问性 | 较难上手 - 需要正式的编程知识 | 更易上手 - 降低非程序员的门槛 |
| 所需知识 | 语法知识、算法、数据结构、调试 | 提示、审查、系统设计、问题定义 |
| 代码理解 | 深度理解 - 开发者直接控制和理解代码库 | 黑箱式理解 - 接受但不完全理解 |
| 代码质量 | 更可控 - 开发者可以遵循最佳实践 | 不稳定 - 取决于 AI 的能力和提示词 |
| 长期可维护性 | 更容易 - 结构良好且有文档记录的代码 | 可能更难 - 缺乏深入理解和文档 |
| 复杂性处理 | 无限制 - 完全控制复杂性和自定义 | 受 AI 限制 - 难以维护大型项目的结构 |
| 灵活性 | 无限制 - 开发者可以完全控制代码的各个方面 | 受 AI 限制 - 生成的结构可能僵化 |

## 三、Vibe Coding 的能与不能

### 1、它擅长做什么

根据多方资料综合，Vibe Coding 在以下场景表现出明显优势：

1. 快速原型与概念验证：当需要在数小时内验证一个想法是否可行时，Vibe Coding 可以将原本需要数天的工作压缩到数小时。这对于早期研发阶段的技术选型尤为有价值。
2. 样板代码与重复性任务：ROS 话题/服务的节点框架、数据格式转换、配置文件解析、单元测试模板等重复性代码，是 LLM 的强项。这类代码逻辑固定、模式清晰，生成质量较高。
3. 跨技术栈的"翻译"工作：将一个 Python 实现转换为 C++ 实现，或将 ROS1 节点迁移到 ROS2，这类工作规则性强，Vibe Coding 可以大幅降低翻译成本。
4. 文档与注释生成：为遗留代码补充注释、生成接口文档，是 LLM 相对可靠的场景。

### 2、它的局限在哪里

Software Mind 的分析指出了 Vibe Coding 在生产环境中的几个核心风险：

1. 安全漏洞问题：2025 年初，使用 Lovable AI 构建的数十款应用因将数据库凭证硬编码在客户端代码中而被攻击者利用。AI 生成的代码往往缺乏对输入验证、访问控制、密钥管理等安全细节的处理。
2. 调试困难：AI 生成的代码缺乏内在的结构性，一旦出现深层次 bug，调试成本可能远高于手写代码。
3. 可维护性差：没有经过系统设计的 Vibe Coding 产物，随着功能叠加，代码库会迅速陷入混乱。McKinsey 的调研数据显示，接近 80% 的组织在 AI 应用上没有看到显著的底线收益，主要原因正是碎片化的使用方式和缺乏治理。
4. 无法替代架构判断：对于复杂的分布式系统、实时性要求高的控制系统、涉及状态机和行为树深度嵌套的逻辑，当前的 LLM 难以独立完成整体架构设计，更无法保证生成结果的形式化正确性。

### 四、支持 Vibe Coding 的工具与平台

目前有一些工具非常适合 Vibe Coding。

- **Cursor**： 是一款以 AI 为核心的集成开发环境，专为会话式编码而设计，提供自然语言输入、上下文分析、代码生成、自动调试和增强的文档查找等功能。目前综合评价最高的 AI 编程 IDE，支持 repo 级别的上下文感知，适合在 ROS 工作空间中使用。
- **Claude Code**：Anthropic 出品，在代码质量和逻辑推理方面表现较为稳定。
- **GitHub Copilot**：是一款 AI 代码助手，作为代码编辑器的扩展工作，提供代码自动完成和自然语言编码问答的聊天模式。


### 五、参考资料

> 1、[什么是 Vibe Coding？](https://www.zhihu.com/question/1944542162130833916/answer/2024773200538551455)
> 2、[氛围编程(Vibe Coding)火爆了，AI 会取代程序员吗？](https://blog.csdn.net/bagell/article/details/147078208?spm=1001.2101.3001.6650.13&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-13-147078208-blog-155984647.235%5Ev43%5Epc_blog_bottom_relevance_base9&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-13-147078208-blog-155984647.235%5Ev43%5Epc_blog_bottom_relevance_base9&utm_relevant_index=20)