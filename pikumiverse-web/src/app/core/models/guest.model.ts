export class Guest {
  name: string;
  team_name: string;
  score: number;

  constructor() {
    this.name = '';
    this.team_name = '';
    this.score = 0;
  }
}

export type GuestScore = {
  score: number;
};
