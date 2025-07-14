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
  wheight: number;
};

export type User = {
  username: string;
  id: number;
  email: string;
  password: string;
  planification?: Planification;
};

export type Planification = {
  [day: string]: Exercise[];
};
  