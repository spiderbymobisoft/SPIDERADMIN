import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Register } from './register.component';
import 'parsleyjs';

export const routes = [
  { path: '', component: Register, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    Register
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ]
})
export class RegisterModule {
  static routes = routes;
}
