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
import { HappyHoursService } from "../../../../../../core/services/c-happy-hours/happy-hours.service";
import { ToastModule } from "primeng/toast";

@Component({
  selector: "app-d-category-add",
  standalone: true,
  imports: [ButtonModule, CardModule, InputSwitchModule, DialogModule, FormsModule, ReactiveFormsModule, RouterLink, ToastModule],
  templateUrl: "./b-happy-hours-edit.component.html",
  styleUrl: "./b-happy-hours-edit.component.scss",
})
export class BHappyHoursEditAddComponent {
  submitForm: FormGroup;

  isEditing = false;

  happyHoursById: string | null = null;

  private fb = inject(FormBuilder);

  private happyHoursService = inject(HappyHoursService);

  private ngxSpinnerService = inject(NgxSpinnerService);

  private router = inject(Router);

  private messageService = inject(MessageService);

  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.submitForm = this.fb.group({
      start_time: ["", Validators.required],
      end_time: ["", Validators.required],
      discount_percentage: ["", [Validators.required,Validators.min(1),Validators.max(100),Validators.pattern(/^[0-9]+$/)]]},
  {
  validators: this.timeRangeValidator,
});
  }

  ngOnInit() {
    if (this.activatedRoute.snapshot.data["happyHours"]) {
      this.isEditing = true;
      const data = this.activatedRoute.snapshot.data["happyHours"];
      this.submitForm.patchValue(data.data);
      console.log(data);
      
      this.happyHoursById = data.data.id;
    }
  }

  saveForm() {
    this.submitForm.markAllAsTouched();
    if (this.submitForm.invalid) return;
    this.ngxSpinnerService.show("actionsLoader");
    this.messageService.clear();
    const happyHoursFormData: {
  start_time: string
  end_time: string
  discount_percentage: number
} = this.submitForm.value;

      this.happyHoursService.updateHappyHoursById(happyHoursFormData,this.happyHoursById).subscribe(() => {
        this.router.navigate(["/dashboard/offers/happy-hours/happy-hours-index"]);
        this.messageService.add({ severity: "success", summary: "Updated", detail: "Happy hours updated successfully" });
        timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
      });
    
  }
  timeRangeValidator(form: FormGroup) {
  const start = form.get('start_time')?.value;
  const end = form.get('end_time')?.value;

  if (!start || !end) return null;

  const startDate = new Date(`1970-01-01T${start}`);
  const endDate = new Date(`1970-01-01T${end}`);

  return startDate < endDate ? null : { timeOrderInvalid: true };
}

}
