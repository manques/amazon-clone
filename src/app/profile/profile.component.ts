import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  constructor(private data: DataService, private rest: RestApiService){ 
    this.data.getProfile();
    this.data.getAddress();
  }

  ngOnInit() {
  }

}
