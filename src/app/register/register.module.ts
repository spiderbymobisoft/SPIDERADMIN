import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Register } from './register.component';
import 'parsleyjs';
import { Select2Module } from 'ng2-select2';

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
    Select2Module,
    RouterModule.forChild(routes),
  ]
})
export class RegisterModule {
  static routes = routes;
}
