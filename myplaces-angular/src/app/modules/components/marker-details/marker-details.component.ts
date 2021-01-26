import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Marker} from '../../../shared/model/marker/marker';
import {throwError} from 'rxjs';
import {MarkerService} from '../../../core/service/marker/marker.service';
import {MarkerDetailsService} from '../../../core/service/marker/marker-details.service';
import {MarkerCategory} from '../../../shared/model/marker/marker-category.enum';

@Component({
  selector: 'app-marker-details',
  templateUrl: './marker-details.component.html',
  styleUrls: ['./marker-details.component.scss']
})
export class MarkerDetailsComponent implements OnInit {

  detailsForm: FormGroup;
  marker: Marker;
  isError: boolean;
  @Input() lat: number;
  @Input() lng: number;
  @Input() editedMarker: Marker;
  isSaved: boolean;

  constructor(public activeModal: NgbActiveModal,
              private markerService: MarkerService,
              private detailsService: MarkerDetailsService) {
    this.marker = {
      markerId: null,
      latitude: null,
      longitude: null,
      title: '',
      description: '',
      userId: null,
      category: null
    };

    this.editedMarker = {
      markerId: null,
      latitude: null,
      longitude: null,
      title: '',
      description: '',
      userId: null,
      category: null
    };
  }

  ngOnInit(): void {
    this.detailsForm = new FormGroup({
      title: new FormControl(this.editedMarker.title, Validators.required),
      description: new FormControl(this.editedMarker.description),
      category: new FormControl(this.editedMarker.category, Validators.required)
    });

    // Subscribes changing marker data
    this.detailsService.currentDetailsFinisher.subscribe(c => this.isSaved = c);
  }

  saveDetails(f: boolean) {
    this.detailsService.finishDetails(f);
  }

  // Saves info about marker, if marker exists in database, updates it's details
  save() {
    if (this.detailsForm.invalid) {
      this.isError = true;
    } else {
      this.isError = false;
      if (this.editedMarker.markerId === null) {
        this.marker.title = this.detailsForm.get('title').value;
        this.marker.description = this.detailsForm.get('description').value;
        this.marker.category = this.detailsForm.get('category').value;
        this.marker.latitude = this.lat;
        this.marker.longitude = this.lng;
        this.saveNewMarker(this.marker);
      } else {
        this.editedMarker.title = this.detailsForm.get('title').value;
        this.editedMarker.description = this.detailsForm.get('description').value;
        this.editedMarker.category = this.detailsForm.get('category').value;
        this.saveNewMarker(this.editedMarker);
      }
      this.activeModal.close();
    }
  }

  // Uses service to save new marker to database
  private saveNewMarker(marker: Marker) {
    this.markerService.saveNewMarker(marker).subscribe(data => {
      this.saveDetails(true);
    }, error => {
      this.saveDetails(false);
      throwError(error);
    });
  }

}
