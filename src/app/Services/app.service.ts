import { Approvals } from './../Types/approvals';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, pipe } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { AuthService } from './authService';
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })

export class AppService {

  constructor(private httpClient: HttpClient, private auth: AuthService) { }

  public getApprovalsCount() {
    const url = 'http://76.8.25.92:9222/sap/opu/odata/sap/ZGW_FI_APPROVAL_API_SRV/InvoiceSet/$count';
    return this.httpClient.get<any>(url, { observe: 'response' }).pipe((map(res => {
      localStorage.setItem('X-Csrf-Token', res.headers.get('X-Csrf-Token'));
      return res.body;
    })), catchError(this.handleError));
  }

  public getApprovalsData() {
    const url = 'http://76.8.25.92:9222/sap/opu/odata/sap/ZGW_FI_APPROVAL_API_SRV/InvoiceSet/';
    return this.httpClient.get<any>(url, { observe: 'response' }).pipe((map(res => {
      localStorage.setItem('X-Csrf-Token', res.headers.get('X-Csrf-Token'));
      return res.body;
    })), catchError(this.handleError));
  }

  public getpdf(pdfLink: string) {
    const url = `http://54.185.66.42:5000/APT/UI/getPDF/${pdfLink}`;
    // const url = `ZGW_FI_ATP_APL_SRV/ZAPT_FETCH_PDFSet('${pdfLink}')`;
    return this.httpClient.get<any>(url, { observe: 'response' }).pipe((map(res => {
      localStorage.setItem('X-Csrf-Token', res.headers.get('X-Csrf-Token'));
      // const byteArray = new Uint8Array(atob(res.body.d.EvFile).split('').map(char => char.charCodeAt(0)));
      // return new Blob([byteArray], {type: 'application/pdf'});
      const pdf = res.body.replace('\u0000', '');
      const dataPdf = 'data:application/pdf;base64,' + pdf;
      return dataPdf;
    })), catchError(this.handleError));
  }

  public saveApprovalsData(data: Approvals) {

    const param = data.Archivelink.substr(0, (data.Archivelink.length - 4));
    const url = `http://54.185.66.42:5000/APT/UI/updateRecord/${param}`;

    const d = {
      "RcptDate": moment(data.RcptDate).format('YYYYMMDD'),
      "Source": data.Source,
      "Archivelink": data.Archivelink,
      "InvoiceNumber": data.InvoiceNumber,
      "PO": data.Po,
      "Curr": data.Curr,
      "AppUser": data.AppUser,
      "RecStatus": data.Status,
      "Amount": data.Amount,
      "IvDocument": data.Document
    };
    // const url = `ZGW_FI_ATP_APL_SRV/ZAPT_UPD_RECSet('dd33d3b1-40fd-4119-9')/`;
    return this.httpClient.post(url, d)
      // tslint:disable-next-line: no-shadowed-variable
      .pipe(map((data) => {
        return data;
      }), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(error);
  }
}

