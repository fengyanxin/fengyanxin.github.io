---
title: 【AI】Cursor CLI 快速入门
date: 2026-05-25 17:07:22
tags:
- AI
- OpenClaw
categories:
- AI
---

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/image-20260525172529182.png)

## 什么是 Cursor CLI ?

Cursor CLI 是 Cursor 提供的**终端 AI 编程助手**。你可以在命令行中：

- 与 AI Agent 对话，编写、审查、修改代码
- 在 CI/CD 流水线中自动化代码审查、修复、生成
- 通过 MCP 扩展工具能力（数据库、浏览器、API 等）
- 在不打开 IDE 的情况下完成大部分开发任务

CLI 的核心命令是 `agent`（部分系统也支持 `cursor agent`）。

<!-- more -->

## 安装

### macOS / Linux / WSL

```bash
curl https://cursor.com/install -fsS | bash
```

安装完成后，确保 `~/.local/bin` 或 `~/.cursor/bin` 在 PATH 中：

```bash
# 添加到 ~/.zshrc 或 ~/.bashrc
export PATH="$HOME/.local/bin:$PATH"
```

### Windows（PowerShell）

```powershell
irm 'https://cursor.com/install?win32=true' | iex
```

### 验证安装

```bash
agent --version
agent about
```

### 安装 Shell 集成（可选）

在终端中快速启动 Agent：

```bash
agent install-shell-integration
```

卸载：

```bash
agent uninstall-shell-integration
```

### 更新 CLI

```bash
agent update
```

## 登录与认证

### 浏览器登录（推荐）

```bash
agent login
```

会打开浏览器完成 OAuth 认证。若不想自动打开浏览器：

```bash
NO_OPEN_BROWSER=1 agent login
```

### 查看登录状态

```bash
agent status
# 或
agent whoami
```

### API Key 认证（适合 CI / 脚本）

```bash
export CURSOR_API_KEY="your_api_key_here"
agent -p "review this code"
```

也可通过参数传入：

```bash
agent --api-key "your_api_key_here" -p "fix lint errors"
```

### 退出登录

```bash
agent logout
```

## 快速上手

### 进入项目目录

```bash
cd /path/to/your/project
```

### 启动交互式 Agent

```bash
agent
```

### 带初始提示启动

```bash
agent "重构 auth 模块，改用 JWT"
```

### 指定工作区

```bash
agent --workspace ~/projects/my-app "添加单元测试"
```

## 交互模式

交互模式适合探索性开发、多轮对话和需要人工确认的场景。

### 启动方式

```bash
agent
agent "帮我分析这个项目的架构"
agent --plan "设计新的缓存层方案"
agent --mode ask "解释一下这段代码的作用"
```

### 常用斜杠命令

在交互会话中输入 `/` 可查看可用命令，常见包括：

| 命令 | 说明 |
|------|------|
| `/help` | 查看帮助 |
| `/model <name>` | 切换模型，如 `/model auto`、`/model gpt-5.2` |
| `/sandbox` | 配置沙箱模式与网络访问 |
| `/mcp` | 管理 MCP 服务器 |

### 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `↑` | 浏览上一条输入 |
| `Shift + Tab` | 切换运行模式（Agent / Plan / Ask） |
| `Shift + Enter` | 插入换行（多行输入） |
| `Ctrl + J` / `Ctrl + Enter` | 插入换行（通用替代） |
| `Ctrl + D` | 退出 CLI |

### 会话管理

```bash
# 列出历史会话
agent ls

# 恢复最近一次会话
agent resume

# 继续上一次会话
agent --continue

# 恢复指定会话
agent --resume="chat-id-here"
```

## 非交互模式（脚本 / CI）

使用 `-p` / `--print` 标志以非交互方式运行，输出直接打印到终端，适合脚本和自动化流水线。

### 基本用法

```bash
agent -p "查找并修复性能问题" --model "gpt-5.2"
```

### 输出格式

```bash
# 纯文本（默认，适合脚本解析）
agent -p "review these changes" --output-format text

# JSON 格式
agent -p "analyze codebase" --output-format json

# 流式 JSON（配合 --stream-partial-output）
agent -p "generate report" --output-format stream-json --stream-partial-output
```

### 常用参数组合

```bash
# 自动批准所有工具调用（谨慎使用）
agent -p "fix all lint errors" --force
# 或
agent -p "fix all lint errors" --yolo

# 信任工作区（headless 模式，跳过确认）
agent -p "run tests and fix failures" --trust

# 自动批准 MCP 服务器
agent -p "query database for errors" --approve-mcps

# 启用沙箱
agent -p "refactor utils" --sandbox enabled
```

