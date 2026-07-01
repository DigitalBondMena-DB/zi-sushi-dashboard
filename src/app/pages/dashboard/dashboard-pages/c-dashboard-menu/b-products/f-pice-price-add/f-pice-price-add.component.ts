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
import { PiecesPrice } from "../../../../../../core/Interfaces/d-products/IGetProductById";
import { IAddCategoryBody } from "../../../../../../core/Interfaces/h-category/IAddCategoryBody";
import { ProductsService } from "../../../../../../core/services/d-products/products.service";
import { OnlyNumberDirective } from "../../../../../../only-number.directive";

@Component({
  selector: "app-f-pice-price-add",
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    InputSwitchModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    OnlyNumberDirective,
  ],
  templateUrl: "./f-pice-price-add.component.html",
  styleUrl: "./f-pice-price-add.component.scss",
  providers: [MessageService],
})
export class FPicePriceAddComponent {
  submitForm: FormGroup;

  isEditing = false;

  productId: string | null = null;

  private fb = inject(FormBuilder);

  private productsService = inject(ProductsService);

  private ngxSpinnerService = inject(NgxSpinnerService);

  private router = inject(Router);

  private messageService = inject(MessageService);

  private activatedRoute = inject(ActivatedRoute);

  private piceDetails!: PiecesPrice;

  constructor() {
    this.submitForm = this.fb.group({
      pieces: ["", Validators.required],
      prices: ["", Validators.required],
      status: [1, Validators.required],
    });
  }

  ngOnInit() {
    if (this.activatedRoute.snapshot.data["products"]) {
      if (this.router.url.includes("edit")) {
        this.isEditing = true;
        this.piceDetails = JSON.parse(localStorage.getItem("PiceDetails")!);
        this.submitForm.patchValue(JSON.parse(localStorage.getItem("PiceDetails")!));
      }
      this.productId = this.activatedRoute.snapshot.data["products"].product.id;
    }
  }

  saveForm() {
    if (this.submitForm.invalid) return;
    this.ngxSpinnerService.show("actionsLoader");
    this.messageService.clear();
    const pricePriceData: IAddCategoryBody = this.submitForm.value;

    if (this.isEditing && this.productId) {
      this.productsService.updateProductPics(this.piceDetails.id.toString(), pricePriceData).subscribe(() => {
        this.router.navigate(["/dashboard/menu/products/products-pice-price/" + this.productId]);
        this.messageService.add({ severity: "success", summary: "Updated", detail: "Category updated successfully" });
        timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
      });
    } else {
      this.productsService.storeProductPics(this.productId!, pricePriceData).subscribe(() => {
        this.router.navigate(["/dashboard/menu/products/products-pice-price/" + this.productId]);
        this.messageService.add({ severity: "success", summary: "Added", detail: "Category added successfully" });
        timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
      });
    }
  }
}
