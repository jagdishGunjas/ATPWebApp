import { ItmGenData } from 'src/app/Types/itmGenData';
import { Approvals } from './../../Types/approvals';
import { ApprovalsComponent } from './../approvals/approvals.component';
import { Router } from '@angular/router';
import { Invoice } from './../../Types/invoice';
import { Component, OnInit, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { EventEmitter } from '@angular/core';
import { AppService } from './../../Services/app.service';
import * as JsonToXML from 'js2xmlparser';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';

@Component({
  selector: 'app-approvals-edit',
  templateUrl: './approvals-edit.component.html',
  styleUrls: ['./approvals-edit.component.css']
})
export class ApprovalsEditComponent implements OnInit {
  @ViewChild('modalTemplate') modalInput: TemplateRef<any>;
  @Input()
  public invoiceData: Invoice;
  @Input()
  public invoiceRowData: Approvals;
  @Output()
  showInvoice: EventEmitter<boolean> = new EventEmitter<boolean>();
  public pdfData: any;
  public modalRef: BsModalRef;
  public loading: boolean;
  public modalHeader: string;
  public modalMsg: string;
  public showCancel: boolean = false;
  config = {
    keyboard: false,
    backdrop: true,
    ignoreBackdropClick: true
  };
  constructor(private router: Router,
              private appService: AppService,
              private domSanitizer: DomSanitizer,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.loading = true;
    this.showCancel = false;
    this.appService.getpdf(this.invoiceRowData.Archivelink).subscribe((blob => {
      this.pdfData = this.domSanitizer.bypassSecurityTrustResourceUrl(blob);
      this.loading = false;
    }), (error: any) => {
      if (error.error instanceof ErrorEvent) {
        this.modalHeader = `Error : PDF NOT FOUND`;
      }
      else {
        this.modalHeader = `Server Error : PDF NOT FOUND`;
      }

      this.modalMsg = 'Do you wish to continue Edit?';
      this.showCancel = true;
      this.openModal();
    });
  }

  public openModal() {
    this.loading = false;
    this.modalRef = this.modalService.show(this.modalInput, this.config);
  }

  public confirm(): void {
    this.modalRef.hide();
    if (this.showCancel === false) {
        this.showInvoice.emit(true);
    }
  }
  public cancel(): void {
    this.modalRef.hide();
    this.showInvoice.emit(true);
  }
  public AddSummary(): void {
    this.invoiceData.SummarySeg.push(
      {
        Qualifier: '',
        TotalValue: '',
        Curr: ''
      }
    );

  }

  public AddItmGenData(): void {
    this.invoiceData.ItmGenData.push(
      {
        ItmNum: '',
        Quantity: '',
        UOM: '',
        NetItmValue: '',
        Description: '',
        WgtUnit: '',
        TotalWgt: '',
        TotalItemPrice: '',
        Plant: ''
      }
    );
  }

  public removeSummary(index: number) {
    this.invoiceData.SummarySeg.splice(index, 1);
  }

  public removeItems(index: number) {
    this.invoiceData.ItmGenData.splice(index, 1);
  }

  public Save(): void {
    this.loading = true;
    // tslint:disable-next-line: use-isnan
    this.invoiceData.DueDate =  isNaN(Date.parse(this.invoiceData.DueDate)) ? '' : moment(this.invoiceData.DueDate).format('MM/DD/YYYY');
    this.invoiceData.PODate = isNaN(Date.parse(this.invoiceData.PODate)) ? '' : moment(this.invoiceData.PODate).format('MM/DD/YYYY');
    this.invoiceData.ShipDate = isNaN(Date.parse(this.invoiceData.ShipDate)) ? ''  : moment(this.invoiceData.ShipDate).format('MM/DD/YYYY');
    this.invoiceData.InvoiceDate = isNaN(Date.parse(this.invoiceData.InvoiceDate)) ? ''  : moment(this.invoiceData.InvoiceDate).format('MM/DD/YYYY');

    this.invoiceRowData.Document = JsonToXML.parse('invoice', this.invoiceData);
    this.invoiceRowData.IvDocument = this.invoiceRowData.Document.replace(/\r?\n|\r/g, '');

    this.appService.saveApprovalsData(this.invoiceRowData).subscribe((r) => {
      this.modalHeader = 'Message';
      this.modalMsg = 'Record saved successfully !!!';
      this.showCancel = false;
      this.openModal();
    });

  }
  public Cancel(): void {
    this.showInvoice.emit(false);
  }
}
