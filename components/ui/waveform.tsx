"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useWavesurfer } from "@wavesurfer/react";
import WaveSurfer from "wavesurfer.js";
import { cn } from "@/lib/utils";

interface WaveformProps {
  className?: string;
  progress?: number; // 0 to 1
  audioUrl?: string; // Audio URL for Wavesurfer
  duration?: number; // Duration in seconds for time markers
  onTimeUpdate?: (currentTime: number) => void;
  onReady?: () => void;
  onSeek?: (time: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  isPlaying?: boolean;
  height?: number;
  segmentRange?: { start: number; end: number } | null;
  onSegmentRangeUsed?: () => void;
}

export function Waveform({
  className,
  progress = 0,
  audioUrl,
  duration,
  onTimeUpdate,
  onReady,
  onSeek,
  onPlay,
  onPause,
  isPlaying = false,
  height = 64,
  segmentRange,
  onSegmentRangeUsed,
}: WaveformProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isWavesurferReady, setIsWavesurferReady] = useState(false);

  const { wavesurfer, isReady, currentTime } = useWavesurfer({
    container: containerRef,
    height,
    waveColor: "#B1B1B1",
    progressColor: "#EE772F",
    cursorColor: "#F6B094",
    barWidth: 2,
    barRadius: 2,
    barGap: 1,
    fillParent: true,
    normalize: true,
    url: audioUrl,
    backend: "WebAudio",
    peaks: undefined, // Let Wavesurfer generate peaks automatically
    interact: true,
    hideScrollbar: true,
    autoCenter: true,
    sampleRate: 8000,
  });

  // Handle when Wavesurfer is ready
  useEffect(() => {
    if (isReady && wavesurfer) {
      setIsWavesurferReady(true);
      onReady?.();
    }
  }, [isReady, wavesurfer, onReady]);

  // Handle time updates
  useEffect(() => {
    if (!wavesurfer) return;

    const handleTimeUpdate = () => {
      const time = wavesurfer.getCurrentTime();
      onTimeUpdate?.(time);
    };

    wavesurfer.on("timeupdate", handleTimeUpdate);

    return () => {
      wavesurfer.un("timeupdate", handleTimeUpdate);
    };
  }, [wavesurfer, onTimeUpdate]);

  // Handle pause events
  useEffect(() => {
    if (!wavesurfer) return;

    const handlePause = () => {
      onPause?.();
    };

    wavesurfer.on("pause", handlePause);

    return () => {
      wavesurfer.un("pause", handlePause);
    };
  }, [wavesurfer, onPause]);

  // Handle seeking
  useEffect(() => {
    if (!wavesurfer) return;

    const handleSeek = (time: number) => {
      onSeek?.(time);
    };

    wavesurfer.on("seeking", handleSeek);

    return () => {
      wavesurfer.un("seeking", handleSeek);
    };
  }, [wavesurfer, onSeek]);

  // Sync playing state
  useEffect(() => {
    if (!wavesurfer || !isWavesurferReady) return;

    if (isPlaying && !wavesurfer.isPlaying()) {
      wavesurfer.play().catch(console.error);
    } else if (!isPlaying && wavesurfer.isPlaying()) {
      wavesurfer.pause();
    }
  }, [isPlaying, wavesurfer, isWavesurferReady]);

  // Sync progress when controlled externally
  useEffect(() => {
    if (!wavesurfer || !isWavesurferReady || !duration) return;

    const expectedTime = progress * duration;
    const currentWavesurferTime = wavesurfer.getCurrentTime();

    // Only seek if there's a significant difference to avoid feedback loops
    if (Math.abs(expectedTime - currentWavesurferTime) > 0.5) {
      wavesurfer.seekTo(progress);
    }
  }, [progress, duration, wavesurfer, isWavesurferReady]);

  // Handle segment range playback
  useEffect(() => {
    if (!wavesurfer || !isWavesurferReady || !segmentRange) return;

    // Play the specific segment range and notify parent
    wavesurfer
      .play(segmentRange.start, segmentRange.end + 0.5)
      .catch(console.error);
    onPlay?.(); // Notify parent that playback has started

    // Clear the segment range after using it
    onSegmentRangeUsed?.();
  }, [segmentRange, wavesurfer, isWavesurferReady, onSegmentRangeUsed, onPlay]);

  // Handle click events for seeking
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!wavesurfer || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;

      wavesurfer.seekTo(percent);
    },
    [wavesurfer]
  );

  // Fallback to simple progress bar if no audio URL
  if (!audioUrl) {
    return (
      <div
        className={cn(
          "w-full bg-gray-200 rounded overflow-hidden cursor-pointer",
          className
        )}
        style={{ height }}
        onClick={handleClick}
      >
        <div
          className="h-full bg-blue-500 transition-all duration-200"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full transition-opacity hover:opacity-90 cursor-pointer",
        className
      )}
      onClick={handleClick}
    >
      <div ref={containerRef} className="w-full" style={{ height }} />

      {/* Loading indicator */}
      {!isWavesurferReady && (
        <div className="flex items-center justify-center h-16 bg-gray-50 rounded">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="ml-2 text-sm text-gray-600">
            Loading waveform...
          </span>
        </div>
      )}
    </div>
  );
}
