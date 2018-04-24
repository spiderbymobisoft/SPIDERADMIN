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
  public user: any;
  constructor(
    private router: Router, private ds: DeleteService,
    public rs: RetrieveService, private ss: SharedServices
  ) {

  }

  ngOnInit(): void {
    this.user = this.ss.USER();
    this.recordsInit();
  }

  recordsInit() {
    if (this.user.security.user_type != 'undefined' && this.user.security.user_type === 'Super') {
      this.getPropertyRecords();
    }

    if (this.user.security.user_type != 'undefined' && this.user.security.user_type === 'Organisation') {
      this.getOrganisationPropertyRecords();
    }

    if (this.user.security.user_type != 'undefined' && this.user.security.user_type === 'Individual') {
      this.getIndividualPropertyRecords();
    }

    if (this.user.security.user_type === 'undefined') {
      this.getIndividualPropertyRecords();
    }
  }

  getPropertyRecords(){
    this.rs.getAllPropertyRecords().subscribe(response=>{
      this.propertyRecords = response.result;
    }, err=>{
      this.ss.swalAlert('Newtork Service','No internet connection. Please connect and refresh.', 'error');
    });
  }

  getOrganisationPropertyRecords(){
    this.rs.getOrganisationPropertyRecords(this.user._id).subscribe(response=>{
      this.propertyRecords = response.result;
    }, err=>{
      this.ss.swalAlert('Newtork Service','No internet connection. Please connect and refresh.', 'error');
    });
  }

  getIndividualPropertyRecords(){
    this.rs.getIndividualPropertyRecords(this.user._id).subscribe(response=>{
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
          this.recordsInit();
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
