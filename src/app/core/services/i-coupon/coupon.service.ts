import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { WEB_SITE_BASE_URL } from "../../constants/WEB_SITE_BASE_UTL";
import { IAllCoupons } from "../../Interfaces/i-coupon/IAllCoupons";
import { IGetCouponById } from "../../Interfaces/i-coupon/IGetCouponById";
import { IAddCouponBody } from "../../Interfaces/i-coupon/IAddCouponBody";
import { IAddCouponResponse } from "../../Interfaces/i-coupon/IAddCouponResponse";
import { IUpdateCouponBody } from "../../Interfaces/i-coupon/IUpdateCouponBody";
import { IUpdateCouponResponse } from "../../Interfaces/i-coupon/IUpdateCouponResponse";
import { IToggleCoupon } from "../../Interfaces/i-coupon/IToggleCoupon";

@Injectable({
  providedIn: "root",
})
export class CouponService {
  constructor(private http: HttpClient) {}

  getAllCoupons(page: number = 1, perPage: number = 10) {
    return this.http.get<IAllCoupons>(`${WEB_SITE_BASE_URL}coupon_index?page=${page}&limit=${perPage}`);
  }
  getCouponById(couponId: string) {
    return this.http.get<IGetCouponById>(`${WEB_SITE_BASE_URL}coupon_data/${couponId}`);
  }
  addCoupon(couponData: IAddCouponBody) {
    return this.http.post<IAddCouponResponse>(`${WEB_SITE_BASE_URL}coupon_store`, couponData);
  }
  updateCoupon(couponId: string, couponData: IUpdateCouponBody) {
    return this.http.post<IUpdateCouponResponse>(`${WEB_SITE_BASE_URL}coupon_update/${couponId}`, couponData);
  }
  destroyCoupon(couponId: string) {
    return this.http.post<IToggleCoupon>(`${WEB_SITE_BASE_URL}coupon_destroy/${couponId}`, {});
  }
  enableCoupon(couponId: string) {
    return this.http.post<IToggleCoupon>(`${WEB_SITE_BASE_URL}coupon_enable/${couponId}`, {});
  }
}