### 脚本示例

```bash
#!/bin/bash
set -e

cd /path/to/project

RESULT=$(agent -p "运行测试，若有失败则修复并说明改动" \
  --output-format text \
  --trust)

echo "$RESULT"
```

## 常用命令参考

### 全局选项

| 选项 | 说明 |
|------|------|
| `-v, --version` | 显示版本 |
| `-p, --print` | 非交互模式，输出到终端 |
| `--output-format` | 输出格式：`text` / `json` / `stream-json` |
| `--mode` | 启动模式：`plan` / `ask` |
| `--plan` | 等同于 `--mode=plan` |
| `--model` | 指定模型 |
| `--list-models` | 列出可用模型 |
| `-f, --force` / `--yolo` | 自动批准工具调用 |
| `--sandbox` | 沙箱：`enabled` / `disabled` |
| `--approve-mcps` | 自动批准 MCP |
| `--trust` | 信任工作区（仅 headless） |
| `--workspace` | 指定工作目录 |
| `--worktree` | 在隔离 git worktree 中运行 |
| `--resume` | 恢复指定会话 |
| `--continue` | 继续上次会话 |

### 子命令

| 命令 | 说明 |
|------|------|
| `agent login` | 登录 |
| `agent logout` | 退出 |
| `agent status` | 查看认证状态 |
| `agent about` | 版本、系统、账户信息 |
| `agent models` | 列出可用模型 |
| `agent update` | 更新 CLI |
| `agent ls` | 列出历史会话 |
| `agent resume` | 恢复最近会话 |
| `agent create-chat` | 创建新会话并返回 ID |
| `agent generate-rule` | 交互式生成 Cursor Rule |
| `agent mcp` | 管理 MCP 服务器 |
| `agent worker` | 启动私有云 Worker |

## 运行模式

Cursor CLI 支持三种主要模式：

| 模式 | 启动方式 | 特点 |
|------|----------|------|
| **Agent** | `agent`（默认） | 可读写文件、执行命令、完整工具权限 |
| **Plan** | `agent --plan` 或 `--mode plan` | 只读，用于分析、设计方案，不直接改代码 |
| **Ask** | `agent --mode ask` | 只读 Q&A，适合解释代码、回答问题 |

在交互模式中，可用 `Shift + Tab` 快速切换。

## 配置文件详解

### 全局配置

路径：`~/.cursor/cli-config.json`

修改后需**重启 CLI** 生效。

### 项目级配置

项目可在 `.cursor/cli.json` 中覆盖部分设置。CLI 会从 git 根目录到当前目录逐层合并，**深层配置优先级更高**。项目配置仅影响当前会话，不会写回全局配置。

### 常用配置项

```json
{
  "permissions": {
    "allow": ["Shell(git)", "Read(src/**/*.ts)", "Write(src/**)"],
    "deny": ["Shell(rm)", "Read(.env*)", "Write(**/*.key)"]
  },
  "editor": {
    "vimMode": false,
    "defaultBehavior": "agent"
  },
  "display": {
    "showLineNumbers": false,
    "showThinkingBlocks": false,
    "showStatusIndicators": false
  },
  "approvalMode": "allowlist",
  "sandbox": {
    "mode": "disabled",
    "networkAccess": "user_config_with_defaults",
    "networkAllowlist": []
  },
  "maxMode": false,
  "attribution": {
    "attributeCommitsToAgent": true,
    "attributePRsToAgent": true
  },
  "webFetchDomainAllowlist": ["docs.github.com", "*.example.com"]
}
```

### 配置项说明

| 配置项 | 说明 |
|--------|------|
| `permissions.allow` / `deny` | 工具权限白名单 / 黑名单 |
| `approvalMode` | `allowlist`（默认，需确认）或 `unrestricted`（自动批准） |
| `sandbox.mode` | `disabled` / `enabled` |
| `sandbox.networkAccess` | 沙箱网络访问策略 |
| `editor.vimMode` | 启用 Vim 键位 |
| `maxMode` | 启用 Max Mode 高质量响应 |
| `attribution` | Agent 提交/PR 是否署名 |
| `webFetchDomainAllowlist` | Web Fetch 工具允许的域名 |

### 不建议手动修改的字段

以下字段由 CLI 内部管理，请勿手动编辑：

- `version`、`model`、`selectedModel`、`modelParameters`
- `privacyCache`、`authInfo`
- `conversationClassificationScoredConversations`

## 权限与安全

### 权限模式

CLI 通过 `permissions` 控制 Agent 可调用的工具：

