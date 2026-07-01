import { Component, inject } from "@angular/core";
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
import { timer } from "rxjs";
import { ISubLocationData } from "../../../../../core/Interfaces/e-sublocations/IGetAllSubLocations";
import { SubLocationsService } from "../../../../../core/services/e-sublocations/sub-locations.service";
import { CurrencyPipe } from "@angular/common";
import { IBranch, ILocation } from "../../../../../core/Interfaces/e-sublocations/IGetSubLocationsBranches";
import { LoadingDataBannerComponent } from "../../../../../shared/components/loading-data-banner/loading-data-banner.component";
import { NoDataFoundBannerComponent } from "../../../../../shared/components/no-data-found-banner/no-data-found-banner.component";
import { InputTextModule } from "primeng/inputtext";
import { ISelectOptions } from "../../../../../core/Interfaces/core/ISelectOptions";

@Component({
  selector: "app-a-sub-locations-all",
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
    CurrencyPipe,
    LoadingDataBannerComponent,
    NoDataFoundBannerComponent,
    InputTextModule,
  ],
  templateUrl: "./a-sub-locations-all.component.html",
  styleUrl: "./a-sub-locations-all.component.scss",
  providers: [MessageService],
})
export class ASubLocationsAllComponent {
  subLocations: ISubLocationData[] = [];
  filteredSubLocations: ISubLocationData[] = [];

  Locations: ILocation[] = [];
  Branches: IBranch[] = [];

  private ngxSpinnerService = inject(NgxSpinnerService);
  private subLocationsService = inject(SubLocationsService);
  private messageService = inject(MessageService);

  totalRecords: number = 0;
  rowsPerPage = 10;
  currentPage = 1;

  // Dropdown
  selectedStatus: string = "";
  selectOptions: ISelectOptions[] = [];
  onFilterChange(value: string): void {
    if (value) {
      // Filter the blogs based on the selected category
      this.filteredSubLocations = this.subLocations.filter((ele) => {
        return ele.status.toString().includes(value);
      });
    } else {
      // Reset to original data if no category is selected
      this.filteredSubLocations = [...this.subLocations];
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
    this.fetchLocations();
  }

  fetchLocations() {
    this.subLocationsService.getSubLocationsBranches().subscribe(
      (response) => {
        this.Branches = response.branches;
        this.Locations = response.locations;
        this.fetchSubLocation();
      },
      () => {
        this.messageService.add({ severity: "error", summary: "Error", detail: "Failed to load SubLocations" });
      }
    );
  }

  fetchSubLocation() {
    this.subLocationsService.getAllLocations().subscribe(
      (response) => {
        this.totalRecords = response.sublocations.total;
        this.subLocations = response.sublocations.data.reverse();
        this.filteredSubLocations = [...this.subLocations];
      },
      () => {
        this.messageService.add({ severity: "error", summary: "Error", detail: "Failed to load SubLocations" });
      }
    );
  }

  findLocations(id: number): string | undefined {
    return this.Locations.find((e) => e.id === id)?.ar_location;
  }

  findCity(id: number): string | undefined {
    return this.Branches.find((e) => e.id === id)?.en_branch_location;
  }

  toggleSubLocationStatus(subLocation: ISubLocationData) {
    this.ngxSpinnerService.show("actionsLoader");
    this.messageService.clear();

    const updatedStatus = subLocation.status ? 0 : 1;
    if (updatedStatus) {
      this.subLocationsService.enableLocation(subLocation.id.toString()).subscribe(() => {
        subLocation.status = updatedStatus;
        this.messageService.add({
          severity: "success",
          summary: "Updated",
          detail: `Branch ${updatedStatus ? "Enabled" : "Disabled"} successfully`,
        });
        timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
      });
    } else {
      this.subLocationsService.destroyLocation(subLocation.id.toString()).subscribe(() => {
        subLocation.status = updatedStatus;
        this.messageService.add({
          severity: "success",
          summary: "Updated",
          detail: `Branch ${updatedStatus ? "Enabled" : "Disabled"} successfully`,
        });
        timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
      });
    }
  }

  onPageChange(event: any) {
    this.currentPage = event.first / event.rows + 1;
    this.rowsPerPage = event.rows;
    this.loadProducts(this.currentPage, this.rowsPerPage);
  }

  loadProducts(page: number, perPage: number) {
    this.ngxSpinnerService.show("actionsLoader");

    this.subLocationsService.getAllLocations(page, perPage).subscribe(
      (response) => {
        this.ngxSpinnerService.hide("actionsLoader");
        this.subLocations = response.sublocations.data.reverse();
        this.filteredSubLocations = [...this.subLocations];
      },
      () => {
        this.messageService.add({ severity: "error", summary: "Error", detail: "Failed to load SubLocations" });
      }
    );
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

  // Sorting method
  onSort(event: any) {
    const { field, order } = event;
    this.filteredSubLocations.sort((a: any, b: any) => {
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

  // Global filter method
  onGlobalFilter(table: any, event: Event) {
    const searchValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredSubLocations = this.subLocations.filter((subLocation) => {
      return (
        subLocation.id.toString().includes(searchValue) ||
        subLocation.en_sub_location.toLowerCase().includes(searchValue) ||
        subLocation.ar_sub_location.toLowerCase().includes(searchValue) ||
        subLocation.price.toString().includes(searchValue) ||
        this.findLocations(subLocation.location_id)?.toLowerCase().includes(searchValue) ||
        this.findCity(subLocation.branch_id)?.toLowerCase().includes(searchValue)
      );
    });
    table.filterGlobal(searchValue, "contains");
  }
}
