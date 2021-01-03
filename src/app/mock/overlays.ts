// Overlays
export const overlays = {
  GetOption: (a: string, b: string) => '',
  UpdateMenu: (mouse: {x: number, y: number}) => {},
  UpdateControls: (mouse: {x: number, y: number}) => {},
  UpdateLevels: (mouse: {x: number, y: number}) => {},
  UpdatePaused: (mouse: {x: number, y: number}) => {},
  DrawMenu: (context: Window) => {},
  DrawControls: (context: Window) => {},
  DrawLevels: (context: Window) => {},
  DrawLevelDesc: (context: Window, level: number) => {},
  DrawArrow: (context: Window, direction: { x: number, y: number, z: number }) => {},
  DrawTimer: (context: Window, time: number, isHighscore: boolean) => {},
  DrawCredits: (context: Window, isFullRun: boolean, time: number) => {},
  DrawMidPoint: (context: Window, isFullRun: boolean, time: number) => {},
  DrawSumTime: (context: Window, time: number) => {},
  DrawFPS: (context: Window, fps: number) => {},
  DrawCheatsEnabled: (context: Window) => {},
  DrawCheats: (context: Window) => {},
  DrawPaused: (context: Window) => {},
};

