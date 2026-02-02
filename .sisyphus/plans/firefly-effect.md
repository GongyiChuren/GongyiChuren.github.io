# 紫色萤火虫飘动效果

## TL;DR

> **Quick Summary**: 将现有的极光效果替换为紫色发光萤火虫飘动效果，在白色背景下更加明显美观
> 
> **Deliverables**: 
> - 修改 `src/components/features/SakuraEffect.astro` 实现萤火虫效果
> 
> **Estimated Effort**: Quick
> **Parallel Execution**: NO - sequential
> **Critical Path**: Task 1

---

## Context

### Original Request
用户希望在白色背景下添加紫亮色发光萤火虫飘动效果。

### Interview Summary
**Key Discussions**:
- 用户想要小巧的萤火虫粒子，而非大光球
- 紫色系发光效果
- 在白色背景下要明显可见

---

## Work Objectives

### Core Objective
将现有的极光/光球效果替换为紫色萤火虫飘动效果

### Concrete Deliverables
- 修改后的 `src/components/features/SakuraEffect.astro`

### Definition of Done
- [ ] 页面上可见紫色萤火虫飘动
- [ ] 萤火虫有闪烁发光效果
- [ ] 运动轨迹自然流畅

### Must Have
- 紫色系发光颜色（淡紫、紫罗兰、粉紫等）
- 小巧的萤火虫粒子（2-5px核心）
- 柔和的发光光晕
- 闪烁/呼吸效果
- 自然的飘动轨迹

### Must NOT Have (Guardrails)
- 不要太大的光球（保持小巧）
- 不要遮挡页面内容
- 不要影响页面性能（控制数量在25个左右）

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO
- **User wants tests**: Manual-only
- **QA approach**: Manual verification

---

## TODOs

