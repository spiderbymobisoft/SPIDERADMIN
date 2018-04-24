import { Routes } from '@angular/router';
import { ErrorComponent } from './error/error.component';
import { CanActivateViaAuthGuard } from "./services/http/authentication/auth.guard";


export const ROUTES: Routes = [
  {
   path: '', redirectTo: 'app', pathMatch: 'full', canActivate: [CanActivateViaAuthGuard]
  },
  {
    path: 'app',   loadChildren: './layout/layout.module#LayoutModule', canActivate: [CanActivateViaAuthGuard]
  },
  {
    path: 'login', loadChildren: './login/login.module#LoginModule'
  },
  {
    path: 'register', loadChildren: './register/register.module#RegisterModule'
  },
  {
    path: 'error', component: ErrorComponent
  },
  {
    path: '**',    component: ErrorComponent
  }
];
