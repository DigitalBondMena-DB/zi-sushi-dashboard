import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IActiveUsers } from '../model/activeUser';
import { IPromoCode, PromoCode } from '../model/promo-code';
import { IAllPromoCodes } from '../model/promo-codes';
import { WEB_SITE_BASE_URL } from '../../../../../../../core/constants/WEB_SITE_BASE_UTL';

@Injectable({
  providedIn: 'root',
})
export class PromoCodeService {
  http = inject(HttpClient);


  getAllPromoCodes(
    page: number = 1,
    limit: number = 10
  ): Observable<IAllPromoCodes> {
    return this.http.get<IAllPromoCodes>(
      `${WEB_SITE_BASE_URL}promocodes/index?limit=${limit}`
    );
  }

  getSinglePromoCode(id: string): Observable<IPromoCode> {
    return this.http.get<IPromoCode>(`${WEB_SITE_BASE_URL}promocodes/show/${id}`);
  }

  enablePromoCode(id: string): Observable<{ message: string; status: number }> {
    return this.http.post<{ message: string; status: number }>(
      `${WEB_SITE_BASE_URL}promocodes/toggle/${id}`,
      {}
    );
  }

  updatePromoCode(id: string, promoCodeData: PromoCode): Observable<any> {
    return this.http.post<any>(
      `${WEB_SITE_BASE_URL}promocodes/update/${id}`,
      promoCodeData
    );
  }

  addPromoCode(promoCodeData: PromoCode): Observable<any> {
    return this.http.post<any>(
      `${WEB_SITE_BASE_URL}promocodes/store`,
      promoCodeData
    );
  }

  activeUsers(search: string = ''): Observable<IActiveUsers> {
    return this.http.get<IActiveUsers>(
      `${WEB_SITE_BASE_URL}activeusers?search=${search}`
    );
  }
}
