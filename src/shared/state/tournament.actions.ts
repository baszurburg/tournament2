import { Tournament } from '../../app/models/tournament.interface';
import { Category } from '../../app/models/category.interface';

// GLOBAL ACTIONS
// ==================================================

//
//  ACTIONS - EDITING
export class StartEditing {
  public static readonly type = '[EDITING] Start';
}

export class StopEditing {
  public static readonly type = '[EDITING] Stop';
}

//
//  ACTIONS - LOADING
export class StartLoading {
  public static readonly type = '[LOADING] Start';
}

export class StopLoading {
  public static readonly type = '[LOADING] Stop';
}

// TOURNAMENT ACTIONS
// ==================================================

// store Tournaments
export class StoreTournaments {
  public static readonly type = '[Tournaments] Store Tournaments';
  public constructor(public readonly payload: Array<Tournament>) {}
}

// selected Tournament
export class SelectTournament {
  public static readonly type = '[Tournaments] Select Tournament';
  public constructor(public readonly payload: string) {}
}

// CATEGORY ACTIONS
// ==================================================

// store Categories
export class StoreCategories {
  public static readonly type = '[Categories] Store Categories';
  public constructor(public readonly payload: Array<Category>) {}
}

// selected Category
export class SelectCategory {
  public static readonly type = '[Categories] Select Category';
  public constructor(public readonly payload: Category) {}
}

export type TournamentActions =
  | StartEditing
  | StopEditing
  | StartLoading
  | StopLoading
  | StoreTournaments
  | SelectTournament
  | StoreCategories
  | SelectCategory;
