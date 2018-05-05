import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DeleteService } from '../services/http/crud/delete.services';
import { RetrieveService } from '../services/http/crud/retrieve.services';
import { SharedServices } from '../services/shared/shared.services';
import { CsvService } from 'angular2-json2csv';

declare var jQuery: any;
declare var swal: any;

@Component({
  selector: '[properties]',
  templateUrl: './properties.template.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./properties.style.scss']
})
export class Properties implements OnInit {
  propertyRecords: any[];
  public user: any;
  constructor(
    private csvService: CsvService,
    private router: Router, private ds: DeleteService,
    public rs: RetrieveService, private ss: SharedServices
  ) {

  }

  ngOnInit(): void {
    this.user = this.ss.USER();
    this.recordsInit();
  }

  downloadAsCSV() {
    let downloadID = new Date();
    let payload: any;
    let downloadable: any[] = [];
    this.propertyRecords.forEach(data => {
      payload = {
        id: data._id,
        property_id: data.property.property_id,
        street_id: data.property.street_id,
        building_serial_number: data.property.building_serial_number,
        building_part_occupied: data.property.building_part_occupied,
        ownership_type: data.property.ownership_type,
        house_number: data.property.house_number,
        street_name: data.property.street_name,
        lga: data.property.lga,
        state: data.property.state,
        country: data.property.country,
        site_conditions: data.property.site_conditions, //array
        building_type: data.property.building_type, //array
        storey_building: data.property.storey_building,
        storey_building_floors: data.property.storey_building_floors,
        water_supply: data.property.water_supply, //array
        refuse_disposal: data.property.refuse_disposal,
        has_signage: data.property.has_signage,
        gate_house: data.property.gate_house,
        generator_house: data.property.generator_house,
        boys_quarter: data.property.boys_quarter,
        number_of_entity: data.property.number_of_entity,
        accessible: data.property.accessible,
        entities: data.entities,
        contact_person: data.contact.contact_person,
        email: data.contact.email,
        telephone: data.contact.telephone,
        location_type: data.location.type,
        latitude: data.location.coordinates[0],
        longitude: data.location.coordinates[1],
        w3w: data.location.whatthreewords,
        enumerator_firstname: data.enumerator.firstname,
        enumerator_lastname: data.enumerator.lastname,
        enumerator_email: data.enumerator.email,
        created_on: data.created
      };
      downloadable.push(payload);
    });
    this.csvService.download(downloadable, `SPiDER_PROPERTY_DATA_${downloadID}`);
  }

  recordsInit() {
    if (this.user.security.user_type != 'undefined' && this.user.security.user_type === 'Super') {
      this.getPropertyRecords();
    }

    if (this.user.security.user_type != 'undefined' && this.user.security.user_type === 'Organisation') {
      this.getOrganisationPropertyRecords();
    }

    if (this.user.security.user_type != 'undefined' && this.user.security.user_type === 'Individual') {
      this.getIndividualPropertyRecords();
    }

    if (this.user.security.user_type === 'undefined') {
      this.getIndividualPropertyRecords();
    }
  }

  getPropertyRecords() {
    this.rs.getAllPropertyRecords().subscribe(response => {
      this.propertyRecords = response.result;
    }, err => {
      this.ss.swalAlert('Newtork Service', 'No internet connection. Please connect and refresh.', 'error');
    });
  }

  getOrganisationPropertyRecords() {
    this.rs.getOrganisationPropertyRecords(this.user._id).subscribe(response => {
      this.propertyRecords = response.result;
    }, err => {
      this.ss.swalAlert('Newtork Service', 'No internet connection. Please connect and refresh.', 'error');
    });
  }

  getIndividualPropertyRecords() {
    this.rs.getIndividualPropertyRecords(this.user._id).subscribe(response => {
      this.propertyRecords = response.result;
    }, err => {
      this.ss.swalAlert('Newtork Service', 'No internet connection. Please connect and refresh.', 'error');
    });
  }

  goToEditPropertyPage(record) {
    this.ss.setRecord('property', record);
    this.router.navigate(['app/property/edit']);
  }

  goToPropertyPage(record) {
    this.ss.setRecord('property', record);
    this.router.navigate(['app/property']);
  }

  deleteRecord(id) {
    swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF0000',
      cancelButtonColor: '#0871FA',
      confirmButtonText: 'Yes, delete it!'
    }).then(() => {
      this.ds.deleteProperty(id).subscribe(response => {
        if (response.success) {
          this.recordsInit();
          this.ss.swalAlert('Data Service', 'Record deleted!', 'success');
        } else {
          this.ss.swalAlert('Data Service', 'Record cannot be delete at this time. Please try again or contact SPiDER support!', 'error');
        }
      }, err => {
        this.ss.swalAlert('Network Service', 'Record cannot be delete at this time. Please check your internet connection and try again!', 'error');
      });
    });
  }


}
