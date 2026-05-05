export function splitEmoji(label: string): { emoji: string; text: string } {
  const idx = label.indexOf(" ");
  if (idx === -1) return { emoji: "", text: label };
  return { emoji: label.slice(0, idx), text: label.slice(idx + 1) };
}
