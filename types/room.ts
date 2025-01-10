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
  rounds: Round[];
};

export type Round = {
  id: number;
  theme: string;
  themeMaster: User;
};

export type Pick = {
  id: number;
  round: Round;
  song: string;
  user: User;
};
