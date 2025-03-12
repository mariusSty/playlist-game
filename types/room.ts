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
  track: Track;
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

export type Track = {
  id: string;
  title: string;
  artist: string;
  previewUrl: string;
};
