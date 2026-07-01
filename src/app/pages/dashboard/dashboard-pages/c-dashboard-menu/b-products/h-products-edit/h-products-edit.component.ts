import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { NgxJoditComponent } from "ngx-jodit";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { FileUploadModule } from "primeng/fileupload";
import { InputSwitchModule } from "primeng/inputswitch";
import { timer } from "rxjs";
import { Category } from "../../../../../../core/Interfaces/h-category/ICategoryById";
import { ProductsService } from "../../../../../../core/services/d-products/products.service";
import { HttpErrorResponse } from "@angular/common/http";
import { OnlyNumberDirective } from "../../../../../../only-number.directive";
import { WEB_SITE_IMG_URL } from "../../../../../../core/constants/WEB_SITE_BASE_UTL";

@Component({
  selector: "app-h-products-edit",
  standalone: true,
  imports: [
    ButtonModule,
    FileUploadModule,
    CardModule,
    InputSwitchModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    DropdownModule,
    NgxJoditComponent,
    CommonModule,
    OnlyNumberDirective,
  ],
  templateUrl: "./h-products-edit.component.html",
  styleUrl: "./h-products-edit.component.scss",
  providers: [MessageService],
})
export class HProductsEditComponent {
  submitForm!: FormGroup;

  categories!: Category[];
  readonly imgUrl = WEB_SITE_IMG_URL
  productId: string | null = null;

  private fb = inject(FormBuilder);

  private productsService = inject(ProductsService);

  private ngxSpinnerService = inject(NgxSpinnerService);

  private router = inject(Router);

  private messageService = inject(MessageService);

  private activatedRoute = inject(ActivatedRoute);

  errorMessage: string = "";

  isBaseImage = "";

  private initializeForm() {
    this.submitForm = this.fb.group({
      image: [""],
      price: ["", Validators.required],
      category_id: ["", Validators.required],
      en_food_name: ["", Validators.required],
      ar_food_name: ["", Validators.required],
      en_ingredients: [""],
      ar_ingredients: [""],
      piece_price_state: [0, Validators.required],
      product_choice_state: [0, Validators.required],
      status: [1, Validators.required],
    });
  }

  ngOnInit() {
    this.initializeForm();
    this.categories = this.activatedRoute.snapshot.data["categories"].categories;
    if (this.activatedRoute.snapshot.data["products"]) {
      this.productId = this.activatedRoute.snapshot.data["products"].product.id;
      const product = this.activatedRoute.snapshot.data["products"];
      this.submitForm.patchValue(product.product);

      if (product.product.en_ingredients == null) {
        this.submitForm.get("en_ingredients")?.setValue("");
      }
      if (product.product.ar_ingredients == null) {
        this.submitForm.get("ar_ingredients")?.setValue("");
      }
      console.log(product.product.image);
      this.isBaseImage = product.product.image;
    }

    this.submitForm.get("piece_price_state")?.valueChanges.subscribe((value) => {
      if (value === 0) {
        this.makePriceRequired();
      } else {
        this.makePriceOptional();
      }
    });
  }

  private makePriceOptional() {
    const priceControl = this.submitForm.get("price");
    priceControl?.clearValidators();
    priceControl?.updateValueAndValidity(); // <- update here, not the whole form
  }

  private makePriceRequired() {
    const priceControl = this.submitForm.get("price");
    priceControl?.setValidators(Validators.required);
    priceControl?.updateValueAndValidity(); // <- update here too
  }

  saveForm() {
    this.submitForm.markAllAsTouched();
    this.errorMessage = "";

    const fd = new FormData();
    if (this.submitForm.get("piece_price_state")?.value) {
      this.submitForm.removeControl("price");
    }

    if (this.submitForm.invalid) return;
    this.ngxSpinnerService.show("actionsLoader");
    this.messageService.clear();

    Object.keys(this.submitForm.value).forEach((key) => {
      if (key !== "image") {
        fd.append(key, this.submitForm.value[key]);
      }
    });

    // Backend requires both 'status' and 'state' with the same value
    fd.append("state", this.submitForm.value["status"]);

    // Patch Image
    if (typeof this.submitForm.get("image")?.value == "object") {
      fd.append("image", this.submitForm.get("image")?.value);
    } else {
      fd.delete("image");
    }

    if (this.productId) {
      this.productsService.updateProduct(this.productId, fd).subscribe({
        next: (response) => {
          this.router.navigate(["/dashboard/menu/products/products-index"]);
          this.messageService.add({ severity: "success", summary: "Updated", detail: "Product updated successfully" });
          timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
        },
        error: (error: HttpErrorResponse) => {
          this.ngxSpinnerService.hide("actionsLoader");
          if (error.error.errors.image) {
            this.errorMessage = error.error.errors.image[0];
          }
        },
      });
    }
  }

  onFileSelect(event: any): void {
    this.isBaseImage = "";
    const files = event.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.submitForm.patchValue({ image: file });
    }
  }

  clearImage(): void {
    console.log(this.activatedRoute.snapshot.data["products"].product.image);
    this.isBaseImage = this.activatedRoute.snapshot.data["products"].product.image;
    this.submitForm.patchValue({ image: "" });
  }
}
