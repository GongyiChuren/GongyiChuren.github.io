import type { SakuraConfig } from "../types/config";

export const sakuraConfig: SakuraConfig = {
	// 是否启用特效 (深空极光)
	enable: true,

	// 光球数量 (由管理器内部控制，此处参数预留)
	sakuraNum: 10,

	// 无限循环
	limitTimes: -1,

	// 尺寸配置 (预留)
	size: {
		min: 0,
		max: 0,
	},

	// 透明度配置 (预留)
	opacity: {
		min: 0,
		max: 0,
	},

	// 速度配置 (预留)
	speed: {
		horizontal: { min: 0, max: 0 },
		vertical: { min: 0, max: 0 },
		rotation: 0,
		fadeSpeed: 0,
	},

	// 层级：背景之上
	zIndex: 0, 
};
