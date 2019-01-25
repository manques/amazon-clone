import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private data : DataService, private rest: RestApiService) { }
  products : any;
  totalProducts : number;
  pages: number;

  ngOnInit() {
    this.getProducts();
  }

  async getProducts(){
    try{
      const data = await this.rest.get('/products');
      if(data['success']){
        this.products = data['products'];
        this.totalProducts = data['totalProducts'];
        this.pages = data['pages'];
      }else{
        this.data.error(data['message']);
      }
    }catch(err){
      this.data.error(err);
    }
  }

}
