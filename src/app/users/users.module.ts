import { NgModule, CUSTOM_ELEMENTS_SCHEMA  }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { MomentModule } from 'angular2-moment';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Select2Module } from 'ng2-select2';
import { Users } from './users.component.ts';
import { UtilsModule } from '../layout/utils/utils.module';

export const routes = [
  { path: '', component: Users, pathMatch: 'full' }
];


@NgModule({
  imports: [
    CommonModule,
    MomentModule,
    RouterModule.forChild(routes),
    UtilsModule,
    Select2Module,
    FormsModule
  ],
  declarations: [
    Users
  ],
  schemas:  [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class UsersModule {
  static routes = routes;
}
