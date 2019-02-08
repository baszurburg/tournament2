import { Component, OnDestroy, OnInit } from '@angular/core';
import { TournamentsState } from '../../../../shared/state/tournament.state';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'tnm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Select(TournamentsState.getAppStateEditing) private appStateInEditMode: Observable<boolean>;
  @Select(TournamentsState.getAppStateLoading) private appStateIsLoading: Observable<boolean>;

  private stateSubscriptions: Array<Subscription> = [];
  public inEditMode = false;
  public isLoading = false;

  public constructor() {
    this.stateSubscriptions.push(this.appStateInEditMode.subscribe( (value) => this.inEditMode = value));
    this.stateSubscriptions.push(this.appStateIsLoading.subscribe( (value) => this.isLoading = value));
  }

  public ngOnInit(): void {
    // noop
  }

  public ngOnDestroy(): void {
    this.stateSubscriptions.forEach((subscription) => subscription.unsubscribe());
  }

}
