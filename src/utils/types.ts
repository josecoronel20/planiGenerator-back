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
  id: string;
  exercise: string;
  sets: number[];
  weight: number;
};

export type User = {
  username: string;
  id: number;
  email: string;
  password: string;
  planning?: planning;
};

export type planning = {
  [day: string]: Exercise[];
};
  