import { Component, inject } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { InputSwitchModule } from "primeng/inputswitch";
import { TableModule, Table } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { timer } from "rxjs";
import { couponData, IAllCoupons } from "../../../../../../core/Interfaces/i-coupon/IAllCoupons";
import { CouponService } from "../../../../../../core/services/i-coupon/coupon.service";
import { LoadingDataBannerComponent } from "../../../../../../shared/components/loading-data-banner/loading-data-banner.component";
import { PercentPipe } from "@angular/common";
import { NoDataFoundBannerComponent } from "../../../../../../shared/components/no-data-found-banner/no-data-found-banner.component";
import { ISelectOptions } from "../../../../../../core/Interfaces/core/ISelectOptions";

@Component({
  selector: "app-a-all-coupon",
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
    PercentPipe,
    DropdownModule,
    NoDataFoundBannerComponent,
  ],
  templateUrl: "./a-all-coupon.component.html",
  styleUrl: "./a-all-coupon.component.scss",
  providers: [MessageService],
})
export class AAllCouponComponent {
  coupons: couponData[] = [];
  allCoupons!: IAllCoupons;
  filteredCoupons: couponData[] = [];

  loading = false;

  private ngxSpinnerService = inject(NgxSpinnerService);

  private messageService = inject(MessageService);

  private couponService = inject(CouponService);

  // Dropdown
  selectedStatus: string = "";
  selectOptions: ISelectOptions[] = [];
  onFilterChange(value: string): void {
    if (value) {
      // Filter the blogs based on the selected category
      this.filteredCoupons = this.coupons.filter((ele) => {
        return ele.status.toString().includes(value);
      });
    } else {
      // Reset to original data if no category is selected
      this.filteredCoupons = [...this.coupons];
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
    this.fetchData();
  }

  // get All Coupon
  fetchData() {
    this.loading = true;
    this.couponService.getAllCoupons().subscribe(
      (response) => {
        this.allCoupons = response;
        this.totalRecords = response.coupons.total;
        this.coupons = response.coupons.data.reverse();
        this.filteredCoupons = [...this.coupons];
        this.loading = false;
      },
      () => {
        this.messageService.add({ severity: "error", summary: "Error", detail: "Failed to load Coupon" });
        this.loading = false;
      }
    );
  }

  onGlobalFilter(table: Table, event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredCoupons = this.coupons.filter((coupon) => {
      return (
        coupon.id.toString().includes(searchTerm) ||
        coupon.code.toLowerCase().includes(searchTerm) ||
        coupon.percentage.toString().includes(searchTerm) ||
        (coupon.counter_use ? "multi" : "once").includes(searchTerm)
      );
    });
    table.filterGlobal(searchTerm, "contains");
  }

  onSort(event: any) {
    const { field, order } = event;
    this.filteredCoupons.sort((a: any, b: any) => {
      let valueA = a[field];
      let valueB = b[field];

      if (order === -1) {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      } else {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      }
    });
  }

  // Toggle Coupon
  toggleCouponStatus(coupon: couponData) {
    this.ngxSpinnerService.show("actionsLoader");
    this.messageService.clear();

    const updatedStatus = coupon.status ? 0 : 1; // Toggle between 0 and 1
    if (updatedStatus) {
      this.couponService.enableCoupon(coupon.id.toString()).subscribe(() => {
        coupon.status = updatedStatus; // Update the UI immediately
        this.messageService.add({
          severity: "success",
          summary: "Updated",
          detail: `Coupon ${updatedStatus ? "Enabled" : "Disabled"} successfully`,
        });
        timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
      });
    } else {
      this.couponService.destroyCoupon(coupon.id.toString()).subscribe(() => {
        coupon.status = updatedStatus; // Update the UI immediately
        this.messageService.add({
          severity: "success",
          summary: "Updated",
          detail: `Coupon ${updatedStatus ? "Enabled" : "Disabled"} successfully`,
        });
        timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
      });
    }
  }

  totalRecords: number = 0;
  rowsPerPage = 10;
  currentPage = 0;

  onPageChange(event: any) {
    this.currentPage = event.page;
    this.rowsPerPage = event.rows;
    this.loadCoupons();
  }

  loadCoupons() {
    this.loading = true;
    this.ngxSpinnerService.show("actionsLoader");

    this.couponService.getAllCoupons(this.currentPage + 1, this.rowsPerPage).subscribe(
      (response) => {
        this.ngxSpinnerService.hide("actionsLoader");
        this.coupons = response.coupons.data.reverse();
        this.filteredCoupons = [...this.coupons];
        this.loading = false;
      },
      () => {
        this.messageService.add({ severity: "error", summary: "Error", detail: "Failed to load Coupon" });
        this.loading = false;
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
}
