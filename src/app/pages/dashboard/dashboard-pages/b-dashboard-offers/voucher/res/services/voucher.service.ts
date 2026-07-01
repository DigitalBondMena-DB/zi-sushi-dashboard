import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IActiveUsers } from '../model/activeUser';
import { IAddVoucher } from '../model/reqVoucher';
import { IVoucher } from '../model/voucher';
import { IVouchers } from '../model/vouchers';
import { WEB_SITE_BASE_URL } from '../../../../../../../core/constants/WEB_SITE_BASE_UTL';

@Injectable({
  providedIn: 'root',
})
export class VoucherService {
  http = inject(HttpClient);


  getAllVouchers(page: number = 1, limit: number = 10): Observable<IVouchers> {
    return this.http.get<IVouchers>(
      `${WEB_SITE_BASE_URL}vouchers/index?limit=${limit}`
    );
  }

  getSingleVoucher(id: string): Observable<IVoucher> {
    return this.http.get<IVoucher>(`${WEB_SITE_BASE_URL}vouchers/show/${id}`);
  }

  enableVoucher(id: string): Observable<{ message: string; status: number }> {
    return this.http.post<{ message: string; status: number }>(
      `${WEB_SITE_BASE_URL}vouchers/toggle/${id}`,
      {}
    );
  }

  updateVoucher(id: string, voucherData: IAddVoucher): Observable<any> {
    return this.http.post<any>(
      `${WEB_SITE_BASE_URL}vouchers/update/${id}`,
      voucherData
    );
  }

  addVoucher(voucherData: IAddVoucher): Observable<any> {
    return this.http.post<any>(`${WEB_SITE_BASE_URL}vouchers/store`, voucherData);
  }

  activeUsers(search: string = ''): Observable<IActiveUsers> {
    return this.http.get<IActiveUsers>(
      `${WEB_SITE_BASE_URL}activeusers?search=${search}`
    );
  }
}
