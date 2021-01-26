import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../../core/service/authentication/auth.service';
import {Router} from '@angular/router';
import {MarkerDetailsService} from '../../../core/service/marker/marker-details.service';
import {MarkerCategory} from '../../../shared/model/marker/marker-category.enum';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean;
  username: string;
  category: MarkerCategory;
  subscription: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              private detailsService: MarkerDetailsService) {
  }

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.isLoggedIn = this.authService.isLoggedIn();
    this.authService.loggedIn.subscribe((data: boolean) => this.isLoggedIn = data);
    this.authService.username.subscribe((data: string) => this.username = data);
    this.subscription = this.detailsService.currentCategory.subscribe(c => this.category = c);
    console.log(this.username);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Allows to change category inside dropdown
  changeCategory(category: MarkerCategory) {
    this.detailsService.changeCategory(category);
  }

  // Returns type of MarkerCategory enum
  public get markerCategory(): typeof MarkerCategory {
    return MarkerCategory;
  }

  // Logouts user
  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.changeCategory(MarkerCategory.NONE);
    this.router.navigateByUrl('').then();
  }

}
