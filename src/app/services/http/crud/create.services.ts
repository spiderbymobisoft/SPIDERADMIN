import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { APIConfig } from '../../apiconfig/api.config';
import {Observable} from 'rxjs/Rx';
import { SharedServices } from '../../shared/shared.services';

@Injectable()
export class CreateService{

    public isLoggedin : boolean;
    public authToken : any;
    private authorization : string;
    private remote: string;

    constructor(public http: Http, public config : APIConfig, private ss: SharedServices) {
        this.remote = config.apiConfig.remoteURL;
        this.authorization = config.apiConfig.authorization;
    }

    //ADD NEW USER
    addUser(user) {
        let headers = new Headers({ 'Content-Type' : 'application/json' });
        headers.append('Authorization' , this.authorization);
        return new Promise(resolve => {
            this.http.post(this.remote+'user', JSON.stringify(user), {headers: headers}).subscribe(response => {
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

    //ADD NEW ORGANISATION
    addOrganisation(user) {
        let headers = new Headers({ 'Content-Type' : 'application/json' });
        headers.append('Authorization' , this.authorization);
        return new Promise(resolve => {
            this.http.post(this.remote+'organisation', JSON.stringify(user), {headers: headers}).subscribe(response => {
                console.log('RES', response.json());
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


    //BULK UPLOAD BSN
    uploadBSN(payload){
        
        let headers = new Headers({ 'Content-Type' : 'application/json' });
        headers.append('Authorization' , this.authorization);
        return new Promise((resolve, reject) => {
            this.http.post(this.remote+'bsn', JSON.stringify(payload), {headers: headers}).subscribe(response => {
                let data = response.json();
                if(data.success){
                    resolve(data);
                }
                else
                    resolve({result: [], success: false});
            },(err)=>{
                reject(err);
            });
        });
    }

    //SUPPORT DIRECT MESSAGE
    publishSupportMessage(payload){
        
        let headers = new Headers({ 'Content-Type' : 'application/json' });
        headers.append('Authorization' , this.authorization);
        return new Promise((resolve, reject) => {
            this.http.post(this.remote+'support', JSON.stringify(payload), {headers: headers}).subscribe(response => {
                let data = response.json();
                if(data.success){
                    resolve(true);
                }
                else
                    resolve(false);
            },(err)=>{
                reject(err);
            });
        });
    }

    //DIRECT MESSAGE TO USER
    sendDirectMessage(payload){
        
        let headers = new Headers({ 'Content-Type' : 'application/json' });
        headers.append('Authorization' , this.authorization);
        return new Promise((resolve, reject) => {
            this.http.post(this.remote+'notification', JSON.stringify(payload), {headers: headers}).subscribe(response => {
                let data = response.json();
                if(data.success){
                    resolve(true);
                }
                else
                    resolve(false);
            },(err)=>{
                reject(err);
            });
        });
    }


    //BROADCAST MESSAGE TO USERS
    sendBroadcastMessage(payload){
        
        let headers = new Headers({ 'Content-Type' : 'application/json' });
        headers.append('Authorization' , this.authorization);
        return new Promise(resolve => {
            this.http.post(this.remote+'notification/broadcast', JSON.stringify(payload), {headers: headers}).subscribe(response => {
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
            xhr.open('POST', this.remote+'upload/file', true);
            xhr.send(formData);
        });
    }
    
}