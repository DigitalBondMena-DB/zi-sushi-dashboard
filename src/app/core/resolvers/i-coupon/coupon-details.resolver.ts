import { ResolveFn } from "@angular/router";
import { IGetCouponById } from "../../Interfaces/i-coupon/IGetCouponById";
import { CouponService } from "../../services/i-coupon/coupon.service";
import { inject } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { finalize, timer } from "rxjs";

export const couponDetailsResolver: ResolveFn<boolean | IGetCouponById> = (route, state) => {
  const couponService = inject(CouponService);
  const ngxSpinnerService = inject(NgxSpinnerService);
  ngxSpinnerService.show("actionsLoader");
  return couponService.getCouponById(route.paramMap.get("id")!).pipe(
    finalize(() => {
      timer(200).subscribe(() => ngxSpinnerService.hide("actionsLoader"));
    })
  );
};
