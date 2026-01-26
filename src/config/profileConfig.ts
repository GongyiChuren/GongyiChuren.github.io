import type { ProfileConfig } from "../types/config";

export const profileConfig: ProfileConfig = {
	// 头像
	avatar: "/assets/images/avatar.webp",

	// 名字
	name: "GongyiChuren",

	// 个人签名
	bio: "热爱编程，热爱生活",

	// 链接配置
	// 已经预装的图标集：fa6-brands，fa6-regular，fa6-solid，material-symbols，simple-icons
	// 访问https://icones.js.org/ 获取图标代码，
	// 如果想使用尚未包含相应的图标集，则需要安装它
	// `pnpm add @iconify-json/<icon-set-name>`
	// showName: true 时显示图标和名称，false 时只显示图标
	links: [
		{
			name: "Telegram",
			icon: "fa6-brands:telegram",
			url: "https://t.me/GongyiChuren",
			showName: false,
		},
		{
			name: "Discord",
			icon: "fa6-brands:discord",
			url: "https://discord.com/users/gongyichuren",
			showName: false,
		},
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/GongyiChuren",
			showName: false,
		},
		{
			name: "RSS",
			icon: "fa6-solid:rss",
			url: "/rss/",
			showName: false,
		},
	],
};
