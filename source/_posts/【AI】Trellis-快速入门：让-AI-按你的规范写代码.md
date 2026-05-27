---
title: 【AI】Trellis 快速入门：让 AI 按你的规范写代码
date: 2026-05-27 13:33:33
tags:
- AI
- Trellis
categories:
- AI
---

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/trellis.png)

## 一、Trellis 是什么？

**Trellis** 是一个面向 AI 编程助手的**团队级 Agent 框架与工具集**，支持 Claude Code、Cursor、OpenCode、Codex、Gemini CLI、GitHub Copilot 等 **14+ 平台**。

官方用一句话概括：

> AI 的能力像藤蔓一样旺盛，却容易四处蔓延。Trellis 是为 AI 搭的脚手架，把它引向你团队的规范路径。

更直白地说：**Trellis 是 AI 编程助手的「训练轮」**—— 它会在每次会话中自动注入项目规范（Spec），让 AI 按你的标准写代码，而不是每次即兴发挥。

<!-- more -->

### 与传统方案对比

| 维度 | `.cursorrules` | `CLAUDE.md` | Skills | **Trellis** |
|------|----------------|-------------|--------|-------------|
| 规范注入 | 每次手动加载 | 自动加载但易被截断 | 用户主动触发 | Hook 自动注入，按任务精准加载 |
| 规范粒度 | 单一大文件 | 单一大文件 | 每个 Skill 一个 | 模块化文件，按任务组合 |
| 跨会话记忆 | 无 | 无 | 无 | Workspace 日志持久化 |
| 工作流约束 | 无 | 无 | 无 | 自动触发 Skill + Check 子代理 |
| 团队共享 | 个人 | 个人 | 可分享但无标准 | Git 版本化的 Spec 库 |
| 平台支持 | 仅 Cursor | 仅 Claude Code | 各平台独立 | 14+ 平台 + 共享 Skill 生态 |

## 二、核心概念：三大系统

Trellis 由三个互相配合的系统组成：

```
┌─────────────────────────────────────────────────────────┐
│                     你描述要做的任务                      │
└─────────────────────────────┬───────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────┐
│  Hook 自动注入：                                          │
│  - .trellis/spec/ 中的相关规范                           │
│  - .trellis/tasks/{task}/ 中的任务上下文                  │
│  - .trellis/workspace/ 中的会话历史                       │
└─────────────────────────────┬───────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────┐
│  AI 按规范写代码 → 检查 → 更新 Spec → 归档任务            │
└─────────────────────────────────────────────────────────┘
```

### 1. Spec（规范库）

你的编码标准，以 Markdown 存放在 `.trellis/spec/`：

```
.trellis/spec/
├── frontend/       # 前端规范（组件、Hooks、状态管理）
├── backend/        # 后端规范（API、错误处理、日志）
└── guides/         # 通用思考指南
```

**要点**：Spec 不是「理想架构文档」，而是**可执行的契约**——要引用真实文件路径、给出好/坏示例、说明原因。

### 2. Task（任务）

每个工作单元有独立目录，存放在 `.trellis/tasks/`：

```
.trellis/tasks/01-31-user-auth/
├── task.json           # 元数据、状态、分支
├── prd.md              # 需求文档
├── design.md           # 技术设计（复杂任务）
├── implement.md        # 执行计划（复杂任务）
├── implement.jsonl     # 实现阶段要读的 Spec/研究文件
├── check.jsonl         # 检查阶段要读的 Spec/研究文件
└── research/           # 调研结果
```

### 3. Workspace（工作区）

每个开发者的会话日志，存放在 `.trellis/workspace/{开发者名}/`：

```
.trellis/workspace/alice/
├── index.md        # 个人索引
└── journal-1.md    # 每次 /finish-work 追加的会话记录
```

下次开新会话时，AI 能读到「上次做了什么」，无需依赖聊天历史。

## 三、安装与初始化

### 环境要求

| 依赖 | 最低版本 | 用途 |
|------|----------|------|
| Node.js | 18 | Trellis CLI |
| Python | 3.9 | Hook 与自动化脚本 |
| git | 任意较新版本 | 分支、worktree、提交元数据 |

