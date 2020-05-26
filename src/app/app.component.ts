import { Router } from '@angular/router';
import { Component} from '@angular/core';
import { User } from './Types/user';
import { AuthService } from './Services/authService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ATP';
  currentUser: User;

  constructor(
      private router: Router,
      private authenticationService: AuthService
  ) {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  logout() {
      this.authenticationService.logout();
      this.router.navigate(['/login']);
  }

  public doUnload(): void {
    this.doBeforeUnload();
  }

  // Keep me Signed in
  public doBeforeUnload(): void {
    // this.authenticationService.logout();
  }
}

