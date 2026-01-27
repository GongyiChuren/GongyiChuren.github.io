---
title: Agent Skills 使用分享：用 AI 工具快速搭建个人博客
description: 如何把 AI 建站流程封装成 Agent Skills，实现从需求拆解到自动部署的闭环。案例：用 Gemini + Claude + Codex + Cloudflare 搭建 Astro 博客，结合 Skills 体系，几小时内上线。
published: 2026-01-27
tags:
  - "AI"
  - "Claude code"
  - "Agent skills"
  - "Blogs"
  - "CLI"
image: /posts/images/vitepress2.png
---

在 2026 年，AI 工具已经让“搭建个人博客”变得像聊天一样简单，但我更进一步：把整个过程封装成 **Agent Skills**（一种可复用提示模板 + 触发规则的技能包），让 AI 在对话中自动调用对应模块，实现“说需求 → 拆解执行 → 校验输出”的闭环。

最近我用这套 Skills 重新搭了个 Astro 博客：Gemini 脑暴大纲、Claude 整合 GitHub 现成仓库、Codex 美化自定义，最后 Cloudflare + GitHub 自动部署。全程基本没手敲代码，只通过触发 Skills 推进，3 小时就上线了。分享这个案例，帮你看到 Agent Skills 在 AI 建站中的实战价值。

## 为什么需要 Agent Skills

AI 建站工具多，但传统方式还是有痛点：

- **重复操作**：每次建站都要重述需求、改配置、调样式，容易忘上次的最佳实践
- **易出错**：跨工具切换（Gemini 到 Claude），上下文丢了重来
- **不可复用**：好不容易调好的 prompt，下个项目又从零写

Agent Skills 就是我的解决方案：把常见操作封装成小模块（prompt 模板 + 触发词），让 AI 像工具箱一样调用。例如，一个 “integrate-repo” skill 专门处理仓库整合，触发后自动执行标准化步骤，避免每次闲聊。

## 我的使用目标 & 成功标准

目标清单（针对 AI 建站场景）：

1. 把建站流程拆成可复用 Skills，80% 操作自动化触发
2. 减少手工输入：从需求到上线，只需 5–10 次触发/修正
3. 确保跨 AI 模型（Gemini/Claude/Codex）通用
4. 集成校验：每个 Skill 输出后自动检查（如代码语法、部署兼容）

成功标准：

- 时间节省：从 0 到上线 ≤4 小时（传统方式至少 1 天）
- 错误率：配置错漏 <5%（靠 Skills 内置校验）
- 可复用性：同一个 Skills 包跨多个项目/模型用 >95%

## Skills 体系的设计方法

我设计 Skills 时遵循这些原则：

1. **单一职责**：每个 Skill 只管一件事（如 “generate-outline” 只出大纲，不碰代码）
2. **命名与触发规则**：用 #skill-name 触发，例如 “#integrate-repo [仓库链接]”，或在上下文中自然提到
3. **层级分类**：
   - 通用层：outline-generator、code-validator（跨项目用）
   - 领域层：ai-build-blog（建站专用，如 repo-integrator、style-customizer）
   - 项目层：astro-cloudflare-deploy（当前博客专属提醒，如 .nojekyll）

Skills 实际是 .txt 或 .md 文件存的 prompt 模板，我在对话中复制或引用它们。

## 实际流程案例：用 Skills 完成 AI 搭建 Astro 博客

需求（我扔给 AI 的一句话）：

> 用我的 agent skills 帮我搭建一个 Astro 个人博客：基于 GitHub 现成仓库，目标是极简技术博客，支持 Markdown、暗黑模式、RSS。最后部署到 Cloudflare。完整走流程：#generate-outline → #integrate-repo → #customize-style → #setup-deploy → 输出完整项目文件。

### 技能调用链路（AI 实际执行顺序）

