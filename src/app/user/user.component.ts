import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Intelligence } from '../services/library/intelligence';
import { RetrieveService } from '../services/http/crud/retrieve.services';
import { SharedServices } from 'app/services/shared/shared.services';
import { UpdateService } from '../services/http/crud/update.services';

declare var swal: any;
declare var jQuery: any;

@Component({
  selector: 'user',
  templateUrl: './user.template.html',
  styleUrls: ['./user.style.scss'],
  encapsulation: ViewEncapsulation.None
})
export class User implements OnInit {

  public users: any[] = [];
  public user: any = {};
  public intelligence = new Intelligence();
  public display: string = 'user';
  public closeButton: boolean = false;
  public userEdit: boolean = false;
  public saving: boolean = false;
  public thisUser: any;
  public footerText: string;


  public instance: any;
  public registerSwitch: boolean = false;

  constructor(private router: Router, private rs: RetrieveService, private us: UpdateService,
    private ss: SharedServices, private retrieveService: RetrieveService) { }

  ngOnInit(): void {
    this.thisUser = this.ss.USER();
    this.displayThis();
  }

  openEdit() {
    setTimeout(() => {
      this.closeButton = true;
      window.scrollTo(0, 0);
    }, 100);
    this.userEdit = true;
    window.scrollTo(0, 0);
  }



  updateUser() {
    this.saving = true;
    let payload: any= {
      id: this.user.id,
      firstname: this.user.firstname,
      organisation: this.user.organisation,
      lastname: this.user.lastname,
      mobile: this.user.mobile,
      role: this.user.role,
      is_active: this.user.is_active
    };
    this.user.user_type === 'Individual' ? this.updateIndividual(payload) : this.updateOrganisation(payload);
  }

  updateIndividual(payload) {
    this.us.updateIndividual(payload).subscribe(response => {
      if (response.success) {
        this.thisUser = response.result;
        this.ss.updateUser(response.result);
        this.ss.swalAlert('Account Service', `Account has been updated!`, 'success');
        this.userEdit = false;
        window.scrollTo(0, 0);
      } else {
        this.ss.swalAlert('Account Service', `Unable to update account. Please try again or contact support!`, 'error');
      }
    }, err => {
      this.ss.swalAlert('Network Service', 'No network! Please connect to the internet and try again', 'error');
    });
  }

  updateOrganisation(payload) {
    this.us.updateOrganisation(payload).subscribe(response => {
      if (response.success) {
        this.thisUser = response.result;
        this.ss.updateUser(response.result);
        this.ss.swalAlert('Account Service', `Account has been updated!`, 'success');
        this.userEdit = false;
        window.scrollTo(0, 0);
      } else {
        this.ss.swalAlert('Account Service', `Unable to update account. Please try again or contact support!`, 'error');
      }
    }, err => {
      this.ss.swalAlert('Network Service', 'No network! Please connect to the internet and try again', 'error');
    });
  }


  closeEdit() {
    this.userEdit = false;
    this.closeButton = false;
  }

  displayThis() {
    this.user = {
      id: this.thisUser._id,
      organisation: this.thisUser.organisation !== 'undefined' ? this.thisUser.organisation.name : '',
      firstname: this.thisUser.personal.firstname,
      lastname: this.thisUser.personal.lastname,
      mobile: this.thisUser.personal.mobile,
      email: this.thisUser.personal.email,
      avatar: this.thisUser.avatar || 'assets/icon/user.svg',
      is_active: this.thisUser.security.is_active !== 'undefined' ? this.thisUser.security.is_active : false,
      role: this.thisUser.security.role,
      user_type: this.thisUser.security.user_type !== 'undefined' ? this.thisUser.security.user_type : 'Individual',
      last_seen: this.thisUser.last_seen
    };
    setTimeout(() => {
      this.display = 'user';
    }, 300);
  }

  closeThis() {
    this.thisUser = this.ss.USER();
    this.displayThis();
    this.registerSwitch = false;
    this.closeButton = false;
    this.userEdit = false;
    this.display = 'user';
  }

}
