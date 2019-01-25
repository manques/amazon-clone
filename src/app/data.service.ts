import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { RestApiService } from './rest-api.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  message = '';
  messageType = 'danger';
  user: any;
  address: any;
  categories: any;
  myProducts : any;
  cartItem = 0;

  constructor(private router : Router,  private rest: RestApiService) {
    this.router.events.subscribe(event =>{
      if( event instanceof NavigationStart ){
        this.message = '';
      }
    });
   }

  success(message){
    this.message = message;
    this.messageType = 'success';
  }

  warning(message){
    this.message = message;
    this.messageType = 'warning';
  }
  error(message){
    this.message = message;
    this.messageType = 'danger';
  }

 get token(){
    return localStorage.getItem('token');
  }

async getProfile(){
  try{
    if(localStorage.getItem('token')){
      const data = await this.rest.get('/accounts/profile');
      if(data['success']){
        this.user = data['user'];
      }
    }
  }catch(err){
    this.error(err);
  }
}

  async getAddress(){
    try{
        if(localStorage.getItem('token')){
          const data = await this.rest.get('/accounts/address');
          if(data['success']){
            this.address = data['address'];
          }
        }
    }catch(err){
      this.error(err);
    }
  }

  async getCategories(){
    try{
      const data = await this.rest.get('/categories');
      if(data['success']){
        this.categories = data['categories'];
      }else{
        this.error(data['message']);
      }
    }catch(err){
      this.error(err);
    }
  }

  async getMyProducts(){
    try{
      if(localStorage.getItem('token')){
        const data = await this.rest.get('/seller/products');
        if(data['success']){
          this.myProducts = data['products'];
        }else{
          this.error(data['message']);
        }
      }
    }catch(err){
      this.error(err);
    }
  }
  // cart

  getCart(){
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [] ;
  }

  postCart(item : string){
    const cart: any = this.getCart();
    if(cart.find( cart => JSON.stringify(cart) == JSON.stringify(item) )){
      return false;
    }else{
      cart.push(item);
      this.cartItem++;
      localStorage.setItem('cart', JSON.stringify(cart));
      return true;
    }
  }
  clearCart(){
    this.cartItem = 0;
    localStorage.setItem('cart', '[]');
  }
  removeCart(item: string){
    let cart: any = this.getCart();
    if(cart.find( cart => JSON.stringify(cart) === JSON.stringify(item) )){
     cart = cart.filter(cart => JSON.stringify(cart) !== JSON.stringify(item));
     this.cartItem--;
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }
}
