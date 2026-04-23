---
title: 【AI】OpenClaw 快速入门
date: 2026-04-23 14:45:18
tags:
- AI
- OpenClaw
categories:
- AI
---

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/fe0e8572-f35b-4e20-8b00-7723e48ec498.png)

## 简介

OpenClaw（**原名 Clawdbot，过渡名 Moltbot**）是 2026 年 1 月突然爆火的开源个人 AI 助手项目，由 Peter Steinberger（PSPDFKit 创始人）开发。

OpenClaw 是一个可执行任务的智能体，我们给指令，它不仅回答，还能主动操作系统、访问网页、处理邮件、整理文件、发起提醒甚至自动编写代码。

OpenClaw 是一个把 **本地算力 + 大模型 Agent 自动化** 玩到极致的开发者效率工具。

OpenClaw 目标是让 AI 不只是给建议，而是直接完成完整工程任务。

<!-- more -->

因为 Anthropic 在 1 月 27 日发律师函称 Clawd / Clawdbot与 Claude 太像，项目在当天紧急更名为 Moltbot（脱皮龙虾之意，吉祥物是小龙虾 Molty 🦞），但功能完全一致，旧命令 clawdbot 仍然兼容。

Moltbot 是项目组为了应对侵权风险想出的过渡名字，OpenClaw 这是目前的最终官方名称。

- OpenClaw 官网: https://openclaw.ai/
- 中文文档： https://docs.openclaw.ai/zh-CN
- Github 地址：https://github.com/openclaw/openclaw
- OpenClaw 技能合集: https://github.com/VoltAgent/awesome-openclaw-skills

## 发展

Clawbot、Moltbot 和 OpenClaw 其实是同一个开源项目，名字演进顺序为：

> Clawdbot → Moltbot → OpenClaw
> 

| 名称 | 时间线 | 背景/原因 | 本质关系 |
|---|---|---|---|
| Clawdbot / Clawbot | 2025 年末至 2026 年 1 月初 | 最初项目名；灵感来自 Claude 和 claw（龙虾爪）梗 | 原始名称，是最早出现在 GitHub 的身份 |
| Moltbot | 2026 年 1 月 27 日 | 因 Anthropic 商标顾虑被要求更名 | 中间过渡名字；功能、代码与 Clawdbot 一致 |
| OpenClaw | 2026 年 1 月 30 日之后 | 抛弃版权冲突、强调开源性/长线品牌 | 当前官方名称，也是今后文档、仓库等统一标识 |

## 安装

OpenClaw 的安装被设计得极为友好，即使是非开发者也能快速上手。

系统要求（不一定 Mac mini）：

- 硬件：极低，2GB RAM 即可运行。
- 环境：支持 Mac, Windows, Linux，需要安装 Node.js (pnpm) 或使用 Docker。

### 1、推荐安装方式（一键脚本）：

直接通过终端，执行以下命令。

**macOS/Linux 系统:**

``` swift
curl -fsSL https://openclaw.ai/install.sh | bash
```

**Windows 系统：**

``` swift
#PowerShell
iwr -useb https://openclaw.ai/install.ps1 | iex

#CMD
curl -fsSL https://openclaw.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

这会自动安装 Node.js（≥22）并完成基本配置。

### 2、手动安装

需要 Node.js ≥22 并完成基本配置：

**使用 npm：**

``` swift
npm i -g openclaw

# 如果速度慢可以指定国内镜像
npm i -g openclaw --registry=https://registry.npmmirror.com
```

**或使用 pnpm：**

``` swift
pnpm add -g openclaw
```

安装完成后，初始化并安装后台服务（launchd / systemd 用户服务）：

``` swift
openclaw onboard
```

### 3、从源码安装（开发模式）

``` swift
git clone https://github.com/openclaw/openclaw.git
cd openclaw

pnpm install

pnpm ui:build   # 首次运行会自动安装 UI 相关依赖并构建前端界面
pnpm build      # 构建整个项目（包含后端与相关模块）

