import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private jsonUrl = '/assets/data/stock.json';
  constructor(private http: HttpClient) {}

  //loadData(): Observable<any> {
  getStockData(): Observable<any> {
    return this.http.get(this.jsonUrl);
  }
}