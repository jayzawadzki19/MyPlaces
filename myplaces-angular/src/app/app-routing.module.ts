import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MapComponent} from './modules/pages/map/map.component';
import {LoginComponent} from './modules/pages/login/login.component';
import {RegisterComponent} from './modules/pages/register/register.component';
import {MarkersListComponent} from './modules/pages/markers-list/markers-list.component';


const routes: Routes = [
  {path: '', component: MapComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'myMarkers', component: MarkersListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