# 初始化 OpenClaw 并安装为系统后台服务（开机自动运行）
pnpm openclaw onboard --install-daemon

# 开发模式：监听 TypeScript 代码变更并自动重载网关服务
pnpm gateway:watch
```

## 卸载

**使用内置卸载程序：**

``` swift
openclaw uninstall
```

**非交互式（自动化 / npx）：**

``` swift
openclaw uninstall --all --yes --non-interactive
npx -y openclaw uninstall --all --yes --non-interactive
```

## 配置

我们推荐使用一键脚本安装。

**macOS/Linux 系统:**

``` swift
curl -fsSL https://openclaw.ai/install.sh | bash
```

**Windows 系统：**

``` swift
#PowerShell
iwr -useb https://openclaw.ai/install.ps1 | iex

#CMD
curl -fsSL https://openclaw.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

它会完成环境检测，并且安装必要的依赖，还会启动 onboarding(设置向导) 流程。

**后期要重新进入设置向导，可以执行以下命令：**

``` swift
openclaw onboard --install-daemon
```

结果如下图：

![img](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/e1de4820-039c-42f8-9189-761ca9baa593.png)

然后，会提醒你这个龙虾能力很强，当然风险也很大，我们选 `yes`（no 就不安装了） 就好了：

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/aca86b08-25b3-4b9b-80ae-efb6eced5252.png)

接下来我们就选快速启动 `QuickStart` 选项：

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/78ba08f8-9c17-476d-9c01-fecf9741bc57.png)

接下来我们需要配置一个大模型，`Model/Auth Provider` 选择 AI 供应商，国内外的供应商基本都支持。

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/9a5a1c3e-2826-4349-8e80-2fa228b903f2.png)

如果没有海外的账号，配置咱们国内的 Qwen、MiniMax、智谱的 API key 也是可以的，认证配置文件（OAuth + API 密钥）在`~/.openclaw/agents/<agentId>/agent/auth-profiles.json`，后期也可以在这个文件上修改。

然后会出现选择聊天工具的选项，海外的一般都没有可以选最后一个：

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/434ba7fb-a0c4-4168-9b9f-a89ed80021e2.png)

其他配置，比如端口的设置 `Gateway Port`，按默认的 `18789` 即可，比如 **Skills、包的安装管理器选 npm 或其他**，可以一路 Yes 下去。

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/4fddc7d3-e0c0-44fc-98f8-e81cd32faf5b.png)

选一些自己喜欢的 **skills**，也可以直接跳过，使用 `空格` 按键选择：

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/7d416638-34f9-4c7b-92a7-7b777040c83c.png)

这些 `API key`，没有的直接选 `no`：

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/4ee2f8a3-f15b-49e7-91eb-aac75269080f.png)

最后这三个钩子可以开启，使用 `空格` 按键选择，主要做内容引导日志和会话记录：

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/f0249b24-068d-472a-8182-594c35703c9b.png)

选择 `Open the Web UI`，使用浏览器打开：

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/176a410e-369c-46b3-8f07-49d384a80f8c.png)

安装完后，就会自动访问 `http://127.0.0.1:18789/chat`，就可以打开聊天界面让它开始工作。

比如搜索最新的科技新闻：

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/Moltbot-Clawdbot-runoob3.webp)

启动后，我们可以使用 `openclaw status` 命令查看状态：

``` swift
openclaw status
```

如果你在新手引导期间安装了服务，Gateway 网关应该已经在运行：

``` swift
openclaw gateway status
```

手动运行（前台）：

``` swift
openclaw gateway --port 18789 --verbose
```

安装后可以执行的命令：

- 运行新手引导：`openclaw onboard --install-daemon`
- 快速检查：`openclaw doctor`
- 检查 Gateway 网关健康状态：`openclaw status + openclaw health`
- 打开仪表板：`openclaw dashboard`

## 使用

### 使用技能

