import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

declare var global: any;

import 'parsleyjs';

import { PropertyEdit } from './property.edit.component';

export const routes = [
  {path: '', component: PropertyEdit, pathMatch: 'full'}
];

@NgModule({
  declarations: [
    PropertyEdit
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class PropertyEditModule {
  static routes = routes;
}
