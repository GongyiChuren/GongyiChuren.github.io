import type { SakuraConfig } from "../types/config";

// 萤火虫对象类
class Firefly {
	x: number;
	y: number;
	s: number; // 大小
	r: number; // 这里的 r 用作相位偏移，控制呼吸节奏
	a: number; // 基础不透明度
	fn: {
		x: (x: number, y: number) => number;
		y: (x: number, y: number) => number;
		r: (r: number) => number;
		a: (a: number) => number;
	};
	idx: number;
	limitArray: number[];
	config: SakuraConfig;

	constructor(
		x: number,
		y: number,
		s: number,
		r: number,
		a: number,
		fn: {
			x: (x: number, y: number) => number;
			y: (x: number, y: number) => number;
			r: (r: number) => number;
			a: (a: number) => number;
		},
		idx: number,
		limitArray: number[],
		config: SakuraConfig,
	) {
		this.x = x;
		this.y = y;
		this.s = s;
		this.r = r;
		this.a = a;
		this.fn = fn;
		this.idx = idx;
		this.limitArray = limitArray;
		this.config = config;
	}

	draw(cxt: CanvasRenderingContext2D, globalAlpha: number) {
		// 计算呼吸效果
		// 使用 sin 函数创建平滑的呼吸节奏，周期约为 3-5 秒
		const breath = (Math.sin(Date.now() / 1500 + this.r) + 1) / 2; // 0 到 1 之间波动
		const currentAlpha = this.a * (0.3 + breath * 0.7) * globalAlpha; // 基础透明度 * 呼吸因子 * 全局淡入淡出

		if (currentAlpha <= 0.01) return;

		cxt.save();
		cxt.globalAlpha = currentAlpha;

		// 绘制发光圆形
		const size = 3 * this.s; // 基础大小
		
		// 萤火虫核心
		cxt.beginPath();
		cxt.arc(this.x, this.y, size, 0, Math.PI * 2);
		cxt.fillStyle = "#fbbf24"; // 暖金色核心
		cxt.fill();

		// 萤火虫光晕
		// 通过径向渐变模拟柔和光晕
		const gradient = cxt.createRadialGradient(this.x, this.y, size, this.x, this.y, size * 4);
		gradient.addColorStop(0, "rgba(251, 191, 36, 0.4)"); // 核心周围较亮
		gradient.addColorStop(1, "rgba(251, 191, 36, 0)");   // 边缘完全透明
		
		cxt.fillStyle = gradient;
		cxt.beginPath();
		cxt.arc(this.x, this.y, size * 4, 0, Math.PI * 2);
		cxt.fill();

		cxt.restore();
	}

	update() {
		// 萤火虫移动逻辑：缓慢漂浮，带有随机扰动
		// 使用 perlin noise 思想的简化版或叠加正弦波会让运动更自然，这里沿用之前的接口微调参数
		this.x = this.fn.x(this.x, this.y);
		this.y = this.fn.y(this.y, this.y);
		
		// 边界检查：无缝循环
		if (this.x > window.innerWidth + 50) this.x = -50;
		if (this.x < -50) this.x = window.innerWidth + 50;
		if (this.y > window.innerHeight + 50) this.y = -50;
		if (this.y < -50) this.y = window.innerHeight + 50;
	}
}

// 列表类
class FireflyList {
	list: Firefly[];

	constructor() {
		this.list = [];
	}

	push(firefly: Firefly) {
		this.list.push(firefly);
	}

	update() {
		for (let i = 0, len = this.list.length; i < len; i++) {
			this.list[i].update();
		}
	}

	draw(cxt: CanvasRenderingContext2D, globalAlpha: number) {
		for (let i = 0, len = this.list.length; i < len; i++) {
			this.list[i].draw(cxt, globalAlpha);
		}
	}
}

// 获取随机值的函数
function getRandom(
	option: "x" | "y" | "s" | "r" | "a",
	config: SakuraConfig,
): number;
function getRandom(
	option: "fnx" | "fny" | "fnr" | "fna",
	config: SakuraConfig,
): (...args: number[]) => number;
function getRandom(
	option: string,
	config: SakuraConfig,
): number | ((...args: number[]) => number) {
	let ret: number | ((...args: number[]) => number) = 0;

	switch (option) {
		case "x":
			ret = Math.random() * window.innerWidth;
			break;
		case "y":
			ret = Math.random() * window.innerHeight;
			break;
		case "s":
			ret =
				config.size.min + Math.random() * (config.size.max - config.size.min);
			break;
		case "r":
			ret = Math.random() * Math.PI * 2; // 随机相位
			break;
		case "a":
			ret =
				config.opacity.min +
				Math.random() * (config.opacity.max - config.opacity.min);
			break;
		case "fnx":
			// 水平飘动速度
			const speedX = (Math.random() - 0.5) * 0.5; 
			ret = (x: number, _y: number) => x + speedX;
			break;
		case "fny":
			// 垂直起伏速度，甚至可以向上飞
			const speedY = (Math.random() - 0.5) * 0.5;
			ret = (_x: number, y: number) => y + speedY;
			break;
		default:
			ret = 0;
	}
	return ret;
}

// 管理器类
export class SakuraManager {
	private config: SakuraConfig;
	private canvas: HTMLCanvasElement | null = null;
	private ctx: CanvasRenderingContext2D | null = null;
	private list: FireflyList | null = null;
	private animationId: number | null = null;
	private isRunning = false;
	