技能是包含 `SKILL.md` 文件的独立文件夹，想要为 OpenClaw 代理拓展新功能，ClawHub 是查找、安装技能的最优选择。

- ClawHub 技能仓库地址：https://clawhub.ai/
- ClawHub 国内镜像：https://skillhub.tencent.com/

**安装 ClawHub 工具：**

``` swift
# 推荐方式（npx 无需全局安装）
npx clawhub@latest --version

# 或全局安装（方便以后直接用 clawhub 命令）
npm install -g clawhub
# 或者用 pnpm
pnpm add -g clawhub
```

**登录：**

``` swift
clawhub login
```

**搜索技能：**

``` swift
clawhub search "postgres backups"
```

**下载安装新技能：**

``` swift
clawhub install my-skill-pack
```

**批量更新已安装技能：**

``` swift
clawhub update --all
```

### 插件管理

插件是轻量代码模块，可通过新增命令、工具及 Gateway RPC 能力，为 OpenClaw 拓展额外功能。

**查看已加载插件：**

``` swift
openclaw plugins list
```

**安装官方插件（示例：语音通话插件）：**

``` swift
openclaw plugins install @openclaw/voice-call
```

**插件安装后重启网关生效：**

``` swift
openclaw gateway restart
```

### 常用命令

OpenClaw 常用命令一览表：

| 命令 | 分类 | 描述 |
|---|---|---|
| openclaw onboard | 初始化与安装 | 交互式向导（配置模型、通道、网关、工作区） |
| openclaw setup | 初始化与安装 | 初始化配置 + 工作区（非交互版） |
|  openclaw configure | 初始化与安装 | 交互式配置向导（模型、通道、技能） |
| openclaw gateway status | 网关管理 | 查看网关服务状态 + RPC 探活 |
| openclaw gateway start | 网关管理 | 启动网关服务 |
| openclaw gateway stop | 网关管理 | 停止网关服务 |
| openclaw gateway restart | 网关管理 | 重启网关服务 |
| openclaw gateway run | 网关管理 | 直接在前台运行网关（调试用） |
| openclaw gateway health | 网关管理 | 获取网关健康信息 |
| openclaw config file | 配置管理 | 显示当前配置文件完整路径 |
| openclaw config get <path> | 配置管理 | 读取配置项 |
| openclaw config set <path> <value> | 配置管理 | 修改配置项 |
| openclaw config validate | 配置管理 | 校验配置文件是否合法 |
| openclaw doctor | 诊断与状态 | 	一键健康检查 + 自动修复 |
| openclaw status | 诊断与状态 | 显示会话健康状态和最近联系人 |
| openclaw health | 诊断与状态 | 从运行中的网关拉取健康数据 |
| openclaw logs | 诊断与状态 | 实时查看网关日志 |
| openclaw dashboard | 其他高频操作 | 打开网页控制面板 |
| openclaw channels status | 其他高频操作 | 查看已连接的聊天通道 |
| openclaw agent run | 其他高频操作 | 手动触发一次代理运行 |

改完配置后记得运行 `openclaw gateway restart` 让改动生效～ 🦞

### 通道管理

- **WhatsApp**：openclaw channels login（或扫描 QR）
- **Telegram**：openclaw channels add --channel telegram（需 Bot Token）
- **Discord**：openclaw channels add --channel discord（需 Bot Token）
- **iMessage**：macOS 原生桥接
- **Slack**：openclaw channels add --channel slack（需 Bot Token）

### 工作区结构（Workspace Anatomy）

- **AGENTS.md**：指令说明
- **USER.md**：偏好设置
- **MEMORY.md**：长期记忆
- **HEARTBEAT.md**：检查清单
- **SOUL.md**：人格/语气
- **IDENTITY.md**：名称/主题
- **BOOT.md**：启动配置
- **根目录**：~/.openclaw/workspace

### 聊天内斜杠命令

