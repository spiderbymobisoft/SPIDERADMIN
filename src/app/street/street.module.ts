import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ButtonsModule, DropdownModule, PaginationModule  } from 'ng2-bootstrap';
import { DataTableModule } from 'angular2-datatable';
import { Ng2TableModule } from 'ng2-table';

import { UtilsModule } from '../layout/utils/utils.module';

import { RouterModule } from '@angular/router';
import { SearchPipe } from './pipes/search-pipe';

import { Street } from './street.component';

export const routes = [
  {path: '', component: Street, pathMatch: 'full'}
];

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    Street,
    SearchPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonsModule.forRoot(),
    DropdownModule.forRoot(),
    PaginationModule.forRoot(),
    UtilsModule,
    Ng2TableModule,
    DataTableModule,
    RouterModule.forChild(routes),
  ],
  schemas:  [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class StreetModule {
  static routes = routes;
}
