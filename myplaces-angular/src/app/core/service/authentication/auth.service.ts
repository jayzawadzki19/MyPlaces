import {EventEmitter, Injectable, Output} from '@angular/core';
import {Credentials} from '../../../shared/model/auth/credentials';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LocalStorageService} from 'ngx-webstorage';
import {LoginResponse} from '../../../shared/model/auth/login-response';
import {CookieService} from 'ngx-cookie-service';
import {map} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = environment.baseUrl;
  credentials: Credentials;
  token: string;

  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();
  @Output() username: EventEmitter<string> = new EventEmitter();

  constructor(private http: HttpClient,
              private localStorage: LocalStorageService,
              private cookieService: CookieService) {
    this.cookieService.set('username', this.localStorage.retrieve('username'));
  }

  signUp(credentials: Credentials): Observable<any> {
    return this.http.post(this.baseUrl + 'api/auth/register', credentials);
  }

  login(credentials: Credentials): Observable<LoginResponse> {
    this.createBasicAuthToken(credentials);
    const httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.retrieveToken()
      })
    };

    return this.http.post<LoginResponse>(this.baseUrl + 'api/auth/login', credentials, httpHeaders)
      .pipe(map(data => {
        this.credentials = credentials;
        this.localStorage.store('username', data.username);
        this.cookieService.set('username', JSON.stringify(data));
        this.localStorage.store('token', this.token);

        this.loggedIn.emit(true);
        this.username.emit(data.username);
        return data;
      }));
  }

  logout() {
    this.localStorage.clear('username');
    this.localStorage.clear('token');
    this.cookieService.delete('username');
  }

  getUsername() {
    return this.localStorage.retrieve('username');
  }

  isLoggedIn(): boolean {
    return this.getUsername() != null;
  }

  retrieveToken() {
    return this.token;
  }

  private createBasicAuthToken(c: Credentials) {
    this.token = 'Basic ' + window.btoa(c.username + ':' + c.password);
  }
}
