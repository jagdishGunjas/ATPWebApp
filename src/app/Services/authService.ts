import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from './../Types/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private csrfToken: string;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public get CsrfToken(): string {
    return this.csrfToken;
  }

  public set CsrfToken(value: string) {
    this.csrfToken = value;
 }

  public login(uid: string, pwd: string) {
    console.log('Auth service -login');
    const url = 'http://76.8.25.92:9222/sap/opu/odata/sap/ZGW_FI_APPROVAL_API_SRV/';
    return this.http.get<any>(url, { observe: 'response' })
      .pipe(map(data => {
        console.log('Auth service - Login -success', data);
        console.log('Successful LogIn', this.currentUser, this.currentUserSubject);
        if (data) {
          console.log('Auth service - Login -success - if');
          this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
          this.currentUser = this.currentUserSubject.asObservable();

          console.log('Login-X-Csrf-Token', data.headers.get('X-Csrf-Token'));
          localStorage.setItem('X-Csrf-Token', data.headers.get('X-Csrf-Token'));
        }
        console.log('Auth service - Login -success -end');
        return data.body;
      }), catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.log('Auth service - Login -catch');
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      console.log('Auth service - Login -catch-Server Error -If');
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log('Auth service - Login -catch-Server Error -After If- before local Storage clear');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('X-Csrf-Token');
    console.log('Auth service - Login -catch-Server Error -After If- after local Storage clear');
    this.currentUserSubject.next(null);
    console.log('Auth service - Login -catch-Server Error -After currentUserSubject.next=null');

    window.console.log(errorMessage);
    return throwError(errorMessage);
  }

  logout() {
    // remove user data from local storage for log out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('X-Csrf-Token');
    this.currentUserSubject.next(null);
  }
}
