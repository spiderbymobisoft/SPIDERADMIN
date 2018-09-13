import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { AppConfig } from '../app.config';
import { Router } from '@angular/router';
import { Intelligence } from '../services/library/intelligence';
import { RetrieveService } from '../services/http/crud/retrieve.services';
import { SharedServices } from 'app/services/shared/shared.services';
import { AgmMap } from '@agm/core';

declare var swal: any;

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.template.html',
  styleUrls: ['./dashboard.style.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Dashboard implements OnInit {

  public user: any;
  public menuItems: any[] = [];
  public intelligence = new Intelligence();

  lat: number = 51.678418;
  lng: number = 7.809007;

  constructor(config: AppConfig, private router: Router, private rs: RetrieveService, private ss: SharedServices) {

  }

  ngOnInit(): void {
    this.user = this.ss.USER();
    this.user.security.user_type ? this.user.security.user_type === 'Super' || this.user.security.user_type === 'Organisation' ? this.adminMenuInit() : this.userMenuInit() : this.userMenuInit();
  }

  adminMenuInit() {
    this.menuItems = [{
      title: 'User Manager',
      img: 'assets/icon/user.svg',
      description: 'User Information & Access',
      page: 'users'
    },
    {
      title: 'Street Records',
      img: 'assets/icon/street.svg',
      description: 'All Streets Information',
      page: 'streets'
    },
    {
      title: 'Property Records',
      img: 'assets/icon/property.svg',
      description: 'All Properties Information',
      page: 'properties'
    },
    {
      title: 'Device Manager',
      img: 'assets/icon/device.svg',
      description: 'Users Device Manager',
      page: 'devices'
    },
    {
      title: 'Messaging',
      img: 'assets/icon/notification.svg',
      description: 'Internal Messaging',
      page: 'new/notification'
    },
    {
      title: 'Settings',
      img: 'assets/icon/settings.svg',
      description: 'Console Settings',
      page: 'settings'
    }];
  }

  userMenuInit() {
    this.menuItems = [
      {
        title: 'My Account',
        img: 'assets/icon/user.svg',
        description: 'My Information & Access',
        page: 'user'
      },
      {
        title: 'Street Records',
        img: 'assets/icon/street.svg',
        description: 'All Streets Information',
        page: 'streets'
      },
      {
        title: 'Property Records',
        img: 'assets/icon/property.svg',
        description: 'All Properties Information',
        page: 'properties'
      }];
  }

  displayThis(item) {
    this.router.navigate([`/app/${item.page}`]);
  }

}
