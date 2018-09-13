import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import { VerifyEmailModel } from '../model/verify.email.model';
import { AppVersion } from '../model/appversion.model';
import { APIConfig } from '../../apiconfig/api.config';

@Injectable()
export class RetrieveService {

  private authorization: string;
  private url: string;
  private remote: string;
  private limit: number = 500;
  constructor(private http: Http, private config: APIConfig) {
    config.getSavedSettings().then(settings => {
      settings['cloud'] ? this.url = config.apiConfig.remoteURL : this.url = config.apiConfig.apiURL;
      this.remote = config.apiConfig.remoteURL;
      this.authorization = config.apiConfig.authorization;
    });

  }

  getImage(imageUrl: string) {
    let headers = new Headers({ 'Content-Type': 'blob' });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(imageUrl, options)
      .map((res) => {
        return new Blob([res['body']], {type: res.headers.get('Content-Type')});
      })
  }

  getCurrentAppVersion(): Observable<AppVersion> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', this.authorization);
    let app: string = "SPiDER";
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.remote + 'current/version/' + app, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  verifyUser(email): Observable<VerifyEmailModel> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', this.authorization);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.remote}verify/${email}`, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  verifyOrganisation(email): Observable<VerifyEmailModel> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', this.authorization);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.remote}verify/organisation/${email}`, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getUsers(): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', this.authorization);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.remote}users`, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getOrganisationUsers(owner): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', this.authorization);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.remote}organisation/users/${owner}`, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getPropertyRecords(start): Observable<any> {
    // /let body = JSON.stringify(payload); 
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', this.authorization);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.url}properties/${start}/${this.limit}`, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllPropertyRecords(skip): Observable<any> {
    // /let body = JSON.stringify(payload); 
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', this.authorization);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.url}all/properties/${skip}`, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getOrganisationPropertyRecords(owner, skip): Observable<any> {
    // /let body = JSON.stringify(payload); 
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', this.authorization);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.url}organisation/properties/${owner}/${skip}`, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getIndividualPropertyRecords(owner): Observable<any> {
    // /let body = JSON.stringify(payload); 
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', this.authorization);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.url}individual/properties/${owner}`, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getStreetRecords(start): Observable<any> {
    // /let body = JSON.stringify(payload); 
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', this.authorization);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.url}streets/${start}/${this.limit}`, options)
      .map(this.extractData)
      .catch(this.handleError);
  }


  getAllStreetRecords(skip): Observable<any> {
    // /let body = JSON.stringify(payload); 
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', this.authorization);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.url}all/streets/${skip}`, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getOrganisationStreetRecords(owner, skip): Observable<any> {
    // /let body = JSON.stringify(payload); 
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', this.authorization);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.url}organisation/streets/${owner}/${skip}`, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getIndividualStreetRecords(owner): Observable<any> {
    // /let body = JSON.stringify(payload); 
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', this.authorization);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.url}individual/streets/${owner}`, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  

  getStreetRecordsByUser(userId): Observable<any> { 
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization' , this.authorization);
    let options = new RequestOptions({ headers : headers });
    return this.http.get(this.url+'user/streets/'+userId, options)
    .map(this.extractData)
    .catch(this.handleError);
  }


  getPropertyRecordsByStreet(streetId): Observable<any> { 
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization' , this.authorization);
    let options = new RequestOptions({ headers : headers });
    return this.http.get(this.url+'street/properties/'+streetId, options)
    .map(this.extractData)
    .catch(this.handleError);
  }


  searchStreetRecords(search, start): Observable<any> { 
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization' , this.authorization);
    let options = new RequestOptions({ headers : headers });
    return this.http.get(this.url+'search/streets/'+search+'/'+start+'/'+this.limit, options)
    .map(this.extractData)
    .catch(this.handleError);
  }

  getEntityRecords(propertyId): Observable<any> { 
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization' , this.authorization);
    let options = new RequestOptions({ headers : headers });
    return this.http.get(this.url+'property/entities/'+propertyId, options)
    .map(this.extractData)
    .catch(this.handleError);
  }


  getPhotos(target, targetId): Observable<any> { 
    let endPoint: string = '';
    if(target == 'street'){
      endPoint = this.url + 'street/photos/' + targetId;
    }
    if(target == 'property'){
      endPoint = this.url + 'property/photos/' + targetId;
    }
    if(target == 'entity'){
      endPoint = this.url + 'entity/photos/' + targetId;
    }
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization' , this.authorization);
    let options = new RequestOptions({ headers : headers });
    return this.http.get(endPoint, options)
    .map(this.extractData)
    .catch(this.handleError);
  }

  getFAQs(): Observable<any> { 
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization' , this.authorization);
    let options = new RequestOptions({ headers : headers });
    return this.http.get(this.remote+'support/faqs', options)
    .map(this.extractData)
    .catch(this.handleError);
  }


  getBSN(skip: number): Observable<any> { 
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization' , this.authorization);
    let options = new RequestOptions({ headers : headers });
    return this.http.get(this.remote+'bsn/'+skip, options)
    .map(this.extractData)
    .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body;
    // check if empty, before call json
    if (res.text()) {
      body = res.json();
    }
    return body || {};
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}