import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { MomentModule } from 'angular2-moment';
import { RouterModule } from '@angular/router';

import 'jquery.animate-number/jquery.animateNumber.js';

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
    UtilsModule
  ],
  declarations: [
    Dashboard
  ],
  schemas:  [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class DashboardModule {
  static routes = routes;
}
