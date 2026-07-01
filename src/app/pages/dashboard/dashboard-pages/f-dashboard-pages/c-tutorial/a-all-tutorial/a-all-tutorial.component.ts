import { Component, inject } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { InputSwitchModule } from "primeng/inputswitch";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { tutorialData } from "../../../../../../core/Interfaces/a-tutorial-content/IGetAllTutorials";
import { TutorialService } from "../../../../../../core/services/a-tutorial-content/tutorial.service";
import { LoadingDataBannerComponent } from "../../../../../../shared/components/loading-data-banner/loading-data-banner.component";

@Component({
  selector: "app-a-all-tutorial",
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    ReactiveFormsModule,
    TableModule,
    FormsModule,
    DropdownModule,
    ToastModule,
    InputSwitchModule,
    LoadingDataBannerComponent,
    RouterLink,
  ],
  templateUrl: "./a-all-tutorial.component.html",
  styleUrl: "./a-all-tutorial.component.scss",
  providers: [MessageService],
})
export class AAllTutorialComponent {
  tutorials: tutorialData[] = [];

  loading = false;

  private messageService = inject(MessageService);

  private tutorialService = inject(TutorialService);

  ngOnInit() {
    this.fetchData();
  }

  // get All Tutorials
  fetchData() {
    this.loading = true;
    this.tutorialService.getAllTutorial().subscribe(
      (response) => {
        this.tutorials = response.content.data.reverse();
        this.loading = false;
      },
      () => {
        this.loading = false;
        this.messageService.add({ severity: "error", summary: "Error", detail: "Failed to load Category" });
      }
    );
  }
}
