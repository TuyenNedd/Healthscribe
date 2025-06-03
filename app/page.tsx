"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AudioPlayer } from "@/components/audio-player";
import { TranscriptPanel } from "@/components/transcript-panel";
import { InsightsPanel } from "@/components/insights-panel";
import { AudioControls } from "@/components/audio-controls";
import { mockAudioData } from "@/lib/mock-data";
import { TranscriptSegment, SummaryPoint } from "@/types";

// Import word timing data
import wordTimingsData from "@/data/fever_stomach_word.json";

export default function Home() {
  const [currentTime, setCurrentTime] = useState(0);
  const [highlightedSegmentId, setHighlightedSegmentId] = useState<string>();
  const [activePointId, setActivePointId] = useState<string>();
  const [searchQuery, setSearchQuery] = useState("");

  // Transform word timing data to the expected format
  const wordTimings = wordTimingsData.map((item) => ({
    word: item.word,
    start: item.start,
    end: item.end,
  }));

  const handleSegmentClick = (segment: TranscriptSegment) => {
    setCurrentTime(segment.startTime);
  };

  const handleSummaryPointClick = (point: SummaryPoint) => {
    if (point.relatedSegmentIds.length > 0) {
      const firstSegmentId = point.relatedSegmentIds[0];
      setHighlightedSegmentId(firstSegmentId);
      setActivePointId(point.id);

      // Find the segment to get its start time
      const segment = mockAudioData.transcript.find(
        (s) => s.id === firstSegmentId
      );
      if (segment) {
        setCurrentTime(segment.startTime);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-full mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{mockAudioData.title}</h1>
          <Button variant="outline">Change Audio</Button>
        </div>

        <div className="mb-6">
          <AudioPlayer
            audioUrl={mockAudioData.url}
            title={mockAudioData.title}
            duration={mockAudioData.duration}
            onTimeUpdate={setCurrentTime}
            onSeek={setCurrentTime}
            wordTimings={wordTimings}
          />
        </div>

        <div className="mb-6">
          <AudioControls onSearch={setSearchQuery} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-[600px]">
            <TranscriptPanel
              transcript={mockAudioData.transcript}
              speakers={mockAudioData.speakers}
              currentTime={currentTime}
              highlightedSegmentId={highlightedSegmentId}
              onSegmentClick={handleSegmentClick}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-[600px]">
            <InsightsPanel
              summary={mockAudioData.summary}
              onSummaryPointClick={handleSummaryPointClick}
              activePointId={activePointId}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
