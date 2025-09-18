export type Exchange = Record<string, string>;

export type Narration = {
  story: string;
  result: "survived" | "died"
};

export type JudgementPhase = "decision" | "story" | "result";

export interface JudgementProps {
  scenario: string;
  agentName: string;
  chatHistory: Exchange[];
}

export type PersuasionReport = {
  score: number;
  steps_count: number;
};

export type AnalyserResult = {
  decision: string;
  persuasion: PersuasionReport;
};