### 安装 CLI

```bash
# 全局安装
npm install -g @mindfoldhq/trellis

# 进入项目目录
cd your-project

# 初始化（-u 指定开发者身份，会创建个人 workspace）
trellis init -u your-name
```

不指定 `-u` 时，会从 `git config user.name` 自动检测。

### 选择 AI 平台

```bash
# 交互式：检测已安装平台并询问
trellis init -u your-name

# 显式指定平台
trellis init -u your-name --claude --cursor
trellis init -u your-name --codex --gemini
```

**Cursor 用户**：

```bash
trellis init -u your-name --cursor
```

会在 `.cursor/` 下生成 `commands/`、`agents/`、`skills/`、`hooks/`。

### 不同 init 场景

| 场景 | 命令 | 结果 |
|------|------|------|
| 首次初始化 | `trellis init -u your-name --cursor` | 创建 `.trellis/` + 引导任务 `00-bootstrap-guidelines` |
| 已有项目加新平台 | `trellis init --cursor` | 只写新平台配置，不生成任务 |
| 新成员加入 | `trellis init -u their-name` | 生成 `00-join-*` onboarding 任务 |
| 同一开发者重复 init | `trellis init -u your-name` | 无操作（已存在） |

### 使用 Spec 模板（可选）

```bash
# 交互式选择官方模板
trellis init -u your-name

# 指定模板（如 Electron 全栈）
trellis init -u your-name --template electron-fullstack

# 从自定义 Git 仓库拉取
trellis init --registry gh:myorg/myrepo/specs
```

官方模板包括：Electron + React、Next.js + oRPC + PostgreSQL、Cloudflare Workers + Hono + Turso 等。

## 四、目录结构一览

初始化后（以 Cursor 为例）：

```
your-project/
├── .trellis/                    # 核心（平台无关）
│   ├── workflow.md              # 三阶段工作流定义
│   ├── config.yaml              # 项目配置
│   ├── spec/                    # 规范库
│   ├── tasks/                   # 任务目录
│   ├── workspace/               # 开发者工作区
│   ├── scripts/                 # Python 自动化脚本
│   └── .runtime/sessions/       # 会话级运行时状态
│
├── .cursor/                     # Cursor 适配层
│   ├── commands/                # /trellis:finish-work 等
│   ├── agents/                  # trellis-implement 等子代理
│   ├── skills/                  # 自动触发的 Skill
│   └── hooks/                   # SessionStart 等 Hook
│
└── .agents/skills/              # 跨平台共享 Skill（agentskills.io 标准）
```

## 五、日常开发工作流

Trellis 0.5+ 采用 **Skill-first**：大部分能力由 Skill 自动触发，你主要用自然语言描述任务，必要时用少量命令推进。

### 基本流程

```text
1. 用自然语言描述任务
   "添加用户登录功能"

2. AI 按 workflow.md 执行 Plan → Execute → Finish

3. 你测试 + 确认提交后
   /trellis:finish-work
```

### 三阶段详解

#### Phase 1 — Plan（规划）

1. `task.py create` 创建任务目录
2. `trellis-brainstorm` Skill：逐问澄清需求，迭代 `prd.md`
3. 需要调研时，spawn `trellis-research` 子代理
4. 配置 `implement.jsonl` / `check.jsonl`（只放 Spec 和研究文件，不放源码路径）
5. `task.py start` 将任务设为当前会话的 active task

#### Phase 2 — Execute（执行）

1. `trellis-implement` 子代理：按 PRD 写代码（**不自动 git commit**）
2. `trellis-check` 子代理：对照 Spec 审查 diff，跑 lint/typecheck/test，**可自修复**

#### Phase 3 — Finish（收尾）

1. `trellis-check` Skill：最终验证
2. （可选）`trellis-break-loop` Skill：难 bug 的根因分析
3. `trellis-update-spec` Skill：把可复用经验写入 `.trellis/spec/`
4. 主会话提议 commit 计划，等你一次确认后执行 `git commit`
5. 你运行 `/trellis:finish-work`：归档任务 + 写 journal

