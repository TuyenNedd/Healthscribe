"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Waveform } from "@/components/ui/waveform";
import { formatTime } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  duration: number;
  onTimeUpdate?: (currentTime: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onSeek?: (time: number) => void;
  wordTimings?: Array<{ word: string; start: number; end: number }>;
}

export function AudioPlayer({
  audioUrl,
  title,
  duration,
  onTimeUpdate,
  onPlay,
  onPause,
  onSeek,
  wordTimings,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const progress = duration > 0 ? currentTime / duration : 0;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      onTimeUpdate?.(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handlePlaying = () => {
      setIsLoading(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("playing", handlePlaying);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("playing", handlePlaying);
    };
  }, [onTimeUpdate]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = playbackRate;
    }
  }, [volume, playbackRate]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      onPause?.();
    } else {
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
      onPlay?.();
    }

    setIsPlaying(!isPlaying);
  };

  const handleSeek = (newValue: number[]) => {
    const newTime = newValue[0];
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = newTime;
      setCurrentTime(newTime);
      onSeek?.(newTime);
    }
  };

  const skipBackward = () => {
    const audio = audioRef.current;
    if (audio) {
      const newTime = Math.max(0, audio.currentTime - 10);
      audio.currentTime = newTime;
      setCurrentTime(newTime);
      onSeek?.(newTime);
    }
  };

  const skipForward = () => {
    const audio = audioRef.current;
    if (audio) {
      const newTime = Math.min(duration, audio.currentTime + 10);
      audio.currentTime = newTime;
      setCurrentTime(newTime);
      onSeek?.(newTime);
    }
  };

  const getCurrentWord = () => {
    if (!wordTimings) return null;
    return wordTimings.find(
      (word) => currentTime >= word.start && currentTime <= word.end
    );
  };

  const getMedicalTerms = () => {
    // Simple medical term detection - in production this would use more sophisticated NLP
    const medicalKeywords = [
      "temperature",
      "fever",
      "medicine",
      "doctor",
      "symptoms",
      "nauseous",
      "vomited",
      "diarrhea",
      "poisoning",
      "degrees",
    ];
    return (
      wordTimings?.filter((word) =>
        medicalKeywords.some((term) =>
          word.word.toLowerCase().includes(term.toLowerCase())
        )
      ) || []
    );
  };

  const currentWord = getCurrentWord();
  const medicalTerms = getMedicalTerms();
  const isMedicalTerm =
    currentWord &&
    medicalTerms.some(
      (term) => term.word.toLowerCase() === currentWord.word.toLowerCase()
    );

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="text-sm text-blue-600 mt-1 min-h-[1.25rem]">
              {currentWord ? (
                <>
                  Currently speaking: &ldquo;{currentWord.word}&rdquo;
                  {isMedicalTerm && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Medical Term
                    </span>
                  )}
                </>
              ) : (
                <span className="text-transparent">
                  Currently speaking: &ldquo;placeholder&rdquo;
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings size={16} className="mr-2" />
                  {playbackRate}x
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                  <DropdownMenuItem
                    key={rate}
                    onClick={() => setPlaybackRate(rate)}
                    className={playbackRate === rate ? "bg-blue-50" : ""}
                  >
                    {rate}x Speed
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center space-x-2">
              <Volume2 size={16} className="text-gray-500" />
              <Slider
                className="w-24"
                defaultValue={[volume * 100]}
                max={100}
                step={1}
                onValueChange={(value) => setVolume(value[0] / 100)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div
            className="relative w-full cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = (e.clientX - rect.left) / rect.width;
              const newTime = duration * percent;
              handleSeek([newTime]);
            }}
          >
            <Waveform progress={progress} duration={duration} />
          </div>

          <Slider
            className="w-full"
            value={[currentTime]}
            max={duration}
            step={0.1}
            onValueChange={handleSeek}
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={skipBackward}
              aria-label="Skip backward 10 seconds"
              disabled={isLoading}
            >
              <SkipBack size={16} />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={togglePlayPause}
              aria-label={isPlaying ? "Pause" : "Play"}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause size={16} />
              ) : (
                <Play size={16} />
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={skipForward}
              aria-label="Skip forward 10 seconds"
              disabled={isLoading}
            >
              <SkipForward size={16} />
            </Button>
          </div>

          <div className="text-sm text-gray-500">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        {wordTimings && (
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <strong>Word-level timing available:</strong> {wordTimings.length}{" "}
            words tracked
            {medicalTerms.length > 0 && (
              <span className="ml-4">
                <strong>Medical terms detected:</strong> {medicalTerms.length}
              </span>
            )}
          </div>
        )}
      </div>

      <audio ref={audioRef} src={audioUrl} preload="metadata" />
    </div>
  );
}
