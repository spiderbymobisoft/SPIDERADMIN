import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { APIConfig } from '../../apiconfig/api.config';
import { SharedServices } from '../../shared/shared.services';

@Injectable()
export class AuthenticationService {
    public isLoggedin: boolean;
    public authToken: any;
    private authorization: string;
    private remote: string;

    constructor(public http: Http, config: APIConfig, private ss: SharedServices) {
        this.isLoggedin = false;
        this.authToken = null;
        this.remote = config.apiConfig.remoteURL;
        this.authorization = config.apiConfig.authorization;
    }

    storeUserCredentials(token, userdata) {
        this.ss.updateUser(userdata);
        sessionStorage.setItem('__token__', token);
        this.ss.switchOnAccess();
        this.useCredentials(token);
    }

    useCredentials(token) {
        this.isLoggedin = true;
        this.authToken = token;
    }

    loadUserCredentials() {
        var token = sessionStorage.getItem('__token__');
        this.useCredentials(token);
    }

    destroyUserCredentials() {
        this.isLoggedin = false;
        this.authToken = null;
        this.ss.clear();
        sessionStorage.clear();
    }

    authenticate(user) {
        var creds = JSON.stringify(user);
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', this.authorization);
        return new Promise(resolve => {
            this.http.post(`${this.remote}authenticate`, creds, { headers: headers }).subscribe(data => {
                let _data = data.json();
                if (_data.success) {
                    this.storeUserCredentials(_data.token, _data.result);
                    resolve(true);
                }
                else
                    resolve(false);
            }, (err) => {
                resolve(false);
            });
        });
    }

    authenticateOrganisation(user) {
        var creds = JSON.stringify(user);
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', this.authorization);
        return new Promise(resolve => {
            this.http.post(`${this.remote}authenticate/organisation`, creds, { headers: headers }).subscribe(data => {
                let _data = data.json();
                if (_data.success) {
                    this.storeUserCredentials(_data.token, _data.result);
                    resolve(true);
                }
                else
                    resolve(false);
            }, (err) => {
                resolve(false);
            });
        });
    }

    isAuthenticated(): boolean {
        return this.ss.ACCESS();
    }

    logout() {
        return new Promise(resolve => {
            this.destroyUserCredentials();
            resolve(true);
        });
    }
}