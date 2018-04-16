import { Injectable } from '@angular/core';

@Injectable()
export class APIConfig { 
    config = {
        appVersion : "1.0.0",
        apiURL :  "https://api.spider.com.ng",
        authorization : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfYnNvbnR5cGUiOiJPYmplY3RJRCIsImlkIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjpbODksMjQ5LDE2NCwxNywyMzIsMzAsMjI4LDExLDUyLDE4MiwyMzIsMjA4XX0sImlhdCI6MTUwOTUzMjY5MX0.ghQBHtQdOP63jqP7bysGrB9N1sBZdmVh8H5RdOQXzdw"
    }
    getConfig(): Object {
        return this.config;
    }

    getFooterText(): string {
        let today = new Date();
        let year = today.getFullYear();
        return `(c) ${year} SPiDER by Mobisoft`;
    }
}