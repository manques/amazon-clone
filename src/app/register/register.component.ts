import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';
import{ Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    name = '';
    email = '';
    password = '';
    isSeller = false;

    btnDisabled = false;
  constructor(private data: DataService, private rest: RestApiService, private router: Router) { }

  ngOnInit() {
  }
  validate(){
    if(this.name){
      if(this.email){
        if(this.password){
          return true;
        }else{
          this.data.error('Required password!!');
        }
      }else{
        this.data.error('Required email id!!!');
      }
    }else{
      this.data.error('Please enter Name!!');
    }
  }

 async  register(){
    this.btnDisabled = true;
    try{
      if(this.validate()){
        const data = await this.rest.post('/accounts/signup', {
          name: this.name,
          email: this.email,
          password: this.password,
          isSeller: this.isSeller
        });
        if(data['success']){
          this.data.success(data['message']);
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
