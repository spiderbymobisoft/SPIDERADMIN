import { NgModule, CUSTOM_ELEMENTS_SCHEMA  }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { MomentModule } from 'angular2-moment';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Select2Module } from 'ng2-select2';
import { User } from './user.component.ts';
import { UtilsModule } from '../layout/utils/utils.module';

export const routes = [
  { path: '', component: User, pathMatch: 'full' }
];


@NgModule({
  imports: [
    CommonModule,
    MomentModule,
    RouterModule.forChild(routes),
    UtilsModule,
    Select2Module,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    User
  ],
  schemas:  [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class UserModule {
  static routes = routes;
}
