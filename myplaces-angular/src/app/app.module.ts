import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {NavbarComponent} from './modules/components/navbar/navbar.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MapComponent} from './modules/pages/map/map.component';
import {LoginComponent} from './modules/pages/login/login.component';
import {RegisterComponent} from './modules/pages/register/register.component';
import {ReactiveFormsModule} from '@angular/forms';
import {httpInterceptorProviders} from './core/service/interceptor';
import {HttpClientModule} from '@angular/common/http';
import {LocalStorageService, NgxWebstorageModule} from 'ngx-webstorage';
import { MarkerDetailsComponent } from './modules/components/marker-details/marker-details.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MapComponent,
    LoginComponent,
    RegisterComponent,
    MarkerDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LeafletModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxWebstorageModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
