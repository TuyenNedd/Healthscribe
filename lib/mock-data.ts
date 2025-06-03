import { AudioData } from "@/types";

export const mockAudioData: AudioData = {
  id: "consultation-fever-stomach",
  title: "Fever and Stomach Pain Consultation",
  url: "/data/fever_stomach.mp3",
  duration: 62.36, // Based on the transcript end time
  speakers: [
    {
      id: "SPEAKER_00",
      name: "Dr. Smith",
      role: "clinician",
    },
    {
      id: "SPEAKER_01",
      name: "Mr. McKay",
      role: "patient",
    },
  ],
  transcript: [
    {
      id: "segment-1",
      speakerId: "SPEAKER_00",
      text: "Hello, Mr. McKay.",
      startTime: 4.76,
      endTime: 6.42,
    },
    {
      id: "segment-2",
      speakerId: "SPEAKER_00",
      text: "What brings you here today?",
      startTime: 7.28,
      endTime: 9.0,
    },
    {
      id: "segment-3",
      speakerId: "SPEAKER_01",
      text: "I have a fever and a sore stomach. Okay, Tony.",
      startTime: 9.74,
      endTime: 14.16,
    },
    {
      id: "segment-4",
      speakerId: "SPEAKER_00",
      text: "I see your temperature is 104 degrees. That's very high.",
      startTime: 15.28,
      endTime: 21.3,
    },
    {
      id: "segment-5",
      speakerId: "SPEAKER_01",
      text: "Yes, I feel very dizzy and nauseous. Did you get sick?",
      startTime: 22.24,
      endTime: 27.2,
    },
    {
      id: "segment-6",
      speakerId: "SPEAKER_01",
      text: "Yes, I vomited twice this morning. Did you have any diarrhea? Yes,",
      startTime: 28.34,
      endTime: 35.0,
    },
    {
      id: "segment-7",
      speakerId: "SPEAKER_00",
      text: "a little bit. Did you take any medicine to treat your symptoms? No, doctor.",
      startTime: 35.22,
      endTime: 41.36,
    },
    {
      id: "segment-8",
      speakerId: "SPEAKER_01",
      text: "I didn't take anything. Okay,",
      startTime: 41.56,
      endTime: 44.02,
    },
    {
      id: "segment-9",
      speakerId: "SPEAKER_00",
      text: "sounds like you may have some food poisoning. Oh, no.",
      startTime: 44.22,
      endTime: 48.9,
    },
    {
      id: "segment-10",
      speakerId: "SPEAKER_00",
      text: "Take this medicine now and again every six hours until it's finished. You'll be okay. You'll be okay in about 24 hours. That's",
      startTime: 49.84,
      endTime: 59.8,
    },
    {
      id: "segment-11",
      speakerId: "SPEAKER_01",
      text: "a relief. Thank you very much, doctor. Thank you, doctor.",
      startTime: 59.8,
      endTime: 62.36,
    },
  ],
  summary: [
    {
      id: "summary-1",
      category: "Chief Complaint",
      text: "Patient presents with fever and stomach pain",
      relatedSegmentIds: ["segment-3"],
    },
    {
      id: "summary-2",
      category: "History of Present Illness",
      text: "Patient reports temperature of 104°F with associated dizziness, nausea, vomiting (twice in the morning), and mild diarrhea",
      relatedSegmentIds: ["segment-4", "segment-5", "segment-6", "segment-7"],
    },
    {
      id: "summary-3",
      category: "History of Present Illness",
      text: "Patient has not taken any medication for symptoms prior to visit",
      relatedSegmentIds: ["segment-7", "segment-8"],
    },
    {
      id: "summary-4",
      category: "Assessment",
      text: "Likely food poisoning based on presentation",
      relatedSegmentIds: ["segment-9"],
    },
    {
      id: "summary-5",
      category: "Plan",
      text: "Prescribed medication to be taken every 6 hours until finished",
      relatedSegmentIds: ["segment-10"],
    },
    {
      id: "summary-6",
      category: "Plan",
      text: "Expected recovery time: approximately 24 hours",
      relatedSegmentIds: ["segment-10"],
    },
  ],
};
