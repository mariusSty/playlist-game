export type Room = {
  id: string;
  pin: string;
  users: User[];
  host: User;
  game: Game;
};

export type User = {
  id: string;
  name: string;
};

export type Game = {
  id: number;
  isFinished: boolean;
  round: Round[];
  actualRound?: Round;
};

export type Round = {
  id: number;
  theme: Theme;
  themeMaster: User;
};

export type Theme = {
  id: number;
  description: string;
};

export type Pick = {
  id: number;
  round: Round;
  song: Song;
  user: User;
};

export type Song = {
  id: number;
  title: string;
  artist: string;
  url: string;
};
