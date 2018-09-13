import { Component, ViewEncapsulation, OnInit, EventEmitter } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Select2OptionData } from 'ng2-select2';
import { RetrieveService } from '../services/http/crud/retrieve.services';
import { CreateService } from '../services/http/crud/create.services';
import { Intelligence } from '../services/library/intelligence';
import { SharedServices } from '../services/shared/shared.services';
declare let jQuery: any;
declare let swal: any;
declare var Messenger: any;

@Component({
  selector: '[new-notification]',
  templateUrl: './new-notification.template.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./new-notification.style.scss']
})
export class NewNotification implements OnInit {

  public intelligence = new Intelligence();
  public instance: any;
  public user: any = {};
  public users: any[] = [];
  public lightSwitch: boolean = false;
  public publishSwitch: boolean = false;
  private payload: any = {
    message: {
      title: '',
      body: ''
    },
    user: {
      id: '',
      firstname: '',
      lastname: '',
      email: '',
      oneId: ''
    }
  };

  constructor(
    private cs: CreateService,
    private rs: RetrieveService,
    private router: Router, private ss: SharedServices
  ) {

  }

  ngOnInit(): void {
    this.parsleyInit();
    this.loadUserData();
  }


  parsleyInit(): void {
    setTimeout(() => {
      jQuery('.parsleyjs').parsley();
      this.instance = jQuery('.parsleyjs').parsley();
    }, 0);
  }

  loadUserData() {
    this.lightSwitch = true;
    this.user = this.ss.USER();
    this.getOrganisationUsers();
  }

  getOrganisationUsers() {
    this.rs.getOrganisationUsers(this.user._id).subscribe(data => {
      this.users = data.result;
    }, err => {
      this.warningAlert();
    });
  }

  sendMessage() {
    //send message;
    if (this.instance.isValid()) {
      this.publishSwitch = true;
      this.payload.message.body = this.payload.message.body.substr(0, 1000).replace(/<\/?[^>]+(>|$)/g, "");
      if (this.payload.message.body) {
        let _user: any = this.users.filter(user => user._id == this.payload.user.id)[0];
        this.payload.user = {
          id: _user._id,
          firstname: _user.personal.firstname,
          lastname: _user.personal.lastname,
          email: _user.personal.email,
          oneId: _user.personal.one_signal_id
        };
        this.cs.sendDirectMessage(this.payload).then((data) => {

          this.sweetAlert(`Message sent!`, 'success');
          this.payload = {
            message: {
              title: '',
              body: ''
            },
            user: {
              id: '',
              firstname: '',
              lastname: '',
              email: '',
              oneId: ''
            }
          };
          this.publishSwitch = false;

        }).catch(err=>{
          this.sweetAlert(`Unable to send message!`, 'error');
        });
      } else {
        this.sweetAlert(`Unable to send message!`, 'error');
      }
    }

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

  popMessage(message) {
    swal('Notification Service', message, 'info')
  }

  warningAlert() {
    Messenger().post({
      message: 'Network Error. Please try again',
      type: 'danger',
      hideAfter: 3
    });
  }

}
