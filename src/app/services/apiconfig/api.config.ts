import { Injectable } from '@angular/core';

@Injectable()
export class APIConfig { 
    private settings: any = {};
    private config = {
        appVersion : "1.0.0",
        apiURL :  "",
        remoteURL: "https://api.dev.spider.com.ng/",
        msgURL : "https://messenger.spider.com.ng/",
        authorization : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfYnNvbnR5cGUiOiJPYmplY3RJRCIsImlkIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjpbODksMjQ5LDE2NCwxNywyMzIsMzAsMjI4LDExLDUyLDE4MiwyMzIsMjA4XX0sImlhdCI6MTUwOTUzMjY5MX0.ghQBHtQdOP63jqP7bysGrB9N1sBZdmVh8H5RdOQXzdw"
    }

    constructor(){
        this.getSavedSettings().then(settings=>{
            this.settings = settings;
            this.config.apiURL = this.settings && this.settings.api ? `http://${this.settings.ip}:${this.settings.port}/` : 'https://api.dev.spider.com.ng/';
        });
        
    }

    get apiConfig(){
        return this.config;
    }

    updateLocalServerSettings(settings){
        return new Promise(resolve=>{
            this.config.apiURL = `http://${settings.ip}:${settings.port}/`;
            this.settings = settings;
            localStorage.setItem('spider_server_settings', JSON.stringify(settings));
            setTimeout(() => {
                resolve(true);
            }, 1500);
        })
        
    }

    getSavedSettings(){
        return new Promise(resolve=>{
           resolve(JSON.parse(localStorage.getItem('spider_server_settings')) || { cloud: true });
        });
    }

    getFooterText(): string {
        let today = new Date();
        let year = today.getFullYear();
        return `(c) ${year} SPiDER by Mobisoft`;
    }

}