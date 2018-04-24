import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RetrieveService } from '../services/http/crud/retrieve.services';
import { SharedServices } from '../services/shared/shared.services';
import { DeleteService } from '../services/http/crud/delete.services';

declare var jQuery: any;
declare var swal: any;

@Component({
  selector: '[property]',
  templateUrl: './property.template.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./property.style.scss']
})
export class Property implements OnInit {
  public entityRecords: any[];
  public propertyRecord: any;

  constructor(private router: Router, private rs: RetrieveService, private ss: SharedServices, private ds: DeleteService) {
    this.propertyRecord = ss.getRecord('property');
  }

  ngOnInit(): void {
    this.getEntityRecords();
  }

  getEntityRecords() {
    this.rs.getEntityRecords(this.propertyRecord.property.property_id).subscribe(response => {
      this.entityRecords = response.result;
    }, err => {
      this.ss.swalAlert('Newtork Service', 'No internet connection. Please connect and refresh.', 'error');
    });
  }


  showEntity(record) {
    this.ss.setRecord('entity', record);
    this.router.navigate(['app/entity']);
  }

  editEntity(record){
    this.ss.setRecord('entity', record);
    this.router.navigate(['app/entity/edit']);
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
      this.ds.deleteEntity(id).subscribe(response =>{
        if(response.success){
          this.getEntityRecords();
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
