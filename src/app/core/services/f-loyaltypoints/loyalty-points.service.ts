import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ILoyaltyPoints } from '../../Interfaces/f-loyalty-points/iloyalty-points';
import { WEB_SITE_BASE_URL } from '../../constants/WEB_SITE_BASE_UTL';

@Injectable({
  providedIn: 'root'
})
export class LoyaltyPointsService {
    constructor(private http: HttpClient) {}
    getLoyaltyPointsStatus():Observable<ILoyaltyPoints> {
      return this.http.get<ILoyaltyPoints>(`${WEB_SITE_BASE_URL}status-zi-points`);
    }
    toggleLoyaltyPointsStatus():Observable<ILoyaltyPoints> {
      return this.http.post<ILoyaltyPoints>(`${WEB_SITE_BASE_URL}toggle-zi-points`,{});
    }
}
