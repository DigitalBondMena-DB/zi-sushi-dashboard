import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DialogModule } from "primeng/dialog";
import { FileUploadModule } from "primeng/fileupload";
import { InputSwitchModule } from "primeng/inputswitch";
import { InputTextModule } from "primeng/inputtext";
import { ToastModule } from "primeng/toast";
import { timer } from "rxjs";
import { SlidersService } from "../../../../../../core/services/r-sliders/sliders.service";
import { WEB_SITE_IMG_URL } from "../../../../../../core/constants/WEB_SITE_BASE_UTL";

@Component({
  selector: "app-c-sliders-add",
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
    CommonModule,
    InputTextModule,
    ToastModule,
  ],
  templateUrl: "./c-sliders-add.component.html",
  styleUrl: "./c-sliders-add.component.scss",
  providers: [MessageService],
})
export class CSlidersAddComponent {
  submitForm!: FormGroup;
  isEditing = false;
  sliderId: string | null = null;
  isBaseImage = "";
  readonly imgUrl = WEB_SITE_IMG_URL;

  private fb = inject(FormBuilder);
  private slidersService = inject(SlidersService);
  private ngxSpinnerService = inject(NgxSpinnerService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private activatedRoute = inject(ActivatedRoute);

  private initializeForm() {
    this.submitForm = this.fb.group({
      en_title: ["", Validators.required],
      ar_title: ["", Validators.required],
      en_text: ["", Validators.required],
      ar_text: ["", Validators.required],
      image: ["", Validators.required],
      is_active: [1, Validators.required],
    });
  }

  ngOnInit() {
    this.initializeForm();
    if (this.activatedRoute.snapshot.data["slider"]) {
      this.isEditing = true;
      const response = this.activatedRoute.snapshot.data["slider"];
      const slider = response.slider;
      this.sliderId = slider.id.toString();
      this.submitForm.patchValue(slider);
      this.isBaseImage = slider.image || "";
      this.makeImageOptional();
    }
  }

  private makeImageOptional() {
    this.submitForm.get("image")?.clearValidators();
    this.submitForm.updateValueAndValidity();
  }

  saveForm() {
    this.submitForm.markAllAsTouched();
    if (this.submitForm.invalid) return;

    this.ngxSpinnerService.show("actionsLoader");
    this.messageService.clear();

    const fd = new FormData();
    Object.keys(this.submitForm.value).forEach((key) => {
      if (key !== "image") {
        fd.append(key, this.submitForm.value[key]);
      }
    });

    if (typeof this.submitForm.get("image")?.value === "object") {
      fd.append("image", this.submitForm.get("image")?.value);
    } else {
      fd.delete("image");
    }

    if (this.isEditing && this.sliderId) {
      this.slidersService.updateSlider(this.sliderId, fd).subscribe({
        next: () => {
          this.router.navigate(["/dashboard/pages/sliders/sliders-index"]);
          this.messageService.add({ severity: "success", summary: "Updated", detail: "Slider updated successfully" });
          timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
        },
        error: () => {
          this.messageService.add({ severity: "error", summary: "Error", detail: "Failed to update Slider" });
          timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
        }
      });
    } else {
      this.slidersService.addSlider(fd).subscribe({
        next: () => {
          this.router.navigate(["/dashboard/pages/sliders/sliders-index"]);
          this.messageService.add({ severity: "success", summary: "Added", detail: "Slider added successfully" });
          timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
        },
        error: () => {
          this.messageService.add({ severity: "error", summary: "Error", detail: "Failed to add Slider" });
          timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
        }
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
    if (this.isEditing) {
      const response = this.activatedRoute.snapshot.data["slider"];
      this.isBaseImage = response.slider.image || "";
    }
    this.submitForm.patchValue({ image: "" });
  }
}