```json
{
  "permissions": {
    "allow": [
      "Shell(ls)",
      "Shell(git)",
      "Read(src/**/*.ts)",
      "Write(docs/**/*)",
      "WebFetch(docs.github.com)",
      "Mcp(playwright:*)"
    ],
    "deny": [
      "Shell(rm)",
      "Read(.env*)",
      "Write(**/*.key)",
      "WebFetch(malicious-site.com)"
    ]
  }
}
```

### 权限模式语法

| 类型 | 示例 |
|------|------|
| Shell 命令 | `Shell(git)`、`Shell(npm)` |
| 读文件 | `Read(src/**/*.ts)`、`Read(.env*)` |
| 写文件 | `Write(package.json)`、`Write(docs/**)` |
| 网页抓取 | `WebFetch(*.github.com)` |
| MCP 工具 | `Mcp(server-name:tool-name)`、`Mcp(datadog:*)` |

### 审批模式

- **`allowlist`（默认）**：不在 allow 列表中的工具需人工确认
- **`unrestricted`**：自动批准所有工具（等同 `--yolo`，生产环境慎用）

### 沙箱

沙箱限制 Agent 执行的 Shell 命令和网络访问：

```bash
# 交互式配置
/sandbox

# 命令行启用
agent --sandbox enabled -p "run tests"
```

配置示例：

```json
{
  "sandbox": {
    "mode": "enabled",
    "networkAccess": "user_config_only",
    "networkAllowlist": ["api.github.com", "pypi.org"]
  }
}
```

## MCP 服务器管理

MCP（Model Context Protocol）让 Agent 连接外部工具和服务。

### 配置文件位置

- 全局：`~/.cursor/mcp.json`
- 项目：`.cursor/mcp.json`

### CLI 管理命令

```bash
# 列出已配置的 MCP 及状态
agent mcp list

# 查看某 MCP 提供的工具
agent mcp list-tools playwright

# 启用 MCP
agent mcp enable <identifier>

# 禁用 MCP
agent mcp disable <identifier>

# MCP 认证
agent mcp login <identifier>
```

### 在 Agent 中使用 MCP

```bash
# Agent 会在需要时自动调用 MCP 工具
agent -p "打开 google.com 并截图"

# 非交互模式自动批准 MCP
agent --approve-mcps -p "查询数据库最近错误"
```

### MCP 配置示例

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    },
    "lanhu": {
      "url": "http://localhost:8000/mcp?role=Developer&name=YourName"
    }
  }
}
```

## Git Worktree 隔离开发

使用 `--worktree` 在**临时 git worktree** 中运行 Agent，改动与当前工作区隔离。Worktree 由 Cursor 管理，位于 `~/.cursor/worktrees/`。

### 基本用法

```bash
# 从当前仓库创建临时 worktree
agent --worktree "升级测试框架并修复失败的快照"

# 指定 worktree 名称
agent --worktree my-feature "实现用户认证"

# 指定基准分支
agent --worktree --worktree-base main "修复 flaky 测试"

