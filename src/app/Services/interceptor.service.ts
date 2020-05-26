import { AuthService } from './authService';
import { User } from './../Types/user';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
@Injectable()
export class InterceptorService implements HttpInterceptor {
  public currentUser: User;
  public reqUrl = environment.proxyurl; // + environment.apiBaseUrl;

  constructor(private authenticationService: AuthService) {
    this.currentUser = localStorage.getItem('currentUser') ?
      JSON.parse(localStorage.getItem('currentUser')) : '';

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.currentUser = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : '';

    if (req.method === 'GET') {
     // const reqUrl = environment.proxyurl + environment.apiBaseUrl;
      req = req.clone({
        headers: req.headers
        .set('Authorization', 'Basic ' + btoa(`${this.currentUser.userName}:${this.currentUser.password}`))
        .set('withCredentials', 'true')
        .set('X-Csrf-Token', 'Fetch')
        , url: this.reqUrl + '' + req.url
      });
    } else if (req.method === 'POST') {
      req = req.clone({
        headers: req.headers
          .set('Authorization', 'Basic ' + btoa(`${this.currentUser.userName}:${this.currentUser.password}`))
          .set('X-Csrf-Token', localStorage.getItem('X-Csrf-Token'))
          // .set('Xsrf-Token', localStorage.getItem('X-Csrf-Token'))
          // .set('Access-Control-Allow-Origin', 'http://localhost:4200')
          // .set('Access-Control-Allow-Methods', 'DELETE, POST, GET, OPTIONS')
          // .set('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With')

          // .set('withCredentials', 'true')
        , url: req.url
      });
    }

    // req = req.clone({
    //   headers: new HttpHeaders({
    //     'Content-Type':  'application/json',
    //     'X-Csrf-Token': 'NU8uJBXxUT0TpkFkPdP9PQ==',
    //     Authorization: ('Basic ' + btoa(`${this.currentUser.userName}:${this.currentUser.password}`)),
    //   })
    // });
    return next.handle(req);
  }
}
