import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RetrieveService } from '../services/http/crud/retrieve.services';
import { SharedServices } from '../services/shared/shared.services';
import { DeleteService } from '../services/http/crud/delete.services';
import { CsvService } from 'angular2-json2csv';
import { Intelligence } from '../services/library/intelligence';

declare var jQuery: any;
declare var swal: any;

@Component({
  selector: '[street]',
  templateUrl: './street.template.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./street.style.scss']
})
export class Street implements OnInit {
  public propertyRecords: any[];
  private streetRecord: any;
  private intelligence: any = new Intelligence();
  selectedRecords: any[] = [];
  toogleSelectAll: boolean = false;
  
  constructor(private csvService: CsvService, private ds: DeleteService, private router: Router, 
    private rs: RetrieveService, private ss: SharedServices) {
    this.streetRecord = ss.getRecord('street');
  }

  ngOnInit(): void {
    this.getPropertyRecords();
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

  getPropertyRecords(){
    this.rs.getPropertyRecordsByStreet(this.streetRecord.street.street_id).subscribe(response=>{
      this.propertyRecords = response.result;
    }, err=>{
      this.ss.swalAlert('Newtork Service','No internet connection. Please connect and refresh.', 'error');
    });
  }


  goToEditPropertyPage(record){
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
    }).then(()=>{
      this.ds.deleteProperty(id).subscribe(response =>{
        if(response.success){
          this.getPropertyRecords();
          this.ss.swalAlert('Data Service', 'Record deleted!', 'success');
        }else{
          this.ss.swalAlert('Data Service', 'Record cannot be delete at this time. Please try again or contact SPiDER support!', 'error');
        }
      },err=>{
        this.ss.swalAlert('Network Service', 'Record cannot be delete at this time. Please check your internet connection and try again!', 'error');
      });
    });
  }

}
