import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgxJoditComponent } from "ngx-jodit";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { EditorModule } from "primeng/editor";
import { MessagesModule } from "primeng/messages";
import { ToastModule } from "primeng/toast";
import { IPrivacyPolicyData } from "../../../../../core/Interfaces/o-privacy-policy/IPrivacyPolicyData";
import { SafeHtmlPipe } from "../../../../../core/pipes/safe-html.pipe";
import { PrivacyPolicyService } from "../../../../../core/services/o-privacy-policy/privacy-policy.service";
import { LoadingDataBannerComponent } from "../../../../../shared/components/loading-data-banner/loading-data-banner.component";

import "jodit/esm/plugins/add-new-line/add-new-line.js";
import "jodit/esm/plugins/bold/bold.js";
import "jodit/esm/plugins/color/color.js";
import "jodit/esm/plugins/copy-format/copy-format.js";
import "jodit/esm/plugins/drag-and-drop/drag-and-drop.js";
import "jodit/esm/plugins/file/file.js";
import "jodit/esm/plugins/fullsize/fullsize.js";
import "jodit/esm/plugins/iframe/iframe.js";
import "jodit/esm/plugins/indent/indent.js";
import "jodit/esm/plugins/justify/justify.js";
import "jodit/esm/plugins/line-height/line-height.js";
import "jodit/esm/plugins/preview/preview.js";
import "jodit/esm/plugins/resizer/resizer.js";
import "jodit/esm/plugins/search/search.js";
import "jodit/esm/plugins/select/select.js";
import "jodit/esm/plugins/source/source.js";
import "jodit/esm/plugins/symbols/symbols.js";
import "jodit/esm/plugins/video/video.js";
import { NgxSpinnerService } from "ngx-spinner";
import { finalize, timer } from "rxjs";
import { CardModule } from "primeng/card";

@Component({
  selector: "app-b-privacy-policy",
  standalone: true,
  imports: [
    FormsModule,
    SafeHtmlPipe,
    ToastModule,
    ButtonModule,
    MessagesModule,
    EditorModule,
    NgxJoditComponent,
    LoadingDataBannerComponent,
    CardModule,
  ],
  templateUrl: "./b-privacy-policy.component.html",
  styleUrl: "./b-privacy-policy.component.scss",
  providers: [MessageService],
})
export class BPrivacyPolicyComponent {
  privacyPolicy!: IPrivacyPolicyData;

  isEditing: boolean = false;

  private messageService = inject(MessageService);

  private privacyPolicyService = inject(PrivacyPolicyService);

  private ngxSpinnerService = inject(NgxSpinnerService);

  ngOnInit(): void {
    this.privacyPolicyService.getPrivacyPolicy().subscribe({
      next: (response) => {
        this.privacyPolicy = response;
      },
    });
  }

  toggleEditing() {
    this.isEditing = !this.isEditing;
  }

  saveChanges() {
    this.ngxSpinnerService.show("actionsLoader");
    let fd = new FormData();
    Object.keys(this.privacyPolicy.PrivacyPolicy).forEach((key) => {
      let data = { ...this.privacyPolicy.PrivacyPolicy } as any;
      fd.append(key, data[key] as any);
    });

    this.privacyPolicyService
      .updatePrivacyPolicy(fd)
      .pipe(
        finalize(() => {
          timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
        })
      )
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Changes saved successfully",
          });
          this.isEditing = false;
          this.privacyPolicy.PrivacyPolicy = response.PrivacyPolicy;
        },
        error: (err) => {
          console.error("Error saving changes", err);
        },
      });
  }
}
