import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { SharedServices } from '../../shared/shared.services';

@Injectable()
export class CanActivateViaRoleGuard implements CanActivate {

    constructor(private ss: SharedServices) { }

    canActivate() {
        let user = this.ss.USER();

        if (!user.security.user_type || user.security.user_type == 'Individual') {
            return false;
        } else {
            return true;
        }

    }
}