### Cursor 上的会话启动

在 Cursor 等支持 SessionStart Hook 的平台上：

- **打开新会话即可**，Hook 会自动注入：
  - `workflow.md` 摘要
  - 开发者身份、git 状态、活跃任务列表
  - Spec 索引路径
  - Workspace 近期 journal

- **不需要**手动运行 `/trellis:start`（Hook 已承担启动职责）
- 若怀疑上下文未加载，**开一个新会话**即可重新注入

### 卡住时怎么办？

输入：

```text
/trellis:continue
```

AI 会根据当前任务的 `task.json.status` 和每轮注入的 workflow-state 面包屑，自动推进到下一步（规划 / 实现 / 检查 / 更新 Spec 等）。

## 六、命令与 Skill 速查

### 你需要记住的命令（很少）

| 命令 | 何时用 | 作用 |
|------|--------|------|
| `/trellis:continue` | 任务进行中卡住或想推进 | 按 workflow 进入下一阶段 |
| `/trellis:finish-work` | 代码已 commit、验收通过 | 归档任务 + 写 session journal |
| `/trellis:start` | 仅无 Hook 的平台（Kilo/Windsurf 等） | 手动加载上下文 |

### 自动触发的 Skill

| Skill | 触发时机 | 作用 |
|-------|----------|------|
| `trellis-brainstorm` | 创建任务后的规划 | 澄清需求，写 PRD |
| `trellis-before-dev` | 写代码前 | 读相关 Spec |
| `trellis-check` | 实现后 | 验证 + 自修复循环 |
| `trellis-update-spec` | 有可复用经验时 | 更新 Spec 库 |
| `trellis-break-loop` | 难 bug 修复后 | 5 维根因分析与预防 |

### 子代理

| 子代理 | 权限 | 用途 |
|--------|------|------|
| `trellis-research` | 只读 | 代码库搜索、文档调研 |
| `trellis-implement` | 写代码，不 commit | 实现阶段 |
| `trellis-check` | 写代码（修问题） | 审查 + 自修复 |

## 七、任务管理 CLI

```bash
# 创建任务
./.trellis/scripts/task.py create "添加用户登录" --slug user-login

# 设为当前会话任务
./.trellis/scripts/task.py start .trellis/tasks/01-31-user-login

# 添加上下文（Spec 文件）
./.trellis/scripts/task.py add-context "$TASK_DIR" implement \
  ".trellis/spec/backend/index.md" "后端开发指南"

# 列出任务
./.trellis/scripts/task.py list

# 归档
./.trellis/scripts/task.py archive user-login
```

### 任务状态流转

```
create → planning → start → in_progress → archive → completed
```

### JSONL 上下文规则

**应该放入** `implement.jsonl` / `check.jsonl` 的：

- `.trellis/spec/**/*.md` 规范文件
- `{TASK_DIR}/research/*.md` 调研文件

**不应该放入**的：

- 即将修改的源码路径（实现阶段由子代理直接读取）
- 只有 `_example` 占位行而无真实条目

## 八、如何写好 Spec

Spec 是 Trellis 的核心资产。好的 Spec 具备：

1. **具体**：引用项目内真实文件路径和代码
2. **说明原因**：规则背后的现实考量
3. **类型明确**：API 签名、字段类型、错误类型写清楚
4. **低耦合**：一个文件一个主题

示例：

````markdown
## API 输入校验

所有 API 路由必须在调用 service 前用 Zod 校验输入。
Schema 放在路由文件旁边。

```ts
// Bad
const user = await userService.create(req.body);

// Good
const input = CreateUserSchema.parse(req.body);
const user = await userService.create(input);
```

校验失败时，返回 `src/lib/errors.ts` 中定义的标准错误格式。
````

**不要**把「代码应该干净一致」这类空话写进 Spec；**不要**把理想规范当成现有实践文档化。

## 九、七个真实场景

