export const scenarios = (characterName: string) => [
    `${characterName} is stranded on a stormy island at night`,
    `${characterName} is a lost in the jungle`,
    `${characterName} is a falling from the sky`,
]

export const DEFAULT_NFT = {
    name: "baby punk",
    bio: "super unhinged",
    attributes: {
        compliance: 80,
        creativity: 21,
        motivation_to_survive: 80,
        unhingedness: 70,
    },
};

export const CHAT_DURATION_MS = 2 * 60 * 1000; // 2 minutes

export const INITIAL_MESSAGE = "What do you think I should do?";
