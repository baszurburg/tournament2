import { Component, OnDestroy } from '@angular/core';
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
export class TournamentDetailComponent implements OnDestroy {

  @Select(TournamentsState.getSelectedTournament) private selectedTournament: Observable<Tournament>;

  public tournament: Tournament;
  private stateSubscriptions: Array<Subscription> = [];

  public constructor(private router: Router) {
    const stateEditSubscription = this.selectedTournament.subscribe( (value) => this.tournament = value);
    if (!this.tournament) {
      this.router.navigate(['/tournaments']);
    }
  }

  public ngOnDestroy(): void {
    this.stateSubscriptions.forEach((subscription) => subscription.unsubscribe());
  }

}
