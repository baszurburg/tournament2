export interface Category {
  id: string;
  tournamentCode: string;
  name: string;
  code: string;
  description?: string;
  startDate?: Date;
  sortOrder?: string;
}
