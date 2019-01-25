import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';
import{ Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email= '';
  password = '';

  btnDisabled = false;
  constructor(private router: Router, private data: DataService, private rest: RestApiService) { }

  ngOnInit() {
  }
    validate(){
      if(this.email){
        if(this.password){
          return true;
        }else{
          this.data.error('Password is required!!');
        }
      }else{
        this.data.error('email is required!!');
      }
    }
 async login(){
    this.btnDisabled = true;
    try{
      if(this.validate()){
        const data = await this.rest.post('/accounts/login', {
          email: this.email,
          password: this.password
        });
        // if(data1['success']){
        //   localStorage.setItem('token', data1['token']);        
        //   // this.data.success(data['message']);  
        // }else{
        //   this.data.error(data1['message']) ;
        // } 

        if(data['success']){
          localStorage.setItem('token', data['token']);
          this.data.getProfile();
          this.router.navigate(['/']);
        }else{
          this.data.error(data['message']);
        }

      }
    }catch(err){
      this.data.error(err);
    }
    this.btnDisabled = false;
  }

}
