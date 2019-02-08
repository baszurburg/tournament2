import { Action, Selector, State, StateContext } from '@ngxs/store';

import * as tournamentActions from './tournament.actions';
import { Tournament } from '../../app/models/tournament.interface';
import { Category } from '../../app/models/category.interface';

// -----tournament state model --------
export interface TournamentsStateModel {
  tournaments: Array<Tournament>;
  categories: Array<Category>;
  editing: boolean;
  loading: number;
  selectedTournamentCode: string;
  selectedCategory: Category;
}
// --- tournament state : initialState---
@State<TournamentsStateModel>({
  name: 'tournamentsState',
  defaults: {
    tournaments: [],
    categories: [],
    editing: false,
    loading: 0,
    selectedTournamentCode: null,
    selectedCategory: null
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
    return state.tournaments.find(
      (tournament: Tournament) => tournament.code === state.selectedTournamentCode
    );
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
    patchState({ selectedTournamentCode: payload });
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

}
