export const scenarios = (characterName: string) => [
    `${characterName} is stranded on a stormy island at night`,
    `${characterName} is a lost in the jungle`,
    `${characterName} is a falling from the sky`,
    `${characterName} is trapped overnight in an IKEA maze`,
    `${characterName} is surfing a runaway zorb down a mountain`,
    `${characterName} is locked in a submarine-themed escape room as water rises`,
    `${characterName} is navigating a haunted mall blackout`,
    `${characterName} is clinging to a broken space elevator maintenance ladder`,
    `${characterName} is rafting a kombucha flood through a microbrewery`,
    `${characterName} is chased by feral vending machines in a deserted station`,
    `${characterName} is dodging lava at a volcano souvenir shop`,
    `${characterName} is snowed in on a dangling gondola lift`,
    `${characterName} is lost in a corn maze under a blood moon`,
    `${characterName} is stuck in a smart home gone rogue`,
    `${characterName} is herding hostile pigeons on a skyscraper ledge`,
    `${characterName} is outrunning a swarm of delivery drones`,
    `${characterName} is wading through a flooding subway tunnel`,
    `${characterName} is hopping across floating trampolines on a stormy lake`,
    `${characterName} is time-looped into the worst Tuesday ever`,
    `${characterName} is hiding from animatronic dinosaurs in a museum blackout`,
    `${characterName} is negotiating with a stubborn mountain goat on a narrow ridge`,
    `${characterName} is piloting a shopping cart through freeway traffic`,
    `${characterName} is stuck on a parade float with a runaway balloon`,
];

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
