import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  PLATFORM_ID,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgxSpinnerService } from 'ngx-spinner';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { finalize } from 'rxjs';
import { ISuperAdminResponse } from '../../../../core/Interfaces/m-home/IHomeStatics';
import { HomeService } from '../../../../core/services/m-home-statics/home.service';
import { ChartsComponent } from './charts/charts.component';

dayjs.extend(isBetween);
dayjs.extend(customParseFormat);

@Component({
  selector: 'app-a-dashboard-home',
  standalone: true,
  imports: [
    CardModule,
    PanelModule,
    MultiSelectModule,
    DropdownModule,
    TableModule,
    CommonModule,
    FormsModule,
    NgxDaterangepickerMd,
    ChartsComponent,
  ],
  templateUrl: './a-dashboard-home.component.html',
  styleUrl: './a-dashboard-home.component.scss',
})
export class ADashboardHomeComponent {
  private ngxSpinnerService = inject(NgxSpinnerService);

  private PLATFORM_ID = inject(PLATFORM_ID);

  @ViewChildren('dateInputs') dateInputs!: QueryList<ElementRef>;

  name: string = '';

  private homeService = inject(HomeService);

  isAdmin = false;

  Statics!: ISuperAdminResponse;

  selectedBranch: string = 'all';

  ngOnInit(): void {
    this.getDashboardData();
    if (isPlatformBrowser(this.PLATFORM_ID)) {
      if (JSON.parse(localStorage.getItem('user')!).role === 'super-admin')
        this.isAdmin = true;
      this.name = JSON.parse(localStorage.getItem('user')!).name;
    }
  }

  getDashboardData(filterParams: any = {}): void {
    this.homeService
      .getHomeStatics(filterParams)
      .pipe(finalize(() => {}))
      .subscribe((data) => {
        this.Statics = data;
      });
  }

  isDropdownOpen = false;
  isSingleDatePicker = false;

  selectedRange: any = {
    startDate: dayjs().subtract(7, 'day').toDate(),
    endDate: dayjs().toDate(),
  };

  datePresets: any = {
    Today: [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
    Yesterday: [
      dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
      dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    ],
    'Last 7 Days': [
      dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
      dayjs().format('YYYY-MM-DD'),
    ],
    'Last 30 Days': [
      dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
      dayjs().format('YYYY-MM-DD'),
    ],
    'This Month': [
      dayjs().startOf('month').format('YYYY-MM-DD'),
      dayjs().endOf('month').format('YYYY-MM-DD'),
    ],
    'Last Month': [
      dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
      dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD'),
    ],
    'Custom Range': null,
  };

  // datePresetsKeys = Object.keys(this.datePresets);
  selected!: { start: Dayjs; end: Dayjs };

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  applyFilter() {
    this.isDropdownOpen = false;
    this.ngxSpinnerService.show('actionsLoader');

    const startDate = this.selectedRange?.startDate
      ? dayjs(this.selectedRange.startDate).format('YYYY-MM-DD')
      : undefined;
    const endDate = this.selectedRange?.endDate
      ? dayjs(this.selectedRange.endDate).format('YYYY-MM-DD')
      : undefined;

    const firstDate = !this.isSingleDatePicker ? startDate : undefined;
    const secondDate = !this.isSingleDatePicker ? endDate : undefined;
    const singleDate = this.isSingleDatePicker ? startDate : undefined;

    this.homeService
      .getHomeStatics(firstDate, secondDate, singleDate)
      .subscribe((data) => {
        this.ngxSpinnerService.hide('actionsLoader');
        this.Statics = data;
      });
  }

  onDateSelected(event: any) {
    this.selectedRange = event;
  }
}
