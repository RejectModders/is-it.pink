import { 
  PINK_COLORS, 
  NOT_PINK_COLORS, 
  DAILY_CHALLENGES, 
  DailyChallenge,
  EASY_PINK_COLORS,
  MEDIUM_PINK_COLORS,
  HARD_PINK_COLORS,
  EASY_NOT_PINK_COLORS,
  MEDIUM_NOT_PINK_COLORS,
  HARD_NOT_PINK_COLORS,
} from './game-constants';

// Helper function to convert hex to HSL
export function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 0 };
  
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

// Helper to generate complementary colors for themes
export function generateThemeColors(primary: string, accent: string, isDark: boolean) {
  const hslPrimary = hexToHSL(primary);
  const hslAccent = hexToHSL(accent);
  
  return {
    primary: `hsl(${hslPrimary.h}, ${hslPrimary.s}%, ${isDark ? Math.min(hslPrimary.l + 15, 85) : hslPrimary.l}%)`,
    primaryForeground: isDark ? '#1a0f16' : '#ffffff',
    accent: `hsl(${hslAccent.h}, ${hslAccent.s}%, ${isDark ? Math.min(hslAccent.l + 10, 80) : hslAccent.l}%)`,
    accentForeground: isDark ? '#1a0f16' : '#ffffff',
    ring: primary,
  };
}

// Seeded random for daily challenge
export function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Get the daily challenge for a specific date (deterministic - same challenge for everyone on that day)
export function getDailyChallenge(date: string): DailyChallenge {
  // Create a deterministic seed from the date
  const dateParts = date.split('-').map(Number);
  const daysSinceEpoch = Math.floor(new Date(dateParts[0], dateParts[1] - 1, dateParts[2]).getTime() / (1000 * 60 * 60 * 24));
  
  // Use the day to pick a challenge (cycles through all 50)
  const challengeIndex = daysSinceEpoch % DAILY_CHALLENGES.length;
  return DAILY_CHALLENGES[challengeIndex];
}

// Get colors based on difficulty level
function getColorsForDifficulty(difficulty: 'easy' | 'medium' | 'hard', isPink: boolean) {
  if (difficulty === 'easy') {
    // Easy: Use obviously pink colors and clearly not-pink colors
    return isPink ? EASY_PINK_COLORS : EASY_NOT_PINK_COLORS;
  } else if (difficulty === 'medium') {
    // Medium: Mix of easy and medium colors
    const pinks = [...EASY_PINK_COLORS, ...MEDIUM_PINK_COLORS];
    const notPinks = [...EASY_NOT_PINK_COLORS, ...MEDIUM_NOT_PINK_COLORS];
    return isPink ? pinks : notPinks;
  } else {
    // Hard: All colors including tricky ones
    return isPink ? PINK_COLORS : NOT_PINK_COLORS;
  }
}

// Generate the color sequence for a daily challenge
export function getDailySequence(date: string): Array<{ color: { hex: string; name: string }; isPink: boolean }> {
  const challenge = getDailyChallenge(date);
  const seed = date.split('-').reduce((acc, val) => acc + parseInt(val), 0) * 12345;
  const sequence: Array<{ color: { hex: string; name: string }; isPink: boolean }> = [];
  
  for (let i = 0; i < challenge.rounds; i++) {
    const rand = seededRandom(seed + i * 1000);
    const isPink = rand < challenge.pinkRatio;
    const colorArray = getColorsForDifficulty(challenge.difficulty, isPink);
    const colorIndex = Math.floor(seededRandom(seed + i * 2000) * colorArray.length);
    sequence.push({ color: colorArray[colorIndex], isPink });
  }
  
  return sequence;
}

// Generate a sequence for any challenge (for preview mode)
export function getChallengeSequence(challenge: DailyChallenge, seedOffset = 0): Array<{ color: { hex: string; name: string }; isPink: boolean }> {
  const seed = (challenge.id * 9999) + seedOffset;
  const sequence: Array<{ color: { hex: string; name: string }; isPink: boolean }> = [];
  
  for (let i = 0; i < challenge.rounds; i++) {
    const rand = seededRandom(seed + i * 1000);
    const isPink = rand < challenge.pinkRatio;
    const colorArray = getColorsForDifficulty(challenge.difficulty, isPink);
    const colorIndex = Math.floor(seededRandom(seed + i * 2000) * colorArray.length);
    sequence.push({ color: colorArray[colorIndex], isPink });
  }
  
  return sequence;
}

// Get challenge for a specific date (for calendar)
export function getChallengeForDate(date: Date): DailyChallenge {
  const daysSinceEpoch = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
  const challengeIndex = daysSinceEpoch % DAILY_CHALLENGES.length;
  return DAILY_CHALLENGES[challengeIndex];
}
