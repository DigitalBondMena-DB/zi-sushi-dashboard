import { Component, inject } from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { InputSwitchModule } from "primeng/inputswitch";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { InputTextModule } from "primeng/inputtext";
import { timer } from "rxjs";
import { ISliderData } from "../../../../../../core/Interfaces/r-sliders/IGetAllSliders";
import { SlidersService } from "../../../../../../core/services/r-sliders/sliders.service";
import { WEB_SITE_IMG_URL } from "../../../../../../core/constants/WEB_SITE_BASE_UTL";
import { LoadingDataBannerComponent } from "../../../../../../shared/components/loading-data-banner/loading-data-banner.component";
import { NoDataFoundBannerComponent } from "../../../../../../shared/components/no-data-found-banner/no-data-found-banner.component";
import { ISelectOptions } from "../../../../../../core/Interfaces/core/ISelectOptions";

@Component({
  selector: "app-a-all-sliders",
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
    RouterLink,
    CommonModule,
    NgOptimizedImage,
    LoadingDataBannerComponent,
    NoDataFoundBannerComponent,
    InputTextModule,
  ],
  templateUrl: "./a-all-sliders.component.html",
  styleUrl: "./a-all-sliders.component.scss",
  providers: [MessageService],
})
export class AAllSlidersComponent {
  sliders: ISliderData[] = [];
  filteredSliders: ISliderData[] = [];
  readonly imgUrl = WEB_SITE_IMG_URL;

  private ngxSpinnerService = inject(NgxSpinnerService);
  private slidersService = inject(SlidersService);
  private messageService = inject(MessageService);

  totalRecords: number = 0;
  rowsPerPage = 10;
  currentPage = 1;
  loading = false;

  selectedStatus: string = "";
  selectOptions: ISelectOptions[] = [];

  onFilterChange(value: string): void {
    if (value) {
      this.filteredSliders = this.sliders.filter((ele) => {
        return ele.is_active.toString().includes(value);
      });
    } else {
      this.filteredSliders = [...this.sliders];
    }
  }

  initDropDownFilter(): void {
    this.selectOptions = [
      {
        label: "Active",
        value: "1",
      },
      {
        label: "Inactive",
        value: "0",
      },
    ];
  }

  ngOnInit() {
    this.initDropDownFilter();
    this.fetchSliders(this.currentPage, this.rowsPerPage);
  }

  fetchSliders(page: number, perPage: number) {
    this.loading = true;
    this.ngxSpinnerService.show("actionsLoader");
    this.slidersService.getAllSliders(page, perPage).subscribe({
      next: (response) => {
        this.totalRecords = response.sliders.total;
        this.sliders = response.sliders.data;
        this.filteredSliders = [...this.sliders];
        this.loading = false;
        timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: "error", summary: "Error", detail: "Failed to load Sliders" });
        timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
      }
    });
  }

  toggleSliderStatus(slider: ISliderData) {
    this.messageService.clear();

    const updatedStatus = slider.is_active ? 0 : 1;

    // Prevent disabling the last active slider
    if (!updatedStatus) {
      const activeCount = this.sliders.filter((s) => s.is_active).length;
      if (activeCount <= 1) {
        // Force UI to revert back to ON state
        slider.is_active = updatedStatus as any;
        setTimeout(() => (slider.is_active = 1), 0);

        this.messageService.add({
          severity: "warn",
          summary: "Not Allowed",
          detail: "At least one slider must remain active.",
          life: 4000,
        });
        return;
      }
    }

    this.ngxSpinnerService.show("actionsLoader");

    if (updatedStatus) {
      this.slidersService.enableSlider(slider.id.toString()).subscribe({
        next: () => {
          slider.is_active = updatedStatus;
          this.messageService.add({
            severity: "success",
            summary: "Updated",
            detail: "Slider Enabled successfully",
          });
          timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
        },
        error: () => {
          this.messageService.add({ severity: "error", summary: "Error", detail: "Failed to enable Slider" });
          timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
        }
      });
    } else {
      this.slidersService.destroySlider(slider.id.toString()).subscribe({
        next: () => {
          slider.is_active = updatedStatus;
          this.messageService.add({
            severity: "success",
            summary: "Updated",
            detail: "Slider Disabled successfully",
          });
          timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
        },
        error: () => {
          this.messageService.add({ severity: "error", summary: "Error", detail: "Failed to disable Slider" });
          timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
        }
      });
    }
  }

  onPageChange(event: any) {
    this.currentPage = event.first / event.rows + 1;
    this.rowsPerPage = event.rows;
    this.fetchSliders(this.currentPage, this.rowsPerPage);
  }

  getPagination(): number[] {
    if (this.totalRecords === 0) return [0];

    const options = [10, 100, 500, 1000];
    const validOptions = options.filter((opt) => opt <= this.totalRecords);

    if (!validOptions.includes(this.totalRecords)) {
      validOptions.push(this.totalRecords);
    }

    return validOptions.sort((a, b) => a - b);
  }

  onSort(event: any) {
    const { field, order } = event;
    this.filteredSliders.sort((a: any, b: any) => {
      let valueA = a[field];
      let valueB = b[field];

      if (typeof valueA === "number" && typeof valueB === "number") {
        return order === -1 ? valueA - valueB : valueB - valueA;
      }

      valueA = valueA?.toString().toLowerCase() || "";
      valueB = valueB?.toString().toLowerCase() || "";
      return order === -1 ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });
  }

  onGlobalFilter(table: any, event: Event) {
    const searchValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredSliders = this.sliders.filter((slider) => {
      return (
        slider.id.toString().includes(searchValue) ||
        (slider.en_title || "").toLowerCase().includes(searchValue) ||
        (slider.ar_title || "").toLowerCase().includes(searchValue) ||
        (slider.en_text || "").toLowerCase().includes(searchValue) ||
        (slider.ar_text || "").toLowerCase().includes(searchValue)
      );
    });
    table.filterGlobal(searchValue, "contains");
  }
}
