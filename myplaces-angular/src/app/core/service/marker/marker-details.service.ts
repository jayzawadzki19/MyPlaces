import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {MarkerCategory} from '../../../shared/model/marker/marker-category.enum';

@Injectable({
  providedIn: 'root'
})
export class MarkerDetailsService {

  private categorySource = new BehaviorSubject(MarkerCategory.ALL);
  currentCategory = this.categorySource.asObservable();

  private detailsFinisherSource = new BehaviorSubject(false);
  currentDetailsFinisher = this.detailsFinisherSource.asObservable();

  constructor() {
  }

  changeCategory(category: MarkerCategory) {
    this.categorySource.next(category);
  }

  finishDetails(s: boolean) {
    this.detailsFinisherSource.next(s);
  }
}
