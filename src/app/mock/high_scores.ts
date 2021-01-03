
// Mocking High Scores
export const high_scores = {
  HasCompleted: (level: number) => true,
  HasUnlocked: (level: number) => true,
  Get: (level: number) => 10.0,
  Save: (file: string) => {},
  GetStartLevel: () => 0,
  Update: (level: number, time: number) => {},
};
