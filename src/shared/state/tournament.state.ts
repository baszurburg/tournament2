import { Action, Selector, State, StateContext } from '@ngxs/store';

import * as tournamentActions from './tournament.actions';
import { Tournament } from '../../app/models/tournament.interface';
import { Category } from '../../app/models/category.interface';
import { Poule } from '../../app/models/poule.interface';

// -----tournament state model --------
export interface TournamentsStateModel {
  tournaments: Array<Tournament>;
  categories: Array<Category>;
  poules: Array<Poule>;
  tournamentPoules: Array<Poule>;
  editing: boolean;
  loading: number;
  selectedTournament: Tournament;
  selectedCategory: Category;
  selectedPoule: Poule;
}
// --- tournament state : initialState---
@State<TournamentsStateModel>({
  name: 'tournamentsState',
  defaults: {
    tournaments: [],
    categories: [],
    poules: [],
    tournamentPoules: [],
    editing: false,
    loading: 0,
    selectedTournament: null,
    selectedCategory: null,
    selectedPoule: null
  }
})

export class TournamentsState {

  // APP LOADING & EDITING Selectors
  // ==================================================

  @Selector()
  public static getAppStateEditing(state: TournamentsStateModel): boolean {
    return state.editing;
  }

  @Selector()
  public static getAppStateLoading(state: TournamentsStateModel): boolean {
    return state.loading > 0;
  }

  // TOURNAMENT Selectors
  // ==================================================

  @Selector()
  public static getTournaments(state: TournamentsStateModel): Array<Tournament> {
    return state.tournaments;
  }

  @Selector()
  public static getSelectedTournament(state: TournamentsStateModel): Tournament {
    return state.selectedTournament;
  }

  // CATEGORY Selectors
  // ==================================================

  @Selector()
  public static getCategories(state: TournamentsStateModel): Array<Category> {
    return state.categories;
  }

  @Selector()
  public static getSelectedCategory(state: TournamentsStateModel): Category {
    return state.selectedCategory;
  }

  // POULE Selectors
  // ==================================================

  @Selector()
  public static getPoules(state: TournamentsStateModel): Array<Poule> {
    return state.poules;
  }

  @Selector()
  public static getSelectedPoule(state: TournamentsStateModel): Poule {
    return state.selectedPoule;
  }

  // APP LOADING & EDITING Actions
  // ==================================================

  // Actions Editing
  @Action(tournamentActions.StartEditing)
  public startEditing({ patchState }: StateContext<TournamentsStateModel>, { }: tournamentActions.StartEditing): void {
    // const state = getState();
    patchState({
      editing: true
    });
  }

  @Action(tournamentActions.StopEditing)
  public stopEditing({ patchState }: StateContext<TournamentsStateModel>, { }: tournamentActions.StopEditing): void {
    // const state = getState();
    patchState({
      editing: false
    });
  }

  // Actions Loading
  @Action(tournamentActions.StartLoading)
  public startLoading({ getState, patchState }: StateContext<TournamentsStateModel>, { }: tournamentActions.StartLoading): void {
    const state = getState();
    patchState({
      loading: state.loading + 1
    });
  }

  @Action(tournamentActions.StopLoading)
  public stopLoading({ getState, patchState }: StateContext<TournamentsStateModel>, { }: tournamentActions.StopLoading): void {
    const state = getState();
    patchState({
      loading: state.loading > 0 ? state.loading - 1 : 0
    });
  }

  // TOURNAMENT Actions
  // ==================================================

  @Action(tournamentActions.StoreTournaments)
  public storeTournaments(
    { patchState }: StateContext<TournamentsStateModel>,
    { payload }: tournamentActions.StoreTournaments
  ): void {
    patchState({ tournaments: payload });
  }

  // ---- selected Tournament ----
  @Action(tournamentActions.SelectTournament)
  public selectTournament(
    { patchState }: StateContext<TournamentsStateModel>,
    { payload }: tournamentActions.SelectTournament
  ): void {
    patchState({ selectedTournament: payload });
  }

  // CATEGORY Actions
  // ==================================================

  @Action(tournamentActions.StoreCategories)
  public storeCategories(
    { patchState }: StateContext<TournamentsStateModel>,
    { payload }: tournamentActions.StoreCategories
  ): void {
    patchState({ categories: payload });
  }

  // ---- selected Tournament ----
  @Action(tournamentActions.SelectCategory)
  public selectCategory(
    { patchState }: StateContext<TournamentsStateModel>,
    { payload }: tournamentActions.SelectCategory
  ): void {
    patchState({ selectedCategory: payload });
  }

  // POULE Actions
  // ==================================================

  // ---- store Tournament / Category Poules ----
  @Action(tournamentActions.StorePoules)
  public storePoules(
    { patchState }: StateContext<TournamentsStateModel>,
    { payload }: tournamentActions.StorePoules
  ): void {
    patchState({ poules: payload });
  }

  // ---- store all Tournament Poules ----
  @Action(tournamentActions.StoreTournamentPoules)
  public storeTournamentPoules(
    { patchState }: StateContext<TournamentsStateModel>,
    { payload }: tournamentActions.StoreTournamentPoules
  ): void {
    patchState({ tournamentPoules: payload });
  }

  // ---- selected Poule ----
  @Action(tournamentActions.SelectPoule)
  public selectPoule(
    { patchState }: StateContext<TournamentsStateModel>,
    { payload }: tournamentActions.SelectPoule
  ): void {
    patchState({ selectedPoule: payload });
  }

}