	// 待机检测相关属性
	private lastActivityTime: number = Date.now();
	private globalAlpha: number = 0; // 全局透明度，用于渐显
	private readonly idleThreshold: number = 5000; // 5秒待机阈值
	private readonly fadeSpeed: number = 0.02; // 渐显速度

	constructor(config: SakuraConfig) {
		this.config = config;
		this.setupActivityListeners();
	}

	// 设置用户活动监听
	private setupActivityListeners() {
		const updateActivity = () => {
			this.lastActivityTime = Date.now();
			// 活动时，如果特效正在显示，可以选择立即隐藏或慢慢淡出
			// 这里我们选择不立即隐藏，而是让 update 循环去处理 globalAlpha
		};

		// 监听常见的用户活动
		window.addEventListener('mousemove', updateActivity);
		window.addEventListener('keydown', updateActivity);
		window.addEventListener('scroll', updateActivity);
		window.addEventListener('click', updateActivity);
		window.addEventListener('touchstart', updateActivity);
	}

	async init(): Promise<void> {
		if (!this.config.enable || this.isRunning) {
			return;
		}

		this.createCanvas();
		this.createList();
		this.startAnimation();
		this.isRunning = true;
	}

	private createCanvas(): void {
		this.canvas = document.createElement("canvas");
		this.canvas.height = window.innerHeight;
		this.canvas.width = window.innerWidth;
		this.canvas.setAttribute(
			"style",
			`position: fixed; left: 0; top: 0; pointer-events: none; z-index: ${this.config.zIndex};`,
		);
		this.canvas.setAttribute("id", "canvas_sakura");
		document.body.appendChild(this.canvas);
		this.ctx = this.canvas.getContext("2d");

		window.addEventListener("resize", this.handleResize.bind(this));
	}

	private createList(): void {
		if (!this.ctx) return;

		this.list = new FireflyList();
		const limitArray = new Array(this.config.sakuraNum).fill(-1); // 无限循环

		for (let i = 0; i < this.config.sakuraNum; i++) {
			// 参数生成
			const randomX = getRandom("x", this.config);
			const randomY = getRandom("y", this.config);
			const randomS = getRandom("s", this.config);
			const randomR = getRandom("r", this.config);
			const randomA = getRandom("a", this.config);
			const randomFnx = getRandom("fnx", this.config);
			const randomFny = getRandom("fny", this.config);

			const firefly = new Firefly(
				randomX,
				randomY,
				randomS,
				randomR,
				randomA,
				{
					x: randomFnx,
					y: randomFny,
					r: () => 0,
					a: () => 0,
				},
				i,
				limitArray,
				this.config,
			);

			this.list.push(firefly);
		}
	}

	private startAnimation(): void {
		if (!this.ctx || !this.canvas || !this.list) return;

		const animate = () => {
			if (!this.ctx || !this.canvas || !this.list) return;

			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

			const now = Date.now();
			const idleTime = now - this.lastActivityTime;

			// 状态机逻辑
			if (idleTime > this.idleThreshold) {
				// 待机超过5秒，渐显
				if (this.globalAlpha < 1) {
					this.globalAlpha += this.fadeSpeed;
					if (this.globalAlpha > 1) this.globalAlpha = 1;
				}
			} else {
				// 用户活动中，渐隐
				if (this.globalAlpha > 0) {
					this.globalAlpha -= this.fadeSpeed * 2; // 消失稍微快一点
					if (this.globalAlpha < 0) this.globalAlpha = 0;
				}
			}

			// 只有完全不透明度大于0时才计算和绘制
			if (this.globalAlpha > 0.001) {
				this.list.update();
				this.list.draw(this.ctx, this.globalAlpha);
			}

			this.animationId = requestAnimationFrame(animate);
		};

		this.animationId = requestAnimationFrame(animate);
	}

	private handleResize(): void {
		if (this.canvas) {
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
		}
	}

	stop(): void {
		if (this.animationId) {
			cancelAnimationFrame(this.animationId);
			this.animationId = null;
		}
		if (this.canvas) {
			document.body.removeChild(this.canvas);
			this.canvas = null;
		}
		window.removeEventListener("resize", this.handleResize.bind(this));
		this.isRunning = false;
	}

	toggle(): void {
		if (this.isRunning) this.stop();
		else this.init();
	}

	updateConfig(newConfig: SakuraConfig): void {
		const wasRunning = this.isRunning;
		if (wasRunning) this.stop();
		this.config = newConfig;
		if (wasRunning && newConfig.enable) this.init();
	}

	getIsRunning(): boolean {
		return this.isRunning;
	}
}

let globalSakuraManager: SakuraManager | null = null;

export function initSakura(config: SakuraConfig): void {
	if (globalSakuraManager) {
		globalSakuraManager.updateConfig(config);
	} else {
		globalSakuraManager = new SakuraManager(config);
		if (config.enable) {
			globalSakuraManager.init();
		}
	}
}

export function toggleSakura(): void {
	if (globalSakuraManager) globalSakuraManager.toggle();
}

export function stopSakura(): void {
	if (globalSakuraManager) {
		globalSakuraManager.stop();
		globalSakuraManager = null;
	}
}

export function getSakuraStatus(): boolean {
	return globalSakuraManager ? globalSakuraManager.getIsRunning() : false;
}
