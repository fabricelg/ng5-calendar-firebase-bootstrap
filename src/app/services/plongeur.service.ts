import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PlongeurService {

  //Firebase CRUD : http://www.dotnetmob.com/angular-5-tutorial/angular-5-crud-operations-with-firebase/
   
  //Firebase
  plongeurs: AngularFireList<any>;
  selectedPlongeur: {
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
    this.plongeurs = firebase.list('/plongeurs');
  }

  // Return an observable list of Items
  getPlongeurs(): Observable<any[]> {
    return this.plongeurs.snapshotChanges().map((arr) => {
      return arr.map((snap) => Object.assign(snap.payload.val(), { $key: snap.key }) );
    });
  }

  // Return a single observable item
  getPlongeur(key: string): Observable<any | null> {
    const item = this.firebase.object('plongeurs/'+key).valueChanges() as Observable<any | null>;
    return item;
  }
  
  InsertPlongeur(plongeur)
  {
    this.plongeurs.push({
      nom: plongeur.nom,
      prenom: plongeur.prenom,
      dateNaissance: plongeur.dateNaissance,
      certificat: plongeur.certificat,
      codePostal: plongeur.codePostal,
      ville: plongeur.ville,
      telephone: plongeur.telephone,
      email: plongeur.email,
      brevet: plongeur.brevet,
      prenomAccident: plongeur.prenomAccident,
      nomAccident: plongeur.nomAccident,
      telephoneAccident: plongeur.telephoneAccident,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    });
  }

  updatePlongeur(plongeur){
    this.plongeurs.update(
      plongeur.$key, 
      {
        nom: plongeur.nom,
        prenom: plongeur.prenom,
        dateNaissance: plongeur.dateNaissance,
        certificat: plongeur.certificat,
        codePostal: plongeur.codePostal,
        ville: plongeur.ville,
        telephone: plongeur.telephone,
        email: plongeur.email,
        brevet: plongeur.brevet,
        prenomAccident: plongeur.prenomAccident,
        nomAccident: plongeur.nomAccident,
        telephoneAccident: plongeur.telephoneAccident,
        createdAt: plongeur.createdAt,
        updatedAt: new Date().getTime(),
      }
    );
  }

  deletePlongeur($key : string){
    this.plongeurs.remove($key);
  }
}
