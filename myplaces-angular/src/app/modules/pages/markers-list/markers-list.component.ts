import {Component, OnDestroy, OnInit} from '@angular/core';
import {Marker} from '../../../shared/model/marker/marker';
import {MarkerService} from '../../../core/service/marker/marker.service';
import {MarkerCategory} from '../../../shared/model/marker/marker-category.enum';
import {Subscription, throwError} from 'rxjs';
import {MarkerDetailsService} from '../../../core/service/marker/marker-details.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MarkerDetailsComponent} from '../../components/marker-details/marker-details.component';
import {mark} from '@angular/compiler-cli/src/ngtsc/perf/src/clock';
import {marker} from 'leaflet';
import {errorObject} from 'rxjs/internal-compatibility';

@Component({
  selector: 'app-markers-list',
  templateUrl: './markers-list.component.html',
  styleUrls: ['./markers-list.component.scss']
})
export class MarkersListComponent implements OnInit, OnDestroy {
  markers$: Array<Marker> = [];
  category: MarkerCategory;
  subscription: Subscription;
  editSubscription: Subscription;
  markerDetails: Marker;


  constructor(private markerService: MarkerService,
              private detailsService: MarkerDetailsService,
              private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.subscription = this.detailsService.currentCategory.subscribe(c => {
      this.category = c;
      this.getMarkers(c);
    });

    this.editSubscription = this.detailsService.currentDetailsFinisher.subscribe(c => {
      if (c) {
        this.getMarkers(this.category);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.editSubscription.unsubscribe();
  }

  getMarkers(category: MarkerCategory) {
    if (category === MarkerCategory.ALL) {
      this.getAllMarkers();
    } else {
      this.getMarkersByCategory(category);
    }
  }

  // Saves all user's markers to array
  private getAllMarkers() {
    this.markerService.getAllMarkers().subscribe(data => {
      this.markers$ = data;
    }, error => {
      throwError(error);
    });
  }

  // Saves user's markers with defined category to array
  private getMarkersByCategory(category: MarkerCategory) {
    this.markerService.getMarkersByCategory(category.toString()).subscribe(data => {
      this.markers$ = data;
    }, error => {
      throwError(error);
    });
  }

  // Receives marker details, opens modal with given info
  getDetails(markerId: number) {
    this.markerService.getOneMarker(markerId).subscribe(data => {
      this.markerDetails = data;
      this.open(this.markerDetails);
    }, error => {
      throwError(error);
    });
  }

  // Removes marker
  deleteMarker(markerId: number) {
    this.markerService.deleteMarker(markerId).subscribe(data => {
      this.getMarkers(this.category);
    }, error => {
      throwError(error);
    });
  }

  // Opens modal, provides marker details to modal class
  open(m: Marker) {
    const modalRef = this.modalService.open(MarkerDetailsComponent, {size: 'lg'});
    modalRef.componentInstance.editedMarker.title = m.title;
    modalRef.componentInstance.editedMarker.description = m.description;
    modalRef.componentInstance.editedMarker.category = m.category;
    modalRef.componentInstance.editedMarker.markerId = m.markerId;
    modalRef.componentInstance.editedMarker.userId = m.userId;
    modalRef.componentInstance.editedMarker.longitude = m.longitude;
    modalRef.componentInstance.editedMarker.latitude = m.latitude;
  }

}
