import { Component, ViewEncapsulation, OnInit, EventEmitter } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Select2OptionData } from 'ng2-select2';
import { RetrieveService } from '../services/http/crud/retrieve.services';
import { CreateService } from '../services/http/crud/create.services';
import { Intelligence } from '../services/library/intelligence';
import { SharedServices } from '../services/shared/shared.services';
import { APIConfig } from '../services/apiconfig/api.config';
declare let jQuery: any;
declare let swal: any;
declare var Messenger: any;

@Component({
  selector: '[settings]',
  templateUrl: './settings.template.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./settings.style.scss']
})
export class Settings implements OnInit {

  public instance: any;
  public saving: boolean = false;
  private serverConfig: any;

  constructor(
    private cs: CreateService,
    private rs: RetrieveService, private api: APIConfig,
    private router: Router, private ss: SharedServices
  ) {
    api.getSavedSettings().then(settings=>{
      this.serverConfig  = settings;
    });
  }

  ngOnInit(): void {
    this.parsleyInit();
  }

  parsleyInit(): void {
    setTimeout(() => {
      jQuery('.parsleyjs').parsley();
      this.instance = jQuery('.parsleyjs').parsley();
    }, 0);
  }

  updateServerSettings(){
    if(this.serverConfig.cloud){
      //Save settings
      this.ss.swalAlert('Settings Service','Server settings saved! Reloading console...', 'success');
      this.api.updateLocalServerSettings(this.serverConfig).then(()=>{
        window.location.reload();
      });
    }else{
      this.ss.swalAlert('Settings Service','Invalid IP Address! ' + this.serverConfig.ip, 'danger');
    }
  }

  validateIP(ip) {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip)) {
      return (true);
    }
    return (false);
  }

  closeEdit(){
    this.router.navigate(['app/dashboard']);
  }

}
