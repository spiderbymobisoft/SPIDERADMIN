import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Select2OptionData } from 'ng2-select2';
import { Intelligence } from '../services/library/intelligence';
import { RetrieveService } from '../services/http/crud/retrieve.services';
import { SharedServices } from 'app/services/shared/shared.services';
import { UpdateService } from '../services/http/crud/update.services';

declare var swal: any;

@Component({
  selector: 'users',
  templateUrl: './users.template.html',
  styleUrls: ['./users.style.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Users implements OnInit {

  public users: any[] = [];
  public user: any = {};
  public intelligence = new Intelligence();
  public display: string = 'users';
  public closeButton: boolean = false;
  public userEdit: boolean = false;
  public saving: boolean = false;
  public thisUser: any;
  constructor(private router: Router, private rs: RetrieveService, private us: UpdateService,
    private ss: SharedServices) {

  }

  ngOnInit(): void {
    this.thisUser = this.ss.USER();
    this.userRecordsInit();
  }

  userRecordsInit() {
    this.rs.getUsers(0).subscribe(response => {
      response.result.forEach(user => {
        this.users.push({
          id: user._id,
          firstname: user.personal.firstname,
          lastname: user.personal.lastname,
          mobile: user.personal.mobile,
          email: user.personal.email,
          avatar: user.personal.avatar || 'assets/icon/user.svg',
          is_active: user.security.is_active !== 'undefined' ? user.security.is_active : false,
          role: user.security.role,
          last_seen: user.last_seen
        })
      });
    }, err => {
      this.ss.swalAlert('Network Service', 'No network! Please connect to a network and try again', 'error');
    });
  }

  openEdit(user) {
    this.userEdit = true;
    window.scrollTo(0, 0);
  }

  updateUser() {
    this.saving = true;
    let payload = {
      id: this.user.id,
      mobile: this.user.mobile,
      role: this.user.role,
      is_active: this.user.is_active
    }
    this.us.updateUser(payload).subscribe(response => {
      if (response.success) {
        this.ss.swalAlert('Account Service', `${this.user.firstname}'s account has been updated!`, 'success');
        this.userEdit = false;
        window.scrollTo(0, 0);
      } else {
        this.ss.swalAlert('Account Service', `Unable to update ${this.user.firstname}'s account. Please try again or contact support!`, 'error');
      }
    }, err => {
      this.ss.swalAlert('Network Service', 'No network! Please connect to the internet and try again', 'error');
    });
  }

  closeEdit() {
    this.userEdit = false;
  }

  getUserRoles(): Select2OptionData[] {
    let roles: any = [{
      id: 'Admin',
      text: 'Admin'
    }, {
      id: 'Field Agent',
      text: 'Field Agent'
    }, {
      id: 'Data Miner',
      text: 'Data Miner'
    }, {
      id: 'Data Reporter',
      text: 'Data Reporter'
    }];
    return roles;
  }

  userRoleChanged(e: any): void {
    this.user.role = e.value;
  }

  displayThis(item) {
    this.user = item;
    this.display = 'user';
    setTimeout(() => {
      this.closeButton = true;
      window.scrollTo(0, 0);
    }, 100);
  }

  closeThis() {
    this.closeButton = false;
    this.userEdit = false;
    this.display = 'users';
    this.user = {};
  }

  openNewUserPage() {
    this.router.navigate(['/app/register']);
  }

}
