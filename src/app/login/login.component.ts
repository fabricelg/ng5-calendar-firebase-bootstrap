import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;

  constructor(private router: Router, public authService: AuthService, private tostr: ToastrService) { }

  ngOnInit() {
  }

  login() {
    this.authService.login(this.email, this.password);
    this.router.navigate(['']);
    //this.email = this.password = '';    
  }

}
