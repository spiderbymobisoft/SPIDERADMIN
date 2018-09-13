import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeleteService } from '../services/http/crud/delete.services';
import { RetrieveService } from '../services/http/crud/retrieve.services';
import { SharedServices } from '../services/shared/shared.services';
import { CreateService } from '../services/http/crud/create.services';
import { UpdateService } from '../services/http/crud/update.services';

declare var jQuery: any;
declare var swal: any;

@Component({
  selector: '[bsn-manager]',
  templateUrl: './bsn-manager.template.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./bsn-manager.style.scss']
})
export class BSNManager implements OnInit {
  bsnList: any[] = [];
  isLoading: boolean = true;
  user: any;
  users: any[] = [];
  selectedBSN: any[] = [];
  toogleSelectAll: boolean = false;
  payload: any = {
    user: {
      id: ''
    },
    bsn: []
  }
  private start: number = 0;

  constructor(
    private cs: CreateService, private us: UpdateService,
    private router: Router, private ds: DeleteService,
    public rs: RetrieveService, private ss: SharedServices
  ) {

  }

  ngOnInit(): void {
    this.user = this.ss.USER();
    this.getBSNRecords();
    this.getOrganisationUsers(this.user._id);
  }

  getOrganisationUsers(userId) {
    this.rs.getOrganisationUsers(userId).subscribe(data => {
      this.users = data.result;
    }, err => { });
  }

  openBSNLoader() {
    swal({
      text: `<p class="text-md">
      Enter build serial numbers seperated by comma</p>`,
      input: 'textarea',
      inputPlaceholder: `Building serial number (e.g 1234, 5678, 90112)`,
      showCancelButton: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonClass: 'btn btn-md btn-primary',
      confirmButtonColor: '#000',
      confirmButtonText: `Upload <i class="fa fa-upload large-icon-md text-white pull-left"></i>`
    }).then((text) => {
      let bsnArray: any[] = text.split(',');
      let payload: any[] = [];
      bsnArray.forEach(bsn => payload.push({ bsn: bsn }));
      this.cs.uploadBSN(payload).then(response => {
        this.bsnList = [...response['result'], ...this.bsnList];
      });
    }, (dismiss) => {
      // dismiss can be 'cancel', 'overlay',
      // 'close', and 'timer'}
    });
  }

  selectAll() {
    if (!this.toogleSelectAll) {
      this.payload.bsn = [];
      this.bsnList.forEach(data => this.payload.bsn.push(data._id));
    } else {
      this.payload.bsn = [];
    }
    this.toogleSelectAll ? this.toogleSelectAll = false : this.toogleSelectAll = true;
  }

  isSelected(id) {
    return this.payload.bsn.filter(data => data == id).length > 0;
  }

  selectRecord(id) {
    if (this.isSelected(id)) {
      this.payload.bsn = this.payload.bsn.filter(data => data !== id);
    } else {
      this.payload.bsn.push(id);
    }
    this.toogleSelectAll = false;
  }


  getBSNRecords() {
    this.rs.getBSN(this.start).subscribe(response => {
      this.isLoading = false;
      let _bsnList: any[] = response.result;
      _bsnList.forEach(data => {
        this.bsnList.push(data);
      });
    }, err => {
      this.isLoading = false;
      this.ss.swalAlert('Newtork Service', 'No internet connection. Please connect and refresh.', 'error');
    });
  }


  deleteRecord(id: string, index: number) {
    swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF0000',
      cancelButtonColor: '#0871FA',
      confirmButtonText: 'Yes, delete it!'
    }).then(() => {
      this.ds.deleteBSN(id).subscribe(response => {
        if (response.success) {
          this.bsnList.splice(index, 1);
        } else {
          this.ss.swalAlert('Data Service', 'Record cannot be delete at this time. Please try again or contact SPiDER support!', 'error');
        }
      }, err => {
        this.ss.swalAlert('Network Service', 'Record cannot be delete at this time. Please check your internet connection and try again!', 'error');
      });
    });
  }

  assignBSN() {
    if(this.payload.user.id && this.payload.bsn.length > 0){
      this.us.assignBSN(this.payload).subscribe(data => {
        if(data.success){
          this.ss.swalAlert('BSN Service', 'BSN successfully assigned!', 'success');
          this.bsnList = [];
          this.start = 0;
          this.getBSNRecords();
        }else{
          this.ss.swalAlert('BSN Service', 'Unable to assign BSN!', 'error');
        }
      }, err => {
        this.ss.swalAlert('Network Service', 'Please check your internet connection and try again!', 'error');
      });
    }else{
      this.ss.swalAlert('BSN Service', 'Please select a user and BSN(s)!', 'info');
    }
  }

  moreRecords() {
    this.start += 500;
    this.isLoading = true;
    this.getBSNRecords();
  }

  resetRecords() {
    this.start = 0;
    this.isLoading = true;
    this.getBSNRecords();
  }

}
