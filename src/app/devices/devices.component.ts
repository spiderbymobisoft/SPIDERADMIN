import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Intelligence } from '../services/library/intelligence';
import { RetrieveService } from '../services/http/crud/retrieve.services';
import { SharedServices } from '../services/shared/shared.services';
import { UpdateService } from '../services/http/crud/update.services';
import { CreateService } from '../services/http/crud/create.services';

declare var swal: any;

@Component({
  selector: '[devices]',
  templateUrl: './devices.template.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./devices.style.scss']
})
export class Devices implements OnInit {
  _accountRecords: any[] = [];
  accountRecords: any[] = [];
  searchText: string = '';
  user: any;
  private intelligence: any = new Intelligence();
  private payload = {
    message: {
      title: 'SPiDER Admin Message',
      body: ''
    },
    user: {},
    created: new Date()
  };

  constructor(
    private router: Router, private up: UpdateService, private cs: CreateService,
    public rs: RetrieveService, private ss: SharedServices
  ) {

  }

  ngOnInit(): void {
    this.user = this.ss.USER();
    this.recordsInit();
  }

  recordsInit() {
    if (this.user.security.user_type != 'undefined' && this.user.security.user_type === 'Super') {
      this.getUserRecords();
    }else{
      this.router.navigate(['/dashboard']);
    }
  }


  getUserRecords() {
    this.accountRecords = [];
    this.rs.getUsers().subscribe(response => {
      this._accountRecords = response.result;
      this._accountRecords.forEach(data => {
        this.accountRecords.push(data);
      });
    }, err => {
      this.ss.swalAlert('Newtork Service', 'No internet connection. Please connect and refresh.', 'error');
    });
  }

  activateDevice(record, index) {
    let payload = {id: record._id, status: true};
    this.processDeviceAction(payload, index, 'activate');
  }

  deActivateDevice(record, index){
    let payload = {id: record._id, status: false};
    this.processDeviceAction(payload, index, 'de-activate');
  }

  removeDevice(record, index){
    let payload = {id: record._id};
    swal({
      title: 'Account & Device',
      text: `Are you sure you want to remove the device associated with this account?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF0000',
      cancelButtonColor: '#0871FA',
      confirmButtonText: 'Yes!'
    }).then(() => {
      this.up.removeUserDevice(payload).subscribe(response => {
        if (response.success) {
          this.accountRecords[index].device = null;
          this.ss.swalAlert('Account Service', `Device removed from account!`, 'success');
        } else {
          this.ss.swalAlert('Account Service', `Device cannot be removed at this time. Please try again or contact SPiDER support!`, 'error');
        }
      }, err => {
        this.ss.swalAlert('Network Service', `Device cannot be removed at this time. Please check your internet connection and try again!`, 'error');
      });
    });
  }

  processDeviceAction(payload, index, type){
    swal({
      title: 'Account & Device',
      text: `Are you sure you want to ${type} the device associated with this account?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF0000',
      cancelButtonColor: '#0871FA',
      confirmButtonText: 'Yes!'
    }).then(() => {
      this.up.updateUserDevice(payload).subscribe(response => {
        if (response.success) {
          this.accountRecords[index].device.is_active = payload.status;
          this.ss.swalAlert('Account Service', `Device action completed!`, 'success');
        } else {
          this.ss.swalAlert('Account Service', `Device action cannot be completed at this time. Please try again or contact SPiDER support!`, 'error');
        }
      }, err => {
        this.ss.swalAlert('Network Service', `Device action cannot be completed at this time. Please check your internet connection and try again!`, 'error');
      });
    });
  }


  sendMessage(user) {
    swal({
      text: `<p class="text-md">
      Send a direct message to <b class="text-primary">${user.personal.firstname}</b></p>`,
      input: 'textarea',
      inputPlaceholder: `Send a direct message to ${user.personal.firstname} (max: 500 characters)`,
      showCancelButton: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonClass: 'btn btn-md btn-primary',
      confirmButtonColor: '#000',
      confirmButtonText: `Send Message <i class="fa fa-envelope large-icon-md text-white pull-left"></i>`
    }).then((text) => {
      //send message;
      let _text = text.substr(0, 500).replace(/<\/?[^>]+(>|$)/g, "");
      if (_text) {
       
        this.payload.message.body = _text;
        this.payload.user = {
          id: user._id,
          firstname: user.personal.firstname,
          lastname: user.personal.lastname,
          email: user.personal.email,
          oneId: user.personal.one_signal_id
        };
        this.cs.sendDirectMessage(this.payload).then((data) => {

          this.sweetAlert(`Message sent!`, 'success');

        }).catch(err=>{
          this.sweetAlert(`Unable to send message!`, 'error');
        });
      } else {

        this.sweetAlert(`${_text}`, 'error');

      }
    }, (dismiss) => {
      // dismiss can be 'cancel', 'overlay',
      // 'close', and 'timer'}
    });
  }


  sweetAlert(msg, type) {
    swal(
      {
        title: 'Message Response',
        text: msg,
        type: type,
        allowEscapeKey: false,
        allowOutsideClick: false,
        confirmButtonColor: '#000',
        confirmButtonClass: 'btn btn-md btn-primary'
      });
  }


}
