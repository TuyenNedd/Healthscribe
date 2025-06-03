"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface WaveformProps {
  className?: string;
  progress?: number; // 0 to 1
  audioData?: number[]; // Optional audio data for visualization
  duration?: number; // Duration in seconds for time markers
}

export function Waveform({
  className,
  progress = 0,
  audioData,
  duration,
}: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredPosition, setHoveredPosition] = useState<number | null>(null);

  // Generate more realistic waveform data if not provided
  const waveformData =
    audioData ||
    Array.from({ length: 200 }, (_, i) => {
      // Create a more realistic waveform pattern
      const baseAmplitude = 0.3 + Math.random() * 0.4;
      const frequency = 0.02 + Math.random() * 0.01;
      const noise = (Math.random() - 0.5) * 0.1;

      // Add some variation based on position to simulate speech patterns
      const speechPattern = Math.sin(i * frequency) * 0.3;
      const envelope = Math.exp(-Math.abs(i - 100) / 50) * 0.5; // Peak in middle

      return Math.max(
        0.05,
        Math.min(0.95, baseAmplitude + speechPattern + envelope + noise)
      );
    });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    // Set the canvas size accounting for device pixel ratio
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    const barWidth = Math.max(1, rect.width / waveformData.length - 0.5);
    const barSpacing = 0.5;
    const maxBarHeight = rect.height * 0.85;
    const barRadius = 1.5;

    // Draw the waveform
    waveformData.forEach((value, index) => {
      const x = index * (barWidth + barSpacing);
      const barHeight = value * maxBarHeight;
      const y = (rect.height - barHeight) / 2;

      const normalizedX = x / rect.width;
      const isPlayed = normalizedX < progress;
      const isHovered =
        hoveredPosition !== null &&
        Math.abs(normalizedX - hoveredPosition) < 0.02;

      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, barRadius);

      if (isHovered) {
        ctx.fillStyle = "rgb(37, 99, 235)"; // Blue-600
      } else if (isPlayed) {
        ctx.fillStyle = "rgb(59, 130, 246)"; // Blue-500
      } else {
        ctx.fillStyle = "rgb(203, 213, 225)"; // Gray-300
      }

      ctx.fill();

      // Add a subtle shadow for played portions
      if (isPlayed && !isHovered) {
        ctx.beginPath();
        ctx.roundRect(
          x,
          y + barHeight * 0.1,
          barWidth,
          barHeight * 0.9,
          barRadius
        );
        ctx.fillStyle = "rgba(59, 130, 246, 0.3)";
        ctx.fill();
      }
    });

    // Draw progress indicator line
    const progressX = rect.width * progress;
    if (progress > 0 && progress < 1) {
      ctx.beginPath();
      ctx.moveTo(progressX, 0);
      ctx.lineTo(progressX, rect.height);
      ctx.strokeStyle = "rgb(239, 68, 68)"; // Red-500
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw time markers if duration is provided
    if (duration && duration > 0) {
      const intervals = Math.min(10, Math.floor(duration / 10)); // Show at most 10 markers
      const timeStep = duration / intervals;

      ctx.fillStyle = "rgb(107, 114, 128)"; // Gray-500
      ctx.font = "10px sans-serif";
      ctx.textAlign = "center";

      for (let i = 0; i <= intervals; i++) {
        const time = i * timeStep;
        const x = (i / intervals) * rect.width;
        const timeText = `${Math.floor(time / 60)}:${(time % 60)
          .toFixed(0)
          .padStart(2, "0")}`;

        // Draw small tick
        ctx.beginPath();
        ctx.moveTo(x, rect.height - 5);
        ctx.lineTo(x, rect.height);
        ctx.strokeStyle = "rgb(156, 163, 175)"; // Gray-400
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw time text
        ctx.fillText(timeText, x, rect.height - 8);
      }
    }
  }, [waveformData, progress, hoveredPosition, duration]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    setHoveredPosition(x);
  };

  const handleMouseLeave = () => {
    setHoveredPosition(null);
  };

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "w-full h-16 transition-opacity hover:opacity-90",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    />
  );
}
