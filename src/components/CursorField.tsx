"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number; life: number };

/**
 * Blueprint drafting field: a soft reveal + crosshair that tracks the cursor.
 * Disabled on coarse pointers / reduced motion.
 */
export function CursorField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduceMotion || coarse) {
      canvas.style.display = "none";
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;
    const target = { x: -9999, y: -9999 };
    const pos = { x: -9999, y: -9999 };
    const trail: Point[] = [];
    let visible = false;
    let lastTrail = 0;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function onMove(e: PointerEvent) {
      target.x = e.clientX;
      target.y = e.clientY;
      visible = true;
    }

    function onLeave() {
      visible = false;
    }

    function drawCross(x: number, y: number, size: number, alpha: number) {
      ctx!.save();
      ctx!.globalAlpha = alpha;
      ctx!.strokeStyle = "#2a5a8c";
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      ctx!.moveTo(x - size, y);
      ctx!.lineTo(x + size, y);
      ctx!.moveTo(x, y - size);
      ctx!.lineTo(x, y + size);
      ctx!.stroke();
      ctx!.restore();
    }

    function drawCorner(x: number, y: number, dirX: number, dirY: number, alpha: number) {
      const len = 10;
      ctx!.save();
      ctx!.globalAlpha = alpha;
      ctx!.strokeStyle = "#e24a1c";
      ctx!.lineWidth = 1.25;
      ctx!.beginPath();
      ctx!.moveTo(x, y + dirY * len);
      ctx!.lineTo(x, y);
      ctx!.lineTo(x + dirX * len, y);
      ctx!.stroke();
      ctx!.restore();
    }

    function frame(now: number) {
      const ease = 0.12;
      pos.x += (target.x - pos.x) * ease;
      pos.y += (target.y - pos.y) * ease;

      ctx!.clearRect(0, 0, w, h);

      if (visible || Math.hypot(target.x - pos.x, target.y - pos.y) > 0.5) {
        const x = pos.x;
        const y = pos.y;

        // Soft paper reveal (grid intensification via radial wash)
        const reveal = ctx!.createRadialGradient(x, y, 20, x, y, 220);
        reveal.addColorStop(0, "rgba(255,255,255,0.34)");
        reveal.addColorStop(0.45, "rgba(42,90,140,0.08)");
        reveal.addColorStop(1, "rgba(42,90,140,0)");
        ctx!.fillStyle = reveal;
        ctx!.fillRect(0, 0, w, h);

        // Local denser grid
        ctx!.save();
        ctx!.beginPath();
        ctx!.arc(x, y, 160, 0, Math.PI * 2);
        ctx!.clip();
        ctx!.strokeStyle = "rgba(42,90,140,0.16)";
        ctx!.lineWidth = 1;
        const step = 24;
        const ox = x % step;
        const oy = y % step;
        for (let gx = -160; gx <= 160; gx += step) {
          ctx!.beginPath();
          ctx!.moveTo(x + gx - ox, y - 160);
          ctx!.lineTo(x + gx - ox, y + 160);
          ctx!.stroke();
        }
        for (let gy = -160; gy <= 160; gy += step) {
          ctx!.beginPath();
          ctx!.moveTo(x - 160, y + gy - oy);
          ctx!.lineTo(x + 160, y + gy - oy);
          ctx!.stroke();
        }
        ctx!.restore();

        // Drafting ring
        ctx!.beginPath();
        ctx!.arc(x, y, 46, 0, Math.PI * 2);
        ctx!.strokeStyle = "rgba(42,90,140,0.45)";
        ctx!.lineWidth = 1;
        ctx!.stroke();

        ctx!.beginPath();
        ctx!.arc(x, y, 46, -0.35, 0.55);
        ctx!.strokeStyle = "rgba(226,74,28,0.85)";
        ctx!.lineWidth = 1.5;
        ctx!.stroke();

        // Corner brackets
        const r = 46;
        drawCorner(x - r, y - r, 1, 1, 0.85);
        drawCorner(x + r, y - r, -1, 1, 0.85);
        drawCorner(x - r, y + r, 1, -1, 0.85);
        drawCorner(x + r, y + r, -1, -1, 0.85);

        drawCross(x, y, 7, 0.7);

        // Accent tick
        ctx!.fillStyle = "#e24a1c";
        ctx!.fillRect(x - 1.5, y - 1.5, 3, 3);

        if (now - lastTrail > 42) {
          trail.push({ x, y, life: 1 });
          lastTrail = now;
          if (trail.length > 18) trail.shift();
        }
      }

      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        p.life -= 0.028;
        if (p.life <= 0) {
          trail.splice(i, 1);
          continue;
        }
        drawCross(p.x, p.y, 4 + (1 - p.life) * 4, p.life * 0.35);
      }

      raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    document.documentElement.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
