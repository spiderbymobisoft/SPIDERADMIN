import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Forgot } from './forgot.component';

export const routes = [
  { path: '', component: Forgot, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    Forgot
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ]
})
export class ForgotModule {
  static routes = routes;
}
