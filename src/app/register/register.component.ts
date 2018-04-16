import { Component, ViewEncapsulation } from '@angular/core';
import { APIConfig } from '../services/apiconfig/api.config';
import { Select2OptionData } from 'ng2-select2';
import { CreateService } from '../services/http/crud/create.services';
import { RetrieveService } from '../services/http/crud/retrieve.services';
import { VerificationService } from '../services/http/verification/verification.service';
import { Router } from '@angular/router';
import { SharedServices } from 'app/services/shared/shared.services';

declare let jQuery: any;
declare let swal: any;

//declare var swal : any;
@Component({
  selector: 'register',
  styleUrls: ['./register.style.scss'],
  templateUrl: './register.template.html',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'register-page app'
  }
})
export class Register {
  public footerText: string;
  public user: any = {
    firstname: '',
    lastname: '',
    email: '',
    mobile: '',
    password: '',
    role: ''
  }

  public instance: any;
  public registerSwitch: boolean = false;

  constructor(
    private router: Router, private apiConfig: APIConfig,
    private createService: CreateService, private ss: SharedServices,
    private retrieveService: RetrieveService, private verify: VerificationService
  ) {
    this.footerText = apiConfig.getFooterText();
  }

  registerUser() {
    this.registerSwitch = true;
    if (this.instance.isValid() && this.user.role) {
      this.processRegistration();
    } else {
      this.registerSwitch = false;
    }
  }

  processRegistration(){
    this.retrieveService.verifyUser(this.user.email).subscribe(data => {
      if (!data.success) {
        this.createService.addUser(this.user).then((data) => {
          if (data) {
            this.ss.swalAlert('Account Service', 'A confirmation email has been sent to ' + this.user.email + '!', 'success');
            this.router.navigate(['app/users']);
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
        this.ss.swalAlert('Account Service', 'The email address you provided is already in use. ' + data.success, 'info');
      }
    });
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

 
  ngOnInit(): void {
    jQuery('.parsleyjs').parsley();
    this.instance = jQuery('.parsleyjs').parsley();
  }

}
