import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { MomentModule } from 'angular2-moment';
import { RouterModule } from '@angular/router';

import 'jquery.animate-number/jquery.animateNumber.js';
import { AgmCoreModule } from 'angular2-google-maps/core';

import { Dashboard } from './dashboard.component.ts';
import { UtilsModule } from '../layout/utils/utils.module';

export const routes = [
  { path: '', component: Dashboard, pathMatch: 'full' }
];


@NgModule({
  imports: [
    CommonModule,
    MomentModule,
    RouterModule.forChild(routes),
    UtilsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDe_oVpi9eRSN99G4o6TwVjJbFBNr58NxE'
    })
  ],
  declarations: [
    Dashboard
  ]
})
export class DashboardModule {
  static routes = routes;
}
