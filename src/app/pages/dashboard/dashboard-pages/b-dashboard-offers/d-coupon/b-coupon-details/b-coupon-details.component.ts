import { CommonModule, PercentPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { TagModule } from "primeng/tag";
import { couponData } from "../../../../../../core/Interfaces/i-coupon/IAllCoupons";

@Component({
  selector: "app-b-coupon-details",
  standalone: true,
  imports: [TagModule, CommonModule, CardModule, ButtonModule, RouterLink, PercentPipe],
  templateUrl: "./b-coupon-details.component.html",
  styleUrl: "./b-coupon-details.component.scss",
})
export class BCouponDetailsComponent {
  private ActivatedRoute = inject(ActivatedRoute);

  couponsData!: couponData;

  ngOnInit(): void {
    this.couponsData = this.ActivatedRoute.snapshot.data["coupon"].coupon;
  }
}
