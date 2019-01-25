import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import{ RestApiService } from '../rest-api.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  add1 = '';
  add2 = '';
  city = '';
  state = '';
  country = '';
  postalCode = '';

  btnDisabled = false;

  constructor(private data: DataService, private rest: RestApiService) { 
    this.data.getAddress(); 
  }

  ngOnInit() {

  }

  async updateAddress(){
    this.btnDisabled = true;
    try{
        const data = await this.rest.post('/accounts/address',{
          add1: this.add1,
          add2: this.add2,
          city: this.city,
          state: this.state,
          country: this.country,
          postalCode: this.postalCode
        });
        if(data['success']){
          this.data.success(data['message']);
        }else{
          this.data.error(data['message']);
        }
    }catch(err){
      this.data.error(err);
    }
    this.btnDisabled = false;
  }

}
