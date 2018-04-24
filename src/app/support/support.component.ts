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
  selector: '[support]',
  templateUrl: './support.template.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./support.style.scss']
})
export class Support implements OnInit {

  public faqs: any[] = [];
  public intelligence = new Intelligence();
  public instance: any;
  public user: any = {};
  public lightSwitch: boolean = false;
  public publishSwitch: boolean = false;
  public jobgroups: any[];
  public broadcasts: any[];
  public to: string = '';
  public message: string = '';
  private payload: any = {
    id: '',
    from: {
      id: '',
      firstname: '',
      lastname: '',
      company: '',
      avatar: ''
    },
    to: '',
    message: '',
    created_on: new Date()
  }

  constructor(
    private cs: CreateService,
    private rs: RetrieveService,
    private router: Router, private ss: SharedServices
  ) {

  }

  popMessage(message) {
    swal('Update Service', message, 'info')
  }

  warningAlert() {

    Messenger().post({
      message: 'Network Error. Please try again',
      type: 'danger',
      hideAfter: 3
    });
  }

  sendSupportMessage() {
    //send message;
    if (this.instance.isValid()) {
      this.publishSwitch = true;
      this.payload.message = this.message;
      this.payload.message = this.payload.message.substr(0, 500).replace(/<\/?[^>]+(>|$)/g, "");
      if (this.payload.message) {
        this.payload.id = this.intelligence.ID_GEN();
        this.payload.from = {
          id: this.user._id,
          firstname: this.user.personal.firstname,
          lastname: this.user.personal.lastname,
          company: 'TALENT',
          avatar: this.user.personal.avatar
        };

        this.payload.to = this.to;
        this.payload.created_on = new Date();

        this.cs.publishSupportMessage(this.payload).then((data) => {
          this.publishSwitch = false;
          swal(
            {
              title: 'Support Message Sent',
              text: `Thanks for contacting us ${this.user.personal.firstname}. Kindly expect a call or an email from us shortly`,
              type: 'success',
              allowEscapeKey: false,
              allowOutsideClick: false,
              confirmButtonColor: '#0871FA',
              confirmButtonClass: 'btn btn-md btn-primary'
            }).then(() => {
              this.message = '';
              this.to = ''
            });

        }, err => {
          this.warningAlert();
        });
      } else {
        swal(
          {
            title: 'No Message Sent',
            type: 'warning',
            allowEscapeKey: false,
            allowOutsideClick: false,
            confirmButtonColor: '#0871FA',
            confirmButtonClass: 'btn btn-md btn-primary'
          });
      }
    }

  }

  ngOnInit(): void {
    this.parsleyInit();
    this.loadUserData();
    //this.getFAQs();
  }


  getFAQs() {
    this.faqs = [];
    this.rs.getFAQs().subscribe(data => {
      this.faqs = data.result;
    });
  }

  parsleyInit(): void {
    setTimeout(() => {
      jQuery('.parsleyjs').parsley();
      this.instance = jQuery('.parsleyjs').parsley();
    }, 0);
  }

  storeUserData(data) {
    this.ss.updateUser(data.result);
    setTimeout(() => {
      this.loadUserData();
    }, 0);
  }

  loadUserData() {
    this.lightSwitch = true;
    this.user = this.ss.USER();
  }
}
