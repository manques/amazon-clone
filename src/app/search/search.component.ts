import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit{
  query = '';
  page = 1;
  perPage: Number;
  content: any;
  constructor(private data: DataService, 
              private rest: RestApiService, 
              private route: ActivatedRoute, 
              private router: Router) { 
                
              }

  ngOnInit() {
    this.route.params.subscribe( res =>{
      this.query = res['query'];
      this.page = 1;
      this.getContent();
    });
  }

  get lower(){
    return 1 + this.content.page * this.content.hitsPerPage ;
  }

  get upper(){
    return Math.min((this.content.page + 1)* this.content.hitsPerPage, this.content.nbHits);
  }
  async getContent(){
      try{
        const data = await this.rest.get(`http://localhost:3030/api/search?searchTerm=${this.query}&page=${this.page - 1}`);
        console.log(data);
        if(data['success']){
          this.content = data['content'];
          this.perPage = this.content.hitsPerPage;
          console.log(this.content.hits.length);
        }else{
          this.data.error(data['message']);
        }
      }catch(err){
        this.data.error(err);
      }
  }
}
