import { PercentPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ISelectOptions } from '../../../../../../core/Interfaces/core/ISelectOptions';
import { LoadingDataBannerComponent } from '../../../../../../shared/components/loading-data-banner/loading-data-banner.component';
import { NoDataFoundBannerComponent } from '../../../../../../shared/components/no-data-found-banner/no-data-found-banner.component';
import { Daum, IVouchers } from '../res/model/vouchers';
import { VoucherService } from '../res/services/voucher.service';

@Component({
  selector: 'app-a-all-voucher',
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
  providers: [MessageService],
  templateUrl: './a-all-voucher.component.html',
  styleUrl: './a-all-voucher.component.scss',
})
export class AAllVoucherComponent {
  allVouchers!: IVouchers;
  vouchers: Daum[] = [];
  filteredVouchers: Daum[] = [];

  loading = false;

  private ngxSpinnerService = inject(NgxSpinnerService);

  private messageService = inject(MessageService);

  private voucherService = inject(VoucherService);

  // Dropdown for Status
  selectedStatus: string = '';
  selectStatusOptions: ISelectOptions[] = [];

  // Dropdown for Type
  selectedType: string = '';
  selectTypeOptions: ISelectOptions[] = [];

  onStatusFilterChange(value: string): void {
    this.selectedStatus = value;
    this.applyFilters();
  }

  onTypeFilterChange(value: string): void {
    this.selectedType = value;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.vouchers];

    // Apply search term filter
    if (this.currentSearchTerm) {
      filtered = filtered.filter((voucher) => {
        return (
          voucher.id.toString().includes(this.currentSearchTerm) ||
          voucher.title_en.toLowerCase().includes(this.currentSearchTerm) ||
          voucher.value.toString().includes(this.currentSearchTerm) ||
          voucher.type.toLowerCase().includes(this.currentSearchTerm) ||
          voucher.apply.toLowerCase().includes(this.currentSearchTerm) ||
          voucher.use.toLowerCase().includes(this.currentSearchTerm)
        );
      });
    }

    // Apply status filter
    if (this.selectedStatus) {
      filtered = filtered.filter((ele) => {
        return ele.status.toString() === this.selectedStatus;
      });
    }

    // Apply type filter
    if (this.selectedType) {
      filtered = filtered.filter((ele) => {
        return ele.type.toLowerCase() === this.selectedType.toLowerCase();
      });
    }

    this.filteredVouchers = filtered;
  }

  initDropDownFilter(): void {
    this.selectStatusOptions = [
      {
        label: 'Active',
        value: '1',
      },
      {
        label: 'Inactive',
        value: '0',
      },
    ];

    this.selectTypeOptions = [
      {
        label: 'Fixed',
        value: 'fixed',
      },
      {
        label: 'Percentage',
        value: 'percent',
      },
    ];
  }

  ngOnInit() {
    this.initDropDownFilter();
    this.fetchData();
  }

  // get All Vouchers
  fetchData() {
    this.loading = true;
    this.voucherService.getAllVouchers().subscribe(
      (response) => {
        this.allVouchers = response;
        this.totalRecords = response.vouchers.total;
        this.vouchers = response.vouchers.data.reverse();
        this.filteredVouchers = [...this.vouchers];
        this.loading = false;
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load Vouchers',
        });
        this.loading = false;
      }
    );
  }

  currentSearchTerm: string = '';

  onGlobalFilter(table: Table, event: Event) {
    this.currentSearchTerm = (
      event.target as HTMLInputElement
    ).value.toLowerCase();
    this.applyFilters();
    table.filterGlobal(this.currentSearchTerm, 'contains');
  }

  onSort(event: any) {
    const { field, order } = event;
    this.filteredVouchers.sort((a: any, b: any) => {
      let valueA = a[field];
      let valueB = b[field];

      if (order === -1) {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      } else {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      }
    });
  }

  // Toggle Voucher
  toggleVoucherStatus(voucher: Daum) {
    this.messageService.clear();
    const updatedStatus = voucher.status ? 0 : 1;
    this.voucherService.enableVoucher(voucher.id.toString()).subscribe(() => {
      voucher.status = updatedStatus;
      this.messageService.add({
        severity: 'success',
        summary: 'Updated',
        detail: `Voucher ${
          updatedStatus ? 'Enabled' : 'Disabled'
        } successfully`,
      });
    });
  }

  totalRecords: number = 0;
  rowsPerPage = 10;
  currentPage = 0;

  onPageChange(event: any) {
    this.currentPage = event.page;
    this.rowsPerPage = event.rows;
    this.loadVouchers();
  }

  loadVouchers() {
    this.loading = true;
    this.ngxSpinnerService.show('actionsLoader');

    this.voucherService
      .getAllVouchers(this.currentPage + 1, this.rowsPerPage)
      .subscribe(
        (response) => {
          this.ngxSpinnerService.hide('actionsLoader');
          this.vouchers = response.vouchers.data.reverse();
          this.filteredVouchers = [...this.vouchers];
          this.loading = false;
        },
        () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load Vouchers',
          });
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