- [ ] 1. 替换 SakuraEffect.astro 为萤火虫效果

  **What to do**:
  - 打开 `src/components/features/SakuraEffect.astro`
  - 将现有的 AuroraOrb 类替换为 Firefly 类
  - 实现以下特性：
    - 萤火虫大小：核心 2-5px，光晕 16-40px
    - 颜色：紫色系 (#a78bfa, #c4b5fd, #8b5cf6, #c084fc, #e879f9, #818cf8)
    - 闪烁效果：使用 sin 函数模拟呼吸/闪烁
    - 运动：缓慢飘动 + 轻微摆动
    - 数量：约25个萤火虫
  - 使用 `screen` 和 `lighter` 混合模式让发光效果更明显

  **Must NOT do**:
  - 不要创建太大的光球
  - 不要使用太高的 z-index 遮挡内容

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 单文件修改，逻辑清晰
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Canvas 动画效果实现

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential
  - **Blocks**: None
  - **Blocked By**: None

  **References**:
  
  **Pattern References**:
  - `src/components/features/SakuraEffect.astro` - 现有的极光效果实现，需要替换

  **Acceptance Criteria**:

  **Automated Verification**:
  ```
  # Agent executes via playwright browser automation:
  1. Navigate to: http://localhost:4321/
  2. Wait for: canvas#canvas_firefly to be visible
  3. Assert: Canvas element exists and is rendering
  4. Screenshot: .sisyphus/evidence/firefly-effect.png
  ```

  **Commit**: YES
  - Message: `feat(effect): replace aurora with purple firefly floating effect`
  - Files: `src/components/features/SakuraEffect.astro`

---

## Implementation Code Reference

以下是需要替换到 `SakuraEffect.astro` 的完整代码：

```astro
---
import { sakuraConfig } from "@/config";

const config = { ...sakuraConfig, enable: true };
---

<div id="firefly-container" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;"></div>

<script is:inline>
    // 紫色萤火虫飘动效果
    (function() {
        console.log("✨ Firefly Effect Initializing...");

        const CONTAINER_ID = "firefly-container";
        const CANVAS_ID = "canvas_firefly";

        // 萤火虫类 - 小巧发光的粒子
        class Firefly {
            constructor(width, height) {
                this.init(width, height);
            }

            init(width, height) {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                
                // 随机运动方向和速度 - 缓慢飘动
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = (Math.random() - 0.5) * 0.6;
                
                // 萤火虫大小 - 小巧精致
                this.size = 2 + Math.random() * 3;
                
                // 发光光晕大小
                this.glowSize = this.size * (8 + Math.random() * 6);
                
                // 紫色系发光颜色
                const colors = [
                    { r: 167, g: 139, b: 250 }, // 淡紫 #a78bfa
                    { r: 196, g: 181, b: 253 }, // 浅紫 #c4b5fd
                    { r: 139, g: 92, b: 246 },  // 紫罗兰 #8b5cf6
                    { r: 192, g: 132, b: 252 }, // 亮紫 #c084fc
                    { r: 232, g: 121, b: 249 }, // 粉紫 #e879f9
                    { r: 129, g: 140, b: 248 }, // 蓝紫 #818cf8
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                
                // 闪烁相位
                this.phase = Math.random() * Math.PI * 2;
                this.phaseSpeed = 0.02 + Math.random() * 0.03;
                
                // 运动曲线参数
                this.wobbleX = Math.random() * Math.PI * 2;
                this.wobbleY = Math.random() * Math.PI * 2;
                this.wobbleSpeedX = 0.01 + Math.random() * 0.02;
                this.wobbleSpeedY = 0.01 + Math.random() * 0.02;
            }

            update(width, height) {
                this.wobbleX += this.wobbleSpeedX;
                this.wobbleY += this.wobbleSpeedY;
                
                this.x += this.vx + Math.sin(this.wobbleX) * 0.3;
                this.y += this.vy + Math.cos(this.wobbleY) * 0.2;
                
                this.phase += this.phaseSpeed;
                
                // 边界处理
                if (this.x < -this.glowSize) this.x = width + this.glowSize;
                if (this.x > width + this.glowSize) this.x = -this.glowSize;
                if (this.y < -this.glowSize) this.y = height + this.glowSize;
                if (this.y > height + this.glowSize) this.y = -this.glowSize;
            }

            draw(ctx) {
                ctx.save();
                
                const flicker = 0.4 + Math.sin(this.phase) * 0.3 + Math.sin(this.phase * 2.7) * 0.2;
                const glowAlpha = Math.max(0.1, Math.min(0.9, flicker));
                
                const { r, g, b } = this.color;
                
                // 外层大光晕
                const outerGlow = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.glowSize
                );
                outerGlow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${glowAlpha * 0.6})`);
                outerGlow.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${glowAlpha * 0.3})`);
                outerGlow.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${glowAlpha * 0.1})`);
                outerGlow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
                
                ctx.globalCompositeOperation = 'screen';
                ctx.fillStyle = outerGlow;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.glowSize, 0, Math.PI * 2);
                ctx.fill();
                
                // 内层亮核
                const innerGlow = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.size * 2
                );
                innerGlow.addColorStop(0, `rgba(255, 255, 255, ${glowAlpha * 0.9})`);
                innerGlow.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${glowAlpha * 0.8})`);
                innerGlow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
                
                ctx.globalCompositeOperation = 'lighter';
                ctx.fillStyle = innerGlow;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
            }
        }

        let canvas, ctx, animationId;
        let fireflies = [];
        const FIREFLY_COUNT = 25;

        function init() {
            const oldCanvas = document.getElementById(CANVAS_ID);
            if (oldCanvas) oldCanvas.remove();
            if (animationId) cancelAnimationFrame(animationId);

            canvas = document.createElement("canvas");
            canvas.id = CANVAS_ID;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvas.style.position = "fixed";
            canvas.style.top = "0";
            canvas.style.left = "0";
            canvas.style.pointerEvents = "none";
            canvas.style.zIndex = "1";
            
            const container = document.getElementById(CONTAINER_ID);
            if (container) container.appendChild(canvas);
            else document.body.appendChild(canvas);

            ctx = canvas.getContext("2d");

            fireflies = [];
            for (let i = 0; i < FIREFLY_COUNT; i++) {
                fireflies.push(new Firefly(canvas.width, canvas.height));
            }

            animate();
        }

        function animate() {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            fireflies.forEach(firefly => {
                firefly.update(canvas.width, canvas.height);
                firefly.draw(ctx);
            });

            animationId = requestAnimationFrame(animate);
        }

        function onResize() {
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }

        window.addEventListener('resize', onResize);
        document.addEventListener('astro:page-load', init);
        if (window.swup) {
            window.swup.hooks.on('content:replace', init);
        }
    })();
</script>
```

---

## Success Criteria

### Verification Commands
```bash
pnpm dev  # 启动开发服务器后在浏览器中查看效果
```

### Final Checklist
- [ ] 紫色萤火虫在页面上飘动
- [ ] 萤火虫有闪烁发光效果
- [ ] 不遮挡页面内容
- [ ] 页面性能正常
