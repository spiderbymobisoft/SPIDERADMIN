import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import 'parsleyjs';

import { NewNotification } from './new-notification.component';

export const routes = [
  {path: '', component: NewNotification, pathMatch: 'full'}
];

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    NewNotification
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  schemas:  [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class NewNotificationModule {
  static routes = routes;
}