1. **触发 #generate-outline skill** (用 Gemini)
   - Skill 模板：一个结构化 prompt，要求输出步骤列表 + 潜在坑
   - 输出：详细大纲，包括“fork 仓库”“加 frontmatter”“自定义组件”“Cloudflare yaml”
   - 我说“基于这个大纲，继续”

2. **触发 #integrate-repo skill** (用 Claude)
   - Skill 模板：输入仓库链接，自动生成修改 astro.config.mjs、src/content/config.ts 的代码
   - 输出：整合后的文件（如加 MDX 支持、getCollection 逻辑）
   - 执行：我 fork github.com/username/astro-firefly-starter，Claude 帮改核心配置

3. **触发 #customize-style skill** (用 Codex in VS Code)
   - Skill 模板：描述样式需求，生成 Tailwind 组件 + 暗黑模式逻辑
   - 输出：Header.astro（加 logo + theme toggle）、文章页 Prose 样式 + shiki 高亮
   - 我微调：“#customize-style 加侧边目录”，Codex 补上

4. **触发 #setup-deploy skill** (用 Claude)
   - Skill 模板：生成 Cloudflare Pages 的 GitHub Actions yaml + 后台设置指南
   - 输出：.github/workflows/deploy.yml（含 build、pages-action）
   - 执行：我在 Cloudflare 连 GitHub，设 API Token，git push 自动 deploy

5. **触发 #validate-output skill** (通用校验)
   - 自动扫描：检查语法、路径、draft 过滤等
   - 提醒：加 touch dist/.nojekyll 防 404

整个过程我触发了 8 个 Skills（含 3–4 次微调），得到可直接 push 的项目。AI 帮写了 700+ 行代码，我只手动设了 Cloudflare 密钥。

## 常见坑与优化

| 坑 | 表现 | 我的解决办法 |
|----|------|-------------|
| 触发不准 | AI 忽略 #skill-name，直接输出杂乱 | 在 Skills 模板开头加“严格按单一职责执行，只输出结果” |
| 输出不稳 | 不同模型生成不一致（Claude 稳，Codex 创意多） | Skills 加“for-claude” / “for-codex” 变体，指定用哪个 |
| 耦合过紧 | 一个 Skill 管太多步，导致长上下文崩 | 拆分！如 #integrate-repo 只管 config，样式另起 |
| 校验漏网 | 部署后样式崩 | 在 #validate-output 加“模拟 Cloudflare 环境检查路径” |
| 跨工具切换 | 上下文丢 | Skills 加“引用上步输出 ID”规则，如 “基于 #output-123 继续” |

## 我目前的 Skill 目录结构
agent-skills/
├── general/
│   ├── generate-outline.txt    # 脑暴大纲模板
│   ├── validate-output.txt     # 代码/配置校验
│   └── code-merger.txt         # 合并多步输出
├── ai-build/
│   ├── integrate-repo.txt      # 仓库整合
│   ├── customize-style.txt     # 样式自定义
│   └── setup-deploy.txt        # 部署配置
└── project-specific/
    └── astro-cloudflare.txt    # Astro + Cloudflare 专属提醒

版本管理：Git 私有仓库，改动 commit + tag v1.3，Skills 里引用最新。

## 后续计划

短期：

- 新增 #migrate-content skill：批量导入旧 md
- 新增 #add-feature skill：如评论系统、分析集成
- 优化校验：加死链检测

长期：

- 把 Skills 做成函数调用接口（配合 Grok tool use）
- 目标：90% 建站自动化到“三步走”（需求 → 触发链 → push）

## 结语

Agent Skills 特别适合像 AI 建站这种重复性强的任务，让你从“每次重写 prompt”升级到“模块化调用”，效率翻倍。

如果你是内容创作者或轻开发者，**推荐第一步**：

1. 挑一个重复操作（如生成大纲），写成 .txt prompt
2. 起名 #generate-outline，下次对话直接触发
3. 用 2–3 次后扩展成包，很快就上瘾了

欢迎分享你的 Skills 玩法～。
