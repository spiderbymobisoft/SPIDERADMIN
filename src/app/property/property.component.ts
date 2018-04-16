import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RetrieveService } from '../services/http/crud/retrieve.services';
import { SharedServices } from '../services/shared/shared.services';

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

  constructor(private router: Router, private rs: RetrieveService, private ss: SharedServices) {
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

  deleteRecord(id){
    this.ss.swalAlert('Data Service','Record cannot be delete at this time','error');
  }

}
