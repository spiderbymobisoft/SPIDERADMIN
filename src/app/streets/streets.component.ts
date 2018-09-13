import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeleteService } from '../services/http/crud/delete.services';
import { RetrieveService } from '../services/http/crud/retrieve.services';
import { SharedServices } from '../services/shared/shared.services';
import { CsvService } from 'angular2-json2csv';

declare var jQuery: any;
declare var swal: any;

@Component({
  selector: '[streets]',
  templateUrl: './streets.template.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./streets.style.scss']
})
export class Streets implements OnInit {
  _streetRecords: any[] = [];
  streetRecords: any[] = [];
  isLoading: boolean = true;
  searchText: string = '';
  user: any;
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
      this.streetRecords.forEach(data => this.selectedRecords.push(data._id));
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
    let tempRecords: any[] = [];
    if (this.selectedRecords.length === 0) {
      tempRecords = this.streetRecords;
      this.processDownload(tempRecords);
    } else {
      this.selectedRecords.forEach(id => tempRecords.push(this.streetRecords.filter(record => record._id == id)[0]));
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
      if (data.street_photos.length > 0) {
        index = 1;
        data.street_photos.forEach(photo => {
          photos[`photo_${index}`] = photo.url;
          index += 1;
        });
      }
      payload = {
        id: data._id,
        gis_id: data.street.gis_id,
        street_id: data.street.street_id,
        street_name: data.street.street_name,
        area: data.street.area,
        location: data.street.location,
        lga: data.street.lga,
        state: data.street.state,
        country: data.street.country,
        street_furniture: data.street.street_furniture,
        road_type: data.street.road_type,
        road_condition: data.street.road_condition,
        road_carriage: data.street.road_carriage,
        road_feature: data.street.road_feature,
        refuse_disposal: data.street.refuse_disposal,
        drainage: data.street.drainage,
        electricity: data.street.electricity,
        location_type: data.location.type,
        latitude: data.location.coordinates.latitude,
        longitude: data.location.coordinates.longitude,
        w3w: data.location.whatthreewords,
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
    this.csvService.download(downloadable, `SPiDER_STREET_DATA_${downloadID}`);
  }


  recordsInit() {
    if (this.user.security.user_type != 'undefined' && this.user.security.user_type === 'Super') {
      this.getStreetRecords();
    }

    if (this.user.security.user_type != 'undefined' && this.user.security.user_type === 'Organisation') {
      this.getOrganisationStreetRecords();
    }

    if (this.user.security.user_type != 'undefined' && this.user.security.user_type === 'Individual') {
      this.getIndividualStreetRecords();
    }

    if (this.user.security.user_type === 'undefined') {
      this.getIndividualStreetRecords();
    }
  }


  getStreetRecords() {
    this.rs.getAllStreetRecords(this.start).subscribe(response => {
      this.isLoading = false;
      this._streetRecords = response.result;
      this._streetRecords.forEach(data => {
        this.streetRecords.push(data);
      });
    }, err => {
      this.isLoading = false;
      this.ss.swalAlert('Newtork Service', 'No internet connection. Please connect and refresh.', 'error');
    });
  }

  getOrganisationStreetRecords() {
    this.rs.getOrganisationStreetRecords(this.user._id, this.start).subscribe(response => {
      this.isLoading = false;
      this._streetRecords = response.result;
      this._streetRecords.forEach(data => {
        this.streetRecords.push(data);
      });
    }, err => {
      this.isLoading = false;
      this.ss.swalAlert('Newtork Service', 'No internet connection. Please connect and refresh.', 'error');
    });
  }

  getIndividualStreetRecords() {
    this.rs.getIndividualStreetRecords(this.user._id).subscribe(response => {
      this._streetRecords = response.result;
      this._streetRecords.forEach(data => {
        this.streetRecords.push(data);
      });
    }, err => {

      this.ss.swalAlert('Newtork Service', 'No internet connection. Please connect and refresh.', 'error');
    });
  }


  openStreetPage(record) {
    this.ss.setRecord('street', record);
    this.router.navigate(['app/street']);
  }

  openEditStreetPage(record) {
    this.ss.setRecord('street', record);
    this.router.navigate(['app/street/edit']);
  }

  deleteRecord(id:string, index: number) {
    swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF0000',
      cancelButtonColor: '#0871FA',
      confirmButtonText: 'Yes, delete it!'
    }).then(() => {
      this.ds.deleteStreet(id).subscribe(response => {
        if (response.success) {
          this.streetRecords.splice(index,1);
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
