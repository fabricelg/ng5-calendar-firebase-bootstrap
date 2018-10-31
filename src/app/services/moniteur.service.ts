import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MoniteurService {

  //Firebase CRUD : http://www.dotnetmob.com/angular-5-tutorial/angular-5-crud-operations-with-firebase/
   
  //Firebase
  moniteurs: AngularFireList<any>;
  selectedMoniteur: {
    $key : string,
    nom: string,
    prenom: string,
    dateNaissance: string,
    certificat: string,
    codePostal: string,
    ville: string,
    telephone: string,
    email: string,
    brevet: string,
    prenomAccident: string,
    nomAccident: string,
    telephoneAccident: string,
    createdAt: Date,
    updatedAt: Date,
  };

  constructor( private firebase :AngularFireDatabase) {
    this.moniteurs = firebase.list('/moniteurs');
  }

  // Return an observable list of Items
  getMoniteurs(): Observable<any[]> {
    return this.moniteurs.snapshotChanges().map((arr) => {
      return arr.map((snap) => Object.assign(snap.payload.val(), { $key: snap.key }) );
    });
  }

  // Return a single observable item
  getMoniteur(key: string): Observable<any | null> {
    const item = this.firebase.object('moniteurs/'+key).valueChanges() as Observable<any | null>;
    return item;
  }
  
  InsertMoniteur(moniteur)
  {
    this.moniteurs.push({
      nom: moniteur.nom,
      prenom: moniteur.prenom,
      dateNaissance: moniteur.dateNaissance,
      certificat: moniteur.certificat,
      codePostal: moniteur.codePostal,
      ville: moniteur.ville,
      telephone: moniteur.telephone,
      email: moniteur.email,
      brevet: moniteur.brevet,
      prenomAccident: moniteur.prenomAccident,
      nomAccident: moniteur.nomAccident,
      telephoneAccident: moniteur.telephoneAccident,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    });
  }

  updateMoniteur(moniteur){
    this.moniteurs.update(
      moniteur.$key, 
      {
        nom: moniteur.nom,
        prenom: moniteur.prenom,
        dateNaissance: moniteur.dateNaissance,
        certificat: moniteur.certificat,
        codePostal: moniteur.codePostal,
        ville: moniteur.ville,
        telephone: moniteur.telephone,
        email: moniteur.email,
        brevet: moniteur.brevet,
        prenomAccident: moniteur.prenomAccident,
        nomAccident: moniteur.nomAccident,
        telephoneAccident: moniteur.telephoneAccident,
        createdAt: moniteur.createdAt,
        updatedAt: new Date().getTime(),
      }
    );
  }

  deleteMoniteur($key : string){
    this.moniteurs.remove($key);
  }
}