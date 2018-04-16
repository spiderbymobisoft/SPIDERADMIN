import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UtilsModule } from '../layout/utils/utils.module';
import { RouterModule } from '@angular/router';
import { Entity } from './entity.component';

export const routes = [
  {path: '', component: Entity, pathMatch: 'full'}
];

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    Entity
  ],
  imports: [
    CommonModule,
    UtilsModule,
    RouterModule.forChild(routes),
  ],
  schemas:  [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class EntityModule {
  static routes = routes;
}
