import { baseSepolia, base } from "viem/chains";

export const scenarios = (characterName: string, region: string) => {
  if (region === "surviveindelhi") {
    return [
      `${characterName} is about to jump off Qutub Minar.`,
      `${characterName} is about to hug a Delhi metro.`,
      `${characterName} is about to run into Connaught Place traffic.`,
      `${characterName} is about to climb on top of India Gate`,
      `${characterName} is about to sit inside the Red Fort cannon and light it up.`,
    ];
  } else if (region === "surviveinkorea") {
    return [
      `${characterName} is about to jump off Lotte World Tower.`,
      `${characterName} is about to run into Gangnam traffic.`,
      `${characterName} is about to hug a speeding KTX train.`,
      `${characterName} is about to dive off Banpo Bridge`,
      `${characterName} is about to stick his finger in a Namsan power box`,
    ];
  }else{
    return []
  }
};
 
export const DEFAULT_NFT = {
    name: "Bubba the Brave",
    bio: "Bubba lives for dares, gym selfies, and shouting “watch this” before doing something dumb. He the kind of guy who thinks running headfirst at danger is a personality trait.",
    attributes: {
        compliance: 80,
        creativity: 21,
        motivation_to_survive: 80,
        unhingedness: 70,
    },
};

export const CHAT_DURATION_MS = 2 * 60 * 1000; // 2 minutes

export const INITIAL_MESSAGE = "What'd you think I should do?";

// Survival thresholds for persuasion scoring
export const SURVIVE_SCORE_THRESHOLD = 80; // Score needed to survive (0-100)
export const MIN_STEPS_THRESHOLD = 3; // Minimum safety steps needed

export const defaultChain = process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? base : baseSepolia
