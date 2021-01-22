import {MarkerCategory} from './marker-category.enum';

export interface Marker {
  markerId: number;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  userId: number;
  category: MarkerCategory;
}
