import { Injectable } from '@angular/core';

declare var Messenger: any;
declare var swal: any;

@Injectable()
export class SharedServices {

    private user: any = {};
    private appFormOptions: any = {};
    private access: boolean = false;
    public record: any = {
        street: {},
        property: {},
        entity: {}
    };

    setRecord(target: string, data: any){
        sessionStorage.setItem(target, JSON.stringify(data));
    }

    getRecord(target: string) {
       return JSON.parse(sessionStorage.getItem(target));     
    }
    
    updateUser(payload){
        sessionStorage.setItem('__user__',JSON.stringify(payload));
    }

    updateFormOptions (payload){
        sessionStorage.setItem('__form_options__', JSON.stringify(payload));
    }

    switchOnAccess(){
        sessionStorage.setItem('__access__', 'true');
    }

    USER(){
        return JSON.parse(sessionStorage.getItem('__user__')) || {};
    }

    FORMOPTION(){
        return JSON.parse(sessionStorage.getItem('__form_options__')) || {};
    }

    ACCESS(){
        let access = sessionStorage.getItem('__access__');
        if(access === 'true')
            return true;
        return false;
    }

    clear(){
        sessionStorage.clear();
    }


    messengerAlert(message: string, type: string): void {
        Messenger().post({
            message: message,
            type: type,
            hideAfter: 3
        });
    }

    swalAlert(title: string, text: string, type?: string): void {
        swal(
            {
              title: title ? title : 'Account Service',
              text: text,
              type: type,
              allowEscapeKey: false,
              allowOutsideClick: false,
              confirmButtonColor: '#0A9F62',
              confirmButtonClass: 'btn btn-md btn-primary'
            }
          );
    }
  }