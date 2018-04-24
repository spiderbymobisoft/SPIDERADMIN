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
    document_owner: '',
    firstname: '',
    lastname: '',
    organisation: '',
    email: '',
    mobile: '',
    password: '',
    role: 'Data Miner',
    user_type: 'Individual'
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
    if (this.instance.isValid()) {
      if(this.user.user_type == 'Organisation' && !this.user.organisation) {
        this.ss.swalAlert('Account Service','Please provide organisation name','error');
      }
      if(this.user.user_type == 'Organisation' && this.user.organisation) {
        this.registerOrganisation();
      }
      if(this.user.user_type == 'Individual'){
        this.registerIndividual();
      }
    } 
  }

  registerIndividual(){
    this.registerSwitch = true;
    this.retrieveService.verifyUser(this.user.email).subscribe(data => {
      if (!data.success) {
        this.createService.addUser(this.user).then((data) => {
          if (data) {
            this.ss.swalAlert('Account Service', 'A confirmation email has been sent to ' + this.user.email + '!', 'success');
            this.router.navigate(['/login']);
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
        this.ss.swalAlert('Account Service', 'The email address you provided is already in use. ' + data.success, 'error');
      }
    },err=>{
      this.registerSwitch = false;
      this.ss.swalAlert('Network Service', 'Unable to connect! Please connect to the internet and try again', 'error');
    });
  }

  registerOrganisation(){
    this.registerSwitch = true;
    this.retrieveService.verifyOrganisation(this.user.email).subscribe(data => {
      if (!data.success) {
        this.createService.addOrganisation(this.user).then((data) => {
          if (data) {
            this.ss.swalAlert('Account Service', 'A confirmation email has been sent to ' + this.user.email + '!', 'success');
            this.router.navigate(['/login']);
          } else {
            this.registerSwitch = false;
            this.ss.swalAlert('Account Service 1', 'Something went wrong! Please try again', 'error');
          }
        }).catch(e => {
          this.registerSwitch = false;
          this.ss.swalAlert('Account Service 2', 'Something went wrong! Please try again', 'error');
        });
      } else {
        this.registerSwitch = false;
        this.ss.swalAlert('Account Service 3', 'The email address you provided is already in use. ' + data.success, 'info');
      }
    },err=>{
      this.registerSwitch = false;
      this.ss.swalAlert('Network Service', 'Unable to connect! Please connect to the internet and try again', 'error');
    });
  }
 
  ngOnInit(): void {
    jQuery('.parsleyjs').parsley();
    this.instance = jQuery('.parsleyjs').parsley();
  }

}
