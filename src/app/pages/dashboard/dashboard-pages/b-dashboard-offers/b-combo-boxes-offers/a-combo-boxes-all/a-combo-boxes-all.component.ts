import { CurrencyPipe } from "@angular/common";
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
import { ComboData } from "../../../../../../core/Interfaces/b-combo/IGetAllComboOffers";
import { ComboService } from "../../../../../../core/services/b-combo/combo.service";
import { LoadingDataBannerComponent } from "../../../../../../shared/components/loading-data-banner/loading-data-banner.component";
import { NoDataFoundBannerComponent } from "../../../../../../shared/components/no-data-found-banner/no-data-found-banner.component";
import { ISelectOptions } from "../../../../../../core/Interfaces/core/ISelectOptions";

@Component({
  selector: "app-a-combo-boxes-all",
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
    CurrencyPipe,
    NoDataFoundBannerComponent,
  ],
  templateUrl: "./a-combo-boxes-all.component.html",
  styleUrl: "./a-combo-boxes-all.component.scss",
  providers: [MessageService],
})
export class AComboBoxesAllComponent {
  comboBoxes: ComboData[] = [];
  filteredComboBoxes: ComboData[] = [];
  loading = false;

  // Dropdown
  selectedStatus: string = "";
  selectOptions: ISelectOptions[] = [];
  onFilterChange(value: string): void {
    if (value) {
      // Filter the blogs based on the selected category
      this.filteredComboBoxes = this.comboBoxes.filter((ele) => {
        return ele.status.toString().includes(value);
      });
    } else {
      // Reset to original data if no category is selected
      this.filteredComboBoxes = [...this.comboBoxes];
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

  private ngxSpinnerService = inject(NgxSpinnerService);
  private messageService = inject(MessageService);
  private comboService = inject(ComboService);

  // Add sorting state
  sortField: string = "";
  sortOrder: number = 1;
  globalFilterValue: string = "";

  ngOnInit() {
    this.initDropDownFilter();
    this.fetchData();
  }

  // get All Product
  fetchData() {
    this.comboService.getAllComboOffers().subscribe(
      (response) => {
        this.totalRecords = response.combos.total;
        this.comboBoxes = response.combos.data;
        this.filteredComboBoxes = [...this.comboBoxes];
      },
      () => {
        this.messageService.add({ severity: "error", summary: "Error", detail: "Failed to load Combo Offers" });
      }
    );
  }

  // Toggle Product
  toggleComboOffersStatus(combo: ComboData) {
    this.ngxSpinnerService.show("actionsLoader");
    this.messageService.clear();

    const updatedStatus = combo.status ? 0 : 1; // Toggle between 0 and 1
    if (updatedStatus) {
      this.comboService.enableComboOffer(combo.id.toString()).subscribe(() => {
        combo.status = updatedStatus; // Update the UI immediately
        this.messageService.add({
          severity: "success",
          summary: "Updated",
          detail: `Combo Offer ${updatedStatus ? "Enabled" : "Disabled"} successfully`,
        });
        timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
      });
    } else {
      this.comboService.disableComboOffer(combo.id.toString()).subscribe(() => {
        combo.status = updatedStatus; // Update the UI immediately
        this.messageService.add({
          severity: "success",
          summary: "Updated",
          detail: `Combo Offer ${updatedStatus ? "Enabled" : "Disabled"} successfully`,
        });
        timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
      });
    }
  }
  totalRecords: number = 0;
  rowsPerPage = 10;
  currentPage = 1;

  onPageChange(event: any) {
    this.currentPage = event.first / event.rows + 1;
    this.rowsPerPage = event.rows;
    this.loadProducts(this.currentPage, this.rowsPerPage);
  }

  loadProducts(page: number, perPage: number) {
    this.ngxSpinnerService.show("actionsLoader");

    this.comboService.getAllComboOffers(page, perPage).subscribe(
      (response) => {
        this.ngxSpinnerService.hide("actionsLoader");
        this.comboBoxes = response.combos.data;
        this.filteredComboBoxes = [...this.comboBoxes];

        // Apply local sorting if a sort field is selected
        if (this.sortField) {
          this.sortLocally();
        }

        // Apply local filtering if there's a filter value
        if (this.globalFilterValue) {
          this.filterLocally();
        }
      },
      () => {
        this.messageService.add({ severity: "error", summary: "Error", detail: "Failed to load Combo Offers" });
      }
    );
  }

  // Add local sorting method
  onSort(event: any) {
    this.sortField = event.field;
    this.sortOrder = event.order;
    this.sortLocally();
  }

  private sortLocally() {
    this.filteredComboBoxes.sort((a: any, b: any) => {
      let valueA = a[this.sortField];
      let valueB = b[this.sortField];

      // Handle numeric values
      if (typeof valueA === "number" && typeof valueB === "number") {
        return this.sortOrder === 1 ? valueA - valueB : valueB - valueA;
      }

      // Handle string values
      if (typeof valueA === "string" && typeof valueB === "string") {
        return this.sortOrder === 1 ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }

      return 0;
    });
  }

  // Add local filtering method
  onGlobalFilter(dt: Table, event: any) {
    const value = event.target.value;
    this.globalFilterValue = value;
    this.filterLocally();
  }

  private filterLocally() {
    if (!this.globalFilterValue) {
      this.filteredComboBoxes = [...this.comboBoxes];
      return;
    }

    const searchValue = this.globalFilterValue.toLowerCase();
    this.filteredComboBoxes = this.comboBoxes.filter((item) => {
      return (
        item.id.toString().includes(searchValue) ||
        item.en_name.toLowerCase().includes(searchValue) ||
        item.ar_name.toLowerCase().includes(searchValue) ||
        item.pieces.toString().includes(searchValue) ||
        item.prices.toString().includes(searchValue)
      );
    });

    // Re-apply sorting if needed
    if (this.sortField) {
      this.sortLocally();
    }
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
}
