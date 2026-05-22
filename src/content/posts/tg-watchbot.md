---
title: Tg-Watchbot：Telegram 双向对话 Bot + 网页关键词推送 + 可视化面板
description: 一个轻量级 Python 服务，把 Telegram 双向对话 Bot、Web/RSS 监控推送和可视化管理面板合在一起，适合部署在 VPS、NAT 小鸡或家用服务器上。
published: 2026-05-20

tags:
  - "Tools"
  - "Telegram"
  - "Python"
  - "RSS"
  - "VPS"
category: "效率工具"
draft: false
image: https://pic.gongyichuren.de/file/1779437104636_image.png
---

最近看 TG 上不少人说封号比较严重。再加上我作为一个刚入门的 MJJ，平时也想更快地获取信息，所以 vibe 了一个自用小工具：`tg-watchbot`。

它是一个轻量级 Python 服务，把 **Telegram 双向对话 Bot** 和 **Web/RSS 监控推送** 合在一起，并提供网页端可视化管理面板。它适合放在 VPS、NAT 小鸡或者家里的小服务器上跑。

项目地址：

```text
https://github.com/GongyiChuren/tg-watchbot
```

## 为什么做这个

我最开始的需求很简单：

- 有一个自己的 Telegram 联系入口，别人私聊 Bot 后可以转发到管理员账号；
- 能监控 Linux.do、NodeSeek、博客、商店页面等信息源；
- 命中关键词、新条目、价格变化或库存变化时，自动推送到 Telegram；
- 有一个网页面板，不用每次都手改配置文件。

另外，项目支持定时清理监控推送相关状态数据，避免网页监控信息过多，影响正常的双向对话使用。

## 主要功能（新版）

- 普通用户私聊 Bot，消息自动转发管理员，支持双向回复
- 管理员支持主动发文字/图片、封禁、解封、备注、快捷回复
- 收件箱可查看完整双向记录（用户消息、Web 回复、TG 管理员回复）
- 支持 RSS / Atom 和网页 CSS selector 监控
- 支持关键词、新条目、价格变化、库存变化提醒
- 支持 TG 群关键词监听：可直接在 Web 面板配置监听
- TG 群监听支持 AI 总结（Responses / Chat 接口二选一）和模板回退
- TG 群监听支持限频与去重窗口，降低重复推送与成本
- TG 群监听新增“已发现群聊”：自动显示群 chat_id，可一键创建监听
- `/update` 支持安全更新：显示 ahead/behind、脏工作区检查、一键回滚
- 首页新增监控运行状态（最近成功/失败、耗时、推送数、连续失败）
- 使用 SQLite 保存用户、消息、监控状态；监控通知默认 60 分钟自动删除

## 展示

![tg-watchbot 新版管理面板](https://pic.gongyichuren.de/file/1779437104636_image.png)

![tg-watchbot TG 群监听与配置](https://pic.gongyichuren.de/file/1779437050727_image.png)

## 适合用来做什么

- 搭一个自己的 Telegram 联系 / 客服 Bot
- 监控 Linux.do / NodeSeek / 博客 / 商店页面
- 关键词命中后推送到 Telegram
- 监控价格、库存、RSS 新帖
- 在小 VPS 上长期后台运行

## 简单部署

```bash
git clone https://github.com/GongyiChuren/tg-watchbot.git
cd tg-watchbot
cp .env.example .env
cp config.example.yaml config.yaml
touch tg-watchbot.sqlite3 tg-watchbot.log
docker compose up -d --build
```

面板默认地址：

```text
http://127.0.0.1:8765
```

如果你不使用 Docker，也可以手动安装：

```bash

python3 -m venv .venv
./.venv/bin/pip install -U pip
./.venv/bin/pip install -r requirements.txt

cp .env.example .env
cp config.example.yaml config.yaml
```

启动服务：

```bash
./.venv/bin/python app.py
```

默认账号：

```text
用户名：admin
密码：change-me
```

登录后进入“设置”，填写 Bot Token、管理员 Telegram 数字 chat id、面板账号和密码。保存后需要重启服务，Bot 才会开始收发 Telegram 消息和发送监控通知。

手动执行一次监控：

```bash
./.venv/bin/python app.py --run-once
```

## systemd 部署

推荐部署到：

```text
/opt/tg-watchbot
```

基本流程是：先复制 `.env.example` 和 `config.example.yaml`，前台运行 `./.venv/bin/python app.py` 打开面板，把设置填完整并保存；确认没问题后再启用 systemd。

如果想从公网访问面板，推荐用 Cloudflare Tunnel + Zero Trust Access。Tunnel 的服务地址填 `http://127.0.0.1:8765`，再在 Access 里限制只允许自己的邮箱登录。这样不需要开放服务器端口，也不用把面板监听改成 `0.0.0.0`。

启用后查看日志：

```bash
sudo journalctl -u tg-watchbot -f
```

健康检查：

```bash
curl http://127.0.0.1:8765/health
```

## 注意事项

- Telegram Bot 不能主动私聊陌生人，对方必须先给 Bot 发过消息
- `.env` 里有 Token 和密码，不要提交到 GitHub
- 未填写 Bot Token / 管理员 ID 时，Web 面板能打开，但 Telegram 收发和监控推送不会工作
- 面板保存设置后不会自动重启，需要手动重启服务
- Web 面板如果暴露到公网，建议套 Cloudflare Access / 反代鉴权
- RSS 监控建议 60 秒起步
- 网页监控建议更保守一点，避免对目标站造成压力

目前它还是一个自用小工具，目标是够轻、够直接、够容易部署。后续如果我自己用着发现问题，也会继续慢慢补。
