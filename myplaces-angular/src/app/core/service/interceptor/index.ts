import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';

import {AuthInterceptor} from './auth-interceptor/auth-interceptor';
import {AuthService} from '../authentication/auth.service';
import {LocalStorageService} from 'ngx-webstorage';
import {CookieService} from 'ngx-cookie-service';

export const httpInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true, deps: [AuthService, HttpClient, LocalStorageService, CookieService]},
];
