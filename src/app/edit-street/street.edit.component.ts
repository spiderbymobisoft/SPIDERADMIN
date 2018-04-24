import { Component, ViewEncapsulation, Injector, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';

import { NigeriaStatesService } from '../services/locations/nigeria.states.service';
import { UpdateService } from '../services/http/crud/update.services';
import { SharedServices } from '../services/shared/shared.services';
import { FormConfig } from '../services/shared/form.config';
import { Intelligence } from '../services/library/intelligence';

declare var jQuery: any;
declare var swal: any;
declare var Messenger: any;

@Component({
  selector: '[street-edit]',
  templateUrl: './street.edit.template.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./street.edit.style.scss']
})

export class StreetEdit implements OnInit {
  private user: any;
  public payload: any;
  public nigeriaStates: Array<any>;
  public stateCities: Array<any>;
  instance: any;
  public publishSwitch: boolean = false;
  private intelligence = new Intelligence();

  constructor(private nss: NigeriaStatesService, private router: Router, 
    public us: UpdateService, public formConfig: FormConfig,
    private activatedRoute: ActivatedRoute, 
    private ss: SharedServices) {
    this.dataInit();
  }

  dataInit() {
    this.user = this.ss.USER();
    this.nigeriaStates = [];
    this.stateCities = [];
    let record = this.ss.getRecord('street');
    this.payload = {
      id: record._id,
      street: record.street,
      modified_by: {
        id: this.user._id,
        firstname: this.user.personal.firstname,
        lastname: this.user.personal.lastname,
        email: this.user.personal.email,
        mobile: this.user.personal.mobile
      },
      modified: new Date()
    };
  }

  ngOnInit(): void {
    jQuery('.parsleyjs').parsley();
    this.instance = jQuery('.parsleyjs').parsley();
    this.getLocations();
  }

  generateGISID(){
    this.payload.street.gis_id = this.intelligence.GENERATE_GISID();
  }

  loadCity(e) {
    this.stateCities = [];
    this.nss.getJSON().subscribe(data => {
      let _data = data;
      _data.forEach(_d => {
        if (_d.state.name === (e.srcElement || e.target).value) {
          _d.state.locals.forEach(local => {
            this.stateCities.push(local);
          });
        }
      });
    });
  }

  getLocations() {
    this.nss.getJSON().subscribe(data => {
      let _data = data;
      _data.forEach(_d => {
        this.nigeriaStates.push(_d.state.name);
      });
    });

    this.stateCities = [];
    this.nss.getJSON().subscribe(data => {
      let _data = data;
      _data.forEach(_d => {
        if (_d.state.name === this.payload.street.state) {
          _d.state.locals.forEach(local => {
            this.stateCities.push(local);
          });
        }
      });
    });

  }

  updateStreet() {
    if (this.instance.isValid()) {
      this.publishSwitch = true;
      this.us.updateStreet(this.payload).subscribe(data => {
        this.ss.swalAlert('Data Service','Street record updated successfully.', 'success');
        this.router.navigate(['app/streets']);
      }, err => {
        this.ss.swalAlert('Network Service','Unable to update record. Please try again or contact SPiDER support', 'error');
      });
    } else {
      this.reset();
    }
  }



  reset() {
    this.publishSwitch = false;
  }

  ngOnDestroy(): void {

  }

  cancelClick() {
    this.router.navigate(['app/streets']);
  }

}
