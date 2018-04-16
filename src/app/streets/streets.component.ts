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
  _streetRecords: any[]=[];
  streetRecords: any[]=[];
  searchText: string = '';
  private intelligence: any = new Intelligence();

  constructor(
    private router: Router, private ds: DeleteService,
    public rs: RetrieveService, private ss: SharedServices
  ) {

  }

  ngOnInit(): void {
    this.getStreetRecords();
  }


  getStreetRecords() {
    this.rs.getAllStreetRecords().subscribe(response => {
      this._streetRecords = response.result;
      this._streetRecords.forEach(data =>{
        this.streetRecords.push(data);
      });
    }, err => {
      this.ss.swalAlert('Newtork Service','No internet connection. Please connect and refresh.', 'error');
    });
  }


  openStreetPage(record) {
    this.ss.setRecord('street', record);
    this.router.navigate(['app/street']);
  }

  deleteRecord(id){
    this.ss.swalAlert('Data Service','Record cannot be delete at this time','error');
  }


}
