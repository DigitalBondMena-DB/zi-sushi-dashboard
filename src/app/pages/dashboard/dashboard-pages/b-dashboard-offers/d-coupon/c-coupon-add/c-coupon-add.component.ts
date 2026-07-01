import { HttpErrorResponse } from "@angular/common/http";
import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DialogModule } from "primeng/dialog";
import { InputSwitchModule } from "primeng/inputswitch";
import { timer } from "rxjs";
import { IAddCouponBody } from "../../../../../../core/Interfaces/i-coupon/IAddCouponBody";
import { CouponService } from "../../../../../../core/services/i-coupon/coupon.service";
import { DropdownModule } from "primeng/dropdown";
import { OnlyNumberDirective } from "../../../../../../only-number.directive";

@Component({
  selector: "app-c-coupon-add",
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    InputSwitchModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    DropdownModule,
    OnlyNumberDirective,
  ],
  templateUrl: "./c-coupon-add.component.html",
  styleUrl: "./c-coupon-add.component.scss",
  providers: [MessageService],
})
export class CCouponAddComponent {
  submitForm: FormGroup;
  isEditing = false;
  couponId: string | null = null;
  errorMessage: string = "";
  counter = [
    { name: "Once", code: 0 },
    { name: "Multi", code: 1 },
  ];
  private fb = inject(FormBuilder);
  private couponService = inject(CouponService);
  private ngxSpinnerService = inject(NgxSpinnerService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.submitForm = this.fb.group({
      code: ["", Validators.required],
      percentage: ["", Validators.required],
      counter_use: [1, Validators.required],
      status: [1, Validators.required],
    });
  }

  ngOnInit() {
    if (this.activatedRoute.snapshot.data["coupon"]) {
      this.isEditing = true;
      this.submitForm.patchValue(this.activatedRoute.snapshot.data["coupon"].coupon);
      this.couponId = this.activatedRoute.snapshot.data["coupon"].coupon.id;
    }
  }

  saveForm() {
    this.submitForm.markAllAsTouched();
    if (this.submitForm.invalid) return;
    this.ngxSpinnerService.show("actionsLoader");
    this.messageService.clear();
    const couponData: IAddCouponBody = this.submitForm.value;

    if (this.isEditing && this.couponId) {
      this.couponService.updateCoupon(this.couponId, couponData).subscribe({
        next: () => {
          this.router.navigate(["/dashboard/offers/coupons"]);
          this.messageService.add({ severity: "success", summary: "Updated", detail: "Category updated successfully" });
          timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.error.errors.code[0];
          timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
        },
      });
    } else {
      this.couponService.addCoupon(couponData).subscribe({
        next: () => {
          this.router.navigate(["/dashboard/offers/coupons"]);
          this.messageService.add({ severity: "success", summary: "Added", detail: "Category added successfully" });
          timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
        },

        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.error.errors.code[0];
          timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
        },
      });
    }
  }
}
