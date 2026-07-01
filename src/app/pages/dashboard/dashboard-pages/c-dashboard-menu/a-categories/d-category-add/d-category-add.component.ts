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
import { IAddCategoryBody } from "../../../../../../core/Interfaces/h-category/IAddCategoryBody";
import { CategoriesService } from "../../../../../../core/services/h-category/categories.service";

@Component({
  selector: "app-d-category-add",
  standalone: true,
  imports: [ButtonModule, CardModule, InputSwitchModule, DialogModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./d-category-add.component.html",
  styleUrl: "./d-category-add.component.scss",
  providers: [MessageService],
})
export class DCategoryAddComponent {
  submitForm: FormGroup;

  isEditing = false;

  categoryId: string | null = null;

  private fb = inject(FormBuilder);

  private categoriesService = inject(CategoriesService);

  private ngxSpinnerService = inject(NgxSpinnerService);

  private router = inject(Router);

  private messageService = inject(MessageService);

  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.submitForm = this.fb.group({
      en_name: ["", Validators.required],
      ar_name: ["", Validators.required],
      state: [1, Validators.required],
    });
  }

  ngOnInit() {
    if (this.activatedRoute.snapshot.data["category"]) {
      this.isEditing = true;
      this.submitForm.patchValue(this.activatedRoute.snapshot.data["category"].category);
      this.categoryId = this.activatedRoute.snapshot.data["category"].category.id;
    }
  }

  saveForm() {
    this.submitForm.markAllAsTouched();
    if (this.submitForm.invalid) return;
    this.ngxSpinnerService.show("actionsLoader");
    this.messageService.clear();
    const CategoryData: IAddCategoryBody = this.submitForm.value;

    if (this.isEditing && this.categoryId) {
      this.categoriesService.updateCategory(this.categoryId, CategoryData).subscribe(() => {
        this.router.navigate(["/dashboard/menu/categories"]);
        this.messageService.add({ severity: "success", summary: "Updated", detail: "Category updated successfully" });
        timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
      });
    } else {
      this.categoriesService.addCategory(CategoryData).subscribe(() => {
        this.router.navigate(["/dashboard/menu/categories"]);
        this.messageService.add({ severity: "success", summary: "Added", detail: "Category added successfully" });
        timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
      });
    }
  }
}
