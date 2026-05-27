---
title: 【AI】Hermes Agent 快速入门
date: 2026-05-27 14:29:13
tags:
- AI
- Hermes
categories:
- AI
---

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/banner.png)

## 一、Hermes Agent 是什么？

**Hermes Agent** 是由 [Nous Research](https://nousresearch.com) 构建的**自改进 AI 智能体**（开源，MIT 许可证）。它不是绑定在 IDE 上的编程副驾驶，也不是单一 API 的聊天封装——而是一个**自主智能体**：运行时间越长，能力越强。

官方核心卖点：

> 唯一内置学习循环的智能体——从经验中创建 Skill、在使用过程中持续改进、主动提示自身持久化知识，并在会话间不断深化对你的建模。

<!-- more -->

### 与常见工具的区别

| 维度 | 普通 Chatbot / Copilot | **Hermes Agent** |
|------|------------------------|------------------|
| 部署位置 | 通常绑定本地 IDE | 本地、VPS、Docker、Modal、Daytona 等任意环境 |
| 交互方式 | 单一界面 | CLI + 20+ 消息平台（Telegram、Discord、钉钉、飞书等） |
| 记忆 | 会话内临时 | MEMORY.md / USER.md + 会话全文搜索 |
| 工作流 | 每次重新解释 | Skill 系统（程序性记忆，可创建、复用、进化） |
| 自动化 | 无或需自建 | 内置 Cron、子 Agent 委托、后台任务 |
| 工具 | 有限 | 70+ 内置工具 + MCP 扩展 |

### 核心能力一览

- **闭环学习循环**：Agent 管理的记忆、自主 Skill 创建、使用中自我改进、FTS5 跨会话召回、Honcho 辩证式用户建模
- **随处运行**：6 种终端后端（local、Docker、SSH、Daytona、Singularity、Modal）
- **多平台网关**：CLI、Telegram、Discord、Slack、WhatsApp、Signal、Matrix、Email、SMS、钉钉、飞书、企业微信、QQ Bot、Teams 等
- **模型灵活**：Nous Portal、OpenRouter、OpenAI、Anthropic、DeepSeek 及任意 OpenAI 兼容端点
- **开放 Skill 标准**：兼容 [agentskills.io](https://agentskills.io)，支持 Skills Hub 社区安装
- **研究就绪**：批处理、轨迹导出、Atropos RL 训练

## 二、架构概览

![图片来源：菜鸟教程](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/image-20260527161909397.png)

Hermes 的核心执行路径：

```
用户输入（CLI / Gateway / API）
    ↓
Prompt 组装（SOUL.md + 记忆 + 上下文文件 + Skill 索引）
    ↓
Agent Loop（LLM 推理 ↔ 工具调用循环）
    ↓
工具层（terminal / file / web / skills / delegate / cron / MCP ...）
    ↓
终端后端（local / docker / ssh / modal ...）
    ↓
响应 + 记忆/Skill 更新 + 会话持久化（state.db）
```

**闭环学习循环（Closed Learning Loop）：**

1. Agent 执行任务
2. 从经验中提取可复用知识 → 写入 Skill 或 Memory
3. Curator 后台维护 Skill（用量跟踪、过时归档、LLM 审查）
4. 下次任务自动加载相关 Skill / 记忆
5. （可选）GEPA 离线进化管道优化 Skill 文本

## 三、安装

### 环境要求

- **最低模型上下文**：64K tokens（多步工具调用需要足够工作内存）
- **Git 安装器额外依赖**：安装程序会自动处理 Python 3.11、Node.js 22、ripgrep、ffmpeg 等

### 一键安装

**Linux / macOS / WSL2：**

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
source ~/.bashrc   # 或 source ~/.zshrc
```

**Windows（原生 PowerShell，早期 Beta）：**

```powershell
iex (irm https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.ps1)
```

建议在 Windows 上使用 WSL2 + Linux 安装器，稳定性更好。

**Android（Termux）：**

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

**pip 安装（最简单，跟踪 PyPI 稳定版）：**

```bash
pip install hermes-agent
hermes postinstall   # 可选：安装 Node.js、浏览器、ripgrep、ffmpeg 并运行 setup
```

### 安装目录结构

| 安装方式 | 代码位置 | 数据目录 |
|----------|----------|----------|
| pip | Python site-packages | `~/.hermes/` |
| git 安装器 | `~/.hermes/hermes-agent/` | `~/.hermes/` |
| root 模式 | `/usr/local/lib/hermes-agent/` | `/root/.hermes/` |

`~/.hermes/` 主要包含：

```
~/.hermes/
├── config.yaml      # 非密钥配置（模型、终端后端、压缩等）
├── .env             # API 密钥和 secrets
├── auth.json        # OAuth 凭据（Nous Portal 等）
├── SOUL.md          # 全局人格/身份定义
├── memories/        # MEMORY.md、USER.md
├── skills/          # Agent 创建和安装的 Skill
├── cron/            # 定时任务
├── sessions/        # Gateway 会话
├── state.db         # SQLite 会话存储（含 FTS5 全文搜索）
└── logs/            # 日志（密钥自动脱敏）
```

## 四、快速上手（5 分钟）

### 第一步：选择 Provider

```bash
hermes model
```

**最简路径 — Nous Portal（一个订阅覆盖 300+ 模型 + Tool Gateway）：**

```bash
hermes setup --portal
```

常用 Provider 示例：

| Provider | 说明 | 配置方式 |
|----------|------|----------|
| Nous Portal | 订阅制，零配置 | `hermes model` OAuth 登录 |
| Anthropic | Claude 模型 | OAuth 或 `ANTHROPIC_API_KEY` |
| OpenRouter | 多模型路由 | `OPENROUTER_API_KEY` |
| DeepSeek | 直连 API | `DEEPSEEK_API_KEY` |
| 阿里云 DashScope | Qwen 模型 | `DASHSCOPE_API_KEY` |
| Custom Endpoint | Ollama、vLLM、SGLang 等 | base URL + API key |

配置存储规则：

- **密钥** → `~/.hermes/.env`
- **普通配置** → `~/.hermes/config.yaml`

```bash
hermes config set model anthropic/claude-opus-4.6
hermes config set OPENROUTER_API_KEY sk-or-...
```

### 第二步：开始对话

```bash
hermes            # 经典 CLI
hermes --tui      # 现代 TUI（推荐：模态覆盖层、鼠标选择）
```

验证用 Prompt 示例：

```text
用 5 条要点总结这个仓库，并告诉我主入口文件是什么。
```

成功标志：横幅显示正确模型、无错误回复、能使用工具、多轮对话正常。

### 第三步：验证会话恢复

```bash
hermes --continue    # 恢复最近会话
hermes -c            # 简写
```

### 第四步：按需扩展

| 目标 | 命令 |
|------|------|
| 完整配置向导 | `hermes setup` |
| 诊断问题 | `hermes doctor` |
| 更新版本 | `hermes update` |
| 消息机器人 | `hermes gateway setup` |
| 配置工具 | `hermes tools` |
| 浏览 Skill | `hermes skills browse` |

**经验法则**：如果 Hermes 无法完成一次正常对话，先不要叠加 gateway、cron、MCP 等功能。

## 五、CLI 使用指南

### 常用启动参数

```bash
hermes chat -q "你好"                          # 单次查询（非交互）
hermes chat --model "anthropic/claude-sonnet-4"
hermes chat --toolsets "web,terminal,skills"
hermes -s github-pr-workflow -q "打开 draft PR"
hermes --resume <session_id>                   # 恢复指定会话
hermes -w -q "Fix issue #123"                  # 在 git worktree 中运行
```

### 状态栏

CLI 底部实时显示：

```text
 ⚕ claude-sonnet-4-20250514 │ 12.4K/200K │ [██████░░░░] 6% │ $0.06 │ 15m
```

上下文占用颜色：绿色 < 50%、黄色 50–80%、橙色 80–95%、红色 ≥ 95%（考虑 `/compress`）。

### 快捷键

| 按键 | 功能 |
|------|------|
| `Enter` | 发送消息 |
| `Alt+Enter` / `Ctrl+J` / `Shift+Enter` | 换行（多行输入） |
| `Ctrl+C` | 中断 Agent（2 秒内连按两次强制退出） |
| `Ctrl+D` | 退出 |
| `Ctrl+G` | 用 `$EDITOR` 编辑当前输入（长 Prompt 利器） |
| `Ctrl+B` | 语音模式录音（需启用 voice） |
| `Ctrl+V` | 粘贴文本或剪贴板图片 |
| `Tab` | 斜杠命令自动补全 |

### 斜杠命令

输入 `/` 触发自动补全。常用命令：

| 命令 | 功能 |
|------|------|
| `/help` | 帮助 |
| `/model` | 切换模型 |
| `/tools` | 列出可用工具 |
| `/compress` | 压缩上下文 |
| `/usage` | Token 用量详情 |
| `/title My Session` | 命名当前会话 |
| `/voice on` | 启用语音模式 |
| `/background <prompt>` | 后台运行独立任务 |
| `/personality concise` | 切换人格 |
| `/skills browse` | 浏览 Skills Hub |

每个已安装的 Skill 也会自动注册为斜杠命令，例如 `/github-pr-workflow`。

### 后台任务

```text
/background 分析 /var/log 中今天的错误并汇总
```

后台任务在独立线程中运行，不阻塞前台会话，完成后以面板形式展示结果。

### 会话管理

```bash
hermes sessions list
hermes -r "auth-refactor"     # 按标题恢复
```

长会话会在接近上下文上限时自动压缩（默认 50% 阈值），保留前 3 轮和后 20 轮。

## 六、配置详解

### 配置优先级

1. CLI 参数（最高）
2. `~/.hermes/config.yaml`
3. `~/.hermes/.env`
4. 内置默认值

### 常用配置示例

```yaml
# ~/.hermes/config.yaml

# 终端后端（命令实际执行位置）
terminal:
  backend: local    # local | docker | ssh | modal | daytona | vercel_sandbox | singularity
  timeout: 180

# 上下文压缩
compression:
  enabled: true
  threshold: 0.50

# 记忆
memory:
  memory_enabled: true
  user_profile_enabled: true
  memory_char_limit: 2200
  user_char_limit: 1375

# MCP 服务器
mcp_servers:
  github:
    command: npx
    args: ["-y", "@modelcontextprotocol/server-github"]
    env:
      GITHUB_PERSONAL_ACCESS_TOKEN: "ghp_xxx"

# 自定义快捷命令
quick_commands:
  status:
    type: exec
    command: systemctl status hermes-agent
```

### 终端后端选择

| 后端 | 执行位置 | 适用场景 |
|------|----------|----------|
| `local` | 本机 | 日常开发（注意：与当前用户同权限） |
| `docker` | Docker 容器 | 沙箱隔离、不可信代码 |
| `ssh` | 远程服务器 | 远程开发、更强算力 |
| `modal` / `daytona` | 云端 | 无服务器、按需计费 |

不可信仓库建议：

```bash
hermes config set terminal.backend docker
```

## 七、记忆系统

Hermes 拥有**有界、经过整理**的跨会话记忆，由两个文件构成：

| 文件 | 用途 | 字符上限 |
|------|------|----------|
| `MEMORY.md` | Agent 笔记：环境、约定、经验教训 | 2,200 字符（~800 tokens） |
| `USER.md` | 用户档案：偏好、沟通风格 | 1,375 字符（~500 tokens） |

存储路径：`~/.hermes/memories/`

### 工作原理

- 会话开始时以**冻结快照**注入系统 Prompt（保留 LLM 前缀缓存）
- Agent 通过 `memory` 工具管理：`add` / `replace` / `remove`
- 会话中修改会立即写盘，但**下次会话**才出现在 Prompt 中

### memory vs user

| 目标 | 存什么 |
|------|--------|
| `memory` | 环境事实、项目约定、工具怪癖、已完成任务摘要 |
| `user` | 姓名、时区、沟通偏好、工作习惯、技术水平 |

### 会话搜索（session_search）

除固定记忆外，所有 CLI 和消息会话存储在 `~/.hermes/state.db`，支持 FTS5 全文搜索：

```bash
hermes sessions list
```

| 特性 | 持久记忆 | 会话搜索 |
|------|----------|----------|
| 容量 | ~1,300 tokens | 无限制 |
| 速度 | 即时（在 Prompt 中） | ~20ms 查询 |
| 用途 | 关键事实始终可用 | 「我们上周讨论过 X 吗？」 |

### 外部记忆提供商

```bash
hermes memory setup
hermes memory status
```

支持 Honcho、Mem0、Hindsight 等 8 个插件，与内置记忆并行运行。

## 八、Skill 系统

Skill 是 Agent 按需加载的**知识文档**（程序性记忆），遵循 [agentskills.io](https://agentskills.io) 开放标准。

### 使用方式

**斜杠命令（每个 Skill 自动注册）：**

```text
/github-pr-workflow 为 auth 重构创建一个 PR
/plan 设计 auth provider 迁移方案
/axolotl 帮我在数据集上微调 Llama 3
```

**CLI 管理：**

```bash
hermes skills browse
hermes skills search kubernetes
hermes skills install openai/skills/k8s
hermes skills list --source hub
```

### 渐进式披露（省 Token）

```text
Level 0: skills_list()        → 名称 + 描述列表（~3k tokens）
Level 1: skill_view(name)     → 完整 Skill 内容
Level 2: skill_view(name, path) → 特定参考文件
```

Agent 只在真正需要时才加载完整内容。

### SKILL.md 格式

```markdown
---
name: my-skill
description: 简要描述
version: 1.0.0
metadata:
  hermes:
    tags: [python, automation]
    category: devops
---

# Skill 标题

## When to Use
触发条件

## Procedure
1. 步骤一
2. 步骤二

## Pitfalls
已知失败模式

## Verification
如何确认成功
```

### Agent 自主创建 Skill（闭环学习）

Agent 在以下情况会通过 `skill_manage` 工具创建 Skill：

- 完成复杂任务（5+ 次工具调用）后
- 踩坑并找到正确路径后
- 用户纠正其做法后

你也可以直接说：

```text
把刚才的流程保存为 deploy-staging 这个 Skill
```

下次只需 `/deploy-staging`。

### Skill Bundle（组合命令）

```bash
hermes bundles create backend-dev \
  --skill github-code-review \
  --skill test-driven-development \
  --skill github-pr-workflow
```

然后 `/backend-dev 重构 auth 中间件` 会一次性加载多个 Skill。

### Memory vs Skill

| 类型 | 存什么 | 示例 |
|------|--------|------|
| Memory | 事实（what） | 「项目用 Go 1.22，测试命令 make test」 |
| Skill | 流程（how） | 「部署 staging 的完整 8 步检查清单」 |

## 九、上下文文件与人格

Hermes 会自动发现并注入项目上下文文件：

| 文件 | 作用 |
|------|------|
| `AGENTS.md` | 项目架构、编码约定（工作目录顶层） |
| `CLAUDE.md` / `.hermes.md` | 项目说明 |
| `.cursorrules` | Cursor 规则（兼容读取） |
| `~/.hermes/SOUL.md` | **全局** Agent 人格/身份（系统 Prompt 首位） |

**AGENTS.md 示例：**

```markdown
# Project Context
- FastAPI 后端 + SQLAlchemy ORM
- 数据库操作一律 async/await
- 测试放在 tests/，使用 pytest-asyncio
- 禁止提交 .env 文件
```

**SOUL.md 示例：**

```markdown
# Soul
你是资深后端工程师。回答简洁直接。
除非被问到，否则跳过冗长解释。优先考虑错误处理和边界情况。
```

- **SOUL.md** → 持久人格
- **AGENTS.md** → 项目特定规则

### 上下文引用（@ 语法）

在消息中用 `@` 附加文件、文件夹、git diff、URL，Hermes 会自动展开内容。

## 十、MCP 集成

连接任意 MCP 服务器扩展工具能力：

```yaml
# ~/.hermes/config.yaml
mcp_servers:
  github:
    command: npx
    args: ["-y", "@modelcontextprotocol/server-github"]
    env:
      GITHUB_PERSONAL_ACCESS_TOKEN: "ghp_xxx"
```

Hermes 支持按服务器过滤 MCP 工具，安全控制加载范围。详见 [Use MCP with Hermes](https://hermes-agent.nousresearch.com/docs/guides/use-mcp-with-hermes)。

## 十一、消息网关

通过单一 Gateway 接入 20+ 平台：

```bash
hermes gateway setup      # 交互式配置
hermes gateway            # 前台运行
hermes gateway install    # 安装为系统/用户服务
hermes gateway status
```

支持平台包括：Telegram、Discord、Slack、WhatsApp、Signal、Matrix、Mattermost、Email、SMS、钉钉、飞书、企业微信、微信、QQ Bot、Teams、Google Chat、Home Assistant 等。

### 消息平台技巧

- 用 `/sethome` 设置主频道，Cron 结果会投递到这里
- 用 `/title` 命名会话，方便 `hermes -r "auth-refactor"` 恢复
- 启用 **DM pairing**：新用户 DM 机器人获得配对码，你用 `hermes pairing approve telegram XKGH5N7P` 批准
- **切勿**在有终端权限的 Bot 上设置 `GATEWAY_ALLOW_ALL_USERS=true`

```bash
TELEGRAM_ALLOWED_USERS=123456789,987654321
DISCORD_ALLOWED_USERS=123456789012345678
```

## 十二、工具与自动化

### 工具概览

Hermes 内置 70+ 工具，按 **toolset** 组织，可通过 `hermes tools` 按平台启用/禁用：

- **web**：搜索、抓取、浏览
- **terminal**：终端命令执行
- **file**：读写、patch 文件
- **skills**：Skill 管理
- **delegation**：子 Agent 委托
- **memory**：记忆读写
- **browser**：浏览器自动化
- **vision**：图像分析
- 等等

### 子 Agent 委托（delegate_task）

需要并行研究多个方向时，让 Agent 使用 `delegate_task` .spawn 隔离的子 Agent，各自独立上下文，只返回摘要。

### 代码执行（execute_code）

Agent 可编写 Python 脚本并通过 RPC 调用 Hermes 工具，将多步流水线压缩为单次推理。

### 定时任务（Cron）

**自然语言创建：**

```text
每天早上 9 点检查 Hacker News 的 AI 新闻，把摘要发到 Telegram。
```

**斜杠命令：**

```bash
/cron add "every 2h" "Check server status"
/cron add "every 1h" "汇总新 feed" --skill blogwatcher
/cron list
/cron pause <job_id>
```

**CLI：**

```bash
hermes cron create "every 2h" "Check server status"
hermes gateway install    # 安装 gateway 守护进程（调度器每 60 秒 tick）
hermes cron list
```

Cron 任务在**全新 Agent 会话**中运行，Prompt 必须自包含（不能写「检查一下那个服务器问题」这种模糊指令）。

**无 Agent 模式（纯脚本，零 Token）：**

```bash
hermes cron create "every 5m" \
  --no-agent \
  --script memory-watchdog.sh \
  --deliver telegram
```

**任务链（context_from）：**

Job B 自动接收 Job A 最近一次输出作为上下文，适合 collect → filter → deliver 流水线。

## 十三、安全

### 命令审批

Hermes 在执行前检查危险命令模式（`rm -rf`、SQL DROP、curl | bash 等）。审批选项：once / session / always / deny。**谨慎选择 always**。

### 容器隔离

Docker / Modal / Daytona 后端中，容器本身是安全边界，危险命令检查会跳过——确保容器镜像已正确锁定。

### 记忆安全扫描

写入 MEMORY.md 的内容会扫描 prompt 注入、凭据外泄、不可见 Unicode 等威胁模式。

### Cron Prompt 扫描

创建定时任务时，Prompt 同样会扫描注入和外泄模式。

## 十四、最佳实践

### 获得更好结果

1. **具体描述需求**：「修复 api/handlers.py 第 47 行 TypeError」优于「修复代码」
2. **前置上下文**：直接粘贴错误堆栈、文件路径
3. **用 AGENTS.md 避免重复说明**项目约定
4. **让 Agent 自主使用工具**，不要逐步手把手指引
5. **复杂流程先查 Skill**：`/skills` 或 `hermes skills search`

### 性能与成本

- 保持系统 Prompt 稳定以利用**前缀缓存**
- 长会话用 `/compress` 压缩上下文
- 并行研究用 `delegate_task`
- 批量操作用 `execute_code` 写脚本一次完成
- 简单任务切换更快/更便宜的模型（`/model`）

### 常见故障排查

| 现象 | 解决方法 |
|------|----------|
| `hermes: command not found` | `source ~/.bashrc` 或检查 PATH |
| API key 未设置 | `hermes model` 或 `hermes config set KEY val` |
| Gateway 无消息 | 重新 `hermes gateway setup`，检查 token 和白名单 |
| `--continue` 找不到会话 | `hermes sessions list`，确认 profile 一致 |
| 配置问题 | `hermes doctor` → `hermes model` → `hermes setup` |

## 十五、命令速查表

| 命令 | 说明 |
|------|------|
| `hermes` | 开始聊天 |
| `hermes --tui` | 现代 TUI 界面 |
| `hermes setup` | 完整配置向导 |
| `hermes setup --portal` | Nous Portal 一键配置 |
| `hermes model` | 选择 Provider 和模型 |
| `hermes tools` | 配置各平台工具集 |
| `hermes config set KEY VAL` | 设置配置项 |
| `hermes config edit` | 编辑 config.yaml |
| `hermes doctor` | 诊断环境 |
| `hermes update` | 更新到最新版 |
| `hermes --continue` / `-c` | 恢复最近会话 |
| `hermes sessions list` | 列出历史会话 |
| `hermes gateway setup` | 配置消息平台 |
| `hermes gateway` | 启动 Gateway |
| `hermes skills browse` | 浏览 Skills Hub |
| `hermes skills install <id>` | 安装 Skill |
| `hermes cron create ...` | 创建定时任务 |
| `hermes memory setup` | 配置外部记忆提供商 |

## 十六、学习资源

| 资源 | 链接 |
|------|------|
| 英文文档 | https://hermes-agent.nousresearch.com/docs |
| 中文文档 | https://hermes-agent.nousresearch.com/docs/zh-Hans/ |
| 快速入门 | https://hermes-agent.nousresearch.com/docs/getting-started/quickstart |
| 安装指南 | https://hermes-agent.nousresearch.com/docs/getting-started/installation |
| 配置 | https://hermes-agent.nousresearch.com/docs/user-guide/configuration |
| CLI 指南 | https://hermes-agent.nousresearch.com/docs/user-guide/cli |
| 记忆系统 | https://hermes-agent.nousresearch.com/docs/user-guide/features/memory |
| Skill 系统 | https://hermes-agent.nousresearch.com/docs/user-guide/features/skills |
| Cron 定时任务 | https://hermes-agent.nousresearch.com/docs/user-guide/features/cron |
| 技巧与最佳实践 | https://hermes-agent.nousresearch.com/docs/guides/tips |
| 架构 | https://hermes-agent.nousresearch.com/docs/developer-guide/architecture |
| GitHub | https://github.com/NousResearch/hermes-agent |
| Discord | https://discord.gg/NousResearch |
| LLM 可读索引 | https://hermes-agent.nousresearch.com/docs/llms.txt |
| 完整文档（单文件） | https://hermes-agent.nousresearch.com/docs/llms-full.txt |

## 总结

Hermes Agent 的核心价值在于：**不依赖单次对话的「记忆力」，而是通过文件化的 Memory、Skill 和会话存储，让 Agent 越用越懂你和你的项目**。它既可以作为终端里的全能助手，也可以 7×24 运行在 VPS 上，通过 Telegram 或钉钉随时响应；内置 Cron、子 Agent、MCP 和 70+ 工具，覆盖从日常编码到自动化运维的完整链路。

建议路径：**先跑通一次完整对话 → 写 AGENTS.md → 安装几个 Skill → 再接入 Gateway 和 Cron**。

## 附录：快速上手清单

```bash
# 1. 安装
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
source ~/.bashrc

# 2. 配置 Provider（推荐 Nous Portal 一键）
hermes setup --portal
# 或：hermes model

# 3. 开始对话
hermes --tui

# 4. 验证会话恢复
hermes --continue

# 5. 按需扩展
hermes gateway setup    # 消息机器人
hermes skills browse    # 安装 Skill
hermes tools            # 调整工具权限
```

## 附录：参考资料

> 1、英文文档：[Hermes Agent 官方文档](https://hermes-agent.nousresearch.com/docs) 
> 2、中文文档：https://hermes-agent.nousresearch.com/docs/zh-Hans/
