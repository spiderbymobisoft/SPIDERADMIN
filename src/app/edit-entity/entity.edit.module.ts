import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

declare var global: any;

import 'parsleyjs';

import { EntityEdit } from './entity.edit.component';

export const routes = [
  {path: '', component: EntityEdit, pathMatch: 'full'}
];

@NgModule({
  declarations: [
    EntityEdit
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class EntityEditModule {
  static routes = routes;
}
