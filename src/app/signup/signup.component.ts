import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  email: string;
  password: string;

  constructor(public authService: AuthService, ) { }

  ngOnInit() {
  }

  signup() {
    this.authService.signup(this.email, this.password);
    //this.email = this.password = '';
  }

}
