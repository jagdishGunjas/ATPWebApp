import { AgGridModule } from 'ag-grid-angular';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApprovalsComponent } from './Components/approvals/approvals.component';
import { LogInComponent } from './Components/log-in/log-in.component';
import { HomeComponent } from './Components/home/home.component';
import { ContactUsComponent } from './Components/contact-us/contact-us.component';
import { AboutUsComponent } from './Components/about-us/about-us.component';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClientXsrfModule } from '@angular/common/http';
import { ButtonRendererComponent } from './CellRenderers/button-renderer/button-renderer.component';
import { AlertComponent } from './components/alert/alert.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InterceptorService } from './Services/interceptor.service';
import { ApprovalsEditComponent } from './Components/approvals-edit/approvals-edit.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    AppComponent,
    ApprovalsComponent,
    LogInComponent,
    HomeComponent,
    ContactUsComponent,
    AboutUsComponent,
    ButtonRendererComponent,
    AlertComponent,
    ApprovalsEditComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    AgGridModule.withComponents([])
  ],
  entryComponents: [ButtonRendererComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
