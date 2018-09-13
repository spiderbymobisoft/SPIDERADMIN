import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { NgForm, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


import { Intelligence } from '../services/library/intelligence';
import { RetrieveService } from '../services/http/crud/retrieve.services';
import { SharedServices } from 'app/services/shared/shared.services';
import { UpdateService } from '../services/http/crud/update.services';
import { CreateService } from '../services/http/crud/create.services';
import { VerificationService } from '../services/http/verification/verification.service';

declare var swal: any;
declare var jQuery: any;

@Component({
  selector: 'users',
  templateUrl: './users.template.html',
  styleUrls: ['./users.style.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Users implements OnInit {

  public regForm: FormGroup;
  public users: any[] = [];
  public user: any = {};
  public intelligence = new Intelligence();
  public display: string = 'users';
  public closeButton: boolean = false;
  public userEdit: boolean = false;
  public saving: boolean = false;
  public thisUser: any;
  public footerText: string;
  public loadingUser: boolean = true;
  public searchText: string = '';
  public instance: any;
  public registerSwitch: boolean = false;

  public showPasswordEdit: boolean = false;
  public isUpdatingPassword: boolean = false;

  public security: any = {
    id: '',
    password: ''
  }

  constructor(private router: Router, private rs: RetrieveService, private us: UpdateService,
    private createService: CreateService, private ss: SharedServices, private retrieveService: RetrieveService,
    private verify: VerificationService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.thisUser = this.ss.USER();
    this.regForm = this.fb.group({
      document_owner: this.thisUser._id,
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9.@]*')]],
      mobile: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });

    this.userManagerInit();
  }

  userManagerInit() {
    if (this.thisUser.security.user_type != 'undefined' && this.thisUser.security.user_type === 'Super') {
      this.userRecordsInit();
    }

    if (this.thisUser.security.user_type != 'undefined' && this.thisUser.security.user_type === 'Organisation') {
      this.organisationUserRecordsInit();
    }

    if (this.thisUser.security.user_type != 'undefined' && this.thisUser.security.user_type === 'Individual') {
      this.individualUserRecordsInit();
    }

    if (this.thisUser.security.user_type === 'undefined') {
      this.individualUserRecordsInit();
    }
  }

  userRecordsInit() {
    this.rs.getUsers().subscribe(response => {
      this.users = [];
      response.result.forEach(user => {
        this.users.push({
          id: user._id,
          organisation: user.organisation.name !== 'undefined' ? user.organisation.name : '',
          firstname: user.personal.firstname,
          lastname: user.personal.lastname,
          mobile: user.security.user_type ? user.security.user_type == 'Organisation' ? user.organisation.mobile : user.personal.mobile : '',
          email: user.security.user_type ? user.security.user_type == 'Organisation' ? user.organisation.email : user.personal.email : '',
          avatar: user.avatar || 'assets/icon/user.svg',
          is_active: user.security.is_active !== 'undefined' ? user.security.is_active : false,
          role: user.security.role,
          user_type: user.security.user_type !== 'undefined' ? user.security.user_type : 'Individual',
          last_seen: user.last_seen
        });
      });
      setTimeout(() => {
        this.loadingUser = false;
      }, 1000);
    }, err => {
      this.loadingUser = true;
      this.ss.swalAlert('Network Service', 'No network! Please connect to a network and try again', 'error');
    });
  }

  organisationUserRecordsInit() {
    this.rs.getOrganisationUsers(this.thisUser._id).subscribe(response => {
      this.users = [];
      response.result.forEach(user => {
        this.users.push({
          id: user._id,
          organisation: user.organisation.name !== 'undefined' ? user.organisation.name : '',
          firstname: user.personal.firstname,
          lastname: user.personal.lastname,
          mobile: user.security.user_type ? user.security.user_type == 'Organisation' ? user.organisation.mobile : user.personal.mobile : '',
          email: user.security.user_type ? user.security.user_type == 'Organisation' ? user.organisation.email : user.personal.email : '',
          avatar: user.avatar || 'assets/icon/user.svg',
          is_active: user.security.is_active !== 'undefined' ? user.security.is_active : false,
          role: user.security.role,
          user_type: user.security.user_type !== 'undefined' ? user.security.user_type : 'Individual',
          last_seen: user.last_seen
        });
      });
      setTimeout(() => {
        this.loadingUser = false;
      }, 1000);
    }, err => {
      this.loadingUser = false;
      this.ss.swalAlert('Network Service', 'No network! Please connect to a network and try again', 'error');
    });
  }

  individualUserRecordsInit() {
    this.users.push({
      id: this.thisUser._id,
      organisation: this.thisUser.organisation.name !== 'undefined' ? this.thisUser.organisation.name : '',
      firstname: this.thisUser.personal.firstname,
      lastname: this.thisUser.personal.lastname,
      mobile: this.thisUser.security.user_type ? this.thisUser.security.user_type == 'Organisation' ? this.thisUser.organisation.mobile : this.thisUser.personal.mobile : '',
      email: this.thisUser.security.user_type ? this.thisUser.security.user_type == 'Organisation' ? this.thisUser.organisation.email : this.thisUser.personal.email : '',
      avatar: this.thisUser.avatar || 'assets/icon/user.svg',
      is_active: this.thisUser.security.is_active !== 'undefined' ? this.thisUser.security.is_active : false,
      role: this.thisUser.security.role,
      user_type: this.thisUser.security.user_type !== 'undefined' ? this.thisUser.security.user_type : 'Individual',
      last_seen: this.thisUser.last_seen
    });
  }


  openEdit() {
    this.userEdit = true;
    this.showPasswordEdit = false;
    window.scrollTo(0, 0);
  }


  updateUser() {
    this.saving = true;
    let payload: any = {
      id: this.user.id,
      firstname: this.user.firstname,
      lastname: this.user.lastname,
      organisation: this.user.organisation,
      mobile: this.user.mobile,
      role: this.user.role,
      is_active: this.user.is_active
    };
    this.user.user_type === 'Individual' ? this.updateIndividual(payload) : this.updateOrganisation(payload);
  }

  updateIndividual(payload) {
    this.us.updateIndividual(payload).subscribe(response => {
      if (response.success) {
        this.ss.swalAlert('Account Service', 'Account has been updated!', 'success');
        this.userEdit = false;
        window.scrollTo(0, 0);
      } else {
        this.ss.swalAlert('Account Service', 'Unable to update account. Please try again or contact support!', 'error');
      }
    }, err => {
      this.ss.swalAlert('Network Service', 'No network! Please connect to the internet and try again', 'error');
    });
  }

  updateOrganisation(payload) {
    this.us.updateOrganisation(payload).subscribe(response => {
      if (response.success) {
        this.ss.swalAlert('Account Service', 'Account has been updated!', 'success');
        this.userEdit = false;
        window.scrollTo(0, 0);
      } else {
        this.ss.swalAlert('Account Service', 'Unable to update account. Please try again or contact support!', 'error');
      }
    }, err => {
      this.ss.swalAlert('Network Service', 'No network! Please connect to the internet and try again', 'error');
    });
  }

  registerUser() {
    this.registerSwitch = true;
    if (this.regForm.valid) {
      this.processRegistration(this.regForm);
    } else {
      this.registerSwitch = false;
    }
  }

  processRegistration(newUser: FormGroup) {
    this.retrieveService.verifyUser(newUser.value.email).subscribe(data => {
      if (!data.success) {
        this.createService.addUser(newUser.value).then((data) => {
          if (data) {
            this.ss.swalAlert('Account Service', 'A confirmation email has been sent to ' + newUser.value.email + '!', 'success');
            this.regForm.reset();
            this.closeThis();
          } else {
            this.registerSwitch = false;
            this.ss.swalAlert('Account Service', 'Something went wrong! Please try again', 'error');
          }
        }).catch(e => {
          this.registerSwitch = false;
          this.ss.swalAlert('Account Service', 'Something went wrong! Please try again', 'error');
        });
      } else {
        this.registerSwitch = false;
        this.ss.swalAlert('Account Service', 'The email address you provided is already in use.', 'info');
      }
    });
  }


  closeEdit() {
    this.userEdit = false;
  }

  displayThis(item) {
    this.user = item;
    this.security.id = this.user.id;
    this.display = 'user';
    setTimeout(() => {
      this.closeButton = true;
      window.scrollTo(0, 0);
    }, 100);
  }

  closeThis() {
    this.thisUser = this.ss.USER();
    this.userManagerInit();
    this.registerSwitch = false;
    this.closeButton = false;
    this.userEdit = false;
    this.display = 'users';
    this.user = {};
  }

  openNewUserPage() {
    this.display = 'new-user';
  }

  updatePassword() {
    if(this.security.password){
      this.isUpdatingPassword = true;
      this.us.updateSecurity(this.security).subscribe(response => {
        if (response.success) {
          this.ss.swalAlert('Account Service', 'Password reset successfully! A confirmation email has been sent to ' + this.user.email, 'success');
        } else {
          this.ss.swalAlert('Account Service', 'Unable to reset password. Please try again or contact support.', 'error');
        }
        this.updatePasswordStatus();
      }, (err) => {
        this.updatePasswordStatus()
        this.ss.swalAlert('Network Service', 'Cannot connect to the internet!', 'error');
      });
    }else{
      this.ss.swalAlert('Account Service', 'Please provide new password and try again.', 'error');
    }
  }

  updatePasswordStatus() {
    this.security.password = '';
    this.showPasswordEdit = false;
    this.isUpdatingPassword = false;
  }

  togglePasswordEdit() {
    this.isUpdatingPassword = false;
    this.showPasswordEdit ? this.showPasswordEdit = false : this.showPasswordEdit = true;
  }

}
