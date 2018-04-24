import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RetrieveService } from '../services/http/crud/retrieve.services';
import { SharedServices } from '../services/shared/shared.services';
import { DeleteService } from '../services/http/crud/delete.services';

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
  constructor(private ds: DeleteService, private router: Router, private rs: RetrieveService, private ss: SharedServices) {
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

  goToEditPropertyPage(record){
    this.ss.setRecord('property', record);
    this.router.navigate(['app/property/edit']);
  }

  goToPropertyPage(record) {
    this.ss.setRecord('property', record);
    this.router.navigate(['app/property']);
  }

  deleteRecord(id) {
    swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF0000',
      cancelButtonColor: '#0871FA',
      confirmButtonText: 'Yes, delete it!'
    }).then(()=>{
      this.ds.deleteProperty(id).subscribe(response =>{
        if(response.success){
          this.getPropertyRecords();
          this.ss.swalAlert('Data Service', 'Record deleted!', 'success');
        }else{
          this.ss.swalAlert('Data Service', 'Record cannot be delete at this time. Please try again or contact SPiDER support!', 'error');
        }
      },err=>{
        this.ss.swalAlert('Network Service', 'Record cannot be delete at this time. Please check your internet connection and try again!', 'error');
      });
    });
  }

}
