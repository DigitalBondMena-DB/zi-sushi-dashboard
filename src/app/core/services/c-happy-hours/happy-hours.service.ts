import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IHappyHours, IHappyHoursResponse, IHappyHoursToggleStatusResponse } from '../../Interfaces/c-happy-hours/ihappy-hours';
import { WEB_SITE_BASE_URL } from '../../constants/WEB_SITE_BASE_UTL';

@Injectable({
  providedIn: 'root'
})
export class HappyHoursService {
  constructor(private http: HttpClient) { }
  getHappyHours():Observable<IHappyHoursResponse> {
    return this.http.get<IHappyHoursResponse>(`${WEB_SITE_BASE_URL}happy-hours`);
  }
  toggleHappyHoursStatus(id:number):Observable<IHappyHoursToggleStatusResponse> {
    return this.http.post<IHappyHoursToggleStatusResponse>(`${WEB_SITE_BASE_URL}happy-hours/toggle/${id}`,{});
  }
  getHappyHoursById(id:string):Observable<IHappyHours>{
    return this.http.get<IHappyHours>(`${WEB_SITE_BASE_URL}happy-hours/${id}`);
  }
  updateHappyHoursById(data:{
  start_time: string
  end_time: string
  discount_percentage: number
},id:string|null):Observable<any>{
    return this.http.post<any>(`${WEB_SITE_BASE_URL}happy-hours/${id}`,data);
  }
}
