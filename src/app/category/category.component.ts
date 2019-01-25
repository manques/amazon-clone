import { Component, OnInit, OnChanges } from '@angular/core';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit, OnChanges {
  categoryId : any;
  products : any;
  total : number;
  pages: number;
  categoryName = '';
  page = 0;
  perPage = 1;
  fakeArray : any;

  constructor( private data: DataService, 
               private rest: RestApiService, 
               private router: Router, 
               private route: ActivatedRoute) {
                 
                }

  ngOnInit() {
    this.route.params.subscribe( res =>{
      this.categoryId = res['id'];
     });
      this.productsByCategory();  
    }

   async  ngOnChanges(){
      await this.productsByCategory();

    }

  get lower(){
    return (this.perPage * (this.page)) + 1;
  }

  get upper(){
    return Math.min(( (this.page + 1) * this.perPage ), this.total);
  }

  get totalProducts(){
    return this.total;
  }


  changePage(p : number){
    this.page = p;
  }
 async productsByCategory(){
   try{
      const data = await this.rest.get(`/categories/${this.categoryId}?page=${this.page}`);
      if(data['success']){
        this.data.success(data['message']);
        this.products =  data['products'];
        this.total = data['totalProducts'];
        this.pages = data['pages'];
        this.categoryName = data['categoryName'];
        this.fakeArray  = new Array(this.pages);
      }
   }catch(err){
     this.data.error(err);
   }
 }
}
