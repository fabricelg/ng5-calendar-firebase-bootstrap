import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrderModule } from 'ngx-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';

// Component
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PlongeurComponent } from './plongeur/plongeur.component';
import { MoniteurComponent } from './moniteur/moniteur.component';
import { ReservationComponent } from './reservation/reservation.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

// Module Calendar
import { CalendarModule } from 'angular-calendar';
import { CommonModule, registerLocaleData } from '@angular/common';
import { UtilsModule } from './utils/utils.module';
import localeFr from '@angular/common/locales/fr';
import { ContextMenuModule } from 'ngx-contextmenu';
import { CalendarWeekHoursViewModule } from 'angular-calendar-week-hours-view';

//Module Datatables
import { DataTablesModule } from 'angular-datatables';

// Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from './../environments/environment';

// Services
import { AuthService } from './services/auth.service';
import { PlongeurService } from './services/plongeur.service';
import { MoniteurService } from './services/moniteur.service';
import { ReservationService } from './services/reservation.service';

// Pipe
import { FilterPipe, SortByPipe } from './utils/datatable.pipe';

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PlongeurComponent,
    ReservationComponent,
    MoniteurComponent,
    FilterPipe,
    SortByPipe,
    LoginComponent,
    SignupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    NgbModule.forRoot(),
    CalendarModule.forRoot(),
    ContextMenuModule.forRoot({
      useBootstrap4: true
    }),
    CalendarWeekHoursViewModule,
    NgbModalModule.forRoot(),
    ToastrModule.forRoot(),
    CommonModule,
    UtilsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    DataTablesModule,
    OrderModule,
    NgxPaginationModule,
  ],
  providers: [AuthService, PlongeurService, ReservationService, MoniteurService],
  bootstrap: [AppComponent]
})
export class AppModule { }
