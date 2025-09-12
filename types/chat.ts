export type Exchange = { [characterName: string]: string } | { user: string };

export interface ChatMessage {
  role: "nft" | "user";
  text: string;
}

export interface NFT {
  name: string;
  bio: string;
  image?: string;
}

export interface ChatProps {
  name: string;
  description: string;
  nftParam: string;
  scenarioParam: string;
}
