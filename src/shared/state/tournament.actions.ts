import { Tournament } from '../../app/models/tournament.interface';
import { Category } from '../../app/models/category.interface';
import { Poule } from '../../app/models/poule.interface';

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
  public constructor(public readonly payload: Tournament) {}
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

// POULE ACTIONS
// ==================================================

// store Poules
export class StorePoules {
  public static readonly type = '[Poules] Store Poules';
  public constructor(public readonly payload: Array<Poule>) {}
}

// store All Tournament Poules
export class StoreTournamentPoules {
  public static readonly type = '[Poules] Store Tournament Poules';
  public constructor(public readonly payload: Array<Poule>) {}
}

// selected Poule
export class SelectPoule {
  public static readonly type = '[Poules] Select Poule';
  public constructor(public readonly payload: Poule) {}
}

export type TournamentActions =
  | StartEditing
  | StopEditing
  | StartLoading
  | StopLoading
  | StoreTournaments
  | SelectTournament
  | StoreCategories
  | SelectCategory
  | StoreTournamentPoules
  | StorePoules
  | SelectPoule;