- `/status`：健康 + 上下文
- `/context list`：上下文贡献者
- `/model <m>`：切换模型
- `/compact`：释放窗口空间
- `/new`：全新会话
- `/stop`：中止当前运行
- `/tts on|off`：切换语音
- `/think`：切换推理模式

### 关键路径映射（Essential Path Map）

- **主配置**：~/.openclaw/openclaw.json
- **默认工作区**：~/.openclaw/workspace/
- **智能体状态目录**：~/.openclaw/agents/<cid>/
- **OAuth & API 密钥**：~/.openclaw/agents/<agentId>/agent/auth-profiles.json，如果是旧版本的在~/.openclaw/credentials/
- **向量索引存储**：~/.openclaw/memory/<cid>.sqlite
- **全局共享技能**：~/.openclaw/skills/
- **网关文件日志**：/tmp/openclaw/*.log

### 语音与 TTS

- **付费**：OpenAI / ElevenLabs
- **免费**：Edge TTS（无需 API Key）
- **自动 TTS**：messages.tts.auto: "always"

### 内存与模型

- **向量搜索**：memory search "X"
- **模型切换**：models set <model>
- **认证设置**：models auth setup
- **日志**：memory/YYYY-MM-DD.md

### Hooks 与技能

- **ClawHub**：clawhub install <slug>
- **Hook 列表**：openclaw hooks list

### 故障排除

- 无 DM 回复 → 配对列表 → 批准
- 群组中静音 → 检查提及模式配置
- 认证过期 → models auth setup-token
- 网关关闭 → doctor --deep
- 内存 Bug → 重建内存索引

### 自动化与研究

- **浏览器**：browser start/screenshot
- **子代理**：/subagents list/info
- **定时任务**：cron list/run <cid>
- **心跳**：heartbeat.every: "30m"

## 通过第三方云直接安装配置

现在各大平台都已经支持这个智能体，如果不想安装在本机，可以一键部署云上OpenClaw：

- 阿里云：https://www.aliyun.com/activity/ecs/clawdbot
- 腾讯云：https://cloud.tencent.com/developer/article/2624973

使用阿里云的轻量级服务器安装：

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/image-20260423160115548.png)

可以使用它们的镜像，一键安装：

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/c63833b3-74f7-4577-9f1c-17fd807859d8.png)

使用腾讯云的轻量级服务器安装：

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/985526b6-d54a-4ed2-8111-0a19bc921963.png)

## 为什么“养龙虾”会火？

- 真正做到了"像JARVIS一样"：能读写文件、跑终端命令、操作浏览器、收发邮件、日历、写代码、订机票、清空收件箱……
- 本地优先 + 长期记忆：所有对话跨平台共享上下文，USER.md 和 memory/ 目录会越用越聪明
- 支持几乎所有大模型：Claude、Gemini、OpenAI、Ollama 本地模型、Pi 等
- 社区技能生态爆炸：ClawdHub 上已有 500+ 社区技能（Slack、Discord、GitHub、浏览器控制、macOS UI 自动化……）
- 安装简单像 npm install，实际能力却很 spicy （开发者原话）

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/Moltbot-Clawdbot-runoob2-20260423160856553.png)

其核心能力包括：

- 将自然语言目标拆解为可执行步骤
- 自动调用终端命令
- 创建与修改项目文件
- 运行代码并检测结果
- 根据报错自动修复

相比 Claude Code/OpenCode 这种代码补全工具，OpenClaw 更接近一个具备执行权限的工程型智能体。

- Claude Code 与 OpenCode等 强在代码质量与理解
- OpenClaw 强在自动完成整个工程流程

| 能力维度 | OpenClaw | Claude Code | OpenCode |
|---|---|---|---|
| 任务规划 | 强 | 中 | 中 |
| 自动执行 | 完整 | 部分 | 部分 |
| 自我修复 | 有 | 无 | 无 |
| 工程级操作 | 强 | 强 | 中 |
| 本地自动化 | 原生支持 | 较弱 | 较弱 |

