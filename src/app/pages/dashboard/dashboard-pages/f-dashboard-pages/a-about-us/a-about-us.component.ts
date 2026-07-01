import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgxJoditComponent } from "ngx-jodit";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { EditorModule } from "primeng/editor";
import { MessagesModule } from "primeng/messages";
import { ToastModule } from "primeng/toast";
import { SafeHtmlPipe } from "../../../../../core/pipes/safe-html.pipe";
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
import { IAboutUsData } from "../../../../../core/Interfaces/n-about-us/IAboutUsData";
import { AboutUsService } from "../../../../../core/services/n-about-us/about-us.service";
import { CardModule } from "primeng/card";
import {  WEB_SITE_IMG_URL } from "../../../../../core/constants/WEB_SITE_BASE_UTL";

@Component({
  selector: "app-a-about-us",
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
  templateUrl: "./a-about-us.component.html",
  styleUrl: "./a-about-us.component.scss",
  providers: [MessageService],
})
export class AAboutUsComponent {
  aboutUs!: IAboutUsData;
  readonly imgUrl = WEB_SITE_IMG_URL;
  isEditing: boolean = false;

  private messageService = inject(MessageService);

  private aboutUsService = inject(AboutUsService);

  private ngxSpinnerService = inject(NgxSpinnerService);

  ngOnInit(): void {
    this.aboutUsService.getAboutUs().subscribe({
      next: (response) => {
        this.aboutUs = response;
      },
    });
  }

  toggleEditing() {
    this.isEditing = !this.isEditing;
  }

  aboutImage: File | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.aboutImage = file;
    }
  }

  saveChanges() {
    this.ngxSpinnerService.show("actionsLoader");

    let fd = new FormData();
    Object.keys(this.aboutUs.about).forEach((key) => {
      let data = { ...this.aboutUs.about } as any;
      fd.append(key, data[key] as any);
    });

    // Append the image file if it exists
    if (this.aboutImage) {
      fd.append("about_image", this.aboutImage);
    }

    this.aboutUsService
      .updateAboutUs(fd)
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
          this.aboutUs.about = response.about as any;
        },
        error: (err) => {
          console.error("Error saving changes", err);
        },
      });
  }
}
