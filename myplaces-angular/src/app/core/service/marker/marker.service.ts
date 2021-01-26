import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LocalStorageService} from 'ngx-webstorage';
import {Marker} from '../../../shared/model/marker/marker';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  reqUrl = 'http://localhost:8080/api/markers';

  // creates authorization header
  httpHeaders = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.localStorage.retrieve('token')
    })
  };

  constructor(private httpClient: HttpClient, private localStorage: LocalStorageService) {
  }

  // Returns all markers
  getAllMarkers(): Observable<any> {
    return this.httpClient.get(this.reqUrl + '/all', this.httpHeaders);
  }

  // Returns markers by category
  getMarkersByCategory(category: string): Observable<any> {
    return this.httpClient.get(this.reqUrl + `/byCategory/${category}`, this.httpHeaders);
  }

  // Returns marker with given id
  getOneMarker(markerId: number): Observable<any> {
    return this.httpClient.get(this.reqUrl + `/getOne/${markerId}`, this.httpHeaders);
  }

  // Saves new marker into database
  saveNewMarker(marker: Marker): Observable<any> {
    return this.httpClient.post(this.reqUrl + '/new', marker, this.httpHeaders);
  }

  // Deletes marker from database
  deleteMarker(markerId: number): Observable<any> {
    return this.httpClient.delete(this.reqUrl + `/delete/${markerId}`, this.httpHeaders);
  }
}
