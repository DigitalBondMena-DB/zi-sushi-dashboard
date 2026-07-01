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
import { finalize, timer } from 'rxjs';
import { ISelectOptions } from '../../../../../../core/Interfaces/core/ISelectOptions';
import { categoryData } from '../../../../../../core/Interfaces/h-category/IAllCategory';
import { CategoriesService } from '../../../../../../core/services/h-category/categories.service';
import { LoadingDataBannerComponent } from '../../../../../../shared/components/loading-data-banner/loading-data-banner.component';
import { NoDataFoundBannerComponent } from '../../../../../../shared/components/no-data-found-banner/no-data-found-banner.component';
import { HappyHoursService } from '../../../../../../core/services/c-happy-hours/happy-hours.service';
import { IHappyHours } from '../../../../../../core/Interfaces/c-happy-hours/ihappy-hours';

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
  templateUrl: './a-all-happy-hours.component.html',
  styleUrl: './a-all-happy-hours.component.scss',
  providers: [MessageService],
})
export class AAllHappyHoursComponent {
  happyHoursData: IHappyHours[] = [];
  filteredHappyHours: IHappyHours[] = [];
  loading = false;

  private ngxSpinnerService = inject(NgxSpinnerService);
  private messageService = inject(MessageService);
  private happyHoursService = inject(HappyHoursService);

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
      this.filteredHappyHours = this.happyHoursData.filter((ele) => {
        return ele.is_active.toString().includes(value);
      });
    } else {
      // Reset to original data if no category is selected
      this.filteredHappyHours = [...this.happyHoursData];
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
    this.happyHoursService.getHappyHours().subscribe(
      {next:(response) => {
        console.log('response Happy hours', response);
        this.happyHoursData = response.data;
        this.filteredHappyHours = [...this.happyHoursData];
        this.loading = false;
      },
      error:() => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load Happy Hours',
        });
        this.loading = false;
      }}
    );
  }

  // Toggle Category
  toggleCategoryStatus(happyHours: IHappyHours) {
    this.ngxSpinnerService.show('actionsLoader');
    this.messageService.clear();
      this.happyHoursService
        .toggleHappyHoursStatus(happyHours.id).pipe(
          finalize(() => {
        timer(200).subscribe(() =>
            this.ngxSpinnerService.hide('actionsLoader')
          );
      })
    ).subscribe(
          {
            next:(response) => {
          happyHours.is_active = response.data.is_active? 1:0; 
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: `Happy Hours ${
              response.data.is_active ? 'Enabled' : 'Disabled'
            } successfully`,
          });
        },
      error:()=>{
        this.messageService.add({
            severity: 'error',
            summary: 'Updated',
            detail: `something wrong when change Happy Hours status`,
          });
      }
    }
      );
  }

  // Add local sorting method
  onSort(event: any) {
  const field = event.field;
  const order = event.order; // 1 = ASC, -1 = DESC
  
  this.filteredHappyHours = [...this.filteredHappyHours].sort((a:any, b:any) => {
    // 2- Sort Time (convert string to real Date time comparison)
    if (field === 'start_time' || field === 'end_time') {
      const timeA = this.convertTimeToMinutes(a[field]);
      const timeB = this.convertTimeToMinutes(b[field]);
      return (timeA - timeB) * order;
    }

    // 3- Sort Discount Percentage (number sorting)
    if (field === 'discount_percentage') {
      return (a.discount_percentage - b.discount_percentage) * order;
    }

    // Default fallback sort (ID)
    if (field === 'id') {
      return (a.id - b.id) * order;
    }

    return 0;
  });
}

// Helper to convert "HH:mm" to minutes for correct time sorting
convertTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}


  onGlobalFilter(dt: Table, event: any) {
    this.globalFilterValue = event.target.value;
    dt.filterGlobal(this.globalFilterValue, 'contains');
  }
}
