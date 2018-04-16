import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { APIConfig } from '../../apiconfig/api.config';
import {Observable} from 'rxjs/Rx';
import { SharedServices } from '../../shared/shared.services';

@Injectable()
export class CreateService{

    public isLoggedin : boolean;
    public authToken : any;
    private appConfig : any;
    private authorization : string;
    private url : string;
    private _url : string;
    private imageServerURL:  string;


    constructor(public http: Http, public config : APIConfig, private ss: SharedServices) {
        this.http = http;
        this.appConfig = config.getConfig();
        this.url = this.appConfig.apiURL;
        this.imageServerURL = this.appConfig.imageServerURL;
        this._url = this.appConfig.msgURL;
        this.authorization = this.appConfig.authorization;
    }

    //ADD NEW USER
    addUser(user) {
        let headers = new Headers({ 'Content-Type' : 'application/json' });
        headers.append('Authorization' , this.authorization);
        return new Promise(resolve => {
            this.http.post(this.url+'user', JSON.stringify(user), {headers: headers}).subscribe(response => {
                let data = response.json();
                if(data.success){
                    resolve(true);
                }
                else
                    resolve(false);
            },(err)=>{
                resolve(false);
            });
        });
    } 

    //SUPPORT DIRECT MESSAGE
    publishSupportMessage(payload){
        
        let headers = new Headers({ 'Content-Type' : 'application/json' });
        headers.append('Authorization' , this.authorization);
        return new Promise(resolve => {
            this.http.post(this._url+'support', JSON.stringify(payload), {headers: headers}).subscribe(response => {
                let data = response.json();
                if(data.success){
                    resolve(true);
                }
                else
                    resolve(false);
            },(err)=>{
                resolve(false);
            });
        });
    }

    //PHOTO UPLOAD
    uploadCoverPhoto(file_name : string, file: File): Observable<any> {
        return Observable.create(observer => {
            let formData: FormData = new FormData(),
                xhr: XMLHttpRequest = new XMLHttpRequest();
                formData.append("coverphoto", file, file_name);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            };
            xhr.open('POST', this.imageServerURL+'upload/file', true);
            xhr.send(formData);
        });
    }
    
}