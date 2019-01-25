import { Component, OnInit} from '@angular/core';
import { DataService } from '../data.service';
import  { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
    mainMenu = [
      { name: 'Categories', link: '/categories'}
      // { name: 'HOME', link: '' },
      // { name: 'ABOUT US', link: '/about'},
      // { name: 'SERVICE', link: '/service'},
      // { name: 'CONTACT US', link: '/contact'}
    ];

    searchTerm = '';

  constructor(private data: DataService, private router: Router) { 
    this.data.getProfile();
    this.data.cartItem = this.data.getCart().length;
  }


  ngOnInit() {
    this.data.getProfile();
    this.data.getCart();
  }
  
  
  get token(){
    return localStorage.getItem('token');
  }
  logout(){
    localStorage.clear();
    this.data.user = '';
    this.router.navigate(['/']);
  }
  search(){

    if(this.searchTerm){
    console.log(this.searchTerm);
      // this.router.navigateByUrl(['/search', { query: this.searchTerm }]);

      this.router.navigateByUrl(`/search;query=${this.searchTerm}`);

    }
  }

}
