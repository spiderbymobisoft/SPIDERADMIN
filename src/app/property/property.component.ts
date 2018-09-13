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
  selector: '[property]',
  templateUrl: './property.template.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./property.style.scss']
})
export class Property implements OnInit {
  public entityRecords: any[];
  public propertyRecord: any;
  private intelligence: any = new Intelligence();

  selectedRecords: any[] = [];
  toogleSelectAll: boolean = false;

  constructor(
    private csvService: CsvService,
    private router: Router, private rs: RetrieveService, 
    private ss: SharedServices, private ds: DeleteService) {
    this.propertyRecord = ss.getRecord('property');
  }

  ngOnInit(): void {
    this.getEntityRecords();
  }

  downloadPhotos(photos) {
    photos.forEach(photo => {
      window.open(photo.url,'_blank');
    });
  }

  selectAll() {
    if (!this.toogleSelectAll) {
      this.selectedRecords = [];
      this.entityRecords.forEach(data => this.selectedRecords.push(data._id));
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
      this.processDownload(this.entityRecords);
    } else {
      let tempRecords: any[] = [];
      this.selectedRecords.forEach(id => tempRecords.push(this.entityRecords.filter(record => record._id == id)[0]));
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
        property_id: data.property_id,
        entity_id: data.entity.entity_id,
        entity_name: data.entity.entity_name,
        entity_group: data.entity.entity_group,
        entity_category: data.entity.entity_categories,
        meter_available: data.entity.meter_available,
        meter_condition: data.entity.meter_condition,
        meter_phases: data.entity.meter_phases,
        meter_type: data.entity.meter_type,
        meter_number: data.entity.meter_number,
        has_signage: data.entity.has_signage,
        contact_person: data.contact.contact_person,
        email: data.contact.email,
        telephone: data.contact.telephone,
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

    this.csvService.download(downloadable, `SPiDER_ENTITY_DATA_${downloadID}`);
  }


  getEntityRecords() {
    this.rs.getEntityRecords(this.propertyRecord.property.property_id).subscribe(response => {
      this.entityRecords = response.result;
    }, err => {
      this.ss.swalAlert('Newtork Service', 'No internet connection. Please connect and refresh.', 'error');
    });
  }




  showEntity(record) {
    this.ss.setRecord('entity', record);
    this.router.navigate(['app/entity']);
  }

  editEntity(record){
    this.ss.setRecord('entity', record);
    this.router.navigate(['app/entity/edit']);
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
      this.ds.deleteEntity(id).subscribe(response =>{
        if(response.success){
          this.getEntityRecords();
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
