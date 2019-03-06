import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { TournamentsState } from '../../../shared/state/tournament.state';
import { Observable, Subscription } from 'rxjs';
import { Tournament } from '../../models/tournament.interface';

@Component({
  selector: 'tnm-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnDestroy, OnInit {

  @Select(TournamentsState.getTournaments) private getStateTournaments: Observable<Array<Tournament>>;
  @Select(TournamentsState.getSelectedTournament) private getStateSelectedTournament: Observable<Tournament>;

  public tournaments: Array<Tournament>;
  public selectedTournament: Tournament;

  private stateSubscriptions: Array<Subscription> = [];

  public constructor(
    private store: Store
  ) {
  }

  public ngOnInit(): void {
    this.getSelectedTournament();
    this.getTournaments();
  }

  public getSelectedTournament(): void {
    this.stateSubscriptions.push(this.getStateSelectedTournament.subscribe( (value) => this.selectedTournament = value));
  }

  public getTournaments(): void {
    this.stateSubscriptions.push(this.getStateTournaments.subscribe( (value) => this.tournaments = value));
  }

  public ngOnDestroy(): void {
    this.stateSubscriptions.forEach((subscription) => subscription.unsubscribe());
  }

}
