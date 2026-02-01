import type { SakuraConfig } from "../types/config";

export const sakuraConfig: SakuraConfig = {
	// 是否启用樱花特效 (现已修改为 0/1 字符雨特效)
	enable: true,

	// 樱花数量
	sakuraNum: 50,

	// 樱花越界限制次数，-1为无限循环
	limitTimes: -1,

	// 樱花尺寸
	size: {
		// 樱花最小尺寸倍数
		min: 0.8,
		// 樱花最大尺寸倍数
		max: 1.2,
	},

	// 樱花不透明度
	opacity: {
		// 樱花最小不透明度
		min: 0.3,
		// 樱花最大不透明度
		max: 0.8,
	},

	// 樱花移动速度
	speed: {
		// 水平移动
		horizontal: {
			// 水平移动速度最小值
			min: -0.5,
			// 水平移动速度最大值
			max: 0.5,
		},
		// 垂直移动
		vertical: {
			// 垂直移动速度最小值
			min: 1.0,
			// 垂直移动速度最大值
			max: 2.0,
		},
		// 旋转速度
		rotation: 0.05,
		// 消失速度，不应大于最小不透明度
		fadeSpeed: 0.05,
	},

	// 层级，确保樱花在合适的层级显示 (在背景之上，内容之下，或者最顶层但不阻挡点击)
	// 设置为 -1 可以让它在背景图之上但在内容之下
	// 设置为 100 会覆盖在内容之上
	zIndex: 0, 
};
