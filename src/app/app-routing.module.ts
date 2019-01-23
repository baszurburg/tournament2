import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PolicyListComponent } from './policies/policy-list/policy-list.component';

const routes: Routes = [
  { path: 'policies', component: PolicyListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
