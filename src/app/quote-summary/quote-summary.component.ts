import { Component, ChangeDetectorRef } from '@angular/core';
import { ICountryAndCode } from '../partner/create-partner/create-partner.component';
import { FormControl, FormGroup } from '@angular/forms';
import axios from 'axios';
import { MatDialog } from '@angular/material/dialog';
import { RunHistoryDialogComponent } from '../run-history/run-history-dialog/run-history-dialog.component';
import { QuoteAccountLookupComponent } from '../quote-account-lookup/quote-account-lookup.component';


@Component({
  selector: 'app-quote-summary',
  templateUrl: './quote-summary.component.html',
  styleUrls: ['./quote-summary.component.scss']
})
export class QuoteSummaryComponent {
  email: string = '';
  emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  emailError: string | null = null;
  quoteNumber: string = '';
  fromDate: string = '';
  toDate: string = '';
  origin: string  = '';
  destination: string = '';
  companyName: string = '';
  allExceptions: boolean;
  allQuotes: boolean;
  currentExceptions: boolean;
  searchType: string = '1';
  tableHeader: any = [
    'Quote_no',
    'Creation_Date',
    'Company_Name',
    'Account',
    'Exception',
    'UserID',
  ];
  fetchingData: boolean;
  tableDataSource: any = [
    {
      Quote_no: 'Q345012',
      Creation_Date: '2024-05-23',
      Company_Name: 'RST Corporation',
      Account: 'Account345',
      Exception: 'Memory Allocation Exception',
      UserID: 'user345',
    },
  ];
  viewStyle?: string = 'table';
  options = ['Option 1', 'Option 2', 'Option 3'];
  countries: ICountryAndCode[] = [
    { code: "+91", name: "India" },
    { code: "+61", name: "Australia" },
    { code: "+1", name: "USA" }
  ];
  selectableCountries: any = [
    {
      name: "+93",
      alpha2Code: "af",
      numericCode: "004",
    },
    {
      name: "+358",
      alpha2Code: "ax",
      numericCode: "248",
    },
    {
      name: "+355",
      alpha2Code: "al",
      numericCode: "008",
    },
  ];
  constructor(private cdRef: ChangeDetectorRef, public dialog: MatDialog) {}

  ngOnInit() {
    this.fetchData();
  }

  async submit() {
    this.fetchingData = true;
    let requestBody = {
      account: 'string',
      companyName: 'string',
      origin: {
        city: this.origin  || 'string',
        country: 'string',
        stateProvince: 'string',
        zipCode: 'string'
      },
      emailAddress: this.email || 'string',
      exception: 'string',
      fromDateTime: this.fromDate || 'string',
      destination: {
        city: this.destination || 'string',
        country: 'string',
        stateProvince: 'string',
        zipCode: 'string'
      },
      quoteNumber: this.quoteNumber || 'string',
      toDateTime: this.toDate || 'string',
      type: {
        allExceptions: this.searchType === '2' || true,
        allQuotes: this.searchType === '3'  || true,
        currentExceptions: this.searchType === '1' || true
      }
    }
    console.log(requestBody)
    try {
      const response = await axios.post('http://localhost:8080/api/v1/quote/search', requestBody);

      this.tableDataSource = response.data.searchExceptionResponse.map((item: any) => {
        return {
          Quote_no: item.quoteId,
          Creation_Date: item.quoteTimestamp,
          Company_Name: item.companyName,
          Account: item.account,
          Exception: item.exceptions.join(', '),
          UserID: 'Default'
        };
      });
      this.cdRef.detectChanges();

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      this.fetchingData = false;
    }
  }


  validateEmail() {
    console.log("reached")
    if (!this.emailRegex.test(this.email)) {
      this.emailError = 'Invalid email format';
    } else {
      this.emailError = null;
    }
  }

  async fetchData() {
    this.fetchingData = true;
    try {
      const response = await axios.post('http://localhost:8080/api/v1/quote/search', {
        account: 'string',
        companyName: 'string',
        destination: {
          city: 'string',
          country: 'string',
          stateProvince: 'string',
          zipCode: 'string'
        },
        emailAddress: 'string',
        exception: 'string',
        fromDateTime: 'string',
        origin: {
          city: 'string',
          country: 'string',
          stateProvince: 'string',
          zipCode: 'string'
        },
        quoteNumber: 'string',
        toDateTime: 'string',
        type: {
          allExceptions: true,
          allQuotes: true,
          currentExceptions: true
        }
      });

      this.tableDataSource = response.data.searchExceptionResponse.map((item: any) => {
        return {
          Quote_no: item.quoteId,
          Creation_Date: item.quoteTimestamp,
          Company_Name: item.companyName,
          Account: item.account,
          Exception: item.exceptions.join(', '),
          UserID: 'Default' // Fill in with actual data
        };
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    this.fetchingData = false;
    console.log(this.tableDataSource)
  }

  openAccountLookup() {
    this.dialog.open(QuoteAccountLookupComponent, {
      minWidth: '1000px',
    });
  }

}
