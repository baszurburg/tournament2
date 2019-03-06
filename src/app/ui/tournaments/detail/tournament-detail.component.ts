import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { Subscription } from 'rxjs';
import { Tournament } from '../../../models/tournament.interface';
import { ActivatedRoute, Router } from '@angular/router';
import * as tournamentActions from '../../../../shared/state/tournament.actions';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'tnm-tournament-detail',
  templateUrl: './tournament-detail.component.html',
  styleUrls: ['./tournament-detail.component.scss']
})
export class TournamentDetailComponent implements OnDestroy {

  public tournament: Tournament;
  private tournaments: Array<Tournament>;
  private selectedTournamentCode: string;
  private stateSubscriptions: Array<Subscription> = [];

  public constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private store: Store) {

    this.stateSubscriptions.push(this.route.params.subscribe((params) => {
      this.selectedTournamentCode = params['tournamentCode'];
      this.store.dispatch(new tournamentActions.StartLoading());

      this.stateSubscriptions.push(this.dataService.getTournament(this.selectedTournamentCode).subscribe((data) => {
        this.tournaments = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
          } as Tournament;
        });

        this.tournament = this.tournaments[0] || null;
        this.store.dispatch(new tournamentActions.StopLoading());
        if (!this.tournament) {
          this.router.navigate(['/tournaments']);
        } else {
          this.store.dispatch(new tournamentActions.SelectTournament(this.tournament));
        }
      }, (_error) => {
        console.warn(_error);
        this.store.dispatch(new tournamentActions.StopLoading());
        if (!this.tournament) {
          this.router.navigate(['/tournaments']);
        }
      }));

    }));

  }

  public ngOnDestroy(): void {
    this.stateSubscriptions.forEach((subscription) => subscription.unsubscribe());
  }

}
