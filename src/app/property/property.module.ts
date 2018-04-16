import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ButtonsModule, DropdownModule, PaginationModule  } from 'ng2-bootstrap';
import { DataTableModule } from 'angular2-datatable';
import { Ng2TableModule } from 'ng2-table';

import { UtilsModule } from '../layout/utils/utils.module';

import { RouterModule } from '@angular/router';
import { SearchPipe } from './pipes/search-pipe';

import { Property } from './property.component';

export const routes = [
  {path: '', component: Property, pathMatch: 'full'}
];

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    Property,
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
export class PropertyModule {
  static routes = routes;
}