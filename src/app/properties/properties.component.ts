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
  propertyRecords: any[] = [];
  isLoading: boolean = true;
  private _propertyRecords: any[] = [];
  public user: any;
  

  selectedRecords: any[] = [];
  toogleSelectAll: boolean = false;
  private start: number = 0;
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

  downloadPhotos(photos) {
    photos.forEach(photo => {
      window.open(photo.url,'_blank');
    });
  }

  selectAll() {
    if (!this.toogleSelectAll) {
      this.selectedRecords = [];
      this.propertyRecords.forEach(data => this.selectedRecords.push(data._id));
    } else {
      this.selectedRecords = [];
    }
    this.toogleSelectAll ? this.toogleSelectAll = false : this.toogleSelectAll = true;
  }

  isSelected(id) {
    return this.selectedRecords.filter(data => data == id).length > 0;
  }

  selectRecord(id) {
    if (this.isSelected(id)) {
      this.selectedRecords = this.selectedRecords.filter(data => data !== id);
    } else {
      this.selectedRecords.push(id);
    }
    this.toogleSelectAll = false;
  }

  downloadAsCSV() {
    if (this.selectedRecords.length === 0) {
      this.processDownload(this.propertyRecords);
    } else {
      let tempRecords: any[] = [];
      this.selectedRecords.forEach(id => tempRecords.push(this.propertyRecords.filter(record => record._id == id)[0]));
      this.processDownload(tempRecords);
    }
  }

  processDownload(dataSet) {
    let downloadID = new Date();
    let payload: any;
    let downloadable: any[] = [];

    let photos: any = {
      photo_1: '',
      photo_2: '',
      photo_3: '',
      photo_4: '',
      photo_5: '',
      photo_6: ''
    };
    let index: number;

    dataSet.forEach(data => {
      if (data.property_photos.length > 0) {
        index = 1;
        data.property_photos.forEach(photo => {
          photos[`photo_${index}`] = photo.url;
          index += 1;
        });
      }
      payload = {
        id: data._id,
        property_id: data.property.property_id,
        street_id: data.property.street_id,
        building_serial_number: data.property.building_serial_number,
        master_building_serial_number: data.property.master_building_serial_number ? data.property.master_building_serial_number : '',
        building_part_occupied: data.property.building_part_occupied,
        ownership_type: data.property.ownership_type,
        house_number: data.property.house_number,
        street_name: data.property.street_name,
        lga: data.property.lga,
        state: data.property.state,
        country: data.property.country,
        site_conditions: data.property.site_conditions, //array
        property_type: data.property.building_type, //array
        storey_building: data.property.storey_building,
        storey_building_floors: data.property.storey_building_floors,
        water_supply: data.property.water_supply, //array
        refuse_disposal: data.property.refuse_disposal,
        has_signage: data.property.has_signage,
        gate_house_id: data.property.gate_house_id,
        generator_house_id: data.property.generator_house_id,
        number_of_entity: data.property.number_of_entity,
        accessible: data.property.accessible,
        entities: data.entities,
        contact_person: data.contact.contact_person ? data.contact.contact_person : 'NA',
        email: data.contact.email ? data.contact.email : 'NA',
        telephone: data.contact.telephone ? data.contact.telephone : 'NA',
        location_type: data.location.type,
        latitude: data.location.coordinates.latitude,
        longitude: data.location.coordinates.longitude,
        w3w: data.location.whatthreewords ? data.location.whatthreewords : 'NA',
        enumerator_firstname: data.enumerator.firstname,
        enumerator_lastname: data.enumerator.lastname,
        enumerator_email: data.enumerator.email,
        created_on: data.created
      };
      downloadable.push({ ...payload, ...photos });
      photos = {
        photo_1: '',
        photo_2: '',
        photo_3: '',
        photo_4: '',
        photo_5: '',
        photo_6: ''
      };
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
    this.rs.getAllPropertyRecords(this.start).subscribe(response => {
      this.isLoading = false;
      this._propertyRecords = response.result;
      this._propertyRecords.forEach(data => {
        this.propertyRecords.push(data);
      });
    }, err => {
      this.ss.swalAlert('Newtork Service', 'No internet connection. Please connect and refresh.', 'error');
    });
  }

  getOrganisationPropertyRecords() {
    this.rs.getOrganisationPropertyRecords(this.user._id, this.start).subscribe(response => {
      this.isLoading = false;
      this.propertyRecords = [...this.propertyRecords, ...response.result];
    }, err => {
      this.isLoading = false;
      this.ss.swalAlert('Newtork Service', 'No internet connection. Please connect and refresh.', 'error');
    });
  }

  getIndividualPropertyRecords() {
    this.rs.getIndividualPropertyRecords(this.user._id).subscribe(response => {
      this.isLoading = false;
      this.propertyRecords = response.result;
    }, err => {
      this.isLoading = false;
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

  deleteRecord(id: string, index: number) {
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
          this.propertyRecords.splice(index, 1);
          this.ss.swalAlert('Data Service', 'Record deleted!', 'success');
        } else {
          this.ss.swalAlert('Data Service', 'Record cannot be delete at this time. Please try again or contact SPiDER support!', 'error');
        }
      }, err => {
        this.ss.swalAlert('Network Service', 'Record cannot be delete at this time. Please check your internet connection and try again!', 'error');
      });
    });
  }

  moreRecords(){
    this.start += 500;
    this.isLoading = true;
    this.recordsInit();
  }

  resetRecords(){
    this.start = 0;
    this.isLoading = true;
    this.recordsInit();
  }


}
