import { Component, ViewEncapsulation, Injector, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';

import { UpdateService } from '../services/http/crud/update.services';
import { SharedServices } from '../services/shared/shared.services';
import { FormConfig } from '../services/shared/form.config';

declare var jQuery: any;
declare var swal: any;
declare var Messenger: any;

@Component({
  selector: '[entity-edit]',
  templateUrl: './entity.edit.template.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./entity.edit.style.scss']
})

export class EntityEdit implements OnInit {
  private user: any;
  public payload: any;
  instance: any;
  public publishSwitch: boolean = false;
  public entityGroup: any[] = [];

  constructor(private router: Router, 
    public us: UpdateService, public formConfig: FormConfig,
    private activatedRoute: ActivatedRoute, 
    private ss: SharedServices) {
    this.dataInit();
  }

  dataInit() {
    this.user = this.ss.USER();
    let record = this.ss.getRecord('entity');
    this.payload = {
      id: record._id,
      contact: record.contact,
      entity: record.entity,
      modified_by: {
        id: this.user._id,
        firstname: this.user.personal.firstname,
        lastname: this.user.personal.lastname,
        email: this.user.personal.email,
        mobile: this.user.personal.mobile
      },
      modified: new Date()
    };
    this.preloadCategory(record.entity.entity_group);
  }

  ngOnInit(): void {
    jQuery('.parsleyjs').parsley();
    this.instance = jQuery('.parsleyjs').parsley();
  }

  loadCategory(event) {
    this.entityGroup = this.formConfig.entityGroup.filter(data => data.title === event.target.value)[0]['sub_titles'];
  }

  preloadCategory(value) {
    this.entityGroup = this.formConfig.entityGroup.filter(data => data.title === value)[0]['sub_titles'];
  }


  updateEntity() {
    if (this.instance.isValid()) {
      this.publishSwitch = true;
      this.us.updateEntity(this.payload).subscribe(data => {
        this.ss.swalAlert('Data Service','Entity record updated successfully.', 'success');
        this.router.navigate(['app/property']);
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
    this.router.navigate(['app/property']);
  }

}
