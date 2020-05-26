import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './../../Services/app.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public approvalsCount = 0;
  public loader = false;
  constructor(private router: Router, private service: AppService) { }

  ngOnInit() {
    this. getApprovalsCount();
  }

  go(route: string): void {
    this.router.navigate([route]);
  }
  getApprovalsCount(): void {
    this.loader = true;
    this.service.getApprovalsCount().subscribe(
      (data: any) => {
        this.loader = false;
        console.log('data from service', data);
        this.approvalsCount = data;
      }
    );
  }


}
