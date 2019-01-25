import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RestApiService {
 
  constructor(private http: HttpClient) { }

  getHeader(){
    const token = localStorage.getItem('token');
    return token ? new HttpHeaders().set('authorization', token): null;
  }

  get(link : string){
    return  this.http.get(`${environment.apiUrl}${link}`, { headers: this.getHeader()}).toPromise();
  }

  post(link: string, body: any){
    return this.http.post(`${environment.apiUrl}${link}`, body, { headers: this.getHeader()}).toPromise();
  }
}
