export interface Music {
  setVolume: (volume: number) => {};
  stop: () => {};
  play: () => {};
  openFromFile: (file: string) => {};
  setLoop: (param: boolean) => {};
}

export const music = {
  setVolume: (volume: number) => {},
  stop: () => {},
  play: () => {},
  openFromFile: (file: string) => {},
  setLoop: (param: boolean) => {},
};

