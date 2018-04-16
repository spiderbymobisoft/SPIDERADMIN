import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import { APIConfig } from '../../apiconfig/api.config';

@Injectable()
export class DeleteService{

    private appConfig : any;
    private authorization : string;
    private url : string;
    headers: Headers;
    options: RequestOptions;
   
    constructor(public http: Http, public config : APIConfig) {
        this.appConfig = config.getConfig();
        this.url = this.appConfig.apiURL;
        this.authorization = this.appConfig.authorization;
        this.headers = new Headers({ 'Content-Type': 'application/json', 
                                    'Accept': 'q=0.8;application/json;q=0.9'
                                });
        this.headers.append('Authorization' , this.authorization);
        this.options = new RequestOptions({ headers: this.headers });
    }
    
    removeSkill(skill): Observable<any> {
        let body = JSON.stringify(skill);
        return this.http
            .patch(this.url+'user/skill/remove', body, this.options)
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