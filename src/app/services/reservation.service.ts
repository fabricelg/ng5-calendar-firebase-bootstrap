import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList  } from 'angularfire2/database';
import { CalendarEventAction } from 'angular-calendar';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class ReservationService {
  //Firebase CRUD : http://www.dotnetmob.com/angular-5-tutorial/angular-5-crud-operations-with-firebase/
   
  //Firebase
  reservations: AngularFireList<any>;
  selectedReservation: {
    $key : string,
    title: string,
    start: Date,
    end: Date,
    plongeurs: {},
    moniteurs: {},
    color: {
      primary: string,
      secondary: string,
    },
    createdAt: Date,
    updatedAt: Date,
  };
  
  constructor( private firebase :AngularFireDatabase) {
    this.reservations = firebase.list('/reservations');
  }

  // Return an observable list of Items
  getReservations(): Observable<any[]> {
    return this.reservations.snapshotChanges().map((arr) => {
      return arr.map((snap) => Object.assign(snap.payload.val(), { $key: snap.key }) );
    });
  }

  /*
  // Return an observable list of Items
  getReservations(){
    this.reservations = this.firebase.list('reservations');
    return this.reservations;
  }
  */
  // Return a single observable item
  getReservation(key: string): Observable<any | null> {
    const item = this.firebase.object('reservations/'+key).valueChanges() as Observable<any | null>;
    return item;
  }
  
  InsertReservation(reservation)
  {
    //console.log('reservation', reservation);
    this.reservations.push({
      title: reservation.title,
      start: reservation.start.getTime(),
      end: reservation.end.getTime(),
      plongeurs: reservation.plongeurs,
      moniteurs: reservation.moniteurs,
      color: {
        primary: reservation.color.primary,
        secondary: reservation.color.secondary,
      },
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    });
  }

  updateReservation(reservation){
    //console.log('reservation', reservation);
    
    this.reservations.update(
      reservation.$key, 
      {
        title: reservation.title,
        start: reservation.start.getTime(),
        end: reservation.end.getTime(),
        plongeurs: reservation.plongeurs,
        moniteurs: reservation.moniteurs,
        color: {
          primary: reservation.color.primary,
          secondary: reservation.color.secondary,
        },
        createdAt: reservation.createdAt,
        updatedAt: new Date().getTime(),
      }
    );
  }

  deleteReservation($key : string){
    this.reservations.remove($key);
  }
}
