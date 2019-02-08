export interface Tournament {
  id: string;
  code: string;
  name: string;
  description?: string;
  dateStart?: Date;
  dateEnd?: Date;
}