| 场景 | 适用情况 | Trellis 价值 |
|------|----------|--------------|
| 1. 新项目 | 从零建仓库 | 在模式扩散前把早期决策写进 Spec |
| 2. 存量项目 | 规范藏在老 PR 和老人脑子里 | 从真实代码提取模式，不暂停功能开发 |
| 3. 产品功能 | 跨 UI/API/DB/权限 | PRD + Spec + 实现 + 检查对齐 |
| 4. 遗留重构 | 能跑但难改 | 行为不变 + 表征测试 + 分步提取 |
| 5. 反复出现的 Bug | 修了还会再来 | 回归测试 + break-loop + Spec 预防 |
| 6. 重复 Code Review 意见 | 同样评论反复出现 | 把 Review 规则升格为 Spec |
| 7. 团队推广 | 多人多工具 | 同一 `.trellis/` 跨平台共享 |

### 示例：添加「用户登录」

你对 AI 说：

```text
添加用户登录功能
```

Trellis 会自动：

1. 询问是否创建 Trellis 任务（复杂工作需要 consent）
2. 用 `trellis-brainstorm` 写 `prd.md`
3. 你确认后 `/trellis:continue` → 实现 + 检查
4. 更新 Spec（如有新经验）
5. 你 commit 后 `/trellis:finish-work`

### 示例：存量项目接入

```text
这是已有仓库，先不要重构代码。

检查代码库，为下一个功能任务提出最小 Trellis bootstrap。
识别 API 路由、鉴权、日志、测试、前端表单的实际模式。
Spec 只写当前代码能支撑的规则，每条规则引用真实文件路径。
```

## 十、跨会话记忆

执行 `/trellis:finish-work` 后，journal 会追加到 `.trellis/workspace/{name}/journal-N.md`。

下次开新会话，AI 可能这样开场：

```text
Hi Alice — 上次会话你完成了用户登录功能（commit abc1234），
包括 LoginForm 组件、JWT 中间件和 users 表。
接下来做什么？
```

## 十一、升级与维护

```bash
# 升级全局 CLI
trellis upgrade

# 同步项目内 bundled 文件（workflow、hooks、skills 等）
trellis update
```

## 十二、最佳实践

1. **先做一个有用的小任务**，再铺开完整 Spec 库
2. **Spec 随用随填**，不要一次性设计整个项目
3. **复杂任务**需要 `design.md` + `implement.md` 再进入实现
4. **`/trellis:finish-work` 前必须先 commit 功能代码**；finish-work 只做归档和 journal
5. **Review Spec 变更**像 Review 代码一样对待
6. 用 bundled 的 `trellis-spec-bootstarp` Skill 从真实代码草拟首版 Spec
7. 卡住时用 `/trellis:continue`，不必背 workflow 每一步

## 十三、学习资源

| 资源 | 链接 |
|------|------|
| 中文文档 | https://docs.trytrellis.app/zh |
| 安装与首个任务 | https://docs.trytrellis.app/start/install-and-first-task |
| 工作原理 | https://docs.trytrellis.app/beta/start/how-it-works |
| 命令与 Spec | https://docs.trytrellis.app/beta/start/everyday-use |
| 真实场景 | https://docs.trytrellis.app/beta/start/real-world-scenarios |
| 架构概览 | https://docs.trytrellis.app/beta/advanced/architecture |
| GitHub | https://github.com/mindfold-ai/Trellis |
| Discord | https://discord.com/invite/tWcCZ3aRHc |

## 总结

Trellis 不依赖 AI「记住」你的规范，而是**每次会话从文件重新注入上下文**。Spec 管「怎么写」、Task 管「写什么」、Workspace 管「上次做到哪」。在 Cursor 上，打开会话、用自然语言描述任务，必要时用 `/trellis:continue` 和 `/trellis:finish-work` 推进即可。

## 附录：快速上手清单

```bash
# 1. 安装
npm install -g @mindfoldhq/trellis

# 2. 初始化（Cursor 用户加 --cursor）
cd your-project
trellis init -u your-name --cursor

# 3. 在 Cursor 开新会话，直接说：
#    "帮我完成 bootstrap 任务，填写最小 Spec，并创建第一个可运行的垂直切片任务"

# 4. 开发过程中卡住：
#    /trellis:continue

# 5. 测试通过、代码已 commit 后：
#    /trellis:finish-work
```