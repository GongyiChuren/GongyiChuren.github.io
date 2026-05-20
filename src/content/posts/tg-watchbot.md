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
image: https://GongyiChuren.github.io/picx-images-hosting/cf59034b-300b-4a0f-b3ab-535e827a2204.7zr28ugzbf.webp
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

## 主要功能

- 普通用户私聊 Bot，消息会转发给管理员
- 管理员可以直接回复用户，也可以主动发**文字 / 图片**
- 支持封禁、解封、备注、查看用户信息
- 支持 RSS / Atom 监控
- 支持网页 CSS selector 抓取
- 支持关键词、新条目、价格变化、库存变化提醒
- 内置 Web 管理面板
- 可以在面板里新增、编辑、删除监控
- 支持 Linux.do / NodeSeek RSS 模板
- 使用 SQLite 保存用户、消息、监控状态
- 支持 systemd 部署

## 展示

![tg-watchbot 管理面板](https://pic.gongyichuren.de/file/1779287173835_8521cab29a9635743a603582ceb7ba02.png)

![tg-watchbot 推送示例](https://pic.gongyichuren.de/file/1779287170665_17b7c8b4040d6334ea62a108d08db644.png)

![tg-watchbot 推送示例](https://pic.gongyichuren.de/file/1779287166619_470b39663485d8711c0f3d8d4e24244e.png)

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

python3 -m venv .venv
./.venv/bin/pip install -U pip
./.venv/bin/pip install -r requirements.txt

cp .env.example .env
cp config.example.yaml config.yaml
nano .env
```

`.env` 至少需要填写：

```dotenv
TELEGRAM_BOT_TOKEN=你的 Bot Token
ADMIN_CHAT_ID=你的 Telegram 数字 chat id
WEB_PANEL_USER=admin
WEB_PANEL_PASSWORD=一个强密码
```

启动服务：

```bash
./.venv/bin/python app.py
```

默认面板地址：

```text
http://127.0.0.1:8765
```

如果只是先打开面板配置，还没有 Telegram Token，也可以只启动面板：

```bash
./.venv/bin/python app.py --panel-only
```

手动执行一次监控：

```bash
./.venv/bin/python app.py --run-once
```

## systemd 部署

README 里已经写了完整的 systemd 部署方式。推荐部署到：

```text
/opt/tg-watchbot
```

部署完成后，可以用下面的命令查看日志：

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
- Web 面板如果暴露到公网，建议套 Cloudflare Access / 反代鉴权
- RSS 监控建议 60 秒起步
- 网页监控建议更保守一点，避免对目标站造成压力

目前它还是一个自用小工具，目标是够轻、够直接、够容易部署。后续如果我自己用着发现问题，也会继续慢慢补。
