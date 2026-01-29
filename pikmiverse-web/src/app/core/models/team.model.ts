export class Team {
  name: string;
  score: number;

  constructor() {
    this.name = '';
    this.score = 0;
  }
}

export type TeamScore = {
  score: number;
};
