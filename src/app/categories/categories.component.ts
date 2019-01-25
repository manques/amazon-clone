import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  category : string;
  btnDisabled = false;

  constructor(private data: DataService, private rest: RestApiService, private router: Router ) {
        this.data.getCategories();
        this.data.token;
   }

  ngOnInit() {
  }

 async addCategory(){
    this.btnDisabled =true;
    try{
      if(this.category){
        const data = await this.rest.post('/categories', {
          name: this.category
        });
        if(data['success']){
          this.data.success(data['message']);
          await this.data.getCategories();
          this.category = '';
        }else{
          this.data.error(data['message']);
        }
      }else{
        this.data.error('Empty Category!!!!');
      }
    }catch(err){
      this.data.error(err);
    }
    this.btnDisabled = false;
  }
}