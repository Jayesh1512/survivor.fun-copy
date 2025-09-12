export function msToClock(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export function formatMessages(history: any[], name: string): { role: "nft" | "user"; text: string }[] {
  const messages: { role: "nft" | "user"; text: string }[] = [];
  history.forEach((ex) => {
    if ("user" in ex) messages.push({ role: "user", text: ex.user });
    else {
      const text = (ex as any)[name as keyof typeof ex] as string;
      messages.push({ role: "nft", text });
    }
  });
  return messages;
}
