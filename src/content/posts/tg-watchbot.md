# Tg-Watchbot：Telegram 双向对话 Bot + 网页关键词推送 + 可视化面板

---

最近看 TG 上不少人说封号比较严重。再加上我作为一个刚入门的 MJJ想更快地获取信息（当然不是抢小鸡，真的 :distorted_face:），所以 vibe 了一个自用小工具：`tg-watchbot`。

它是一个轻量级 Python 服务，把 **Telegram 双向对话 Bot** 和 **Web/RSS 监控推送** 合在一起，并可以在网页端可视化编辑，适合放在 VPS、NAT 小鸡或者家里小服务器上跑。另外，它支持定时清理监控推送相关状态数据，避免网页监控信息过多，影响正常的双向对话使用。

项目地址：

https://github.com/GongyiChuren/tg-watchbot


另外，它支持定时清理监控推送相关状态数据，避免网页监控信息过多，影响正常的双向对话使用。

## 主要功能

- 普通用户私聊 Bot，消息会转发给管理员
- 管理员可以直接回复用户，也可以主动发文字 / 图片
- 支持封禁、解封、备注、查看用户信息
- 支持 RSS / Atom 监控
- 支持网页 CSS selector 抓取
- 支持关键词、新条目、价格变化、库存变化提醒
- 内置 Web 管理面板
- 可以在面板里新增、编辑、删除监控
- 支持 Linux.do / NodeSeek RSS 模板
- 使用 SQLite 保存用户、消息、监控状态
- 支持 systemd 部署
- 已linuxdo等论坛特化

## 展示
![示例图片](https://GongyiChuren.github.io/picx-images-hosting/cf59034b-300b-4a0f-b3ab-535e827a2204.7zr28ugzbf.webp)

![示例图片](https://GongyiChuren.github.io/picx-images-hosting/image.3ns91batmc.webp)

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