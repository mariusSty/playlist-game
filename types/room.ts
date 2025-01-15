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
  picks: Pick[];
};

export type Pick = {
  id: number;
  round: Round;
  song: string;
  user: User;
  votes: Vote[];
};

export type Vote = {
  id: number;
  guessUser: User;
  guessedUser: User;
};

export type Result = {
  user: User;
  score: number;
};
