import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

declare var global: any;

import 'parsleyjs';

import { StreetEdit } from './street.edit.component';

export const routes = [
  {path: '', component: StreetEdit, pathMatch: 'full'}
];

@NgModule({
  declarations: [
    StreetEdit
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class StreetEditModule {
  static routes = routes;
}
