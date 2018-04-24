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
  selector: '[property-edit]',
  templateUrl: './property.edit.template.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./property.edit.style.scss']
})

export class PropertyEdit implements OnInit {
  private user: any;
  public payload: any;
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
    let record = this.ss.getRecord('property');
    this.payload = {
      id: record._id,
      contact: record.contact,
      property: record.property,
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
  }

  generateBSN(){
    this.payload.property.building_serial_number = this.intelligence.GENERATE_BSN();
  }


  updateProperty() {
    if (this.instance.isValid()) {
      this.publishSwitch = true;
      this.us.updateProperty(this.payload).subscribe(data => {
        this.ss.swalAlert('Data Service','Property record updated successfully.', 'success');
        this.router.navigate(['app/properties']);
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
    this.router.navigate(['app/properties']);
  }

}
