import { Component, ViewEncapsulation } from '@angular/core';
import { APIConfig } from '../services/apiconfig/api.config';
import { AuthenticationService } from '../services/http/authentication/auth.service';
import { Router } from '@angular/router';
import { SharedServices } from 'app/services/shared/shared.services';

declare let swal: any;

@Component({
  selector: 'login',
  styleUrls: ['./login.style.scss'],
  templateUrl: './login.template.html',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'login-page app'
  }
})
export class Login {
  public footerText: string;
  public user: any = {
    email: '',
    password: ''
  }
  public loginSwitch: boolean;
  public loginMessage: string;
  private savecredentials = false;
  private allowAccess: string = window.localStorage.getItem('remember');

  constructor(private apiConfig: APIConfig, private auth: AuthenticationService, 
    private router: Router, private ss: SharedServices) {

  }

  validateLogin() {
    this.loginSwitch = true;
    if (!this.user.email || !this.user.password) {
      this.loginSwitch = false;
      this.loginMessage = 'Invalid email or password!';
      this.ss.swalAlert('Account Service',this.loginMessage,'error');
    } else {
      this.auth.authenticate(this.user).then(res => {
        if (res) {
          if (this.savecredentials) {
            window.localStorage.setItem('remember', 'true');
            this.router.navigate(['app/dashboard']);
          } else {
            this.router.navigate(['app/dashboard']);
          }
        } else {
          this.loginSwitch = false;
          this.loginMessage = 'Unable to authenticate you with the provided email and password!';
          this.ss.swalAlert('Account Service',this.loginMessage,'error');
        }
      },err=>{
        this.loginSwitch = false;
        this.loginMessage = 'Network connection error! Please try again.';
        this.ss.swalAlert('Account Service',this.loginMessage,'error');
      });
    }
  }

  ngOnInit() {
    this.footerText = this.apiConfig.getFooterText();
  }
}
