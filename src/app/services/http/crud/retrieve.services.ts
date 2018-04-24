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

  private appConfig: any;
  private authorization: string;
  private url: string;
  private _url: string;
  private limit: number = 500;
  constructor(private http: Http, private config: APIConfig) {
    this.appConfig = config.getConfig();
    this.url = this.appConfig.apiURL;
    this._url = this.appConfig.msgURL;
    this.authorization = this.appConfig.authorization;

  }

  getCurrentAppVersion(): Observable<AppVersion> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', this.authorization);
    let app: string = "SPiDER";
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.url + 'current/version/' + app, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  verifyUser(email): Observable<VerifyEmailModel> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', this.authorization);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.url}verify/${email}`, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  verifyOrganisation(email): Observable<VerifyEmailModel> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', this.authorization);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.url}verify/organisation/${email}`, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getUsers(): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', this.authorization);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.url}users`, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getOrganisationUsers(owner): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', this.authorization);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.url}organisation/users/${owner}`, options)
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

  getAllPropertyRecords(): Observable<any> {
    // /let body = JSON.stringify(payload); 
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', this.authorization);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.url}all/properties`, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getOrganisationPropertyRecords(owner): Observable<any> {
    // /let body = JSON.stringify(payload); 
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', this.authorization);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.url}organisation/properties/${owner}`, options)
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


  getAllStreetRecords(): Observable<any> {
    // /let body = JSON.stringify(payload); 
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', this.authorization);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.url}all/streets`, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getOrganisationStreetRecords(owner): Observable<any> {
    // /let body = JSON.stringify(payload); 
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', this.authorization);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.url}organisation/streets/${owner}`, options)
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

  getFAQs(): Observable<any> { 
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization' , this.authorization);
    let options = new RequestOptions({ headers : headers });
    return this.http.get(this.url+'support/faqs', options)
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