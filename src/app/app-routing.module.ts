import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PlongeurComponent } from './plongeur/plongeur.component';
import { MoniteurComponent } from './moniteur/moniteur.component';
import { ReservationComponent } from './reservation/reservation.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [

  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'reservation',
    component: ReservationComponent
  },
  {
    path: 'plongeur',
    component: PlongeurComponent
  },
  {
    path: 'moniteur',
    component: MoniteurComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
