import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RetrieveService } from '../services/http/crud/retrieve.services';
import { SharedServices } from '../services/shared/shared.services';

declare var jQuery: any;
declare var swal: any;

@Component({
  selector: '[street]',
  templateUrl: './street.template.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./street.style.scss']
})
export class Street implements OnInit {
  public propertyRecords: any[];
  private streetRecord: any;
  constructor(
    private router: Router, private rs: RetrieveService, private ss: SharedServices
  ) {
    this.streetRecord = ss.getRecord('street');
  }

  ngOnInit(): void {
    this.getPropertyRecords();
  }

  getPropertyRecords(){
    this.rs.getPropertyRecordsByStreet(this.streetRecord.street.street_id).subscribe(response=>{
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
