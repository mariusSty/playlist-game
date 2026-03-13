const allThemes = [
  "gultyPleasure",
  "sleepyTime",
  "partyTime",
  "sadness",
  "now",
  "roadTrip",
  "workout",
  "shower",
  "throwback",
  "karaoke",
  "cooking",
  "rainyDay",
  "summer",
  "funeral",
  "motivation",
  "loveStory",
  "sunrise",
  "chill",
  "danceFloor",
  "nostalgia",
];

export function getRandomThemes(count = 5): string[] {
  const shuffled = [...allThemes].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export const themes = allThemes;
