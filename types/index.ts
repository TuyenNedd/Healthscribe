export interface Speaker {
  id: string;
  name: string;
  role: 'clinician' | 'patient';
}

export interface TranscriptSegment {
  id: string;
  speakerId: string;
  text: string;
  startTime: number;
  endTime: number;
  isSmallTalk?: boolean;
  isSilence?: boolean;
}

export interface SummaryPoint {
  id: string;
  category: string;
  text: string;
  relatedSegmentIds: string[];
}

export interface AudioData {
  id: string;
  title: string;
  url: string;
  duration: number;
  speakers: Speaker[];
  transcript: TranscriptSegment[];
  summary: SummaryPoint[];
}