# 跳过 worktree 初始化脚本
agent --worktree --skip-worktree-setup "quick fix"
```

### 跨目录指定项目

```bash
agent --workspace ~/src/my-app --worktree "修复 auth 测试并开 PR"
```

适合：并行实验、高风险重构、不想污染当前分支时使用。

## Rules、Skills 与 Hooks

### Cursor Rules

Rules 为 Agent 提供持久化项目规范。

```bash
# 交互式生成 Rule
agent generate-rule
# 或
agent rule
```

Rule 文件通常放在：

- 项目：`.cursor/rules/` 或 `AGENTS.md`
- 用户：`~/.cursor/rules/`

### Skills

Skills 是可复用的 Agent 能力包，存放在：

- 用户：`~/.cursor/skills-cursor/`、`~/.claude/skills/`
- 项目：`.cursor/skills/`

Agent 会根据任务描述自动匹配相关 Skill。

### Hooks

Hooks 在 Agent 生命周期事件前后执行自定义逻辑（审计、拦截、格式化等）。

**项目级**：`.cursor/hooks.json` + `.cursor/hooks/*`  
**用户级**：`~/.cursor/hooks.json` + `~/.cursor/hooks/*`

示例：

```json
{
  "version": 1,
  "hooks": {
    "beforeShellExecution": [
      {
        "command": ".cursor/hooks/audit-shell.sh"
      }
    ],
    "afterFileEdit": [
      {
        "command": ".cursor/hooks/format.sh"
      }
    ]
  }
}
```

常用事件：

| 事件 | 用途 |
|------|------|
| `beforeShellExecution` | 拦截 / 审计 Shell 命令 |
| `afterShellExecution` | 审计命令输出 |
| `beforeMCPExecution` | 拦截 MCP 调用 |
| `beforeReadFile` | 控制文件读取 |
| `afterFileEdit` | 编辑后格式化 |
| `beforeSubmitPrompt` | 提交前校验 Prompt |
| `stop` | Agent 完成后的后续动作 |

## 自定义状态栏

CLI 支持在输入框上方显示自定义状态栏，类似 Claude Code 的 status line。

在 `~/.cursor/cli-config.json` 中添加：

```json
{
  "statusLine": {
    "type": "command",
    "command": "~/.cursor/statusline.sh",
    "padding": 2,
    "updateIntervalMs": 300,
    "timeoutMs": 2000
  }
}
```

状态栏脚本通过 **stdin** 接收 JSON 会话信息（模型、上下文用量、工作目录等），**stdout** 输出要显示的文本。

示例脚本：

```bash
#!/bin/bash
# ~/.cursor/statusline.sh
INPUT=$(cat)
MODEL=$(echo "$INPUT" | jq -r '.model.display_name // "unknown"')
CWD=$(echo "$INPUT" | jq -r '.cwd // "."')
echo "[$MODEL] $CWD"
```

## CI / GitHub Actions 集成

### GitHub Actions 示例

```yaml
name: Cursor Agent Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Cursor CLI
        run: |
          curl https://cursor.com/install -fsS | bash
          echo "$HOME/.cursor/bin" >> $GITHUB_PATH

      - name: Run Cursor Agent
        env:
          CURSOR_API_KEY: ${{ secrets.CURSOR_API_KEY }}
        run: |
          agent -p "Review these PR changes for security and correctness" \
            --output-format text \
            --trust
```

### CI 最佳实践

1. 使用 `CURSOR_API_KEY` 而非交互式登录
2. 配合 `--trust` 跳过工作区确认
3. 用 `--output-format text` 或 `json` 便于解析
4. 通过 `permissions.deny` 限制危险操作
5. 敏感仓库建议启用 `--sandbox enabled`

## 实用技巧

### 切换模型

```bash
# 命令行指定
agent --model sonnet-4 -p "refactor module"

# 列出可用模型
agent models
agent --list-models

# 交互模式中
/model auto
/model gpt-5.2
```

### 循环任务（/loop）

在交互模式中可用 `/loop` 定时重复执行 Prompt，例如：

```
/loop 5m 检查部署状态
/loop 每 10 分钟运行测试
```

### 插件目录

```bash
agent --plugin-dir ~/.cursor/my-plugin -p "use custom tools"
```

### 环境变量

| 变量 | 说明 |
|------|------|
| `CURSOR_API_KEY` | API Key 认证 |
| `NO_OPEN_BROWSER` | 登录时不打开浏览器 |

### 与 IDE 的关系

- `cursor` 命令：打开 Cursor IDE（需已安装桌面版）
- `agent` 命令：运行终端 Agent（**无需安装 IDE**）

若仅安装了 CLI，直接使用 `agent` 即可。

## 故障排查

### CLI 找不到

```bash
which agent
echo $PATH
# 确保 ~/.local/bin 在 PATH 中
```

### 未登录 / 认证失败

```bash
agent status
agent logout && agent login
# CI 环境检查 CURSOR_API_KEY
```

### 工具调用被拦截

1. 检查 `~/.cursor/cli-config.json` 中的 `permissions`
2. 确认 `approvalMode` 设置
3. 临时使用 `--force`（谨慎）

### MCP 无法连接

```bash
agent mcp list
agent mcp enable <name>
# 检查 ~/.cursor/mcp.json 配置
# HTTP MCP 确认服务已启动且 URL 正确
```

### 网络 / 代理问题

```json
{
  "network": {
    "useHttp1ForAgent": true
  }
}
```

若 HTTP/2 连接不稳定，可启用 HTTP/1.1（SSE 流式）。

### 更新到最新版

```bash
agent update
agent about
```

### 获取帮助

```bash
agent --help
agent help mcp
agent help login
```

## 参考文档

官方文档：https://cursor.com/docs/cli  
问题反馈：https://forum.cursor.com

## 附录：一分钟上手清单

```bash
# 1. 安装
curl https://cursor.com/install -fsS | bash

# 2. 登录
agent login

# 3. 进入项目
cd ~/projects/my-app

# 4. 交互使用
agent

# 5. 脚本使用
agent -p "fix lint and run tests" --trust

# 6. 查看状态
agent about
agent status
```
