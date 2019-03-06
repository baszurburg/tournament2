export interface Team {
  id: string;
  tournamentCode: string;
  categoryCode: string;
  club: string;
  teamName: string;
  played: number;
  win: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  pointsOff: number;
}
