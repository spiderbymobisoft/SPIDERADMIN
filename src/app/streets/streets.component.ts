import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Intelligence } from '../services/library/intelligence';
import { DeleteService } from '../services/http/crud/delete.services';
import { RetrieveService } from '../services/http/crud/retrieve.services';
import { SharedServices } from '../services/shared/shared.services';

declare var jQuery: any;
declare var swal: any;

@Component({
  selector: '[streets]',
  templateUrl: './streets.template.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./streets.style.scss']
})
export class Streets implements OnInit {
  _streetRecords: any[] = [];
  streetRecords: any[] = [];
  searchText: string = '';
  user: any;
  private intelligence: any = new Intelligence();

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
      this.getStreetRecords();
    }

    if (this.user.security.user_type != 'undefined' && this.user.security.user_type === 'Organisation') {
      this.getOrganisationStreetRecords();
    }

    if (this.user.security.user_type != 'undefined' && this.user.security.user_type === 'Individual') {
      this.getIndividualStreetRecords();
    }

    if (this.user.security.user_type === 'undefined') {
      this.getIndividualStreetRecords();
    }
  }


  getStreetRecords() {
    this.rs.getAllStreetRecords().subscribe(response => {
      this._streetRecords = response.result;
      this._streetRecords.forEach(data => {
        this.streetRecords.push(data);
      });
    }, err => {
      this.ss.swalAlert('Newtork Service', 'No internet connection. Please connect and refresh.', 'error');
    });
  }

  getOrganisationStreetRecords() {
    this.rs.getOrganisationStreetRecords(this.user._id).subscribe(response => {
      this._streetRecords = response.result;
      this._streetRecords.forEach(data => {
        this.streetRecords.push(data);
      });
    }, err => {
      this.ss.swalAlert('Newtork Service', 'No internet connection. Please connect and refresh.', 'error');
    });
  }

  getIndividualStreetRecords() {
    this.rs.getIndividualStreetRecords(this.user._id).subscribe(response => {
      this._streetRecords = response.result;
      this._streetRecords.forEach(data => {
        this.streetRecords.push(data);
      });
    }, err => {
      this.ss.swalAlert('Newtork Service', 'No internet connection. Please connect and refresh.', 'error');
    });
  }


  openStreetPage(record) {
    this.ss.setRecord('street', record);
    this.router.navigate(['app/street']);
  }

  openEditStreetPage(record){
    this.ss.setRecord('street', record);
    this.router.navigate(['app/street/edit']);
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
      this.ds.deleteStreet(id).subscribe(response =>{
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
