import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// FIRESTORE
// ==================================================
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

// NGXS & STATE
// ==================================================
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule, StorageOption } from '@ngxs/storage-plugin';
import { TournamentsState } from '../shared/state/tournament.state';

import { environment } from '../environments/environment';

// NGXS BOOTSTRAP
// ==================================================
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

// UI COMPONENTS
// ==================================================
import { HomeComponent } from './ui/home/home.component';
import { PageNotFoundComponent } from './ui/shared/errors/page-not-found/page-not-found.component';
import { NavigationComponent } from './ui/shared/navigation/navigation.component';
import { HeaderComponent } from './ui/shared/header/header.component';
import { AccountComponent } from './ui/account/account.component';
import { PolicyListComponent } from './ui/policies/policy-list/policy-list.component';
import { TournamentsComponent } from './ui/tournaments/tournaments.component';
import { SettingsComponent } from './ui/settings/settings.component';
import { TournamentDetailComponent } from './ui/tournaments/detail/tournament-detail.component';
import { CategoriesComponent } from './ui/categories/categories.component';
import { CategoryDetailComponent } from './ui/categories/detail/category-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    PolicyListComponent,
    HomeComponent,
    PageNotFoundComponent,
    NavigationComponent,
    HeaderComponent,
    AccountComponent,
    TournamentsComponent,
    SettingsComponent,
    TournamentDetailComponent,
    CategoriesComponent,
    CategoryDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgxsModule.forRoot([
      TournamentsState
    ], { developmentMode: !environment.production }),
    NgxsStoragePluginModule.forRoot( {storage: StorageOption.SessionStorage}),
    NgxsLoggerPluginModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
