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
