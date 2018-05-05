import { NgModule, CUSTOM_ELEMENTS_SCHEMA  }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { MomentModule } from 'angular2-moment';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Users } from './users.component.ts';
import { SearchPipe } from './pipes/search-pipe';
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
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    Users,
    SearchPipe
  ],
  schemas:  [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class UsersModule {
  static routes = routes;
}
