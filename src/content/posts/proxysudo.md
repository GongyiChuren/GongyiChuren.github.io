---
title: ProxySudo：把任意代理链接一键变成可用配置
description: 一个轻量级、自建的代理订阅转换工具，支持多种代理链接输入、Mihomo/Clash 与 sing-box 输出、策略组模板、二维码导入和 REST API。
published: 2026-05-23

tags:
  - "Tools"
  - "Proxy"
  - "Vite"
  - "Docker"
  - "Linux"
category: "效率工具"
draft: false
image: https://pic.gongyichuren.de/file/1779540526840_afb6f054111d4d70b8bf541ffe_0.png
---

最近我做了一个小工具，名字叫 **ProxySudo**。它的目标很直接：把各种代理链接、Base64 订阅、Mihomo/Clash YAML，快速转成你能直接导入客户端的配置。

即：**任何代理链接 → 任何客户端配置**。

项目地址：

```text
https://github.com/GongyiChuren/proxysudo
```

## 它解决什么问题

很多时候，代理订阅的格式并不统一：

- 有的是单条分享链接
- 有的是 Base64 订阅
- 有的是 YAML 配置
- 你用的客户端又各不相同

ProxySudo 就是把这层“格式翻译”抽出来，做成一个轻量、可自建、开箱即用的转换服务。粘贴进去，直接出结果，不用来回手搓配置。

## 主要特点

- 支持 VMess、VLESS、Trojan、SS、Hysteria2、TUIC、SOCKS5、HTTP、Base64、Mihomo YAML
- 支持输出 Mihomo/Clash YAML、sing-box JSON、原始链接、标准化 JSON
- 内置 3 套模板：轻巧、均衡、智能优先
- 内置 8 个策略组：AI、微软、Apple、Google、Telegram、流媒体、游戏、兜底
- 提供 REST API 和二维码订阅链接
- 带 SSRF 防护
- 默认浏览器本地转换，无追踪无存储
- 支持 systemd 自启部署

## 我最在意的几个点

我做这个项目时，优先考虑的是三件事：

1. **够轻**：不想把一个转换工具做成一整套大而全的平台
2. **够快**：输入后尽量秒级出结果
3. **够直接**：界面要漂亮，但逻辑不能绕

所以它不是 Sub-Store 那种大而全的方案，而是更偏向“只做好转换这件事”。

## 界面展示

![ProxySudo 预览图](https://pic.gongyichuren.de/file/1779534684633_image.png)

## 部署方式

推荐直接一键部署：

```bash
git clone https://github.com/GongyiChuren/proxysudo.git
cd proxysudo
bash deploy.sh
```

脚本会自动处理依赖安装、前端构建、systemd 启用和启动。

如果你更习惯 Docker，也可以这样跑：

```bash
git clone https://github.com/GongyiChuren/proxysudo.git
cd proxysudo
docker compose up -d
```

默认服务会绑定 `0.0.0.0:4877`，这意味着它是公网可访问的，所以部署时一定要处理访问控制。

## 安全提醒

这一点我觉得要单独写出来：**订阅链接可能包含敏感凭据**。

所以部署 ProxySudo 之前，最好至少做一层限制：

- 用防火墙限制访问端口
- 只绑定到 `127.0.0.1`
- 用 Cloudflare Tunnel 走本地转发
- 或者在 Nginx 前面加认证

如果你只是本地用，最省心的办法就是只让服务监听本机，再通过反代或隧道暴露。

## API 也能直接用

除了网页操作，它还提供了几个常用接口：

- `GET /api/health`
- `POST /api/convert`
- `POST /api/fetch`
- `GET /api/sub`

这意味着你也可以把它接到自己的自动化流程里，不只是当一个网页工具。

## 适合谁

- 常换代理客户端的人
- 想自建订阅转换服务的人
- 需要 API 接口做自动化的人
- 想要一个界面更好看的转换工具的人

## 结尾

ProxySudo 现在还是一个比较轻量的工具，但它已经把我自己最常用的那条链路打通了：输入链接，输出配置，顺手还能部署成自己的服务。

如果你也经常在不同代理格式之间来回切换，这种工具会省掉不少重复劳动。
