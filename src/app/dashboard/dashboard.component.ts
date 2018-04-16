import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { AppConfig } from '../app.config';
import { Router } from '@angular/router';
import { Intelligence } from '../services/library/intelligence';
import { RetrieveService } from '../services/http/crud/retrieve.services';
import { SharedServices } from 'app/services/shared/shared.services';

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

  constructor(config: AppConfig, private router: Router, private rs: RetrieveService, private ss: SharedServices) {
    this.menuInit();
  }

  ngOnInit(): void {
      this.user = this.ss.USER();
  }

  menuInit() {
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
    }];
  }

  displayThis(item){
    this.router.navigate([`/app/${item.page}`]);
  }

}
