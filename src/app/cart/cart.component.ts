import { Component, OnInit} from '@angular/core';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  quantities = [];
  btnDisabled = false;
  handler : any;
  constructor( private data: DataService, private rest: RestApiService, private router: Router ) { 
    console.log(this.getItems);
    console.log(environment.stripeKey);
    this.data.getAddress();
    this.data.getProfile();
  }
  

  trackByCartItems(index: number, item: any){
    return item._id;
  }
  get totalPrice(){
    let total = 0;
    this.getItems.forEach( (data, index) =>{
      total += data['price'] * this.quantities[index];
    });
    return total;
  }

  get getItems(){
    return this.data.getCart();
  }

  removeCart(product, index){
    this.quantities.splice(index, 1);
    console.log(product);
    this.data.removeCart(product);

  }

  ngOnInit() {
    this.getItems.forEach( (data, index) =>{
       this.quantities.push(1);
    });
    console.log(this.quantities);

    this.handler = StripeCheckout.configure({
      key: environment.stripeKey,
      image: '../../assets/img/logo.png',
      locale: 'auto',
      token: async stripeToken =>{
        let products ;
          products = [];
          this.getItems.forEach( (item, index) =>{
            products.push({
              product: item['_id'],
              quantity: this.quantities[index]
            });
          });

          try{
            const data  = await this.rest.post('/payment', {
              totalPrice: this.totalPrice,
              products,
              stripeToken
            });

            if(data['success']){
              this.data.success(data['message']);
              this.data.clearCart();
              console.log('success!!');
            }else{
              this.data.error(data['message']);
              console.log('fail');
            }
          }catch(err){
            this.data.error(err)
          }
      }
    });
  }
  validate(){
    if(!this.quantities.every( data => data > 0)){
      this.data.warning('Quantity cannot be less than 1');
    }else if(!localStorage.getItem('token')){
      this.router.navigate(['/login'])
        .then( () =>{
          this.data.warning('Login before checkout');
        });
    }else if(!this.data.address){
      this.router.navigate(['/profile/address'])
        .then( () =>{
          this.data.warning('Please enter Shipping Address!!');
        });
    }else{
      this.data.message ='';
      return true;
    }
  }
  
  checkout(){
    this.btnDisabled = true;
    try{
      if(this.validate()){
        this.handler.open({
          name: 'JNV',
          description : 'Checkout Payment',
          amount: this.totalPrice * 100,
          closed: () =>{
            this.btnDisabled = false;
          }
        });
      }
    }catch(err){
      this.data.error(err);
    }
    this.btnDisabled = false;
  }
}
