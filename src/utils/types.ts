export type Credentials = {
  id: number;
  username: string;
  email: string;
  password: string;
};

export type CredentialsRegister = {
  email: string;
  password: string;
  username: string;
};

export type Exercise = {
  id: number;
  exercise: string;
  sets: number[];
  weight: number;
};

export type User = {
  username: string;
  id: number;
  email: string;
  password: string;
  routine?: Workout;
};

export type Workout = Exercise[][];