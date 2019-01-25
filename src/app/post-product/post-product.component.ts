import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';
import { Router } from '@angular/router';
import { ProductComponent } from '../product/product.component';

@Component({
  selector: 'app-post-product',
  templateUrl: './post-product.component.html',
  styleUrls: ['./post-product.component.css']
})
export class PostProductComponent implements OnInit {
     title: '';
     price: number;
     categoryId: '';
     description: '';
  

   btnDisabled = false;

  constructor(private data: DataService, private rest: RestApiService, private router: Router) { 
    this.data.getCategories();
  }

  ngOnInit() {
  }
  validate(){
    if(this.title){
      if(this.price > 0){
        if(this.categoryId){
          if(this.description){
            return true;
          }else{
            this.data.error('Write Product short description!!!');
          }
        }else{
          this.data.error('Please enter Category!!!');
        }
      }else{
        this.data.error('Please enter price!!!');
      }
    }else{
      this.data.error('Please enter title!!!');
    }
  }


  async postProduct(){
    this.btnDisabled = true;
      try{
        if(this.validate()){
          const data = await this.rest.post('/seller/products', {
            title: this.title,
            price: this.price,
            categoryId: this.categoryId,
            description: this.description
          });
          if(data['success']){
            this.data.success(data['message']);
            await this.data.getMyProducts();
            this.title ='';
            this.price= null;
            this.categoryId = '';
            this.description = '';
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
