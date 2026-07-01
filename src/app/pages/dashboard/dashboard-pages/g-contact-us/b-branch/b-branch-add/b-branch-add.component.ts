import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DialogModule } from "primeng/dialog";
import { InputSwitchModule } from "primeng/inputswitch";
import { ToastModule } from "primeng/toast";
import { timer } from "rxjs";
import { IAddBranchBody } from "../../../../../../core/Interfaces/j-branches/IAddBranchBody";
import { BranchesService } from "../../../../../../core/services/j-branches/branches.service";
import { OnlyNumberDirective } from "../../../../../../only-number.directive";

@Component({
  selector: "app-b-branch-add",
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    InputSwitchModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    RouterLink,
    OnlyNumberDirective,
  ],
  templateUrl: "./b-branch-add.component.html",
  styleUrl: "./b-branch-add.component.scss",
  providers: [MessageService],
})
export class BBranchAddComponent {
  branchForm: FormGroup;

  isEditing = false;

  branchId: string | null = null;

  private fb = inject(FormBuilder);

  private branchesService = inject(BranchesService);

  private ngxSpinnerService = inject(NgxSpinnerService);

  private router = inject(Router);

  private messageService = inject(MessageService);

  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.branchForm = this.fb.group({
      en_branch_location: ["", Validators.required],
      ar_branch_location: ["", Validators.required],
      en_branch_city: ["", Validators.required],
      ar_branch_city: ["", Validators.required],
      en_branch_address: ["", Validators.required],
      ar_branch_address: ["", Validators.required],
      en_close_message: ["", Validators.required],
      ar_close_message: ["", Validators.required],
      location_url: ["", Validators.required],
      branch_phone_1: ["", [Validators.required, Validators.pattern(/^0?[0-9]{9,}$/)]],
      branch_phone_2: ["", [Validators.pattern(/^0?[0-9]{9,}$/)]],
      branch_phone_3: ["", [Validators.pattern(/^0?[0-9]{9,}$/)]],
      status: [1, Validators.required],
    });
  }

  ngOnInit() {
    if (this.activatedRoute.snapshot.data["branch"]) {
      this.isEditing = true;
      this.branchForm.patchValue(this.activatedRoute.snapshot.data["branch"].branches);
      this.branchId = this.activatedRoute.snapshot.data["branch"].branches.id;
    }
  }

  saveBranch() {
    this.branchForm.markAllAsTouched();
    if (this.branchForm.invalid) return;
    this.ngxSpinnerService.show("actionsLoader");
    this.messageService.clear();
    const branchData: IAddBranchBody = this.branchForm.value;

    if (this.isEditing && this.branchId) {
      this.branchesService.updateBranch(this.branchId, branchData).subscribe(() => {
        this.router.navigate(["/dashboard/contact-us/branches"]);
        this.messageService.add({ severity: "success", summary: "Updated", detail: "Branch updated successfully" });
        timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
      });
    } else {
      this.branchesService.addBranch(branchData).subscribe(() => {
        this.router.navigate(["/dashboard/contact-us/branches"]);
        this.messageService.add({ severity: "success", summary: "Added", detail: "Branch added successfully" });
        timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
      });
    }
  }
}
