import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { TournamentsState } from '../../../../shared/state/tournament.state';
import { Observable, Subscription } from 'rxjs';
import { Tournament } from '../../../models/tournament.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'tnm-tournament-detail',
  templateUrl: './tournament-detail.component.html',
  styleUrls: ['./tournament-detail.component.scss']
})
export class TournamentDetailComponent implements OnInit, OnDestroy {

  @Select(TournamentsState.getSelectedTournament) private selectedTournament: Observable<Tournament>;

  public tournament: Tournament;
  private stateSubscriptions: Array<Subscription> = [];

  constructor(private router: Router) {
    const stateEditSubscription = this.selectedTournament.subscribe( (value) => this.tournament = value);
    if (!this.tournament) {
      this.router.navigate(['/tournaments']);
    }
  }

  public ngOnInit() {
  }

  public ngOnDestroy() {
    this.stateSubscriptions.forEach((subscription) => subscription.unsubscribe());
  }

}
