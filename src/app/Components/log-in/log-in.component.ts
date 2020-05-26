import { User } from './../../Types/user';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService } from './../../Services/alert.service';
import { AuthService } from './../../Services/authService';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  isActive = true;
  returnUrl: string;
  private loggedInuser: User;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthService,
    private alertService: AlertService,
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    console.log('Returned URL', this.returnUrl);
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onIconClick(flag) {
    alert(flag);
    this.isActive = flag;
  }

  onSubmit() {
    this.submitted = true;
    this.loggedInuser = { userName: this.f.username.value, password: this.f.password.value };
    // reset console.logs on submit
    this.alertService.clear();
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    console.log('loggedin', this.loggedInuser);
    localStorage.setItem('currentUser', JSON.stringify(this.loggedInuser));
    this.loading = true;
    console.log('log-in c-Main');
    this.authenticationService.login(this.loggedInuser.userName, this.loggedInuser.password)
      .subscribe(
        (data: any) => {
          console.log('log-in c-Success');
          this.router.navigate([this.returnUrl]);
        },
        (error: any) => {
          console.log('log-in c-error');
          this.alertService.error('Please enter valid credentials.');
          this.loading = false;
        });
  }
}
