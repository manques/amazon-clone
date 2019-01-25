import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import{ RestApiService } from '../rest-api.service';
import { MyProductsComponent } from '../my-products/my-products.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  productId: any;
  product: any;
  btnDisabled = false;
  myReview={
    title : '',
    comment: '',
    rating: 0
  }
  constructor(private data: DataService, private rest: RestApiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe( res =>{
      this.productId = res['id'];
    });
    this.getProduct();
    if(localStorage.getItem('token')){
      this.data.getProfile(); 
    }   
  }

  async getProduct(){
    try{
      const data = await this.rest.get(`/product/${this.productId}`);
      if(data['success']){
        this.product = data['product'];
        console.log(this.product);
      }else{
        this.data.error(data['message']);
      }
    }catch(err){
      this.data.error(err);
    }
  }

  async postReview(){
    this.btnDisabled = true;
    try{
      if(localStorage.getItem('token')){
        const data = await  this.rest.post('/review', {
           title: this.myReview.title,
           comment: this.myReview.comment,
           rating: this.myReview.rating,
           productId: this.productId
        });
        if(data['success']){
          this.data.success(data['message']);
          await this.getProduct();
        }else{
          this.data.error(data['message']);
        }
      }else{
        this.router.navigate(['/login']);
      }
    }catch(err){
      this.data.error(err);
    }
    this.btnDisabled = false;
  }

  postCart(){
    try{
     const data = this.data.postCart(this.product);
     if(data){
       this.data.success('Product addedd to Cart!!!');
     }
     else{
       this.data.error('Product is already exist !!!');
     }
    }catch(err){
      this.data.error(err);
    }
  }

}
