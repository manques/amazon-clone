import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {

  constructor( private data: DataService, private rest: RestApiService ) { }
    name ='';
    email= '';
    password= '';
    isSeller = false;

    btnDisabled = false;

  ngOnInit() {
    this.data.getProfile();
  }

  async updateProfile(){
    this.btnDisabled = true;
    try{
      const data = await this.rest.post('/accounts/profile',{
        name: this.name,
        email: this.email,
        password: this.password,
        isSeller: this.isSeller
      });
      if(data['success']){
        this.data.success(data['message']);
        await this.data.getProfile();
      }else{
        this.data.error(data['message']);
      }
    }catch(err){
      this.data.error(err);
    }
    this.btnDisabled = false;
  }
}
