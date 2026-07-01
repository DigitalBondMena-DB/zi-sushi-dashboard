import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
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
import { HotBoxesService } from "../../../../../../core/services/c-hot-boxes/hot-boxes.service";
import { OnlyNumberDirective } from "../../../../../../only-number.directive";

@Component({
  selector: "app-c-hot-boxes-add",
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
  templateUrl: "./c-hot-boxes-add.component.html",
  styleUrl: "./c-hot-boxes-add.component.scss",
  providers: [MessageService],
})
export class CHotBoxesAddComponent {
  submitForm!: FormGroup;

  categories!: Category[];

  isEditing = false;

  productId: string | null = null;

  private fb = inject(FormBuilder);

  private hotBoxesService = inject(HotBoxesService);

  private ngxSpinnerService = inject(NgxSpinnerService);

  private router = inject(Router);

  private messageService = inject(MessageService);

  private activatedRoute = inject(ActivatedRoute);

  private initializeForm() {
    this.submitForm = this.fb.group({
      image: ["", Validators.required],
      price: [""],
      category_id: [25, Validators.required],
      en_food_name: ["", Validators.required],
      ar_food_name: ["", Validators.required],
      en_ingredients: ["", Validators.required],
      ar_ingredients: ["", Validators.required],
      piece_price_state: [0, Validators.required],
      product_choice_state: [0, Validators.required],
      state: [1, Validators.required],
    });
  }

  ngOnInit() {
    this.initializeForm();
    if (this.activatedRoute.snapshot.data["boxes"]) {
      this.isEditing = true;
      this.productId = this.activatedRoute.snapshot.data["boxes"].product.id;
      const product = this.activatedRoute.snapshot.data["boxes"];

      this.submitForm.patchValue(product.product);

      this.makeImageOptional();
    }
  }

  private makeImageOptional() {
    this.submitForm.get("image")?.clearValidators();
    this.submitForm.updateValueAndValidity();
  }

  saveForm() {
    this.submitForm.markAllAsTouched();
    const fd = new FormData();

    if (this.submitForm.invalid) return;
    this.ngxSpinnerService.show("actionsLoader");
    this.messageService.clear();

    Object.keys(this.submitForm.value).forEach((key) => {
      if (key !== "image") {
        fd.append(key, this.submitForm.value[key]);
      }
    });

    if (typeof this.submitForm.get("image")?.value == "object") {
      fd.append("image", this.submitForm.get("image")?.value);
    } else {
      fd.delete("image");
    }

    if (this.isEditing && this.productId) {
      this.hotBoxesService.updateHotBox(this.productId, fd).subscribe(() => {
        this.router.navigate(["/dashboard/offers/boxes/boxes-index"]);
        this.messageService.add({ severity: "success", summary: "Updated", detail: "Hot Box updated successfully" });
        timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
      });
    } else {
      this.hotBoxesService.addBox(fd).subscribe(() => {
        this.router.navigate(["/dashboard/offers/boxes/boxes-index"]);
        this.messageService.add({ severity: "success", summary: "Added", detail: "Hot Box added successfully" });
        timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
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
}
