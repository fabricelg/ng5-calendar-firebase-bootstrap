import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  isCollapsed = true;
  
  constructor(public authService: AuthService) {}

  logout() {
    //this.isCollapsed = !this.isCollapsed;
    this.authService.logout();
  }

}
 