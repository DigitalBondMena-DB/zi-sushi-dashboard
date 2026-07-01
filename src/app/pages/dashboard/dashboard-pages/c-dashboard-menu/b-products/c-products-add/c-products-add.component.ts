import { CommonModule } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
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
import { OnlyNumberDirective } from "../../../../../../only-number.directive";

@Component({
  selector: "app-c-products-add",
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
  templateUrl: "./c-products-add.component.html",
  styleUrl: "./c-products-add.component.scss",
  providers: [MessageService],
})
export class CProductsAddComponent {
  submitForm!: FormGroup;

  categories!: Category[];

  isEditing = false;

  productId: string | null = null;

  private fb = inject(FormBuilder);

  private productsService = inject(ProductsService);

  private ngxSpinnerService = inject(NgxSpinnerService);

  private router = inject(Router);

  private messageService = inject(MessageService);

  private activatedRoute = inject(ActivatedRoute);

  errorMessage: string = "";

  private initializeForm() {
    this.submitForm = this.fb.group({
      image: ["", Validators.required],
      price: ["", Validators.required],
      piece_price_array: this.fb.array([]),
      product_choice_array: this.fb.array([]),
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
      this.isEditing = true;
      this.productId = this.activatedRoute.snapshot.data["products"].product.id;
      const product = this.activatedRoute.snapshot.data["products"];
      this.submitForm.patchValue(product.product);

      // Patch piece_price_array properly
      // this.patchPiecePriceArray(product.piecesPrices || []);

      // Patch product_choice_array properly
      // this.patchProductChoiceArray(product.choices || []);

      this.makeImageOptional();

      if (product.product.price === null) {
        this.makePriceOptional();
        this.submitForm.updateValueAndValidity(); // consider adding this
      }
    }

    this.submitForm.get("piece_price_state")?.valueChanges.subscribe((value) => {
      this.addPiecePrice();

      if (value === 0) {
        this.clearFormArray(this.piecePriceArray);
        this.makePriceRequired();
      } else {
        this.makePriceOptional();
      }
      if (this.isEditing && this.submitForm.get("piece_price_state")?.value === 0) {
      }
    });

    this.submitForm.get("product_choice_state")?.valueChanges.subscribe((value) => {
      this.addProductChoice();
      if (value === 0) {
        this.clearFormArray(this.productChoiceArray);
      }
    });
  }

  private clearFormArray(formArray: FormArray) {
    while (formArray.length > 0) {
      formArray.removeAt(0);
    }
  }

  private makeImageOptional() {
    this.submitForm.get("image")?.clearValidators();
    this.submitForm.updateValueAndValidity();
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
      if (key !== "image" && key !== "piece_price_array" && key !== "product_choice_array") {
        fd.append(key, this.submitForm.value[key]);
      } else if (key === "piece_price_array" || key === "product_choice_array") {
        fd.append(key, JSON.stringify(this.submitForm.value[key])); // Convert to JSON string
      }
    });

    if (typeof this.submitForm.get("image")?.value == "object") {
      fd.append("image", this.submitForm.get("image")?.value);
    } else {
      fd.delete("image");
    }

    if (this.isEditing && this.productId) {
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
    } else {
      this.productsService.addProduct(fd).subscribe({
        next: (response) => {
          this.router.navigate(["/dashboard/menu/products/products-index"]);
          this.messageService.add({ severity: "success", summary: "Added", detail: "Product added successfully" });
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
    const files = event.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.submitForm.patchValue({ image: file });
    }
  }

  clearImage(): void {
    this.submitForm.patchValue({ image: "" });
  }

  // Accessors for FormArrays
  get piecePriceArray(): any {
    return this.submitForm.get("piece_price_array") as any;
  }

  get productChoiceArray(): any {
    return this.submitForm.get("product_choice_array") as any;
  }

  // Methods to add inputs dynamically
  addPiecePrice(isRequired: boolean = true) {
    if (isRequired) {
      this.piecePriceArray.push(
        this.fb.group({
          pieces: ["", Validators.required],
          prices: ["", Validators.required],
        })
      );
    } else {
      this.piecePriceArray.push(
        this.fb.group({
          pieces: [""],
          prices: [""],
        })
      );
    }
  }

  addProductChoice(isRequired: boolean = true) {
    if (isRequired) {
      this.productChoiceArray.push(
        this.fb.group({
          en_name: ["", Validators.required],
          ar_name: ["", Validators.required],
        })
      );
    } else {
      this.productChoiceArray.push(
        this.fb.group({
          en_name: [""],
          ar_name: [""],
        })
      );
    }
  }

  // Patch the piece price array dynamically
  // private patchPiecePriceArray(piecePrices: any[]) {
  //   this.piecePriceArray.clear();
  //   piecePrices.forEach((item) => {
  //     this.piecePriceArray.push(
  //       this.fb.group({
  //         pieces: [item.pieces, Validators.required],
  //         prices: [item.prices, Validators.required],
  //       })
  //     );
  //   });
  // }

  // Patch the product choice array dynamically
  // private patchProductChoiceArray(choices: any[]) {
  //   this.productChoiceArray.clear();

  //   choices.forEach((item) => {
  //     this.productChoiceArray.push(
  //       this.fb.group({
  //         en_name: [item.en_name, Validators.required],
  //         ar_name: [item.ar_name, Validators.required],
  //       })
  //     );
  //   });
  // }

  // Remove item from FormArray
  removePiecePrice(index: number) {
    this.piecePriceArray.removeAt(index);
  }

  removeProductChoice(index: number) {
    this.productChoiceArray.removeAt(index);
  }
}
