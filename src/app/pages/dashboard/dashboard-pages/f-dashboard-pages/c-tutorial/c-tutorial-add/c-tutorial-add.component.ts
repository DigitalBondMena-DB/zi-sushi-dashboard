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
import { ITutorialAddBody } from "../../../../../../core/Interfaces/a-tutorial-content/ITutorialAddBody";
import { TutorialService } from "../../../../../../core/services/a-tutorial-content/tutorial.service";

@Component({
  selector: "app-c-tutorial-add",
  standalone: true,
  imports: [ButtonModule, CardModule, InputSwitchModule, DialogModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./c-tutorial-add.component.html",
  styleUrl: "./c-tutorial-add.component.scss",
  providers: [MessageService],
})
export class CTutorialAddComponent {
  submitForm: FormGroup;

  isEditing = false;

  tutorialId: string | null = null;

  private fb = inject(FormBuilder);

  private categoriesService = inject(TutorialService);

  private ngxSpinnerService = inject(NgxSpinnerService);

  private router = inject(Router);

  private messageService = inject(MessageService);

  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.submitForm = this.fb.group({
      en_title: ["", Validators.required],
      ar_title: ["", Validators.required],
      en_Text: ["", Validators.required],
      ar_text: ["", Validators.required],
      ar_Text: [""],
      content_type: ["", Validators.required],
    });
  }

  ngOnInit() {
    if (this.activatedRoute.snapshot.data["tutorial"]) {
      this.isEditing = true;
      this.submitForm.patchValue(this.activatedRoute.snapshot.data["tutorial"].ToutrialContent);
      this.tutorialId = this.activatedRoute.snapshot.data["tutorial"].ToutrialContent.id;
    }
  }

  saveForm() {
    if (this.submitForm.invalid) return;
    this.ngxSpinnerService.show("actionsLoader");
    this.messageService.clear();
    const tutorialData: ITutorialAddBody = this.submitForm.value;
    if (this.isEditing && this.tutorialId) {
      tutorialData.ar_Text = this.submitForm.get("ar_text")?.value;
      this.categoriesService.updateTutorial(this.tutorialId, tutorialData).subscribe(() => {
        this.router.navigate(["/dashboard/pages/tutorial"]);
        this.messageService.add({ severity: "success", summary: "Updated", detail: "Tutorial updated successfully" });
        timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
      });
    } else {
      this.categoriesService.addTutorial(tutorialData).subscribe(() => {
        this.router.navigate(["/dashboard/pages/tutorial"]);
        this.messageService.add({ severity: "success", summary: "Added", detail: "Tutorial added successfully" });
        timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
      });
    }
  }
}
