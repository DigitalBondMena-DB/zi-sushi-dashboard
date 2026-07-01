import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { timer } from 'rxjs';
import { ISelectOptions } from '../../../../../../core/Interfaces/core/ISelectOptions';
import { categoryData } from '../../../../../../core/Interfaces/h-category/IAllCategory';
import { CategoriesService } from '../../../../../../core/services/h-category/categories.service';
import { LoadingDataBannerComponent } from '../../../../../../shared/components/loading-data-banner/loading-data-banner.component';
import { NoDataFoundBannerComponent } from '../../../../../../shared/components/no-data-found-banner/no-data-found-banner.component';

@Component({
  selector: 'app-a-all-categories',
  standalone: true,
  imports: [
    ButtonModule,
    TableModule,
    FormsModule,
    ToastModule,
    InputSwitchModule,
    LoadingDataBannerComponent,
    RouterLink,
    NoDataFoundBannerComponent,
    DropdownModule,
  ],
  templateUrl: './a-all-categories.component.html',
  styleUrl: './a-all-categories.component.scss',
  providers: [MessageService],
})
export class AAllCategoriesComponent {
  categories: categoryData[] = [];
  filteredCategories: categoryData[] = [];
  loading = false;

  private ngxSpinnerService = inject(NgxSpinnerService);
  private messageService = inject(MessageService);
  private categoriesService = inject(CategoriesService);

  // Add sorting state
  sortField: string = '';
  sortOrder: number = 1;
  globalFilterValue: string = '';

  // Dropdown
  selectedStatus: string = '';
  selectOptions: ISelectOptions[] = [];
  onFilterChange(value: string): void {
    if (value) {
      // Filter the blogs based on the selected category
      this.filteredCategories = this.categories.filter((ele) => {
        return ele.state.toString().includes(value);
      });
    } else {
      // Reset to original data if no category is selected
      this.filteredCategories = [...this.categories];
    }
  }

  initDropDownFilter(): void {
    this.selectOptions = [
      {
        label: 'Active',
        value: '1',
      },
      {
        label: 'Inactive',
        value: '0',
      },
    ];
  }

  ngOnInit() {
    this.initDropDownFilter();
    this.fetchData();
  }

  // get All Category
  fetchData() {
    this.loading = true;
    this.categoriesService.getAllCategories().subscribe(
      (response) => {
        console.log('response getAllCategories', response);
        this.totalRecords = response.categories.total;
        this.categories = response.categories.data.reverse();
        this.filteredCategories = [...this.categories];
        this.loading = false;
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load Category',
        });
        this.loading = false;
      }
    );
  }

  // Toggle Category
  toggleCategoryStatus(category: categoryData) {
    this.ngxSpinnerService.show('actionsLoader');
    this.messageService.clear();

    const updatedStatus = category.state ? 0 : 1; // Toggle between 0 and 1
    if (updatedStatus) {
      this.categoriesService
        .enableCategory(category.id.toString())
        .subscribe(() => {
          category.state = updatedStatus; // Update the UI immediately
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: `Category ${
              updatedStatus ? 'Enabled' : 'Disabled'
            } successfully`,
          });
          timer(200).subscribe(() =>
            this.ngxSpinnerService.hide('actionsLoader')
          );
        });
    } else {
      this.categoriesService
        .destroyCategory(category.id.toString())
        .subscribe(() => {
          category.state = updatedStatus; // Update the UI immediately
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: `Category ${
              updatedStatus ? 'Enabled' : 'Disabled'
            } successfully`,
          });
          timer(200).subscribe(() =>
            this.ngxSpinnerService.hide('actionsLoader')
          );
        });
    }
  }

  totalRecords: number = 0;
  rowsPerPage = 10;
  currentPage = 1;

  onPageChange(event: any) {
    this.currentPage = Math.floor(event.first / event.rows) + 1;
    this.rowsPerPage = event.rows;
    this.loadCategories(this.currentPage, this.rowsPerPage);
  }

  loadCategories(page: number, perPage: number) {
    this.loading = true;
    this.ngxSpinnerService.show('actionsLoader');

    this.categoriesService.getAllCategories(page, perPage).subscribe(
      (response) => {
        this.ngxSpinnerService.hide('actionsLoader');
        this.categories = response.categories.data;
        this.filteredCategories = [...this.categories];
        this.totalRecords = response.categories.total;

        // Apply local sorting if a sort field is selected
        if (this.sortField) {
          this.sortLocally();
        }

        // Apply local filtering if there's a filter value
        if (this.globalFilterValue) {
          this.filterLocally();
        }

        this.loading = false;
      },
      (error) => {
        this.ngxSpinnerService.hide('actionsLoader');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load Category',
        });
        this.loading = false;
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
    this.filteredCategories.sort((a: any, b: any) => {
      let valueA = a[this.sortField];
      let valueB = b[this.sortField];

      // Handle numeric values
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return this.sortOrder === 1 ? valueA - valueB : valueB - valueA;
      }

      // Handle string values
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortOrder === 1
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      // Handle boolean values
      if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
        return this.sortOrder === 1
          ? valueA === valueB
            ? 0
            : valueA
            ? 1
            : -1
          : valueA === valueB
          ? 0
          : valueA
          ? -1
          : 1;
      }

      return 0;
    });
  }

  onGlobalFilter(dt: Table, event: any) {
    this.globalFilterValue = event.target.value;
    dt.filterGlobal(this.globalFilterValue, 'contains');
    this.filterLocally();
  }

  private filterLocally() {
    if (!this.globalFilterValue) {
      this.filteredCategories = [...this.categories];
      return;
    }

    const searchTerm = this.globalFilterValue.toLowerCase();
    this.filteredCategories = this.categories.filter((category) => {
      return (
        category.id.toString().includes(searchTerm) ||
        category.en_name.toLowerCase().includes(searchTerm) ||
        category.ar_name.toLowerCase().includes(searchTerm) ||
        (category.state ? 'enabled' : 'disabled').includes(searchTerm)
      );
    });
  }

  getPagination(): number[] {
    if (this.totalRecords === 0) return [10];

    const options = [10, 25, 50, 100];
    const validOptions = options.filter((opt) => opt <= this.totalRecords);

    if (!validOptions.includes(this.totalRecords)) {
      validOptions.push(this.totalRecords);
    }

    return validOptions.sort((a, b) => a - b);
  }
}
