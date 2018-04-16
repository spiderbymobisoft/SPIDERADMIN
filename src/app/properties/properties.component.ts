import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DeleteService } from '../services/http/crud/delete.services';
import { RetrieveService } from '../services/http/crud/retrieve.services';
import { SharedServices } from '../services/shared/shared.services';

declare var jQuery: any;
declare var swal: any;

@Component({
  selector: '[properties]',
  templateUrl: './properties.template.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./properties.style.scss']
})
export class Properties implements OnInit {
  propertyRecords: any[];

  constructor(
    private router: Router, private ds: DeleteService,
    public rs: RetrieveService, private ss: SharedServices
  ) {

  }

  ngOnInit(): void {
    this.getPropertyRecords();
  }

  getPropertyRecords(){
    this.rs.getAllPropertyRecords().subscribe(response=>{
      this.propertyRecords = response.result;
    }, err=>{
      this.ss.swalAlert('Newtork Service','No internet connection. Please connect and refresh.', 'error');
    });
  }



  goToPropertyPage(record) {
    this.ss.setRecord('property', record);
    this.router.navigate(['app/property']);
  }

  deleteRecord(id){
    this.ss.swalAlert('Data Service','Record cannot be delete at this time','error');
  }


}
