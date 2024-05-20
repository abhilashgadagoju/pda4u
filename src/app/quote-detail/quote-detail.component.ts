import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import axios from 'axios'
import { ComItem } from '../interface/quotedetailsresponse.interface';


@Component({
  selector: 'app-quote-detail',
  templateUrl: './quote-detail.component.html',
  styleUrls: ['./quote-detail.component.scss']
})
export class QuoteDetailComponent implements OnInit {
  options = ['Option 1', 'Option 2', 'Option 3'];
  connectionType = ['AWS', 'SFTP'];
  selectionConnection = '';
  isCompressionEnabled: any;
  isEncryptionEnabled: any;
  emailFormControl = new FormControl('', [Validators.required]);
  @ViewChild('imgFileInputs') inputElement: ElementRef | undefined;

  quoteNumber: string = '';
  quoteDetails: any = {};
  errorMessage: string = '';
  exceptionsList: string = '';

  // adding new input field
  newComList:ComItem[] = [];
  addComFirstTime: boolean = true;
  isInvalid: boolean[] = [];
  isButtonClicked: boolean = false;

  constructor(private route: ActivatedRoute, private http: HttpClient) {

  }

  clearDestination() {
    this.quoteDetails.shippingInformation.destination.zipCode = '';
    this.quoteDetails.shippingInformation.destination.city = '';
    this.quoteDetails.shippingInformation.destination.stateProvince = '';
  }
  clearOrigin() {
    this.quoteDetails.shippingInformation.origin.zipCode = '';
    this.quoteDetails.shippingInformation.origin.city = '';
    this.quoteDetails.shippingInformation.origin.stateProvince = '';
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.quoteNumber = params.get('quoteNumber') || '22';
      this.fetchQuoteDetails();
    });
  }

  async fetchQuoteDetails(): Promise<void> {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/details/${this.quoteNumber}`);
      this.quoteDetails = response.data.details[0].quoteDetails;
      if (this.quoteDetails.exceptions) {
        this.exceptionsList = this.quoteDetails.exceptions.join(', ');
      }
    } catch (error) {
      this.errorMessage = 'Error fetching quote details';
      console.error(error);
    }
    console.log(this.quoteNumber)
    console.log(this.quoteDetails)
  }

  onFileSelected() {}
  selectionConnectionValue(e: any) {
    console.log(this.emailFormControl.hasError('required'));
    this.selectionConnection = e;
  }


  addInputField() {
    
    if (this.addComFirstTime) {
      this.addComFirstTime = false;
      this.newComList.push({
        count: 0,
        dd3: "dd3_value1",
        tb2: ""
      });
    }else if ( this.newComList[this.newComList.length-1].tb2==="" ) {
      this.isInvalid[this.newComList.length - 1] = true;
    }else if(this.isInvalid.some(value => value === true)){
      //do nothing
    }else {
      this.isInvalid[this.newComList.length - 1] = false;
      this.newComList.push({
        count: 0,
        dd3: "dd3_value1",
        tb2: ""
      });
    }
    console.log(this.newComList);
  }

  trackByFn(index: number, item: ComItem): number {
    return index; // Use index as the unique identifier
  }

  onInputChange(index: number, newValue: any) {
    if(newValue==="") {
      this.isInvalid[index] = true;
    }else{
      this.newComList[index].tb2 = newValue;
      this.isInvalid[index] = false;
    }
    
  }
}
