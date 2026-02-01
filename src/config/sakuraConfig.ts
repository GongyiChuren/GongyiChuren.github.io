import type { SakuraConfig } from "../types/config";

export const sakuraConfig: SakuraConfig = {
	// 是否启用特效 (萤火微光: 待机5s后渐显)
	enable: true,

	// 粒子数量 (萤火虫不需要太多，稀疏一点更有意境)
	sakuraNum: 30,

	// 越界限制 (无限制，循环播放)
	limitTimes: -1,

	// 粒子尺寸
	size: {
		// 最小尺寸
		min: 0.6,
		// 最大尺寸
		max: 1.5,
	},

	// 不透明度 (控制光点的明暗变化范围)
	opacity: {
		min: 0.2,
		max: 0.8,
	},

	// 移动速度 (萤火虫是缓慢漂浮的)
	speed: {
		horizontal: {
			min: -0.2,
			max: 0.2,
		},
		vertical: {
			min: -0.2,
			max: 0.2,
		},
		rotation: 0.02, // 用于控制呼吸相位变化速度
		fadeSpeed: 0,   // 不使用旧的淡出逻辑
	},

	// 层级
	zIndex: 0, 
};
