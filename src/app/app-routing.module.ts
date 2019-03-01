import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PolicyListComponent } from './ui/policies/policy-list/policy-list.component';
import { HomeComponent } from './ui/home/home.component';
import { PageNotFoundComponent } from './ui/shared/errors/page-not-found/page-not-found.component';
import { AccountComponent } from './ui/account/account.component';
import { TournamentsComponent } from './ui/tournaments/tournaments.component';
import { SettingsComponent } from './ui/settings/settings.component';
import { TournamentDetailComponent } from './ui/tournaments/detail/tournament-detail.component';
import { CategoryDetailComponent } from './ui/categories/detail/category-detail.component';

const routes: Routes = [
  { path: 'account', component: AccountComponent },
  { path: 'home', component: HomeComponent },
  { path: 'policies', component: PolicyListComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'tournaments', component: TournamentsComponent },
  { path: 'tournaments/:tournamentCode', component: TournamentDetailComponent },
  { path: 'tournaments/:tournamentCode/:categoryCode', component: CategoryDetailComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
