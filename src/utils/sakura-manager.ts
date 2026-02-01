import type { SakuraConfig } from "../types/config";

// 萤火虫对象类
class Firefly {
	x: number;
	y: number;
	s: number; // 大小
	r: number; // 相位偏移，控制呼吸节奏
	a: number; // 基础不透明度
	fn: {
		x: (x: number, y: number) => number;
		y: (x: number, y: number) => number;
	};
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
		},
		config: SakuraConfig,
	) {
		this.x = x;
		this.y = y;
		this.s = s;
		this.r = r;
		this.a = a;
		this.fn = fn;
		this.config = config;
	}

	draw(cxt: CanvasRenderingContext2D) {
		// 计算呼吸效果
		const breath = (Math.sin(Date.now() / 1500 + this.r) + 1) / 2; // 0 到 1 之间波动
		const currentAlpha = this.a * (0.4 + breath * 0.6); // 保持基础可见度

		cxt.save();
		cxt.globalAlpha = currentAlpha;

		const size = 3 * this.s; 
		
		// 萤火虫核心
		cxt.beginPath();
		cxt.arc(this.x, this.y, size, 0, Math.PI * 2);
		cxt.fillStyle = "#fbbf24"; // 暖金色
		cxt.fill();

		// 萤火虫柔和光晕
		const gradient = cxt.createRadialGradient(this.x, this.y, size, this.x, this.y, size * 5);
		gradient.addColorStop(0, "rgba(251, 191, 36, 0.5)"); 
		gradient.addColorStop(1, "rgba(251, 191, 36, 0)");   
		
		cxt.fillStyle = gradient;
		cxt.beginPath();
		cxt.arc(this.x, this.y, size * 5, 0, Math.PI * 2);
		cxt.fill();

		cxt.restore();
	}

	update() {
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
		for (let i = 0; i < this.list.length; i++) {
			this.list[i].update();
		}
	}

	draw(cxt: CanvasRenderingContext2D) {
		for (let i = 0; i < this.list.length; i++) {
			this.list[i].draw(cxt);
		}
	}
}

// 获取随机值的函数
function getRandom(
	option: "x" | "y" | "s" | "r" | "a",
	config: SakuraConfig,
): number;
function getRandom(
	option: "fnx" | "fny",
	config: SakuraConfig,
): (...args: number[]) => number;
function getRandom(
	option: string,
	config: SakuraConfig,
): number | ((...args: number[]) => number) {
	switch (option) {
		case "x": return Math.random() * window.innerWidth;
		case "y": return Math.random() * window.innerHeight;
		case "s": return config.size.min + Math.random() * (config.size.max - config.size.min);
		case "r": return Math.random() * Math.PI * 2;
		case "a": return config.opacity.min + Math.random() * (config.opacity.max - config.opacity.min);
		case "fnx":
			const speedX = (Math.random() - 0.5) * 0.8; 
			return (x: number) => x + speedX;
		case "fny":
			const speedY = (Math.random() - 0.5) * 0.8;
			return (_x: number, y: number) => y + speedY;
		default: return 0;
	}
}

// 管理器类
export class SakuraManager {
	private config: SakuraConfig;
	private canvas: HTMLCanvasElement | null = null;
	private ctx: CanvasRenderingContext2D | null = null;
	private list: FireflyList | null = null;
	private animationId: number | null = null;
	private isRunning = false;

	constructor(config: SakuraConfig) {
		this.config = config;
	}

	async init(): Promise<void> {
		if (!this.config.enable || this.isRunning) return;

		this.createCanvas();
		this.createList();
		this.startAnimation();
		this.isRunning = true;
	}

	private createCanvas(): void {
		this.canvas = document.createElement("canvas");
		this.canvas.height = window.innerHeight;
		this.canvas.width = window.innerWidth;
		// z-index 设置为 -1，放在背景图层上方，内容图层下方
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
		for (let i = 0; i < this.config.sakuraNum; i++) {
			this.list.push(new Firefly(
				getRandom("x", this.config),
				getRandom("y", this.config),
				getRandom("s", this.config),
				getRandom("r", this.config),
				getRandom("a", this.config),
				{
					x: getRandom("fnx", this.config),
					y: getRandom("fny", this.config),
				},
				this.config
			));
		}
	}

	private startAnimation(): void {
		if (!this.ctx || !this.canvas || !this.list) return;
		const animate = () => {
			if (!this.ctx || !this.canvas || !this.list) return;
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.list.update();
			this.list.draw(this.ctx);
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
		if (this.animationId) cancelAnimationFrame(this.animationId);
		if (this.canvas) document.body.removeChild(this.canvas);
		window.removeEventListener("resize", this.handleResize.bind(this));
		this.isRunning = false;
	}

	updateConfig(newConfig: SakuraConfig): void {
		const wasRunning = this.isRunning;
		if (wasRunning) this.stop();
		this.config = newConfig;
		if (wasRunning && newConfig.enable) this.init();
	}

	getIsRunning(): boolean { return this.isRunning; }
}

let globalSakuraManager: SakuraManager | null = null;

export function initSakura(config: SakuraConfig): void {
	if (globalSakuraManager) globalSakuraManager.updateConfig(config);
	else {
		globalSakuraManager = new SakuraManager(config);
		if (config.enable) globalSakuraManager.init();
	}
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