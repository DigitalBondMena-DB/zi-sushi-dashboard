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
import { Daum, PromoCodes } from '../res/model/promo-codes';
import { PromoCodeService } from '../res/services/promo-code.service';

@Component({
  selector: 'app-a-all-promo-code',
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
  templateUrl: './a-all-promo-code.component.html',
  styleUrl: './a-promo-code.component.scss',
})
export class AAllPromoCodeComponent {
  allPromoCode!: PromoCodes;
  PromoCode: Daum[] = [];
  filteredPromoCode: Daum[] = [];

  loading = false;

  private ngxSpinnerService = inject(NgxSpinnerService);

  private messageService = inject(MessageService);

  private promoCodeService = inject(PromoCodeService);

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
    let filtered = [...this.PromoCode];

    // Apply search term filter
    if (this.currentSearchTerm) {
      filtered = filtered.filter((promocode) => {
        return (
          promocode.id.toString().includes(this.currentSearchTerm) ||
          promocode.code.toLowerCase().includes(this.currentSearchTerm) ||
          promocode.value.toString().includes(this.currentSearchTerm) ||
          promocode.type.toLowerCase().includes(this.currentSearchTerm) ||
          promocode.apply.toLowerCase().includes(this.currentSearchTerm) ||
          promocode.use.toLowerCase().includes(this.currentSearchTerm)
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

    this.filteredPromoCode = filtered;
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

  // get All PromoCode
  fetchData() {
    this.loading = true;
    this.promoCodeService.getAllPromoCodes().subscribe(
      (response) => {
        this.allPromoCode = response.promo_codes;
        this.totalRecords = response.promo_codes.total;
        this.PromoCode = response.promo_codes.data.reverse();
        this.filteredPromoCode = [...this.PromoCode];
        this.loading = false;
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load PromoCode',
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
    this.filteredPromoCode.sort((a: any, b: any) => {
      let valueA = a[field];
      let valueB = b[field];

      if (order === -1) {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      } else {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      }
    });
  }

  // Toggle promocode
  togglePromoCodeStatus(promocode: Daum) {
    this.messageService.clear();
    const updatedStatus = promocode.status ? 0 : 1;
    this.promoCodeService
      .enablePromoCode(promocode.id.toString())
      .subscribe(() => {
        promocode.status = updatedStatus;
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: `Promo Code ${
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
    this.loadPromoCode();
  }

  loadPromoCode() {
    this.loading = true;
    this.ngxSpinnerService.show('actionsLoader');

    this.promoCodeService
      .getAllPromoCodes(this.currentPage + 1, this.rowsPerPage)
      .subscribe(
        (response) => {
          this.ngxSpinnerService.hide('actionsLoader');
          this.PromoCode = response.promo_codes.data.reverse();
          this.filteredPromoCode = [...this.PromoCode];
          this.loading = false;
        },
        () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load PromoCode',
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
