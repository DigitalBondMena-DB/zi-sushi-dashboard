import { CurrencyPipe, NgOptimizedImage } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { InputSwitchModule } from "primeng/inputswitch";
import { Table, TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { timer } from "rxjs";
import { HotboxData, IGetAllHotBoxes } from "../../../../../../core/Interfaces/c-hot-boxes/IGetAllHotBoxes";
import { HotBoxesService } from "../../../../../../core/services/c-hot-boxes/hot-boxes.service";
import { LoadingDataBannerComponent } from "../../../../../../shared/components/loading-data-banner/loading-data-banner.component";
import { NoDataFoundBannerComponent } from "../../../../../../shared/components/no-data-found-banner/no-data-found-banner.component";
import { WEB_SITE_IMG_URL } from "../../../../../../core/constants/WEB_SITE_BASE_UTL";
@Component({
  selector: "app-a-hot-boxes-all",
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
    NgOptimizedImage,
    CurrencyPipe,
    NoDataFoundBannerComponent,
  ],
  templateUrl: "./a-hot-boxes-all.component.html",
  styleUrl: "./a-hot-boxes-all.component.scss",
  providers: [MessageService],
})
export class AHotBoxesAllComponent {
  hotBoxes: HotboxData[] = [];
  allHotBoxes!: IGetAllHotBoxes;
  readonly imgUrl = WEB_SITE_IMG_URL;
  loading = false;

  private ngxSpinnerService = inject(NgxSpinnerService);

  private messageService = inject(MessageService);

  private hotBoxesService = inject(HotBoxesService);

  ngOnInit() {
    this.fetchData();
  }

  // get All Hot Box
  fetchData() {
    this.hotBoxesService.getAllHotBoxes().subscribe(
      (response) => {
        this.allHotBoxes = response;
        this.hotBoxes = response.hotboxes.reverse();
      },
      () => {
        this.messageService.add({ severity: "error", summary: "Error", detail: "Failed to load Box" });
      }
    );
  }

  // Toggle Hot Box
  toggleBoxStatus(hotBox: HotboxData) {
    this.ngxSpinnerService.show("actionsLoader");
    this.messageService.clear();

    const updatedStatus = hotBox.status ? 0 : 1; // Toggle between 0 and 1
    if (updatedStatus) {
      this.hotBoxesService.enableBox(hotBox.id.toString()).subscribe(() => {
        hotBox.status = updatedStatus; // Update the UI immediately
        this.messageService.add({
          severity: "success",
          summary: "Updated",
          detail: `Box ${updatedStatus ? "Enabled" : "Disabled"} successfully`,
        });
        timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
      });
    } else {
      this.hotBoxesService.destroyBox(hotBox.id.toString()).subscribe(() => {
        hotBox.status = updatedStatus; // Update the UI immediately
        this.messageService.add({
          severity: "success",
          summary: "Updated",
          detail: `Box ${updatedStatus ? "Enabled" : "Disabled"} successfully`,
        });
        timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
      });
    }
  }

  totalRecords: number = 0;
  rowsPerPage = 10;
  currentPage = 1;

  onPageChange(event: any) {
    this.currentPage = event.first / event.rows + 1; // Convert to 1-based index
    this.rowsPerPage = event.rows;
    this.loadProducts(this.currentPage, this.rowsPerPage);
  }

  loadProducts(page: number, perPage: number) {
    this.ngxSpinnerService.show("actionsLoader");

    this.hotBoxesService.getAllHotBoxes(page).subscribe(
      (response) => {
        this.ngxSpinnerService.hide("actionsLoader");
        this.hotBoxes = response.hotboxes.reverse();
      },
      () => {
        this.messageService.add({ severity: "error", summary: "Error", detail: "Failed to load Box" });
      }
    );
  }

  onGlobalFilter(dt: Table, event: any) {
    const value = event.target.value;
    dt.filterGlobal(value, "contains");
  }
}
