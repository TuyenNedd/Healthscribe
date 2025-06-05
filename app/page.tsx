"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AudioPlayer } from "@/components/audio-player";
import { TranscriptPanel } from "@/components/transcript-panel";
import { InsightsPanel } from "@/components/insights-panel";
import { AudioControls } from "@/components/audio-controls";
import { TranscriptSegment, SummaryPoint } from "@/types";

// Import data files
import { feverStomachTranscript } from "@/data/fever_stomach_transcript";
import { feverStomachSummary } from "@/data/fever_stomach_summary";
import { feverStomachWord } from "@/data/fever_stomach_word";

export default function Home() {
  const [currentTime, setCurrentTime] = useState(0);
  const [highlightedSegmentIds, setHighlightedSegmentIds] = useState<string[]>(
    []
  );
  const [activePointId, setActivePointId] = useState<string>();
  const [searchQuery, setSearchQuery] = useState("");

  // Transform data to expected formats
  const audioData = {
    id: "consultation-fever-stomach",
    title: "Fever and Stomach Pain Consultation",
    url: "/data/fever_stomach.mp3",
    duration: 62.36,
    speakers: [
      { id: "SPEAKER_00", name: "Dr. Smith", role: "clinician" as const },
      { id: "SPEAKER_01", name: "Mr. McKay", role: "patient" as const },
    ],
    transcript: feverStomachTranscript.map((item, index) => ({
      id: `segment-${index + 1}`,
      speakerId: item.speaker,
      text: item.text,
      startTime: item.start,
      endTime: item.end,
    })),
    summary: Object.entries(feverStomachSummary).flatMap(([category, items]) =>
      items.map((item, index) => ({
        id: `${category}-${index}`,
        category: category
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        text: item.info,
        relatedSegmentIds: item.utterance_ids
          .map((utteranceId) => {
            const transcriptIndex = feverStomachTranscript.findIndex(
              (t) => t.utterance_id === utteranceId
            );
            return `segment-${transcriptIndex + 1}`;
          })
          .filter((id) => id !== "segment-0"), // Filter out invalid mappings
      }))
    ),
  };

  const wordTimings = feverStomachWord;

  const handleSegmentClick = (segment: TranscriptSegment) => {
    setCurrentTime(segment.startTime);
  };

  const handleSummaryPointClick = (point: SummaryPoint) => {
    if (point.relatedSegmentIds.length > 0) {
      // Highlight all related segments
      setHighlightedSegmentIds(point.relatedSegmentIds);
      setActivePointId(point.id);

      // Find the first segment to get its start time
      const firstSegment = audioData.transcript.find(
        (s) => s.id === point.relatedSegmentIds[0]
      );
      if (firstSegment) {
        setCurrentTime(firstSegment.startTime);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-full mx-auto px-4 py-8">
        {/* <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{audioData.title}</h1>
          <Button variant="outline">Change Audio</Button>
        </div> */}

        <div className="sticky top-0 z-10 bg-gray-50 pb-6">
          <AudioPlayer
            audioUrl={audioData.url}
            title={audioData.title}
            duration={audioData.duration}
            onTimeUpdate={setCurrentTime}
            onSeek={setCurrentTime}
            wordTimings={wordTimings}
          />
        </div>

        {/* <div className="mb-6">
          <AudioControls onSearch={setSearchQuery} />
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[600px]">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col overflow-hidden">
            <TranscriptPanel
              transcript={audioData.transcript}
              speakers={audioData.speakers}
              currentTime={currentTime}
              highlightedSegmentIds={highlightedSegmentIds}
              onSegmentClick={handleSegmentClick}
              wordTimings={wordTimings}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col overflow-hidden">
            <InsightsPanel
              summary={audioData.summary}
              onSummaryPointClick={handleSummaryPointClick}
              activePointId={activePointId}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
