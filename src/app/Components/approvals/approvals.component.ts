import { HdrPartner } from './../../Types/hdrPartner';
import { Approvals } from './../../Types/approvals';
import { AppService } from './../../Services/app.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ButtonRendererComponent } from 'src/app/CellRenderers/button-renderer/button-renderer.component';
import { ListApprovals } from 'src/app/Types/listApprovals';
import * as moment from 'moment';
import * as  xml2js from 'xml2js';
import { Invoice } from 'src/app/Types/invoice';
import { ItmGenData } from 'src/app/Types/itmGenData';
import { SummarySeg } from 'src/app/Types/summarySeg';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.css'],
})
export class ApprovalsComponent implements OnInit {
  @ViewChild('modalApproval') modalApproval: TemplateRef<any>;
  private gridApi: any;
  private gridColumnApi: any;
  public rowData: any[] = [];
  public context: any;
  public frameworkComponents: any;
  public defaultColDef: any;
  public columnDefs: any;
  public loader = false;
  public showInvoiceData = false;
  public invoiceData: any;
  public invoiceRowData: Approvals;
  public modalRef: BsModalRef;
  public modalHeader: string;
  public modalMsg: string;
  config = {
    keyboard: false,
    backdrop : true,
    ignoreBackdropClick : true
   };

  constructor(private service: AppService, private modalService: BsModalService) {
    this.columnDefs = [
      { headerName: 'Record', field: 'Record', width: 220, hide: true},
      { headerName: 'InvoiceNumber', field: 'InvoiceNumber', width: 150 },
      {
        headerName: 'RcptDate', field: 'RcptDate', width: 200,
        cellRenderer: (data) => moment(data.RcptDate).format('MM/DD/YYYY')
      },
      { headerName: 'Source', field: 'Source', width: 100 },
      { headerName: 'AppUser', field: 'AppUser', width: 150 },
      { headerName: 'Status', field: 'Status', width: 100 },
      { headerName: 'Archivelink', field: 'Archivelink', width: 100, hide: true },
      { headerName: 'Company', field: 'Company', width: 150 },
      { headerName: 'Po', field: 'Po', width: 200 },
      { headerName: 'VendorNumber', field: 'VendorNumber', width: 250 },
      { headerName: 'VendorName', field: 'VendorName', width: 250 },
      { headerName: 'Currency', field: 'Curr', width: 130 },
      { headerName: 'Amount', field: 'Amount', width: 200 },
      { headerName: 'Document', field: 'Document', hide: true },
      {
        headerName: 'Edit',
        field: '',
        cellRenderer: 'buttonRendererComponent',
        colId: 'params',
        width: 80,
        pinned: 'right'
      },
    ];

    this.context = { componentParent: this };
    this.frameworkComponents = {
      buttonRendererComponent: ButtonRendererComponent,
    };

    this.defaultColDef = {
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 150,
      filter: true,
      resizable: true,
    };
  }

  ngOnInit() {
    this.getRowData();
  }

  public openModal() {
    this.modalRef = this.modalService.show(this.modalApproval, this.config);
  }

  public ok(): void {
    this.modalRef.hide();
  }

  public methodFromParent(data: Approvals): void {
    this.invoiceRowData = data;
    const parser = new xml2js.Parser({ strict: false, trim: true });
    this.parseXML(atob(data.Document))
    // tslint:disable-next-line: no-shadowed-variable
    .then((d) => {
      this.showInvoiceData = true;
      this.invoiceData = d;
    }).catch(Error => {
      this.modalHeader = 'Error';
      this.modalMsg = 'xml document format issue';
      this.openModal();
    }
    );
  }
  public onGridReady(params): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  public handleCancel(isShowInvoiceDetails: boolean) {
    if (isShowInvoiceDetails)
    {
      this.showInvoiceData = false;
      this.getRowData();
    }
    else {
    this.showInvoiceData = isShowInvoiceDetails;
    }
  }
  private getRowData(): void {
    this.loader = true;
    this.service.getApprovalsData().subscribe((data: any) => {
      this.loader = false;
      this.rowData = data.d.results.reverse();
    });
  }

  private parseXML(data: any) {
    return new Promise(resolve => {
      let response: any = null;
      // tslint:disable-next-line: label-position
      const invoice: Invoice = new Invoice();
      const parser = new xml2js.Parser({ strict: false, trim: true });
      parser.parseString(data, (err: any, result: any) => {
       response = result.INVOICE;

       invoice.CURCY = response.CURCY[0];
       invoice.DueDate = isNaN(Date.parse(response.DUEDATE[0])) ? '' : moment(response.DUEDATE[0]).format('MM/DD/YYYY');
       invoice.Freight = response.FREIGHT [0];
       invoice.InvoiceAmount = response.INVOICEAMOUNT[0];
       invoice.InvoiceDate  = isNaN(Date.parse(response.INVOICEDATE[0])) ? '' : moment(response.INVOICEDATE[0]).format('MM/DD/YYYY');
       invoice.InvoiceNumber = response.INVOICENUMBER[0];
       invoice.Payment = response.PAYMENT[0];
       invoice.Po = response.PO[0];
       invoice.PODate =  isNaN(Date.parse(response.PODATE[0])) ? '' : moment(response.PODATE[0]).format('MM/DD/YYYY');
       invoice.ShipDate = isNaN(Date.parse( response.SHIPDATE[0])) ? '' : moment(response.SHIPDATE[0]).format('MM/DD/YYYY');
       invoice.SubTotal = response.SUBTOTAL[0];
       invoice.Tax = response.TAX[0];
       invoice.TotalAmount = response.TOTALAMOUNT[0];
       invoice.HdrPartner = new Array<HdrPartner>();
       invoice.ItmGenData = new Array<ItmGenData>();
       invoice.SummarySeg = new Array<SummarySeg>();

       response.HDRPARTNER.forEach(hdrPartner => {
        invoice.HdrPartner.push( {
          Type : hdrPartner.TYPE[0],
          Number : hdrPartner.NUMBER[0],
          NAME1 : hdrPartner.NAME1[0],
          Street : hdrPartner.STREET[0],
          City : hdrPartner.CITY[0],
          PostalCode : hdrPartner.POSTALCODE[0],
          Country : hdrPartner.COUNTRY[0],
          Language : hdrPartner.LANGUAGE[0]});
      });

       response.ITMGENDATA.forEach(item => {
        invoice.ItmGenData.push( {
          ItmNum : item.ITMNUM[0],
          Quantity : item.QUANTITY[0],
          UOM : item.UOM[0],
          NetItmValue : item.NETITMVALUE[0],
          Description : item.DESCRIPTION[0],
          WgtUnit : item.WGTUNIT[0],
          TotalWgt : item.TOTALWGT[0],
          Plant : item.PLANT[0],
          TotalItemPrice : item.TOTALITEMPRICE[0]});
      });

       response.SUMMARYSEG.forEach(item => {
        invoice.SummarySeg.push( {
          Qualifier : item.QUALIFIER[0],
          TotalValue : item.TOTALVALUE[0],
          Curr : item.CURR[0],
        });
      });

       resolve(invoice);
      });
    });
  }
}
