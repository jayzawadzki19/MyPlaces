import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import * as L from 'leaflet';
import {Observable} from 'rxjs';
import {LocalStorageService} from 'ngx-webstorage';
import {Marker} from '../../../shared/model/marker/marker';
import {mark} from '@angular/compiler-cli/src/ngtsc/perf/src/clock';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  reqUrl = 'http://localhost:8080/api/markers';
  httpHeaders = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.localStorage.retrieve('token')
    })
  };

  constructor(private httpClient: HttpClient, private localStorage: LocalStorageService) {
  }

  getAllMarkers(): Observable<any> {
    return this.httpClient.get(this.reqUrl + '/all', this.httpHeaders);
  }

  getMarkersByCategory(category: string): Observable<any> {
    return this.httpClient.get(this.reqUrl + `/byCategory/${category}`, this.httpHeaders);
  }

  saveNewMarker(marker: Marker): Observable<any> {
    return this.httpClient.post(this.reqUrl + '/new', marker, this.httpHeaders);
  }
}
