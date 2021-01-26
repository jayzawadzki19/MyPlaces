import {Component, OnDestroy, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {MarkerService} from '../../../core/service/marker/marker.service';
import {Marker} from '../../../shared/model/marker/marker';
import {Subscription, throwError} from 'rxjs';
import {MarkerCategory} from '../../../shared/model/marker/marker-category.enum';
import {MarkerDetailsService} from '../../../core/service/marker/marker-details.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MarkerDetailsComponent} from '../../components/marker-details/marker-details.component';
import {AuthService} from '../../../core/service/authentication/auth.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  private map;
  markers$: Array<Marker> = [];
  category: MarkerCategory;
  subscription: Subscription;
  savingSub: Subscription;

  // Initial street layer
  streetMapLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Layer for markers
  markerLayer = L.layerGroup();

  constructor(private markerService: MarkerService,
              private detailsService: MarkerDetailsService,
              private modalService: NgbModal,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.initMap();

    // Subscribes changing category
    this.subscription = this.detailsService.currentCategory.subscribe(c => {
      this.category = c;
      this.getMarkers(c);
    });

    // Subscribes editing marker details
    this.savingSub = this.detailsService.currentDetailsFinisher.subscribe(c => {
      if (c) {
        this.getMarkers(this.category);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.savingSub.unsubscribe();
  }

  // Initializes map, sets starting point, layer and click event handling
  private initMap(): void {
    this.map = L.map('map', {
      center: [52.2319581, 21.0067249],
      zoom: 3
    }).invalidateSize();

    // Adds layer to map
    this.streetMapLayer.addTo(this.map);

    // Sets click event logic, creates marker on maps
    this.map.on('click', e => {
      if (this.authService.isLoggedIn()) {
        this.open(e.latlng.lat, e.latlng.lng);
        this.getMarkers(this.category);
      } else {
        L.marker([e.latlng.lat, e.latlng.lng],
          {icon: this.getIconOptionsBasedOnCategory(MarkerCategory.OTHER)})
          .bindPopup(`<p><b>Register</b><br />To edit data and save markers!</p>`)
          .openPopup()
          .addTo(this.map);
      }
    });
  }

  // Gets markers based on provided category
  getMarkers(category: MarkerCategory) {
    this.removeMarkers();
    if (category === MarkerCategory.ALL) {
      this.getAllMarkers();
    } else if (category === MarkerCategory.NONE) {
      this.removeMarkers();
    } else {
      this.getMarkersByCategory(category);
    }
  }

  // Saves all user's markers to array
  private getAllMarkers() {
    this.markerService.getAllMarkers().subscribe(data => {
      this.markers$ = data;
      this.displayMarkers();
    }, error => {
      throwError(error);
      console.log(error);
    });
  }

  // Saves user's markers with defined category to array
  private getMarkersByCategory(category: MarkerCategory) {
    this.markerService.getMarkersByCategory(category.toString()).subscribe(data => {
      this.markers$ = data;
      this.displayMarkers();
    }, error => {
      throwError(error);
      console.log(error);
    });
  }

  // Adds markers from saved array to layer with markers and saves this layer to map
  private displayMarkers() {
    this.markers$.forEach(m => {
      this.markerLayer.addLayer(L.marker([m.latitude, m.longitude],
        {icon: this.getIconOptionsBasedOnCategory(m.category)})
        .bindPopup(`<p><b style="align-content: center">${m.title}</b><br />${m.description}</p><br /><i>${m.category}</i>`)
        .openPopup());
    });
    this.markerLayer.addTo(this.map);
  }

  // Sets icon options for marker based on category
  private getIconOptionsBasedOnCategory(c: MarkerCategory): L.Icon {
    let iconUrl: string;
    const cat = MarkerCategory[c];
    switch (cat) {
      case MarkerCategory.FOOD: {
        iconUrl = 'src/assets/marker/marker-icon-food.png';
        break;
      }
      case MarkerCategory.FREETIME.toString(): {
        iconUrl = 'src/assets/marker/marker-icon-freetime.png';
        break;
      }
      case MarkerCategory.SHOPPING.toString(): {
        iconUrl = 'src/assets/marker/marker-icon-shopping.png';
        break;
      }
      case MarkerCategory.SERVICES.toString(): {
        iconUrl = 'src/assets/marker/marker-icon-serv.png';
        break;
      }
      case MarkerCategory.WORK.toString(): {
        iconUrl = 'src/assets/marker/marker-icon-work.png';
        break;
      }
      case MarkerCategory.OTHER.toString(): {
        iconUrl = 'src/assets/marker/marker-icon-other.png';
        break;
      }
      default:
        iconUrl = 'src/assets/marker/marker-icon-other.png';

    }

    return L.icon({
      iconSize: [25, 41],
      iconAnchor: [13, 41],
      popupAnchor: [0, -20],
      iconUrl,
      shadowUrl: 'src/assets/marker/marker-shadow.png'
    });
  }

  // Clears layer from markers
  private removeMarkers() {
    this.markerLayer.clearLayers();
  }

  // Opens new Marker details window
  open(lat: number, lng: number) {
    const modalRef = this.modalService.open(MarkerDetailsComponent, {size: 'lg'});
    modalRef.componentInstance.lat = lat;
    modalRef.componentInstance.lng = lng;
  }


}
