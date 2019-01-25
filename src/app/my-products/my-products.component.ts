import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.css']
})
export class MyProductsComponent implements OnInit {
  constructor(private data: DataService, private rest: RestApiService) { 
    
  }

  ngOnInit() {
    this.data.getMyProducts();
  }

}
