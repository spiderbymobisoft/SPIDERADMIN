import { Routes, RouterModule, CanActivate }  from '@angular/router';
import { CanActivateViaAuthGuard } from "../services/http/authentication/auth.guard";
import { Layout } from './layout.component';
// noinspection TypeScriptValidateTypes
const routes: Routes = [
  { path: '', component: Layout, children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full', canActivate: [CanActivateViaAuthGuard] },
    { path: 'dashboard', loadChildren: '../dashboard/dashboard.module#DashboardModule', canActivate: [CanActivateViaAuthGuard] },

    { path: 'users', loadChildren: '../users/users.module#UsersModule', canActivate: [CanActivateViaAuthGuard] },
    { path: 'register', loadChildren: '../register/register.module#RegisterModule', canActivate: [CanActivateViaAuthGuard] },

    { path: 'streets', loadChildren: '../streets/streets.module#StreetsModule', canActivate: [CanActivateViaAuthGuard] },
    { path: 'street', loadChildren: '../street/street.module#StreetModule', canActivate: [CanActivateViaAuthGuard] },

    { path: 'properties', loadChildren: '../properties/properties.module#PropertiesModule', canActivate: [CanActivateViaAuthGuard] },
    { path: 'property', loadChildren: '../property/property.module#PropertyModule', canActivate: [CanActivateViaAuthGuard] },

    { path: 'entity', loadChildren: '../entity/entity.module#EntityModule', canActivate: [CanActivateViaAuthGuard] },

    { path: 'support', loadChildren: '../support/support.module#SupportModule', canActivate: [CanActivateViaAuthGuard] }
  ]}
];

export const ROUTES = RouterModule.forChild(routes);
