import type { SakuraConfig } from "../types/config";

// 极光/星云光团类
class AuroraOrb {
	x: number;
	y: number;
	vx: number; // 速度X
	vy: number; // 速度Y
	radius: number; // 半径
	color: string; // 颜色
	alpha: number; // 基础透明度
	phase: number; // 呼吸相位

	constructor(width: number, height: number, colors: string[]) {
		this.x = Math.random() * width;
		this.y = Math.random() * height;
		// 极慢的漂浮速度
		this.vx = (Math.random() - 0.5) * 0.2; 
		this.vy = (Math.random() - 0.5) * 0.2;
		// 巨大的半径
		this.radius = Math.min(width, height) * (0.3 + Math.random() * 0.4);
		this.color = colors[Math.floor(Math.random() * colors.length)];
		this.alpha = 0.1 + Math.random() * 0.2;
		this.phase = Math.random() * Math.PI * 2;
	}

	update(width: number, height: number) {
		this.x += this.vx;
		this.y += this.vy;
		this.phase += 0.005;

		// 边界反弹（柔和）
		if (this.x < -this.radius) this.vx = Math.abs(this.vx);
		if (this.x > width + this.radius) this.vx = -Math.abs(this.vx);
		if (this.y < -this.radius) this.vy = Math.abs(this.vy);
		if (this.y > height + this.radius) this.vy = -Math.abs(this.vy);
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.save();
		
		// 动态呼吸透明度
		const currentAlpha = this.alpha * (0.8 + Math.sin(this.phase) * 0.2);
		
		// 创建径向渐变模拟柔和光球
		const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
		gradient.addColorStop(0, this.hexToRgba(this.color, currentAlpha));
		gradient.addColorStop(0.5, this.hexToRgba(this.color, currentAlpha * 0.5));
		gradient.addColorStop(1, this.hexToRgba(this.color, 0));

		ctx.fillStyle = gradient;
		// 混合模式：Screen 或 Lighter 让光叠加更自然
		ctx.globalCompositeOperation = 'screen'; 
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fill();
		
		ctx.restore();
	}

	private hexToRgba(hex: string, alpha: number): string {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	}
}

// 颜色配置：星空色系 (紫、蓝、青、深粉)
const STAR_COLORS = [
	"#4c1d95", // Deep Violet
	"#3b82f6", // Blue
	"#06b6d4", // Cyan
	"#d946ef", // Fuchsia
	"#6366f1", // Indigo
];

export class SakuraManager {
	private config: SakuraConfig;
	private canvas: HTMLCanvasElement | null = null;
	private ctx: CanvasRenderingContext2D | null = null;
	private orbs: AuroraOrb[] = [];
	private animationId: number | null = null;
	private isRunning = false;

	constructor(config: SakuraConfig) {
		this.config = config;
	}

	async init(): Promise<void> {
		if (!this.config.enable || this.isRunning) return;

		this.createCanvas();
		this.createOrbs();
		this.startAnimation();
		this.isRunning = true;
	}

	private createCanvas(): void {
		this.canvas = document.createElement("canvas");
		this.canvas.height = window.innerHeight;
		this.canvas.width = window.innerWidth;
		// 放在背景层，不遮挡内容
		this.canvas.setAttribute(
			"style",
			`position: fixed; left: 0; top: 0; pointer-events: none; z-index: 0;`,
		);
		this.canvas.setAttribute("id", "canvas_sakura");
		document.body.appendChild(this.canvas);
		this.ctx = this.canvas.getContext("2d");

		window.addEventListener("resize", this.handleResize.bind(this));
	}

	private createOrbs(): void {
		this.orbs = [];
		// 创建 6-8 个大光球
		const numOrbs = 7; 
		for (let i = 0; i < numOrbs; i++) {
			this.orbs.push(new AuroraOrb(window.innerWidth, window.innerHeight, STAR_COLORS));
		}
	}

	private startAnimation(): void {
		if (!this.ctx || !this.canvas) return;

		const animate = () => {
			if (!this.ctx || !this.canvas) return;

			// 不完全清除画布，制造一点点拖尾或者单纯清空
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

			// 绘制所有光球
			this.orbs.forEach(orb => {
				orb.update(this.canvas!.width, this.canvas!.height);
				orb.draw(this.ctx!);
			});

			this.animationId = requestAnimationFrame(animate);
		};

		this.animationId = requestAnimationFrame(animate);
	}

	private handleResize(): void {
		if (this.canvas) {
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
			// 重置光球以适应新尺寸
			this.createOrbs();
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
	
	toggle(): void {
		if (this.isRunning) this.stop();
		else this.init();
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
