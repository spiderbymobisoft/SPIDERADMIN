import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import { APIConfig } from '../../apiconfig/api.config';

@Injectable()
export class DeleteService{

    private authorization : string;
    private url : string;
    headers: Headers;
    options: RequestOptions;
   
    constructor(public http: Http, public config : APIConfig) {
        config.getSavedSettings().then(settings => {
            settings['cloud'] ? this.url = config.apiConfig.remoteURL : this.url = config.apiConfig.apiURL;
            this.authorization = config.apiConfig.authorization;
          });
        this.headers = new Headers({ 'Content-Type': 'application/json', 
                                    'Accept': 'q=0.8;application/json;q=0.9'
                                });
        this.headers.append('Authorization' , this.authorization);
        this.options = new RequestOptions({ headers: this.headers });
    }
    
    deleteProperty(propertyID): Observable<any> {
        let body = JSON.stringify({id: propertyID});
        return this.http
            .patch(this.url+'remove/property', body, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    } 

    deleteStreet(streetID): Observable<any> {
        let body = JSON.stringify({id: streetID});
        return this.http
            .patch(this.url+'remove/street', body, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    } 

    deleteEntity(entityID): Observable<any> {
        let body = JSON.stringify({id: entityID});
        return this.http
            .patch(this.url+'remove/entity', body, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    } 

    deleteBSN(bsnId): Observable<any> {
        return this.http
        .delete(this.url+'bsn/'+bsnId, this.options)
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}   