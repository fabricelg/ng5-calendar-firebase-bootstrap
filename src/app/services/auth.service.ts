import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
  user: Observable<firebase.User>;

  constructor(private firebaseAuth: AngularFireAuth, private tostr: ToastrService) {
    this.user = firebaseAuth.authState;
  }

  signup(email: string, password: string) {
    this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        //console.log('Success!', value);
        this.tostr.success('Utlisateur enregistré', 'Inscription effectuée');
      })
      .catch(err => {
        //console.log('Something went wrong:',err.message);
        this.tostr.error(err.message, 'Inscription en erreur');
      });    
  }

  login(email: string, password: string) {
    this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        //console.log('Nice, it worked!');
        this.tostr.success('Utlisateur authentifié', 'Connexion effectuée');
      })
      .catch(err => {
        //console.log('Something went wrong:',err.message);
        this.tostr.error(err.message, 'Identification en erreur');
      });
  }

  logout() {
    this.firebaseAuth
      .auth
      .signOut();
  }

}