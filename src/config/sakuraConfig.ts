import type { SakuraConfig } from "../types/config";

export const sakuraConfig: SakuraConfig = {
	// 是否启用特效 (萤火微光: 始终开启)
	enable: true,

	// 粒子数量 (增加数量以提高可见性)
	sakuraNum: 60,

	// 越界限制 (无限制，循环播放)
	limitTimes: -1,

	// 粒子尺寸
	size: {
		min: 0.8,
		max: 1.8,
	},

	// 不透明度
	opacity: {
		min: 0.4,
		max: 0.9,
	},

	// 移动速度
	speed: {
		horizontal: {
			min: -0.4,
			max: 0.4,
		},
		vertical: {
			min: -0.4,
			max: 0.4,
		},
		rotation: 0.02, 
		fadeSpeed: 0,
	},

	// 层级，设置为 1 确保在背景图之上，但在内容下方
	zIndex: 1, 
};
