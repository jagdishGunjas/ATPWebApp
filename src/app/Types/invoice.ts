import { ItmGenData } from './itmGenData';
import { SummarySeg } from './summarySeg';
import { HdrPartner } from './hdrPartner';

export class Invoice {
  CURCY: string;
  InvoiceNumber: string;
  InvoiceDate: string;
  Po: string;
  PODate: string;
  ShipDate: string;
  DueDate: string;
  SubTotal: string;
  Freight: string;
  Tax: string;
  TotalAmount: string;
  Payment: string;
  InvoiceAmount: string;
  HdrPartner: Array<HdrPartner>;
  ItmGenData: Array<ItmGenData>;
  SummarySeg: Array<SummarySeg>;
}

