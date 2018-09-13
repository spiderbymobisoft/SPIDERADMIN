import { Routes, RouterModule, CanActivate }  from '@angular/router';
import { CanActivateViaAuthGuard } from "../services/http/authentication/auth.guard";
import { Layout } from './layout.component';
import { CanActivateViaRoleGuard } from '../services/http/authentication/role.guard';
// noinspection TypeScriptValidateTypes
const routes: Routes = [
  { path: '', component: Layout, children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full', canActivate: [CanActivateViaAuthGuard] },
    { path: 'dashboard', loadChildren: '../dashboard/dashboard.module#DashboardModule', canActivate: [CanActivateViaAuthGuard] },

    { path: 'user', loadChildren: '../user/user.module#UserModule', canActivate: [CanActivateViaAuthGuard] },
    { path: 'users', loadChildren: '../users/users.module#UsersModule', canActivate: [CanActivateViaAuthGuard, CanActivateViaRoleGuard] },
    { path: 'register', loadChildren: '../register/register.module#RegisterModule', canActivate: [CanActivateViaAuthGuard] },
    
    { path: 'devices', loadChildren: '../devices/devices.module#DevicesModule', canActivate: [CanActivateViaAuthGuard] },

    { path: 'streets', loadChildren: '../streets/streets.module#StreetsModule', canActivate: [CanActivateViaAuthGuard] },
    { path: 'street', loadChildren: '../street/street.module#StreetModule', canActivate: [CanActivateViaAuthGuard] },
    { path: 'street/edit', loadChildren: '../edit-street/street.edit.module#StreetEditModule', canActivate: [CanActivateViaAuthGuard] },

    { path: 'properties', loadChildren: '../properties/properties.module#PropertiesModule', canActivate: [CanActivateViaAuthGuard] },
    { path: 'property', loadChildren: '../property/property.module#PropertyModule', canActivate: [CanActivateViaAuthGuard] },
    { path: 'property/edit', loadChildren: '../edit-property/property.edit.module#PropertyEditModule', canActivate: [CanActivateViaAuthGuard] },

    { path: 'entity', loadChildren: '../entity/entity.module#EntityModule', canActivate: [CanActivateViaAuthGuard] },
    { path: 'entity/edit', loadChildren: '../edit-entity/entity.edit.module#EntityEditModule', canActivate: [CanActivateViaAuthGuard] },
   
    { path: 'bsn/manager', loadChildren: '../bsn-manager/bsn-manager.module#BSNManagerModule', canActivate: [CanActivateViaAuthGuard] },

    { path: 'support', loadChildren: '../support/support.module#SupportModule', canActivate: [CanActivateViaAuthGuard] },
    { path: 'settings', loadChildren: '../settings/settings.module#SettingsModule', canActivate: [CanActivateViaAuthGuard] },
    { path: 'new/notification', loadChildren: '../new-notification/new-notification.module#NewNotificationModule', canActivate: [CanActivateViaAuthGuard] }
  ]}
];

export const ROUTES = RouterModule.forChild(routes);
